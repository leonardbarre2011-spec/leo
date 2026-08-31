import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, W, H, display, ui} from '../theme';
import {envSmooth, easeOut, clamp} from '../util';
import {Grain, Vignette, SpeedLines} from './Fx';

type Grade = 'cold' | 'warm' | 'hot' | 'neutral';

const GRADES: Record<Grade, string> = {
  // Failure beats: drained, blue, harsh.
  cold: 'saturate(0.22) contrast(1.32) brightness(0.66)',
  // Rising beats: rich and warm.
  warm: 'saturate(1.28) contrast(1.14) brightness(1.04)',
  // Peak beats: blown out, punchy.
  hot: 'saturate(1.5) contrast(1.3) brightness(1.12)',
  neutral: 'saturate(1.1) contrast(1.06)',
};

export const ClipShot: React.FC<{
  src: string;
  trimBefore: number;
  grade?: Grade;
  /** 'in' pushes closer over the shot, 'out' pulls back. */
  move?: 'in' | 'out';
  zoom?: number;
  label?: string;
  labelColor?: string;
  streaks?: boolean;
  playbackRate?: number;
  tint?: string;
}> = ({
  src,
  trimBefore,
  grade = 'neutral',
  move = 'in',
  zoom = 1.16,
  label,
  labelColor = C.orange,
  streaks = false,
  playbackRate = 1,
  tint,
}) => {
  const frame = useCurrentFrame();
  const p = frame / 40;
  const e = envSmooth(frame);
  const s = move === 'in' ? zoom + p * 0.12 + e * 0.02 : zoom + 0.14 - p * 0.12 + e * 0.02;

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s})`, filter: GRADES[grade]}}>
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={trimBefore}
          playbackRate={playbackRate}
          muted
          style={{width: W, height: H, objectFit: 'cover'}}
        />
      </AbsoluteFill>

      {tint ? <AbsoluteFill style={{background: tint, mixBlendMode: 'color', opacity: 0.5}} /> : null}

      {/* Brand duotone lift so footage reads as part of the same film. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 26%, transparent 58%, rgba(0,0,0,0.82) 100%)`,
        }}
      />
      {streaks ? <SpeedLines opacity={0.32} count={16} /> : null}

      {label ? (
        <div
          style={{
            position: 'absolute',
            top: 210,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateY(${(1 - easeOut(frame, 9)) * -40}px)`,
            opacity: clamp(frame / 4, 0, 1),
          }}
        >
          <div
            style={{
              ...ui(34, 900, {letterSpacing: 5}),
              color: C.ink,
              background: labelColor,
              padding: '12px 26px',
              borderRadius: 8,
              transform: 'rotate(-1.6deg)',
            }}
          >
            {label}
          </div>
        </div>
      ) : null}

      <Vignette strength={0.8} />
      <Grain opacity={0.16} />
    </AbsoluteFill>
  );
};

/** Number + caption chip used as an overlay on footage. */
export const StatChip: React.FC<{value: string; label: string; delay?: number; x: number; y: number; color?: string}> = ({
  value,
  label,
  delay = 0,
  x,
  y,
  color = C.orange,
}) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  if (t < 0) return null;
  const p = easeOut(t, 9);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateY(${(1 - p) * 26}px) scale(${0.86 + p * 0.14})`,
        opacity: interpolate(t, [0, 4], [0, 1], {extrapolateRight: 'clamp'}),
        background: 'rgba(11,10,9,0.86)',
        border: `3px solid ${color}`,
        borderRadius: 18,
        padding: '14px 24px 18px',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{...display(76), color}}>{value}</div>
      <div style={{...ui(24, 800, {letterSpacing: 3}), color: C.bone, marginTop: 4}}>{label}</div>
    </div>
  );
};
