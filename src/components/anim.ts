import {Easing, interpolate, spring} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 -> 1 over `len` frames starting at `start`, with a cinematic ease-out. */
export const rampIn = (frame: number, start: number, len: number) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

/** Fades a module in and back out inside its own window. */
export const windowOpacity = (local: number, duration: number, inLen = 7, outLen = 7) =>
  Math.min(
    interpolate(local, [0, inLen], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(local, [duration - outLen, duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

/** Punchy overshoot used for stamps, chips and pop-ins. */
export const pop = (frame: number, fps: number, delay = 0, damping = 12) =>
  spring({frame, fps, delay, config: {damping, mass: 0.6, stiffness: 170}});

/** Deterministic wiggle for hand-held feel (no Math.random in Remotion). */
export const wobble = (frame: number, speed: number, amp: number, phase = 0) =>
  Math.sin((frame / speed) * Math.PI * 2 + phase) * amp;

export {interpolate, spring};
