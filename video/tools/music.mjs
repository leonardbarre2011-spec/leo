import fs from 'fs';
const SR=48000, DUR=25.2;
const N=Math.ceil(DUR*SR);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function writeWav(path,L,R){const n=L.length;const b=Buffer.alloc(44+n*4);
 b.write('RIFF',0);b.writeUInt32LE(36+n*4,4);b.write('WAVE',8);b.write('fmt ',12);
 b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(SR,24);
 b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);
 b.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){b.writeInt16LE(Math.round(clamp(L[i],-1,1)*32200),44+i*4);
 b.writeInt16LE(Math.round(clamp(R[i],-1,1)*32200),44+i*4+2);} fs.writeFileSync(path,b);}
const noise=(n,seed=7)=>{const a=new Float32Array(n);let s=seed;for(let i=0;i<n;i++){s=(s*1103515245+12345)&0x7fffffff;a[i]=(s/0x3fffffff)-1;}return a;};
function lp1(buf,cut){const o=new Float32Array(buf.length);let y=0;
 for(let i=0;i<buf.length;i++){const fc=typeof cut==='function'?cut(i/SR):cut;
 const a=1-Math.exp(-2*Math.PI*fc/SR);y+=a*(buf[i]-y);o[i]=y;}return o;}
function hp1(buf,cut){const lo=lp1(buf,cut);const o=new Float32Array(buf.length);
 for(let i=0;i<buf.length;i++)o[i]=buf[i]-lo[i];return o;}
function svfBand(buf,fFn,q){const o=new Float32Array(buf.length);let low=0,band=0;
 for(let i=0;i<buf.length;i++){const f=2*Math.sin(Math.PI*Math.min(fFn(i/SR),SR*0.45)/SR);
 const high=buf[i]-low-(1/q)*band;band+=f*high;low+=f*band;o[i]=band;}return o;}
function mixInto(dst,src,at,g=1){const off=Math.round(at*SR);
 for(let i=0;i<src.length;i++){const j=off+i;if(j>=0&&j<dst.length)dst[j]+=src[i]*g;}}

// ---- musical energy envelope (0..1) at time t ----
const pts=[[0,0.30],[1.15,0.34],[1.25,0.62],[2.30,0.48],[3.30,0.58],[3.50,0.40],
 [5.40,0.46],[5.58,0.72],[5.95,0.50],[6.45,0.66],[6.55,0.52],[8.60,0.58],
 [10.25,0.66],[11.05,0.80],[11.90,0.86],[12.85,0.90],[12.95,1.00],[13.85,0.95],
 [14.40,0.88],[15.05,0.80],[15.20,0.22],[15.95,0.30],[17.20,0.46],[18.10,0.60],
 [18.20,0.78],[18.75,0.88],[19.55,0.92],[19.66,1.00],[20.10,0.55],[20.70,0.30],
 [20.95,0.52],[22.40,0.60],[23.40,0.62],[24.30,0.42],[25.2,0.0]];
function energy(t){
  for(let i=0;i<pts.length-1;i++){
    if(t>=pts[i][0]&&t<=pts[i+1][0]){
      const x=(t-pts[i][0])/(pts[i+1][0]-pts[i][0]);
      const s=x*x*(3-2*x);
      return pts[i][1]+(pts[i+1][1]-pts[i][1])*s;
    }
  } return t<pts[0][0]?pts[0][1]:0;
}

// ---- PAD: Fm9 stack, slow detuned saw-ish partials ----
const F=[87.31, 103.83, 130.81, 174.61, 261.63];      // F2 Ab2 C3 F3 C4
const padL=new Float32Array(N), padR=new Float32Array(N);
for(let v=0; v<F.length; v++){
  const base=F[v];
  for(let h=1; h<=6; h++){
    const amp=(1/(h*h))*(v===0?1.4:1.0)*(v>=3?0.55:1);
    const det=(v*0.31+h*0.17)%1;
    const pan=((v%2)?1:-1)*0.35*(v/F.length);
    let ph=Math.random()*0;
    let phv=(v*1.7+h*0.9);
    for(let i=0;i<N;i++){
      const t=i/SR;
      const lfo=Math.sin(2*Math.PI*(0.06+0.017*v)*t + det*6.28)*0.0018;
      const f=base*h*(1+lfo+det*0.0009);
      phv+=2*Math.PI*f/SR;
      const s=Math.sin(phv)*amp;
      padL[i]+=s*(1-Math.max(0,pan)); padR[i]+=s*(1+Math.min(0,pan));
    }
  }
}
// filter pad by energy
const cutFn=(t)=>340+1500*Math.pow(energy(t),1.7);
let pL=lp1(padL,cutFn), pR=lp1(padR,cutFn);
{ let pk=0; for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(pL[i]),Math.abs(pR[i]));
  for(let i=0;i<N;i++){ const t=i/SR; const g=(0.30+0.55*energy(t))/pk*0.95; pL[i]*=g; pR[i]*=g; } }

// ---- SUB BASS pulses at narrative beats ----
const sub=new Float32Array(N);
function subHit(at,len,f0,f1,g){
  const n=Math.ceil(len*SR), o=new Float32Array(n); let ph=0;
  for(let i=0;i<n;i++){const t=i/SR; const f=f1+(f0-f1)*Math.exp(-t*10);
    ph+=2*Math.PI*f/SR;
    o[i]=Math.sin(ph)*Math.exp(-t*(2.4+1.2/len))*(1-Math.exp(-t*300));}
  mixInto(sub,o,at,g);
}
const subTimes=[[0.05,.9],[1.22,1.15],[2.34,.8],[3.46,.9],[4.30,.7],[5.57,1.2],
 [6.52,.95],[7.62,.85],[8.62,.8],[9.35,.9],[10.28,.95],[11.08,1.0],[11.95,1.0],
 [12.28,.8],[12.90,1.25],[13.33,.85],[13.72,.9],[14.12,.85],[14.52,.8],
 [16.03,.75],[17.44,.8],[18.17,1.05],[18.46,.85],[18.78,1.1],[19.65,1.35],
 [20.88,.9],[21.75,.7],[22.46,.8],[23.16,.85]];
