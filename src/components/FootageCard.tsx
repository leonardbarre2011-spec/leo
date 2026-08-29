import React from 'react';
import {AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate} from 'remotion';
import {ASSETS, COLORS, WIDTH, ZONES} from '../theme';
import {CUTS} from '../data/script';
import {EASE_OUT, wobble} from './anim';

/**
 * The original highlights, untouched: same clips, same order, same frame
 * timing, rendered 1:1 at their native 1080x1164 resolution. The only thing
 * that changes is where they sit in the frame and a gentle punch-in that lands
 * on the cuts the editor already made.
 */
export const FootageCard: React.FC<{dim: number}> = ({dim}) => {
  const frame = useCurrentFrame();

  // Distance since the most recent cut -> a 12-frame push-in on every new clip.
  const lastCut = CUTS.reduce((acc, c) => (c <= frame ? c : acc), 0);
  const sinceCut = frame - lastCut;
  const punch = interpolate(sinceCut, [0, 14], [1.055, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  // Very slow breathing so static clips never feel frozen.
  const breathe = 1 + wobble(frame, 300, 0.012);
  const sway = wobble(frame, 340, 5, 0.8);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: ZONES.cardTop,
          left: 0,
          width: WIDTH,
          height: ZONES.cardHeight,
          overflow: 'hidden',
          borderRadius: 30,
          boxShadow:
            '0 40px 90px rgba(0,0,0,0.62), 0 0 0 2px rgba(247,244,238,0.10), inset 0 0 120px rgba(0,0,0,0.35)',
          backgroundColor: '#000',
        }}
      >
        <OffthreadVideo
          src={ASSETS.clip()}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${punch * breathe}) translateX(${sway}px)`,
          }}
        />
        {/* Scrim so captions and b-roll panels keep contrast over bright gyms */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(7,9,12,0.42) 0%, rgba(7,9,12,0) 26%, rgba(7,9,12,0) 52%, rgba(7,9,12,0.72) 100%)',
          }}
        />
        <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity: dim}} />
      </div>
    </AbsoluteFill>
  );
};
