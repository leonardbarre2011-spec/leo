import React from 'react';
import {AbsoluteFill, useCurrentFrame, random, interpolate} from 'remotion';
import {C, W, H} from '../theme';
import {env, envSmooth, clamp, easeOut} from '../util';

/** Animated film grain. Cheap: one tiled SVG turbulence, re-seeded per frame. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.14}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width={W} height={H}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
        </filter>
        <rect width={W} height={H} filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.72}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(120% 82% at 50% 44%, transparent 38%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Bright bloom that snaps in on a hit then decays — used on impacts. */
export const Flash: React.FC<{at: number; life?: number; color?: string; max?: number}> = ({
  at,
  life = 5,
  color = C.white,
  max = 0.85,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > life) return null;
  const o = interpolate(t, [0, 1, life], [0, max, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen'}} />;
};

/** RGB split that intensifies with voice energy. Applied as a duplicated layer. */
export const ChromaSplit: React.FC<{children: React.ReactNode; amount?: number}> = ({children, amount = 5}) => {
  const frame = useCurrentFrame();
  const a = amount * (0.3 + envSmooth(frame) * 0.9);
  return (
    <>
      <AbsoluteFill style={{transform: `translateX(${-a}px)`, mixBlendMode: 'screen', filter: 'url(#chR)', opacity: 0.5}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill>{children}</AbsoluteFill>
    </>
  );
};

/** Diagonal speed streaks — sells motion on static graphics. */
export const SpeedLines: React.FC<{count?: number; color?: string; opacity?: number; angle?: number}> = ({
  count = 26,
  color = C.orange,
  opacity = 0.5,
  angle = -22,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, transform: `rotate(${angle}deg) scale(1.7)`}}>
      {new Array(count).fill(0).map((_, i) => {
        const sp = 14 + random(`sl${i}`) * 46;
        const y = ((random(`sy${i}`) * H + frame * sp) % (H * 1.4)) - H * 0.2;
        const w = 60 + random(`sw${i}`) * 420;
        const x = ((random(`sx${i}`) * W * 1.6 - frame * sp * 1.6) % (W * 1.8)) - W * 0.4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: 2 + random(`sh${i}`) * 4,
              background: color,
              opacity: 0.25 + random(`so${i}`) * 0.6,
              borderRadius: 4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Hardwood court floor with painted lines — the recurring stage. */
export const CourtBg: React.FC<{tone?: 'cold' | 'warm' | 'dark'}> = ({tone = 'dark'}) => {
  const frame = useCurrentFrame();
  const drift = (frame % 600) * 0.06;
  const grad =
    tone === 'warm'
      ? `linear-gradient(170deg, #2A1A10 0%, #120C08 55%, #0B0A09 100%)`
      : tone === 'cold'
        ? `linear-gradient(170deg, #10161C 0%, #0B0D10 60%, #07080A 100%)`
        : `linear-gradient(170deg, ${C.coal} 0%, ${C.ink2} 55%, ${C.ink} 100%)`;
  const line = tone === 'cold' ? 'rgba(154,162,174,0.16)' : 'rgba(255,91,46,0.16)';
  return (
    <AbsoluteFill style={{background: grad}}>
      {/* floorboards */}
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage: `repeating-linear-gradient(92deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 46px)`,
          transform: `translateY(${drift}px)`,
        }}
      />
      {/* key + arc */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.9}}>
        <g stroke={line} strokeWidth={5} fill="none">
          <circle cx={W / 2} cy={H * 0.62} r={300} />
          <circle cx={W / 2} cy={H * 0.62} r={150} />
          <rect x={W / 2 - 200} y={H * 0.62} width={400} height={520} />
          <path d={`M -60 ${H * 0.34} Q ${W / 2} ${H * 0.02} ${W + 60} ${H * 0.34}`} strokeWidth={7} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Full-bleed accent wash that breathes with the voice. */
export const EnergyWash: React.FC<{color?: string; base?: number}> = ({color = C.orange, base = 0.1}) => {
  const frame = useCurrentFrame();
  const e = envSmooth(frame);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 44% at 50% 46%, ${color} 0%, transparent 68%)`,
        opacity: base + e * 0.22,
        mixBlendMode: 'screen',
      }}
    />
  );
};

/** Ticker rail running along an edge — constant motion in dead space. */
export const Ticker: React.FC<{text: string; y: number; speed?: number; color?: string; size?: number}> = ({
  text,
  y,
  speed = 3,
  color = C.orange,
  size = 34,
}) => {
  const frame = useCurrentFrame();
  const rep = new Array(6).fill(text).join('   •   ');
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: W,
        overflow: 'hidden',
        height: size * 1.6,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          whiteSpace: 'nowrap',
          transform: `translateX(${-((frame * speed) % 1400)}px)`,
          fontFamily: "'PlaybookUI', sans-serif",
          fontWeight: 800,
          fontSize: size,
          letterSpacing: 3,
          color,
          opacity: 0.75,
        }}
      >
        {rep}
      </div>
    </div>
  );
};

/** Scanline sweep for "analysis" moments. */
export const Scanline: React.FC<{color?: string}> = ({color = C.gold}) => {
  const frame = useCurrentFrame();
  const y = ((frame * 26) % (H + 400)) - 200;
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: `repeating-linear-gradient(0deg, ${color}22 0px, ${color}22 1px, transparent 1px, transparent 5px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: y,
          width: W,
          height: 160,
          background: `linear-gradient(180deg, transparent, ${color}44, transparent)`,
        }}
      />
    </>
  );
};

/** Per-shot entrance: hard scale/nudge so every cut lands with force. */
export const Punch: React.FC<{
  children: React.ReactNode;
  kind?: 'zoom' | 'push' | 'drop' | 'side' | 'none';
  amount?: number;
}> = ({children, kind = 'zoom', amount = 1}) => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 10);
  let t = '';
  if (kind === 'zoom') t = `scale(${1 + 0.12 * amount * (1 - p)})`;
  if (kind === 'push') t = `scale(${1 - 0.09 * amount * (1 - p)})`;
  if (kind === 'drop') t = `translateY(${-70 * amount * (1 - p)}px)`;
  if (kind === 'side') t = `translateX(${90 * amount * (1 - p)}px)`;
  const o = clamp(frame / 3, 0, 1);
  return <AbsoluteFill style={{transform: t, opacity: o}}>{children}</AbsoluteFill>;
};

/** Global handheld camera on top of everything. */
export const Handheld: React.FC<{children: React.ReactNode; amount?: number; seed?: string}> = ({
  children,
  amount = 10,
  seed = 'cam',
}) => {
  const frame = useCurrentFrame();
  const e = 0.4 + envSmooth(frame) * 0.7;
  const x = (random(`${seed}x${Math.floor(frame / 3)}`) - 0.5) * amount * e;
  const y = (random(`${seed}y${Math.floor(frame / 3)}`) - 0.5) * amount * e;
  const r = (random(`${seed}r${Math.floor(frame / 5)}`) - 0.5) * amount * 0.035 * e;
  return (
    <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.035)`}}>{children}</AbsoluteFill>
  );
};
