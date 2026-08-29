import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CARD_BOTTOM, COLORS, WIDTH} from '../theme';
import {EASE_OUT} from './anim';

/** Thin "how much is left" line. The only piece of persistent UI on the reel. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = frame / (durationInFrames - 1);
  return (
    <div
      style={{
        position: 'absolute',
        top: CARD_BOTTOM + 18,
        left: 70,
        width: WIDTH - 140,
        height: 6,
        borderRadius: 999,
        background: 'rgba(247,244,238,0.16)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.amber})`,
          boxShadow: `0 0 18px ${COLORS.orange}`,
        }}
      />
    </div>
  );
};

/** Two-frame light kick on the loudest cuts - reads as energy, costs no footage. */
export const FlashOn: React.FC<{cuts: number[]}> = ({cuts}) => {
  const frame = useCurrentFrame();
  const nearest = cuts.find((c) => frame >= c && frame < c + 5);
  if (nearest === undefined) return null;
  const o = interpolate(frame - nearest, [0, 1, 5], [0.34, 0.22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(60% 40% at 50% 45%, #fff 0%, rgba(255,255,255,0) 70%)',
        opacity: o,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};
