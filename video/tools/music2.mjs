import fs from 'fs';
const SR=48000, DUR=23.4;
const N=Math.ceil(DUR*SR);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function writeWav(path,L,R){const n=L.length;const b=Buffer.alloc(44+n*4);
 b.write('RIFF',0);b.writeUInt32LE(36+n*4,4);b.write('WAVE',8);b.write('fmt ',12);
 b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(SR,24);
 b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);
 b.writeUInt32LE(n*4,40);
 for(let i=0;i<n;i++){b.writeInt16LE(Math.round(clamp(L[i],-1,1)*32200),44+i*4);
 b.writeInt16LE(Math.round(clamp(R[i],-1,1)*32200),44+i*4+2);} fs.writeFileSync(path,b);}
const noise=(n,seed=11)=>{const a=new Float32Array(n);let s=seed;
 for(let i=0;i<n;i++){s=(s*1103515245+12345)&0x7fffffff;a[i]=(s/0x3fffffff)-1;}return a;};
function lp1(buf,cut){const o=new Float32Array(buf.length);let y=0;
 for(let i=0;i<buf.length;i++){const fc=typeof cut==='function'?cut(i/SR):cut;
 const a=1-Math.exp(-2*Math.PI*fc/SR);y+=a*(buf[i]-y);o[i]=y;}return o;}
function svfBand(buf,fFn,q){const o=new Float32Array(buf.length);let low=0,band=0;
 for(let i=0;i<buf.length;i++){const f=2*Math.sin(Math.PI*Math.min(fFn(i/SR),SR*0.45)/SR);
 const high=buf[i]-low-(1/q)*band;band+=f*high;low+=f*band;o[i]=band;}return o;}
function mixInto(dst,src,at,g=1){const off=Math.round(at*SR);
 for(let i=0;i<src.length;i++){const j=off+i;if(j>=0&&j<dst.length)dst[j]+=src[i]*g;}}

/* A deliberately quiet arrangement. It moves under the narration in
   long shapes rather than beats — this edit does not need a drum kit. */
const pts=[[0,0.34],[2.60,0.40],[2.75,0.30],[7.10,0.36],[7.30,0.44],
 [8.30,0.40],[9.40,0.30],[10.50,0.34],[10.90,0.50],[12.40,0.62],[13.00,0.50],
 [13.05,0.36],[16.20,0.46],[16.40,0.58],[17.90,0.62],[18.40,0.70],
 [20.90,0.66],[22.40,0.40],[23.4,0.0]];
function energy(t){
  for(let i=0;i<pts.length-1;i++){
    if(t>=pts[i][0]&&t<=pts[i+1][0]){
      const x=(t-pts[i][0])/(pts[i+1][0]-pts[i][0]);
      return pts[i][1]+(pts[i+1][1]-pts[i][1])*(x*x*(3-2*x));
    }
  } return t<pts[0][0]?pts[0][1]:0;
}

/* Cm9 — warmer and less anxious than the first film's Fm */
const CH=[65.41, 77.78, 98.00, 130.81, 196.00];   // C2 Eb2 G2 C3 G3
const padL=new Float32Array(N), padR=new Float32Array(N);
for(let v=0;v<CH.length;v++){
  const base=CH[v];
  for(let h=1;h<=5;h++){
    const amp=(1/(h*h*1.15))*(v===0?1.5:1)*(v>=3?0.5:1);
    const det=(v*0.27+h*0.13)%1;
    const pan=((v%2)?1:-1)*0.3*(v/CH.length);
    let ph=v*2.1+h*0.7;
    for(let i=0;i<N;i++){
      const t=i/SR;
      const lfo=Math.sin(2*Math.PI*(0.045+0.012*v)*t+det*6.28)*0.0014;
      ph+=2*Math.PI*(base*h*(1+lfo+det*0.0007))/SR;
      const sm=Math.sin(ph)*amp;
      padL[i]+=sm*(1-Math.max(0,pan)); padR[i]+=sm*(1+Math.min(0,pan));
    }
  }
}
const cutFn=(t)=>300+900*Math.pow(energy(t),1.5);
let pL=lp1(padL,cutFn), pR=lp1(padR,cutFn);
{let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(pL[i]),Math.abs(pR[i]));
 for(let i=0;i<N;i++){const g=(0.42+0.5*energy(i/SR))/pk*0.95;pL[i]*=g;pR[i]*=g;}}

/* Long sub notes on section changes only — nine in the whole piece. */
const sub=new Float32Array(N);
function subNote(at,len,f,g){
  const n=Math.ceil(len*SR),o=new Float32Array(n);let ph=0;
  for(let i=0;i<n;i++){const t=i/SR;
    ph+=2*Math.PI*f/SR;
    const env=Math.min(1,t/0.09)*Math.pow(Math.max(0,1-t/len),1.5);
    o[i]=Math.sin(ph)*env;}
  mixInto(sub,o,at,g);
}
for(const [t,f,g] of [[0.0,32.7,.75],[2.67,32.7,.7],[7.22,38.9,.7],[8.38,32.7,.6],
 [10.82,38.9,.7],[12.42,49.0,.85],[13.03,32.7,.65],[16.30,38.9,.7],
 [18.45,49.0,.8],[20.90,32.7,.6]]) subNote(t,2.2,f,0.5*g);

/* Two soft swells, where the picture opens up. */
const fx=new Float32Array(N);
function swell(at,len,g,up=true){
  const n=Math.ceil(len*SR),nz=noise(n,Math.round(at*17)+3);
  const b=svfBand(nz,(t)=>up?(260+1500*Math.pow(t/len,2)):(1700*Math.exp(-2.4*t/len)+240),1.5);
  const o=new Float32Array(n);
  for(let i=0;i<n;i++){const x=(i/SR)/len;o[i]=b[i]*(up?Math.pow(x,1.8):Math.pow(1-x,1.3));}
  mixInto(fx,o,at,g);
}
swell(11.30,1.15,0.16,true);   // into "explode"
swell(13.05,1.20,0.14,false);  // out of it, onto the board
swell(17.60,0.95,0.15,true);   // into the CTA

const L=new Float32Array(N),R=new Float32Array(N);
for(let i=0;i<N;i++){
  const e=energy(i/SR);
  const sg=0.8*(0.55+0.6*e);
  L[i]=Math.tanh((pL[i]+sub[i]*sg+fx[i]*0.8)*0.95)*0.9;
  R[i]=Math.tanh((pR[i]+sub[i]*sg+fx[i]*0.8)*0.95)*0.9;
}
for(let i=0;i<Math.round(0.5*SR);i++){const g=i/(0.5*SR);L[i]*=g;R[i]*=g;}
const fo=Math.round(1.6*SR);
for(let i=0;i<fo;i++){const j=N-1-i,g=i/fo;L[j]*=g;R[j]*=g;}
let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));
for(let i=0;i<N;i++){L[i]*=0.85/pk;R[i]*=0.85/pk;}
writeWav('public/audio/music2.wav',L,R);
console.log('music2.wav', (N/SR).toFixed(2)+'s');