for(const [t,g] of subTimes) subHit(t, 0.95, 92, 40.5, 0.55*g);

// ---- HATS: 16ths during high-energy sections only ----
const hats=new Float32Array(N);
const BPM=140, six=60/BPM/4;
function hat(at,g,bright){
  const n=Math.ceil(0.06*SR), nz=noise(n, Math.round(at*1000)+3);
  const b=hp1(nz, bright?7200:5200);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){const t=i/SR;o[i]=b[i]*Math.exp(-t*(bright?130:95));}
  mixInto(hats,o,at,g);
}
const hatWindows=[[10.30,15.05],[18.15,19.62],[21.6,24.2]];
for(const [a,b] of hatWindows){
  let k=0;
  for(let t=a;t<b;t+=six,k++){
    const e=energy(t);
    let g=0.30*e;
    if(k%4===0)g*=1.55; else if(k%2===1)g*=0.55;
    if(k%8===6)g*=1.25;
    hat(t,g,k%4===0);
  }
}
// ---- SNAP on the 3rd beat of drill bars ----
function snap(at,g){
  const n=Math.ceil(0.24*SR), nz=noise(n,Math.round(at*777));
  const b=svfBand(nz,(t)=>2100-900*(t/0.24),1.2);
  const o=new Float32Array(n);
  let ph=0;
  for(let i=0;i<n;i++){const t=i/SR;ph+=2*Math.PI*(320*Math.exp(-t*30)+180)/SR;
   o[i]=b[i]*Math.exp(-t*24)*0.9+Math.sin(ph)*Math.exp(-t*40)*0.25;}
  mixInto(hats,o,at,g);
}
for(const t of [11.52,12.38,13.24,14.10,14.96, 18.6,19.2, 22.0,22.9,23.8]) snap(t,0.26*energy(t));

// ---- RISERS before key drops ----
const fx=new Float32Array(N);
function riserAt(at,len,g){
  const n=Math.ceil(len*SR), nz=noise(n,Math.round(at*31)+11);
  const b=svfBand(nz,(t)=>200+4200*Math.pow(t/len,2.3),1.7);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){const x=(i/SR)/len;o[i]=b[i]*Math.pow(x,2.0);}
  mixInto(fx,o,at,g);
}
riserAt(2.45,1.0,0.30); riserAt(5.95,0.55,0.26); riserAt(10.30,0.75,0.30);
riserAt(12.20,0.70,0.34); riserAt(17.35,0.80,0.30); riserAt(20.10,0.72,0.22);
// downlifter / reverse-ish swell into CTA
function downAt(at,len,g){
  const n=Math.ceil(len*SR), nz=noise(n,Math.round(at*53)+5);
  const b=svfBand(nz,(t)=>3800*Math.exp(-3.0*t/len)+260,1.5);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){const x=(i/SR)/len;o[i]=b[i]*Math.pow(1-x,1.2);}
  mixInto(fx,o,at,g);
}
downAt(15.10,1.1,0.30); downAt(19.66,1.5,0.34); downAt(2.28,0.55,0.18);

// ---- BIG IMPACTS on the two hero hits ----
function impact(at,g){
  const n=Math.ceil(1.9*SR),o=new Float32Array(n);let ph=0;
  for(let i=0;i<n;i++){const t=i/SR;const f=36+120*Math.exp(-t*13);
   ph+=2*Math.PI*f/SR;o[i]=Math.sin(ph)*Math.exp(-t*2.2)*(1-Math.exp(-t*450));}
  const nz=noise(Math.ceil(0.5*SR),99); const b=lp1(nz,900);
  for(let i=0;i<b.length;i++)o[i]+=b[i]*Math.exp(-i/SR*11)*0.35;
  mixInto(fx,o,at,g);
}
impact(1.22,0.55); impact(5.57,0.60); impact(12.90,0.72); impact(19.65,0.85);

// ---- MIX ----
const L=new Float32Array(N),R=new Float32Array(N);
for(let i=0;i<N;i++){
  const t=i/SR;
  const e=energy(t);
  const subG=0.85*(0.5+0.7*e);
  const hatG=1.0;
  const fxG=0.85;
  const l=pL[i] + sub[i]*subG + hats[i]*hatG*0.95 + fx[i]*fxG;
  const r=pR[i] + sub[i]*subG + hats[i]*hatG*1.05 + fx[i]*fxG;
  // soft clip
  L[i]=Math.tanh(l*0.95)*0.9;
  R[i]=Math.tanh(r*0.95)*0.9;
}
// fade in/out
for(let i=0;i<Math.round(0.25*SR);i++){const g=i/(0.25*SR);L[i]*=g;R[i]*=g;}
const fo=Math.round(1.1*SR);
for(let i=0;i<fo;i++){const j=N-1-i;const g=i/fo;L[j]*=g;R[j]*=g;}
let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));
const nrm=0.85/pk;
for(let i=0;i<N;i++){L[i]*=nrm;R[i]*=nrm;}
writeWav('public/audio/music.wav',L,R);
console.log('music.wav written', (N/SR).toFixed(2)+'s peak', pk.toFixed(3));
