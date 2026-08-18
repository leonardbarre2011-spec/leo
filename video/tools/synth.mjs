import fs from 'fs';
const SR = 48000;

// ---------- helpers ----------
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
function writeWav(path, L, R){
  const n = L.length;
  const buf = Buffer.alloc(44 + n*4);
  buf.write('RIFF',0); buf.writeUInt32LE(36+n*4,4); buf.write('WAVE',8);
  buf.write('fmt ',12); buf.writeUInt32LE(16,16); buf.writeUInt16LE(1,20);
  buf.writeUInt16LE(2,22); buf.writeUInt32LE(SR,24); buf.writeUInt32LE(SR*4,28);
  buf.writeUInt16LE(4,32); buf.writeUInt16LE(16,34);
  buf.write('data',36); buf.writeUInt32LE(n*4,40);
  for(let i=0;i<n;i++){
    buf.writeInt16LE(Math.round(clamp(L[i],-1,1)*32000), 44+i*4);
    buf.writeInt16LE(Math.round(clamp(R[i],-1,1)*32000), 44+i*4+2);
  }
  fs.writeFileSync(path, buf);
}
const alloc = (secs)=>new Float32Array(Math.ceil(secs*SR));
function lp1(buf, cutoff){ // one-pole lowpass, cutoff in Hz (can be array-fn of index)
  const out = new Float32Array(buf.length); let y=0;
  for(let i=0;i<buf.length;i++){
    const fc = typeof cutoff==='function'?cutoff(i/SR):cutoff;
    const a = 1-Math.exp(-2*Math.PI*fc/SR);
    y += a*(buf[i]-y); out[i]=y;
  } return out;
}
function hp1(buf, cutoff){
  const lo = lp1(buf,cutoff); const out=new Float32Array(buf.length);
  for(let i=0;i<buf.length;i++) out[i]=buf[i]-lo[i];
  return out;
}
// state-variable bandpass (per-sample sweepable)
function svfBand(buf, freqFn, q){
  const out=new Float32Array(buf.length); let low=0,band=0;
  for(let i=0;i<buf.length;i++){
    const f = 2*Math.sin(Math.PI*Math.min(freqFn(i/SR),SR*0.45)/SR);
    const qc = 1/q;
    const high = buf[i]-low-qc*band;
    band += f*high; low += f*band;
    out[i]=band;
  } return out;
}
function mixInto(dst, src, at, gain=1){
  const off = Math.round(at*SR);
  for(let i=0;i<src.length;i++){ const j=off+i; if(j>=0&&j<dst.length) dst[j]+=src[i]*gain; }
}
const noise = (n)=>{ const a=new Float32Array(n); let s=12345;
  for(let i=0;i<n;i++){ s=(s*1103515245+12345)&0x7fffffff; a[i]=(s/0x3fffffff)-1; } return a; };
const env = (t, a, d, curve=2.5)=> t<a ? (t/a) : Math.pow(Math.max(0,1-(t-a)/d), curve);

