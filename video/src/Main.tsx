import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, Loop, useCurrentFrame} from 'remotion';
import {C, VO_OFFSET, FPS} from './theme';
import {useFonts} from './fonts';
import {Filters} from './components/Overlays';
import {SfxTrack, SfxName} from './components/Sfx';
import {speechDuck, at, CUE, VO_END} from './data/vo';

import {Hook, HOOK_END} from './scenes/Hook';
import {RandomReps, REPS_START, REPS_END} from './scenes/RandomReps';
import {NeverSame, NEVER_START, NEVER_END} from './scenes/NeverSame';
import {OpenLoop, LOOP_START, LOOP_END} from './scenes/OpenLoop';
import {TheFix, FIX_START, FIX_END} from './scenes/TheFix';
import {TheDrill, DRILL_START, DRILL_END} from './scenes/TheDrill';
import {GameSpeed, GAME_START, GAME_END} from './scenes/GameSpeed';
import {Transformation, TRANS_START, TRANS_END} from './scenes/Transformation';
import {CTA, CTA_START, CTA_END} from './scenes/CTA';

export const DURATION = CTA_END;

/**
 * Sound design cue sheet. Every entry is a deliberate accent on a cut, a
 * stamp, or a reveal — nothing is placed on a rhythm grid, because a grid
 * would drift off the voice-over within a couple of seconds.
 */
const SFX: {name: SfxName; at: number; gain?: number}[] = [
  // hook
  {name: 'impact-hard', at: 0, gain: 1},
  {name: 'stamp', at: 4},
  {name: 'stamp', at: 8},
  {name: 'impact', at: 12, gain: 0.9},
  {name: 'whoosh', at: at(CUE.basketball1) - 2},
  {name: 'impact-hard', at: at(CUE.stop1)},
  {name: 'subdrop', at: at(CUE.stop1), gain: 0.85},
  {name: 'whoosh-down', at: HOOK_END - 5},

  // the 100 reps
  {name: 'tick', at: REPS_START + 6},
  {name: 'tick', at: REPS_START + 12},
  {name: 'tick', at: REPS_START + 18},
  {name: 'tick', at: REPS_START + 24},
  {name: 'tick', at: REPS_START + 30},
  {name: 'impact', at: at(CUE.wont)},
  {name: 'glitch', at: at(CUE.wont) + 1},
  {name: 'impact-soft', at: at(CUE.scorer)},

  // never the same shot twice
  {name: 'whoosh', at: NEVER_START},
  {name: 'whoosh', at: at(CUE.never)},
  {name: 'whoosh', at: at(CUE.shot)},
  {name: 'impact-hard', at: at(CUE.twice)},
  {name: 'subdrop', at: at(CUE.twice), gain: 0.8},

  // open loop
  {name: 'riser', at: LOOP_START - 4},
  {name: 'impact', at: LOOP_END},

  // the fix
  {name: 'stamp', at: at(CUE.pressure)},
  {name: 'stamp', at: at(CUE.movement)},
  {name: 'stamp', at: at(CUE.decisions)},
  {name: 'whoosh-down', at: FIX_END - 5},

  // the drill
  {name: 'whoosh', at: at(CUE.sprint)},
  {name: 'whoosh', at: at(CUE.change)},
  {name: 'impact-soft', at: at(CUE.create), gain: 0.8},
  {name: 'swish', at: at(CUE.shoot) + 9},

  // game speed
  {name: 'riser', at: GAME_START + 4, gain: 0.8},
  {name: 'impact-hard', at: at(CUE.game)},

  // stop / start
  {name: 'impact', at: TRANS_START},
  {name: 'glitch', at: at(CUE.good)},
  {name: 'whoosh', at: at(CUE.start) - 2},
  {name: 'impact-hard', at: at(CUE.start)},
  {name: 'impact', at: at(CUE.impossible), gain: 0.9},
  {name: 'subdrop', at: at(CUE.impossible), gain: 0.75},

  // cta + loop point
  {name: 'whoosh', at: CTA_START - 2},
  {name: 'impact-hard', at: at(CUE.better2)},
  {name: 'swish', at: at(CUE.better2) + 3},
  {name: 'impact', at: CTA_END - 12, gain: 0.9},
];

/** Music sits under everything at a level that is felt, not heard, and steps
 *  down again whenever a word is being spoken. */
const Bed: React.FC = () => (
  <Loop durationInFrames={Math.round(9.6 * FPS)} layout="none">
    <Audio
      src={staticFile('sfx/bed.wav')}
      volume={(f) => 0.05 * speechDuck(f)}
      loopVolumeCurveBehavior="extend"
    />
  </Loop>
);

export const Main: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: C.black}}>
      <Filters />

      <Sequence durationInFrames={HOOK_END} layout="none">
        <Hook />
      </Sequence>
      <Sequence from={REPS_START} durationInFrames={REPS_END - REPS_START}>
        <RandomReps />
      </Sequence>
      <Sequence from={NEVER_START} durationInFrames={NEVER_END - NEVER_START}>
        <NeverSame />
      </Sequence>
      <Sequence from={LOOP_START} durationInFrames={LOOP_END - LOOP_START}>
        <OpenLoop />
      </Sequence>
      <Sequence from={FIX_START} durationInFrames={FIX_END - FIX_START}>
        <TheFix />
      </Sequence>
      <Sequence from={DRILL_START} durationInFrames={DRILL_END - DRILL_START}>
        <TheDrill />
      </Sequence>
      <Sequence from={GAME_START} durationInFrames={GAME_END - GAME_START}>
        <GameSpeed />
      </Sequence>
      <Sequence from={TRANS_START} durationInFrames={TRANS_END - TRANS_START}>
        <Transformation />
      </Sequence>
      <Sequence from={CTA_START} durationInFrames={CTA_END - CTA_START}>
        <CTA />
      </Sequence>

      {/* --- audio: voice on top, always --- */}
      <Sequence from={Math.round(VO_OFFSET * FPS)} layout="none">
        {/* mastered by scripts/master-vo.py: speech sits at about -17 dBFS RMS
            with a -1.5 dBFS ceiling. Every other level is set against this. */}
        <Audio src={staticFile('audio/vo-master.wav')} volume={1.4} />
      </Sequence>
      <Bed />
      <SfxTrack cues={SFX} />
    </AbsoluteFill>
  );
};
