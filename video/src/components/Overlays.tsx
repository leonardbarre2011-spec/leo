import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {C} from '../theme';
import {stab, rnd} from './anim';

/** Film grain + vignette. Cheap, but it is the single biggest thing separating
 *  "rendered in a browser" from "graded in an edit suite". */
export const Texture: React.FC<{grain?: number; vignette?: number}> = ({
  grain = 0.075,
  vignette = 0.62,
}) => {
  const frame = useCurrentFrame();
  const shift = Math.floor(rnd(frame) * 400);
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 78% at 50% 44%, rgba(0,0,0,0) 38%, rgba(0,0,0,${vignette}) 100%)`,
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: grain,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '240px 240px',
          backgroundPosition: `${shift}px ${(shift * 7) % 400}px`,
        }}
      />
    </>
  );
};

/** Single-frame white/colour stab on a cut. */
export const Flash: React.FC<{at: number; len?: number; color?: string; max?: number}> = ({
  at,
  len = 4,
  color = C.white,
  max = 0.85,
}) => {
  const frame = useCurrentFrame();
  const o = stab(frame, at, len) * max;
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

/** RGB split + slice displacement. Used only on hard concept changes. */
export const Glitch: React.FC<{at: number; len?: number; children: React.ReactNode}> = ({
  at,
  len = 5,
  children,
}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const active = frame >= at && frame <= at + len;
  if (!active || k <= 0.01) return <>{children}</>;
  const off = 18 * k;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{transform: `translateX(${-off}px)`, filter: 'url(#ch-r)', opacity: 0.75}}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${off}px)`, mixBlendMode: 'screen', opacity: 0.75}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: 1 - k * 0.35}}>{children}</AbsoluteFill>
      {[0, 1, 2].map((i) => {
        const y = random(`g${at}${i}${Math.floor(frame)}`) * 1920;
        const h = 26 + random(`h${at}${i}${Math.floor(frame)}`) * 90;
        return (
          <AbsoluteFill
            key={i}
            style={{
              top: y,
              height: h,
              overflow: 'hidden',
              transform: `translateX(${(random(`x${at}${i}${Math.floor(frame)}`) - 0.5) * 130 * k}px)`,
            }}
          >
            <AbsoluteFill style={{top: -y}}>{children}</AbsoluteFill>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/** Thin ticker rails top and bottom — reads as "sports broadcast" instantly. */
export const Rails: React.FC<{color?: string; opacity?: number}> = ({
  color = C.red,
  opacity = 0.9,
}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: color}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: color}} />
  </AbsoluteFill>
);

/** Letterbox that closes in — used to compress the frame at moments of tension. */
export const Bars: React.FC<{at: number; size: number; duration?: number}> = ({
  at,
  size,
  duration = 8,
}) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [at, at + duration], [0, size], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: h, background: C.black}} />
      <div
        style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: h, background: C.black}}
      />
    </AbsoluteFill>
  );
};

/** SVG filters used by Glitch. Mounted once at the root. */
export const Filters: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="ch-r">
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
        />
      </filter>
    </defs>
  </svg>
);