// ---------- ONE-SHOTS ----------
function boom(dur=1.0, f0=110, f1=32, punch=1){
  const n=Math.ceil(dur*SR), o=new Float32Array(n); let ph=0;
  for(let i=0;i<n;i++){ const t=i/SR;
    const f = f1 + (f0-f1)*Math.exp(-t*11);
    ph += 2*Math.PI*f/SR;
    const e = Math.exp(-t*3.6)*(1-Math.exp(-t*400));
    o[i] = Math.sin(ph)*e*punch;
  }
  // click transient
  const nz = noise(Math.ceil(0.03*SR));
  for(let i=0;i<nz.length;i++) o[i]+= nz[i]*Math.exp(-i/SR*160)*0.28*punch;
  return o;
}
function whoosh(dur=0.62, up=true){
  const n=Math.ceil(dur*SR);
  const nz = noise(n);
  const f = (t)=>{ const x=t/dur; const c = up? 320+5200*Math.pow(x,1.7) : 5200-4600*Math.pow(x,0.7); return c; };
  const b = svfBand(nz, f, 1.1);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){ const t=i/SR, x=t/dur;
    const e = Math.pow(Math.sin(Math.PI*Math.pow(x,0.8)),1.6);
    o[i]=b[i]*e*0.9;
  } return o;
}
function swish(dur=0.42){
  const n=Math.ceil(dur*SR); const nz=noise(n);
  const b = svfBand(nz, (t)=>3400-1500*(t/dur), 1.5);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){ const t=i/SR; o[i]=b[i]*Math.exp(-t*13)*(1-Math.exp(-t*900))*1.15; }
  return o;
}
function bounce(dur=0.45){
  const n=Math.ceil(dur*SR), o=new Float32Array(n); let ph=0;
  for(let i=0;i<n;i++){ const t=i/SR; const f=150*Math.exp(-t*8)+58;
    ph+=2*Math.PI*f/SR; o[i]=Math.sin(ph)*Math.exp(-t*12)*(1-Math.exp(-t*600))*0.9; }
  const nz=noise(Math.ceil(0.02*SR));
  for(let i=0;i<nz.length;i++) o[i]+=nz[i]*Math.exp(-i/SR*220)*0.22;
  return o;
}
function step(dur=0.26){
  const n=Math.ceil(dur*SR), o=new Float32Array(n); let ph=0;
  const nz=noise(n);
  const b=hp1(nz, 900);
  for(let i=0;i<n;i++){ const t=i/SR; const f=95*Math.exp(-t*22)+48;
    ph+=2*Math.PI*f/SR;
    o[i]=Math.sin(ph)*Math.exp(-t*22)*0.8 + b[i]*Math.exp(-t*46)*0.30; }
  return o;
}
function freezeHit(dur=0.9){
  const n=Math.ceil(dur*SR), o=new Float32Array(n);
  const nz=noise(n); const b=svfBand(nz,(t)=>4200*Math.exp(-t*3.2)+700,2.4);
  let ph=0;
  for(let i=0;i<n;i++){ const t=i/SR;
    ph+=2*Math.PI*(190*Math.exp(-t*9)+60)/SR;
    o[i]= b[i]*Math.exp(-t*7)*0.55 + Math.sin(ph)*Math.exp(-t*5.5)*0.7;
  }
  return o;
}
function tick(dur=0.1){
  const n=Math.ceil(dur*SR); const nz=noise(n); const b=hp1(nz,2600);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){ const t=i/SR; o[i]=b[i]*Math.exp(-t*90)*0.55; }
  return o;
}
function riser(dur=1.0){
  const n=Math.ceil(dur*SR); const nz=noise(n);
  const b=svfBand(nz,(t)=>240+3600*Math.pow(t/dur,2.2),1.6);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){ const x=(i/SR)/dur; o[i]=b[i]*Math.pow(x,1.6)*0.85; }
  return o;
}

function saveMono(name, sig, gain=1, pan=0){
  const L=new Float32Array(sig.length), R=new Float32Array(sig.length);
  const gl=gain*Math.cos((pan+1)*Math.PI/4)*1.414*0.707, gr=gain*Math.sin((pan+1)*Math.PI/4)*1.414*0.707;
  // normalize
  let pk=0; for(const v of sig) pk=Math.max(pk,Math.abs(v));
  const nrm = pk>0? 0.92/pk : 1;
  for(let i=0;i<sig.length;i++){ L[i]=sig[i]*nrm*gl; R[i]=sig[i]*nrm*gr; }
  writeWav('public/audio/'+name, L, R);
  console.log('  wrote', name, (sig.length/SR).toFixed(2)+'s');
}

console.log('SFX:');
saveMono('sfx_impact.wav', boom(1.1,120,30,1));
saveMono('sfx_impact_deep.wav', boom(1.6,150,26,1));
saveMono('sfx_whoosh.wav', whoosh(0.6,true));
saveMono('sfx_whoosh_dn.wav', whoosh(0.5,false));
saveMono('sfx_swish.wav', swish(0.45));
saveMono('sfx_bounce.wav', bounce(0.45));
saveMono('sfx_step.wav', step(0.26));
saveMono('sfx_freeze.wav', freezeHit(0.95));
saveMono('sfx_tick.wav', tick(0.1));
saveMono('sfx_riser.wav', riser(1.0));
