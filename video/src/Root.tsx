import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import { DURATION_IN_FRAMES, FPS } from './generated/timeline';
import { H, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SamePlayer"
    component={Film}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
