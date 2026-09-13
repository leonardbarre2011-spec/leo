import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

/** Current time in seconds on the trimmed timeline. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const EASE = {
  /** the house curve — everything decelerates like it has mass */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** snappy, for things that lock into place */
  snap: Easing.bezier(0.2, 1.25, 0.35, 1),
};

/** 0→1 progress between two absolute times, clamped. */
export const prog = (t: number, from: number, to: number, ease = EASE.out) =>
  interpolate(t, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** value ramp between two absolute times. */
export const ramp = (
  t: number,
  from: number,
  to: number,
  a: number,
  b: number,
  ease = EASE.out
) =>
  interpolate(t, [from, to], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** rise then fall — for flashes, pins, impacts. */
export const pulse = (t: number, at: number, up = 0.09, down = 0.36) =>
  t < at
    ? 0
    : t < at + up
      ? prog(t, at, at + up, EASE.out)
      : 1 - prog(t, at + up, at + up + down, EASE.out);

/** A keyframe track. Times are absolute seconds. */
export type Key<T> = [number, T];
export function track(keys: Key<number>[], t: number, ease = EASE.inOut): number {
  if (t <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t >= t0 && t <= t1) return interpolate(t, [t0, t1], [v0, v1], { easing: ease });
  }
  return last[1];
}

/** Critically-damped settle, for objects that arrive rather than appear. */
export const settle = (p: number, bounce = 0.42) =>
  p >= 1 ? 1 : 1 - Math.exp(-7 * p) * Math.cos(bounce * 9 * p);

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
