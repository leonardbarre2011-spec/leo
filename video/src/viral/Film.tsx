import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { V } from '../theme';
import { useFonts } from '../lib/fonts';
import { clamp, EASE, prog, useT } from '../lib/anim';
import { Flash, Grain, Vignette } from '../elements/Ui';
import { Captions, captionsHiddenAt } from './Captions';
import { DURATION, S } from '../generated/timeline-viral';
import {
  Backdrop,
  Clone,
  CtaChip,
  DifferentJob,
  EndCard,
  Flatline,
  Hook,
  Positions,
  Possession,
  Progression,
  SameDrills,
  TwoBodies,
} from './scenes';

/**
 * The short cut.
 *
 * Same argument as the director's cut, 15 seconds shorter, and built around
 * the things that actually decide whether a post gets shown to anyone: the
 * voice starts on frame 1, the captions are twice the size and sit in the
 * middle of the frame, every scene pushes in so no frame is ever static, and
 * the last second hands back to the first so a replay is invisible.
 */
const Cut: React.FC<{
  t: number;
  from: number;
  to: number;
  fade?: number;
  drift?: number;
  children: React.ReactNode;
}> = ({ t, from, to, fade = 0.1, drift = 0.03, children }) => {
  if (t < from - fade || t >= to + fade) return null;
  const inP = prog(t, from - fade * 0.3, from + fade, EASE.out);
  const outP = prog(t, to - fade * 0.6, to + fade * 0.4, EASE.in);
  const life = clamp((t - from) / Math.max(0.001, to - from));
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        // a slow push-in on every scene: nothing in the film ever sits still
        transform: `scale(${1 + drift * life})`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const ViralFilm: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const t = useT();

  // the loop: the last 0.7 s dissolves into the film's own first frame
  const loop = prog(t, 37.34, 37.68, EASE.out);

  return (
    <AbsoluteFill style={{ background: V.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(1250px 760px at 58% 26%, rgba(255,107,51,0.20), rgba(0,0,0,0) 62%),' +
            'radial-gradient(900px 620px at 12% 92%, rgba(70,120,255,0.10), rgba(0,0,0,0) 70%)',
        }}
      />
      <Backdrop t={t} />

      <Cut t={t} from={S('hook').from} to={S('hook').to} fade={0.001} drift={0.022}>
        <Hook t={t} />
      </Cut>
      <Cut t={t} from={S('same').from} to={S('same').to}>
        <Clone t={t} />
      </Cut>
      <Cut t={t} from={S('five').from} to={S('five').to} fade={0.13} drift={0.018}>
        <Positions t={t} />
      </Cut>
      <Cut t={t} from={S('two').from} to={S('two').to} fade={0.09}>
        <TwoBodies t={t} />
      </Cut>
      <Cut t={t} from={S('read').from} to={S('help').to} fade={0.12} drift={0}>
        <Possession t={t} />
      </Cut>
      <Cut t={t} from={S('diff').from} to={S('diff').to} fade={0.04}>
        <DifferentJob t={t} />
      </Cut>
      <Cut t={t} from={S('drills').from} to={S('drills').to} fade={0.04}>
        <SameDrills t={t} />
      </Cut>
      <Cut t={t} from={S('flat').from} to={S('flat').to} fade={0.09}>
        <Flatline t={t} />
      </Cut>
      <Cut t={t} from={S('turn').from} to={S('cardio').to} fade={0.11} drift={0.016}>
        <Progression t={t} />
      </Cut>
      <Cut t={t} from={S('end').from} to={DURATION} fade={0.12} drift={0.02}>
        <EndCard t={t} frame={frame} />
      </Cut>

      <Captions t={t} hidden={captionsHiddenAt(t)} />
      <CtaChip t={t} />

      {/* the loop hand-off — the last frame is the first frame */}
      {loop > 0.001 ? (
        <AbsoluteFill style={{ opacity: loop, background: V.bg }}>
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(1250px 760px at 58% 26%, rgba(255,107,51,0.20), rgba(0,0,0,0) 62%)',
            }}
          />
          <Backdrop t={0} />
          <Hook t={0} frozen />
        </AbsoluteFill>
      ) : null}

      {/* how much film is left — the cheapest retention cue there is */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 6,
          width: `${clamp(t / DURATION) * 100}%`,
          background: V.accent,
          opacity: 0.72,
        }}
      />

      <Vignette strength={0.72} />
      <Grain frame={frame} opacity={0.04} />
      <Flash p={prog(t, S('turn').from, S('turn').from + 0.04) * (1 - prog(t, S('turn').from + 0.04, S('turn').from + 0.2))} />

      <Audio src={staticFile('vo-viral.mp3')} />
      <Audio src={staticFile('sfx-viral.mp3')} volume={0.74} />
    </AbsoluteFill>
  );
};
