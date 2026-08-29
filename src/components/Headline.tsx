import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {HEADLINES} from '../data/script';
import {COLORS, FONTS, WIDTH, ZONES, textEdge} from '../theme';
import {EASE_OUT} from './anim';

/**
 * The opening hook - the only piece of copy that is not the voice-over itself.
 * It must be readable on frame 1, which is why nothing animates for longer than
 * nine frames.
 */
export const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const item = HEADLINES.find((h) => t >= h.from && t < h.to);
  if (!item) return null;

  const local = frame - item.from * fps;
  const opacity = Math.min(
    interpolate(local, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [item.to * fps - 7, item.to * fps], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: ZONES.headlineTop,
        left: 0,
        width: WIDTH,
        height: ZONES.headlineHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        opacity,
      }}
    >
      {item.lines.map((line, i) => {
        const reveal = interpolate(local, [i * 3, 9 + i * 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
        return (
          <div
            key={line}
            style={{
              fontFamily: FONTS.display,
              fontSize: 62,
              lineHeight: 1.0,
              letterSpacing: 0.4,
              color: i === 1 ? COLORS.amber : COLORS.cream,
              textShadow: textEdge(5),
              transform: `translateY(${(1 - reveal) * 22}px)`,
              opacity: reveal,
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
