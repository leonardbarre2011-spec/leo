import fs from 'fs';
const SR=48000, DUR=24.4;
const N=Math.ceil(DUR*SR);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function writeWav(path,L,R){const n=L.length;const b=Buffer.alloc(44+n*4);
 b.write('RIFF',0);b.writeUInt32LE(36+n*4,4);b.write('WAVE',8);b.write('fmt ',12);
 b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(SR,24);
 b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);
 b.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){b.writeInt16LE(Math.round(clamp(L[i],-1,1)*32200),44+i*4);
 b.writeInt16LE(Math.round(clamp(R[i],-1,1)*32200),44+i*4+2);} fs.writeFileSync(path,b);}
const noise=(n,seed=17)=>{const a=new Float32Array(n);let s=seed;
 for(let i=0;i<n;i++){s=(s*1103515245+12345)&0x7fffffff;a[i]=(s/0x3fffffff)-1;}return a;};
function lp1(buf,cut){const o=new Float32Array(buf.length);let y=0;
 for(let i=0;i<buf.length;i++){const fc=typeof cut==='function'?cut(i/SR):cut;
 const a=1-Math.exp(-2*Math.PI*fc/SR);y+=a*(buf[i]-y);o[i]=y;}return o;}
function svfBand(buf,fFn,q){const o=new Float32Array(buf.length);let low=0,band=0;
 for(let i=0;i<buf.length;i++){const f=2*Math.sin(Math.PI*Math.min(fFn(i/SR),SR*0.45)/SR);
 const high=buf[i]-low-(1/q)*band;band+=f*high;low+=f*band;o[i]=band;}return o;}
function mixInto(dst,src,at,g=1){const off=Math.round(at*SR);
 for(let i=0;i<src.length;i++){const j=off+i;if(j>=0&&j<dst.length)dst[j]+=src[i]*g;}}

/* Third film, third piece. D minor this time, and the moving part is a
   muted pluck rather than a pad swell — audibly a different track from
   the other two while sitting in the same restrained place in the mix. */
const pts=[[0,0.34],[2.70,0.42],[3.30,0.34],[6.40,0.40],[6.90,0.46],
 [7.60,0.44],[9.20,0.34],[10.60,0.36],[10.95,0.54],[12.20,0.64],[12.45,0.46],
 [13.00,0.52],[14.80,0.42],[15.30,0.44],[17.50,0.52],[17.75,0.60],
 [19.00,0.52],[19.80,0.66],[21.00,0.70],[23.70,0.62],[24.60,0.36],[25.4,0.0]];
function energy(t){
  for(let i=0;i<pts.length-1;i++){
    if(t>=pts[i][0]&&t<=pts[i+1][0]){
      const x=(t-pts[i][0])/(pts[i+1][0]-pts[i][0]);
      return pts[i][1]+(pts[i+1][1]-pts[i][1])*(x*x*(3-2*x));
    }
  } return t<pts[0][0]?pts[0][1]:0;
}

/* Dm11 pad */
const CH=[55.00, 65.41, 82.41, 110.00, 164.81];  // A1 C2 E2 A2 E3
const padL=new Float32Array(N), padR=new Float32Array(N);
for(let v=0;v<CH.length;v++){
  const base=CH[v];
  for(let h=1;h<=5;h++){
    const amp=(1/(h*h*1.2))*(v===0?1.45:1)*(v>=3?0.45:1);
    const det=(v*0.23+h*0.19)%1;
    const pan=((v%2)?1:-1)*0.32*(v/CH.length);
    let ph=v*1.3+h*1.9;
    for(let i=0;i<N;i++){
      const t=i/SR;
      const lfo=Math.sin(2*Math.PI*(0.04+0.011*v)*t+det*6.28)*0.0013;
      ph+=2*Math.PI*(base*h*(1+lfo+det*0.0006))/SR;
      const sm=Math.sin(ph)*amp;
      padL[i]+=sm*(1-Math.max(0,pan)); padR[i]+=sm*(1+Math.min(0,pan));
    }
  }
}
let pL=lp1(padL,(t)=>280+820*Math.pow(energy(t),1.5));
let pR=lp1(padR,(t)=>280+820*Math.pow(energy(t),1.5));
{let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(pL[i]),Math.abs(pR[i]));
 for(let i=0;i<N;i++){const g=(0.40+0.48*energy(i/SR))/pk*0.95;pL[i]*=g;pR[i]*=g;}}

