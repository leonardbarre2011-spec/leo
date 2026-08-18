import {interpolate, spring} from 'remotion';
import {FPS} from '../theme';

/** Hard, fast, slightly overshooting — the "slam" every headline uses. */
export const SLAM = {damping: 13, stiffness: 320, mass: 0.55} as const;
/** Even harder, almost no overshoot — for numerals and UI chips. */
export const SNAP = {damping: 18, stiffness: 460, mass: 0.4} as const;
/** Loose and heavy — for full-screen scale moves. */
export const HEAVY = {damping: 20, stiffness: 90, mass: 1.2} as const;

export const sp = (
  frame: number,
  delay = 0,
  config: {damping: number; stiffness: number; mass: number} = SLAM
) => spring({frame: frame - delay, fps: FPS, config, durationInFrames: undefined});

/** 0 -> 1 -> 0 pulse, useful for flashes and stabs. */
export const stab = (frame: number, at: number, len: number) =>
  interpolate(frame, [at, at + len * 0.18, at + len], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Deterministic pseudo-random so renders are reproducible frame to frame. */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Signed noise in [-1, 1]. */
export const nrnd = (seed: number) => rnd(seed) * 2 - 1;

export const ease = (frame: number, from: number, to: number, a: number, b: number) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
