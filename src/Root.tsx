import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, SOURCE_DURATION_IN_FRAMES, WIDTH} from './theme';
import {OriginalReel, UpgradedReel, upgradedDefaults} from './UpgradedReel';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Ships at exactly the original length: every clip, every frame, same audio. */}
    <Composition
      id="Upgraded"
      component={UpgradedReel}
      durationInFrames={SOURCE_DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={upgradedDefaults}
    />

    {/* A/B variant: adds a 2s closing card after the reel. */}
    <Composition
      id="UpgradedWithEndCard"
      component={UpgradedReel}
      durationInFrames={SOURCE_DURATION_IN_FRAMES + 60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{...upgradedDefaults, endCardFrames: 60}}
    />

    {/* The source reel as delivered, for before/after comparison. */}
    <Composition
      id="Original"
      component={OriginalReel}
      durationInFrames={SOURCE_DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
