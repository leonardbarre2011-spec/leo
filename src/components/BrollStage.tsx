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

const Window: React.FC<{dur: number; children: (p: ModuleProps) => React.ReactNode}> = ({dur, children}) => {
  const local = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{opacity: windowOpacity(local, dur, 6, 8)}}>
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
          <Window dur={dur}>{(p) => <Mod {...p} />}</Window>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

/** How much the footage should be dimmed at `frame` so hero panels stay legible. */
export const heroDim = (frame: number) => {
  let dim = 0;
  for (const b of BEATS) {
    if (!b.hero) continue;
    const from = sec(b.from);
    const to = sec(b.to);
    if (frame < from - 8 || frame > to + 8) continue;
    const inA = Math.min(1, Math.max(0, (frame - from + 8) / 14));
    const outA = Math.min(1, Math.max(0, (to + 8 - frame) / 14));
    dim = Math.max(dim, 0.42 * Math.min(inA, outA));
  }
  return dim;
};
