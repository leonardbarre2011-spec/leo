import {interpolate, random} from 'remotion';
import envData from './data/env.json';

const ENV = envData as number[];

/** Loudness of the voiceover at a given frame, 0..~1.3. Drives every pulse. */
export const env = (frame: number) => ENV[Math.max(0, Math.min(ENV.length - 1, Math.round(frame)))] ?? 0;

/** Smoothed loudness over a small window — steadier for scale/zoom. */
export const envSmooth = (frame: number, span = 4) => {
  let s = 0;
  for (let i = -span; i <= span; i++) s += env(frame + i);
  return s / (span * 2 + 1);
};

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Ease-out-back impulse, 0 -> 1, used for hard entrances. */
export const impulse = (t: number, dur = 8) => {
  const p = clamp(t / dur, 0, 1);
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

export const easeOut = (t: number, dur = 12) => {
  const p = clamp(t / dur, 0, 1);
  return 1 - Math.pow(1 - p, 3);
};

/** Deterministic handheld shake, amplified by voice energy. */
export const shake = (frame: number, amount: number, seed = 'a') => {
  const e = 0.35 + envSmooth(frame) * 0.8;
  const x = (random(`${seed}x${Math.floor(frame / 2)}`) - 0.5) * amount * e;
  const y = (random(`${seed}y${Math.floor(frame / 2)}`) - 0.5) * amount * e;
  const r = (random(`${seed}r${Math.floor(frame / 3)}`) - 0.5) * amount * 0.05 * e;
  return {x, y, r};
};

export const stagger = (i: number, per = 3) => i * per;

export const fadeIn = (t: number, dur = 6) => interpolate(t, [0, dur], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
