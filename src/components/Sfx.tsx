import React from 'react';
import {Audio, Sequence} from 'remotion';
import {ASSETS, sec} from '../theme';
import {ACCENT_CUTS} from '../data/script';

/**
 * Synthesised transition sweeteners (generated offline into public/sfx, no
 * third-party audio). Kept deliberately quiet - the voice-over is the product.
 */
export const Sfx: React.FC<{enabled: boolean}> = ({enabled}) => {
  if (!enabled) return null;
  return (
    <>
      {ACCENT_CUTS.map((f) => (
        <Sequence key={`w-${f}`} from={Math.max(0, f - 3)} durationInFrames={14} layout="none">
          <Audio src={ASSETS.sfx('whoosh')} volume={0.16} />
        </Sequence>
      ))}
      {/* riser into the product reveal */}
      <Sequence from={sec(10.0)} durationInFrames={34} layout="none">
        <Audio src={ASSETS.sfx('riser')} volume={0.13} />
      </Sequence>
      <Sequence from={sec(11.05)} durationInFrames={12} layout="none">
        <Audio src={ASSETS.sfx('impact')} volume={0.2} />
      </Sequence>
      {/* release stamp */}
      <Sequence from={sec(20.33)} durationInFrames={12} layout="none">
        <Audio src={ASSETS.sfx('impact')} volume={0.2} />
      </Sequence>
      {/* tap on the bio link */}
      <Sequence from={sec(24.17)} durationInFrames={6} layout="none">
        <Audio src={ASSETS.sfx('tick')} volume={0.22} />
      </Sequence>
    </>
  );
};
