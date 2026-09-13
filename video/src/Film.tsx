import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C } from './theme';
import { useFonts } from './lib/fonts';
import { clamp, EASE, prog, ramp, useT } from './lib/anim';
import { Flash, Grain, Vignette } from './elements/Ui';
import { Captions, captionsHiddenAt } from './elements/Captions';
import { CourtPlane } from './elements/Court';
import { DURATION, S } from './generated/timeline';
import { Hook, Loop, Scale, Wait } from './scenes/Act1';
import { Smooth, Stress, TwoHundred } from './scenes/Act2';
import { DifferentJob, Nothing, Positions, Possession, SameDrills, SamePlan } from './scenes/Act3';
import { EndCard, Progression } from './scenes/Act4';

/**
 * One shot list, one clock. Scenes mount only inside their own window, which
 * keeps the frame cheap, and every cut is either hard (on an impact) or a
 * short dissolve — the continuity comes from the ball and the court, not from
 * transition effects.
 */
const Cut: React.FC<{
  t: number;
  from: number;
  to: number;
  fade?: number;
  drift?: number;
  children: React.ReactNode;
}> = ({ t, from, to, fade = 0.12, drift = 0.012, children }) => {
  if (t < from - fade || t >= to + fade) return null;
  const inP = prog(t, from - fade * 0.3, from + fade, EASE.out);
  const outP = prog(t, to - fade * 0.6, to + fade * 0.4, EASE.in);
  const life = (t - from) / Math.max(0.001, to - from);
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        transform: `scale(${1 + drift * (1 - life) - drift * 0.35})`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Ambient floor under everything. Present, never legible. */
const Backdrop: React.FC<{ t: number }> = ({ t }) => {
  const courtScenes = t >= 20.1 && t < 33.05;
  const o = courtScenes ? 0 : 0.7;
  if (o === 0) return null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <CourtPlane
        lean={68}
        turn={ramp(t, 0, DURATION, -12, 10, EASE.inOut)}
        zoom={1.6}
        y={560}
        czoom={0.9}
        lineOpacity={0.5}
        opacity={0.5}
      />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const t = useT();

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1180px 700px at 60% 24%, rgba(255,91,46,0.14), rgba(0,0,0,0) 64%)`,
        }}
      />
      <Backdrop t={t} />

      <Cut t={t} from={S('hook').from} to={S('hook').to} fade={0.001} drift={0}>
        <Hook t={t} />
      </Cut>
      <Cut t={t} from={S('loop').from} to={S('loop').to} fade={0.14}>
        <Loop t={t} />
      </Cut>
      <Cut t={t} from={S('wait').from} to={S('wait').to}>
        <Wait t={t} />
      </Cut>
      <Cut t={t} from={S('scale').from} to={S('scale').to}>
        <Scale t={t} />
      </Cut>
      <Cut t={t} from={S('stress').from} to={S('stress').to} fade={0.08}>
        <Stress t={t} />
      </Cut>
      <Cut t={t} from={S('twohundred').from} to={S('twohundred').to} fade={0.08}>
        <TwoHundred t={t} />
      </Cut>
      <Cut t={t} from={S('smooth').from} to={S('smooth').to} fade={0.1}>
        <Smooth t={t} />
      </Cut>
      <Cut t={t} from={S('positions').from} to={S('positions').to} fade={0.16} drift={0}>
        <Positions t={t} />
      </Cut>
      <Cut t={t} from={S('sameplan').from} to={S('sameplan').to} fade={0.1}>
        <SamePlan t={t} />
      </Cut>
      <Cut t={t} from={S('read').from} to={S('help').to} fade={0.14} drift={0}>
        <Possession t={t} />
      </Cut>
      <Cut t={t} from={S('differentjob').from} to={S('differentjob').to} fade={0.05}>
        <DifferentJob t={t} />
      </Cut>
      <Cut t={t} from={S('samedrills').from} to={S('samedrills').to} fade={0.05}>
        <SameDrills t={t} />
      </Cut>
      <Cut t={t} from={S('nothing').from} to={S('nothing').to} fade={0.1}>
        <Nothing t={t} />
      </Cut>
      <Cut t={t} from={S('turn').from} to={S('cardio').to} fade={0.12} drift={0}>
        <Progression t={t} />
      </Cut>
      <Cut t={t} from={S('end').from} to={DURATION} fade={0.14}>
        <EndCard t={t} frame={frame} />
      </Cut>

      <Captions t={t} hidden={captionsHiddenAt(t)} />

      {/* how much film is left — the only piece of persistent chrome */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 4,
          width: `${clamp(t / DURATION) * 100}%`,
          background: C.accent,
          opacity: 0.5,
        }}
      />

      <Vignette strength={0.8} />
      <Grain frame={frame} opacity={0.045} />
      {/* the hard cut out of the hook */}
      <Flash p={prog(t, 0.9, 0.94) * (1 - prog(t, 0.94, 1.04))} />

      <Audio src={staticFile('vo.mp3')} />
      <Audio src={staticFile('sfx.mp3')} volume={0.72} />
    </AbsoluteFill>
  );
};
