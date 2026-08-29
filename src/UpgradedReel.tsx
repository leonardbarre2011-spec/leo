import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, useCurrentFrame} from 'remotion';
import './fonts';
import {ASSETS, SOURCE_DURATION_IN_FRAMES} from './theme';
import {ACCENT_CUTS} from './data/script';
import {Backdrop, Grain} from './components/Backdrop';
import {FootageCard} from './components/FootageCard';
import {BrollStage, heroDim} from './components/BrollStage';
import {Captions} from './components/Captions';
import {Headline} from './components/Headline';
import {BottomBar, FlashOn, ProgressBar} from './components/Chrome';
import {Sfx} from './components/Sfx';
import {EndCard} from './components/EndCard';

export type UpgradedProps = {
  /** Subtle synthesised whooshes/impacts on the cuts. */
  sfx: boolean;
  /** Extra closing card after the original reel ends (A/B variant). */
  endCardFrames: number;
};

export const upgradedDefaults: UpgradedProps = {sfx: true, endCardFrames: 0};

export const UpgradedReel: React.FC<UpgradedProps> = ({sfx, endCardFrames}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: '#07090c'}}>
      <Sequence durationInFrames={SOURCE_DURATION_IN_FRAMES} layout="none">
        <Backdrop />
        <FootageCard dim={heroDim(frame)} />
        <BrollStage />
        <Headline />
        <Captions />
        <ProgressBar />
        <BottomBar />
        <FlashOn cuts={ACCENT_CUTS} />
        <Grain />
      </Sequence>

      {endCardFrames > 0 ? (
        <Sequence from={SOURCE_DURATION_IN_FRAMES} durationInFrames={endCardFrames} layout="none">
          <EndCard />
        </Sequence>
      ) : null}

      {/* The original voice-over, bit-for-bit, in its original position. */}
      <Audio src={ASSETS.voice()} />
      <Sfx enabled={sfx} />
    </AbsoluteFill>
  );
};

/** The untouched source, for side-by-side reference. */
export const OriginalReel: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <OffthreadVideo
        src={ASSETS.clip()}
        muted
        style={{width: 1080, height: 1164, objectFit: 'cover'}}
      />
    </AbsoluteFill>
    <Audio src={ASSETS.voice()} />
  </AbsoluteFill>
);
