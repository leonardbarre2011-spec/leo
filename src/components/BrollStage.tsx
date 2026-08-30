import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {BEATS, type BrollKind} from '../data/script';
import {sec} from '../theme';
import {windowOpacity} from './anim';
import {AloneBroll, FunnelBroll, ProfileBroll, TikTokBroll} from '../broll/modulesA';
import {BioBroll, DrillsBroll, ProgramBroll, ProofBroll, YouBroll} from '../broll/modulesB';
import type {ModuleProps} from '../broll/types';

const MODULES: Record<BrollKind, React.FC<ModuleProps>> = {
  profile: ProfileBroll,
  alone: AloneBroll,
  tiktok: TikTokBroll,
  funnel: FunnelBroll,
  program: ProgramBroll,
  drills: DrillsBroll,
  proof: ProofBroll,
  you: YouBroll,
  bio: BioBroll,
};

/** Half-area footprint, dropped into the band below the footage card. */
export const BROLL_SCALE = 0.7;
/** The line every module is scaled about - the natural bottom edge of a panel. */
const BROLL_ANCHOR = 1464;
/** Default drop, which lands a panel's bottom just above the platform UI. */
const BROLL_DY = 386;

const Window: React.FC<{
  dur: number;
  originX: number;
  dy: number;
  children: (p: ModuleProps) => React.ReactNode;
}> = ({dur, originX, dy, children}) => {
  const local = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        opacity: windowOpacity(local, dur, 6, 8),
        transform: `translateY(${dy}px) scale(${BROLL_SCALE})`,
        transformOrigin: `${originX}px ${BROLL_ANCHOR}px`,
      }}
    >
      {children({local, dur, fps})}
    </AbsoluteFill>
  );
};

/**
 * The b-roll track. Each window is pinned to the sentence it illustrates, so
 * the viewer always sees the claim they are hearing. Nothing here replaces the
 * source footage - it is composited over the dead space the original export
 * left empty, and only the two hero beats briefly take the centre of the frame.
 */
export const BrollStage: React.FC = () => (
  <AbsoluteFill>
    {BEATS.map((b) => {
      const from = sec(b.from);
      const dur = sec(b.to) - from;
      const Mod = MODULES[b.kind];
      return (
        <Sequence key={`${b.kind}-${from}`} from={from} durationInFrames={dur} layout="none">
          <Window dur={dur} originX={b.originX} dy={b.dy ?? BROLL_DY}>
            {(p) => <Mod {...p} />}
          </Window>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

/** A light dim on the hero beats - the panels sit below the action now, so this
 * is about drawing the eye, not about legibility. */
export const heroDim = (frame: number) => {
  let dim = 0;
  for (const b of BEATS) {
    if (!b.hero) continue;
    const from = sec(b.from);
    const to = sec(b.to);
    if (frame < from - 8 || frame > to + 8) continue;
    const inA = Math.min(1, Math.max(0, (frame - from + 8) / 14));
    const outA = Math.min(1, Math.max(0, (to + 8 - frame) / 14));
    dim = Math.max(dim, 0.12 * Math.min(inA, outA));
  }
  return dim;
};
