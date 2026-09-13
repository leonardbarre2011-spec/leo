import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import { ViralFilm } from './viral/Film';
import { DURATION_IN_FRAMES, FPS } from './generated/timeline';
import { DURATION_IN_FRAMES as VIRAL_FRAMES } from './generated/timeline-viral';
import { H, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* the short cut — 37.75s, built for the feed */}
    <Composition
      id="SamePlayerShort"
      component={ViralFilm}
      durationInFrames={VIRAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
    {/* the original 52.85s cut */}
    <Composition
      id="SamePlayer"
      component={Film}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
