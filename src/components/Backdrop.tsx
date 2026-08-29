import React from 'react';
import {AbsoluteFill, OffthreadVideo, useCurrentFrame} from 'remotion';
import {ASSETS, COLORS} from '../theme';
import {wobble} from './anim';

/**
 * The original export wasted the top and bottom thirds of a 9:16 frame on pure
 * black. Here that dead space becomes a slow-drifting, blurred blow-up of the
 * clip itself, so the frame is always alive and the footage feels embedded in
 * the gym instead of floating in a void.
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = wobble(frame, 420, 14);
  const scale = 1.08 + wobble(frame, 620, 0.03, 1.2);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      <AbsoluteFill style={{transform: `scale(${scale}) translateX(${drift}px)`, opacity: 0.85}}>
        <OffthreadVideo
          src={ASSETS.bg()}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>

      {/* Warm court glow + top/bottom falloff so overlaid type always has contrast */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 60% at 50% 42%, rgba(255,90,31,0.18) 0%, rgba(255,90,31,0) 60%),
            linear-gradient(180deg, rgba(7,9,12,0.66) 0%, rgba(7,9,12,0.18) 24%, rgba(7,9,12,0.22) 70%, rgba(7,9,12,0.78) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 240px 40px rgba(0,0,0,0.6)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Fine film grain, keeps the flat graphic layers from looking like a slideshow. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2) % 3;
  return (
    <AbsoluteFill
      style={{
        opacity: 0.16,
        mixBlendMode: 'overlay',
        transform: `translate(${step * 7 - 7}px, ${step * 11 - 11}px)`,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.55'/></svg>\")",
        backgroundSize: '360px 360px',
        pointerEvents: 'none',
      }}
    />
  );
};
