import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {speechDuck} from '../data/vo';

export type SfxName =
  | 'impact'
  | 'impact-hard'
  | 'impact-soft'
  | 'subdrop'
  | 'whoosh'
  | 'whoosh-down'
  | 'riser'
  | 'tick'
  | 'stamp'
  | 'swish'
  | 'glitch';

/**
 * Ceilings per effect. The mastered voice sits at roughly -17 dBFS RMS, so a
 * 0.1 ceiling puts the loudest impact about 20 dB below it, and `speechDuck`
 * pulls all of these down another 7.5 dB whenever a word is being spoken.
 * If a hit ever competes with a syllable, lower the number here.
 */
const CEIL: Record<SfxName, number> = {
  impact: 0.1,
  'impact-hard': 0.088,
  'impact-soft': 0.08,
  subdrop: 0.09,
  whoosh: 0.058,
  'whoosh-down': 0.058,
  riser: 0.05,
  tick: 0.034,
  stamp: 0.048,
  swish: 0.068,
  glitch: 0.046,
};

const LEN: Record<SfxName, number> = {
  impact: 24,
  'impact-hard': 18,
  'impact-soft': 15,
  subdrop: 34,
  whoosh: 14,
  'whoosh-down': 16,
  riser: 42,
  tick: 3,
  stamp: 4,
  swish: 11,
  glitch: 6,
};

/**
 * One effect placed at an absolute composition frame. The volume callback gets
 * a sequence-local frame, so `from` is added back to duck against the real
 * voice-over position.
 */
export const Sfx: React.FC<{name: SfxName; at: number; gain?: number}> = ({name, at, gain = 1}) => (
  <Sequence from={at} durationInFrames={LEN[name] + 2} layout="none">
    <Audio
      src={staticFile(`sfx/${name}.wav`)}
      volume={(f) => CEIL[name] * gain * speechDuck(at + f)}
      trimAfter={LEN[name] + 2}
    />
  </Sequence>
);

/** Convenience: a list of cues rendered in one go. */
export const SfxTrack: React.FC<{cues: {name: SfxName; at: number; gain?: number}[]}> = ({cues}) => (
  <>
    {cues.map((c, i) => (
      <Sfx key={`${c.name}-${c.at}-${i}`} {...c} />
    ))}
  </>
);