/* the pluck: short, damped, a couple of notes at a time */
const pluck=new Float32Array(N);
function pl(at,f,g,dur=0.55){
  const n=Math.ceil(dur*SR),o=new Float32Array(n);let ph=0,ph2=0;
  for(let i=0;i<n;i++){const t=i/SR;
    ph+=2*Math.PI*f/SR; ph2+=2*Math.PI*f*2.004/SR;
    const e=Math.exp(-t*7.5)*(1-Math.exp(-t*500));
    o[i]=(Math.sin(ph)*0.8+Math.sin(ph2)*0.18)*e;}
  mixInto(pluck,o,at,g);
}
const D=[329.63,392.00,440.00,523.25];  // E4 G4 A4 C5
const figure=[
 [0.05,0],[1.05,1],[2.20,2],
 [3.80,0],[4.90,1],
 [7.72,0],[8.14,1],[8.52,2],
 [9.06,0],[9.50,1],
 [10.08,2],[10.42,1],
 [11.28,2],[11.76,3],
 [12.92,0],[13.70,1],[14.55,2],[15.42,1],
 [16.75,0],[17.15,1],[17.50,2],
 [18.90,0],[19.50,1],[20.20,2],[20.98,3],[21.60,2],[22.30,1],
];
for(const [t,i] of figure) pl(t, D[i], 0.13*(0.6+0.8*energy(t)));

/* long sub notes, one per section */
const sub=new Float32Array(N);
function subNote(at,len,f,g){
  const n=Math.ceil(len*SR),o=new Float32Array(n);let ph=0;
  for(let i=0;i<n;i++){const t=i/SR;ph+=2*Math.PI*f/SR;
    o[i]=Math.sin(ph)*Math.min(1,t/0.1)*Math.pow(Math.max(0,1-t/len),1.5);}
  mixInto(sub,o,at,g);
}
for(const [t,f,g] of [[0.0,27.5,.8],[2.18,27.5,.9],[3.28,32.7,.65],[6.07,27.5,.85],
 [7.68,41.2,.7],[11.17,49.0,.75],[12.88,32.7,.7],[16.22,41.2,.65],
 [18.28,27.5,.8],[21.52,32.7,.6]]) subNote(t,2.3,f,0.46*g);

/* two soft swells */
const fx=new Float32Array(N);
function swell(at,len,g,up=true){
  const n=Math.ceil(len*SR),nz=noise(n,Math.round(at*23)+7);
  const b=svfBand(nz,(t)=>up?(240+1400*Math.pow(t/len,2)):(1600*Math.exp(-2.4*t/len)+220),1.5);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){const x=(i/SR)/len;o[i]=b[i]*(up?Math.pow(x,1.8):Math.pow(1-x,1.3));}
  mixInto(fx,o,at,g);
}
swell(1.40,0.78,0.17,true);    // into the freeze
swell(2.30,1.10,0.13,false);   // and out of it
swell(10.45,0.85,0.14,true);   // into "explode past it"
swell(18.55,0.85,0.13,true);   // into the CTA

const L=new Float32Array(N),R=new Float32Array(N);
for(let i=0;i<N;i++){
  const e=energy(i/SR);
  const sg=0.8*(0.5+0.6*e);
  L[i]=Math.tanh((pL[i]+sub[i]*sg+pluck[i]*0.95+fx[i]*0.8)*0.95)*0.9;
  R[i]=Math.tanh((pR[i]+sub[i]*sg+pluck[i]*1.05+fx[i]*0.8)*0.95)*0.9;
}
for(let i=0;i<Math.round(0.5*SR);i++){const g=i/(0.5*SR);L[i]*=g;R[i]*=g;}
const fo=Math.round(1.5*SR);
for(let i=0;i<fo;i++){const j=N-1-i,g=i/fo;L[j]*=g;R[j]*=g;}
let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));
for(let i=0;i<N;i++){L[i]*=0.85/pk;R[i]*=0.85/pk;}
writeWav('public/audio/music4.wav',L,R);
console.log('music4.wav', (N/SR).toFixed(2)+'s');
