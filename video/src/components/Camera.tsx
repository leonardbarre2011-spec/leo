import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {nrnd, sp, HEAVY} from './anim';

/**
 * A continuous slow push. Real editors never leave a shot completely static —
 * a 4–8% drift over a few seconds is what stops a clip from feeling like a
 * screenshot, without ever reading as an effect.
 */
export const PunchIn: React.FC<{
  children: React.ReactNode;
  from?: number;
  to?: number;
  duration: number;
  originX?: number;
  originY?: number;
  /** extra hard snap-in on frame 0 of the sequence */
  snap?: boolean;
}> = ({children, from = 1.0, to = 1.08, duration, originX = 50, originY = 50, snap = false}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 2.2),
  });
  const snapScale = snap ? interpolate(sp(frame, 0, HEAVY), [0, 1], [1.28, 1]) : 1;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${drift * snapScale})`,
        transformOrigin: `${originX}% ${originY}%`,
        willChange: 'transform',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Handheld-style shake. `decay` makes it an impact rather than a permanent
 * wobble — permanent wobble is the fastest way to look like a template.
 */
export const Shake: React.FC<{
  children: React.ReactNode;
  hits: number[];
  amount?: number;
  decay?: number;
  rotation?: number;
}> = ({children, hits, amount = 22, decay = 9, rotation = 1.1}) => {
  const frame = useCurrentFrame();
  let energy = 0;
  for (const h of hits) {
    if (frame >= h) energy = Math.max(energy, Math.exp(-(frame - h) / decay));
  }
  const a = energy * amount;
  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${nrnd(frame * 1.7) * a}px, ${nrnd(frame * 2.9 + 17) * a}px, 0) rotate(${
          nrnd(frame * 1.3 + 91) * rotation * energy
        }deg) scale(${1 + energy * 0.02})`,
        willChange: 'transform',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Directional motion-blur smear on cuts, faked with stacked offset copies. */
export const SmearCut: React.FC<{children: React.ReactNode; length?: number; angle?: number}> = ({
  children,
  length = 5,
  angle = 0,
}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, length], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (k <= 0.001) return <>{children}</>;
  const dx = Math.cos((angle * Math.PI) / 180) * 90 * k;
  const dy = Math.sin((angle * Math.PI) / 180) * 90 * k;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translate3d(${-dx}px, ${-dy}px, 0)`, opacity: 0.5 * k}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translate3d(${dx}px, ${dy}px, 0)`, opacity: 0.5 * k}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{filter: `blur(${k * 9}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
