import React from 'react';
import {Composition} from 'remotion';
import {Viral} from './Viral';
import {DURATION, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Viral" component={Viral} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
