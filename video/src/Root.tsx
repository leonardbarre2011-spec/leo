import React from 'react';
import {Composition} from 'remotion';
import {Main, DURATION} from './Main';
import {FrameCheck, Shot} from './FrameCheck';
import {Tiles} from './Tiles';
import {FPS, W, H} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Composition
      id="FrameCheck"
      component={FrameCheck}
      durationInFrames={1}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{shots: [] as Shot[]}}
    />
    <Composition
      id="Tiles"
      component={Tiles}
      durationInFrames={1}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{frames: [0, 8, 30, 60, 90, 120] as number[]}}
    />
  </>
);
