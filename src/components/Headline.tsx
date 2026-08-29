import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {BEATS, HEADLINES} from '../data/script';
import {COLORS, FONTS, WIDTH, ZONES, textEdge} from '../theme';
import {EASE_OUT, pop} from './anim';

/**
 * Top-zone headline track. The spoken opener ("since I started this
 * account...") is a soft hook; a hard, readable hook on frame 1 is what stops
 * the scroll, and each later card re-states the offer in mute-readable form.
 */
export const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const item = HEADLINES.find((h) => t >= h.from && t < h.to);
  if (!item) return null;

  // Hero b-roll panels carry their own headline - never say the same words twice.
  const hero = BEATS.some((b) => b.hero && t >= b.from - 0.2 && t < b.to + 0.2);
  if (hero) return null;

  const local = frame - item.from * fps;
  const opacity = Math.min(
    interpolate(local, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [item.to * fps - 5, item.to * fps], [1, 0], {
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
        justifyContent: 'flex-start',
        gap: 10,
        opacity,
      }}
    >
      {item.kicker ? (
        <div
          style={{
            transform: `scale(${interpolate(pop(local, fps, 0, 13), [0, 1], [0.7, 1])})`,
            fontFamily: FONTS.ui,
            fontWeight: 800,
            fontSize: 23,
            letterSpacing: 3.4,
            color: COLORS.ink,
            background: COLORS.amber,
            padding: '7px 18px 6px',
            borderRadius: 999,
            boxShadow: '0 8px 22px rgba(255,176,32,0.35)',
          }}
        >
          {item.kicker}
        </div>
      ) : null}

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
              fontSize: 54,
              lineHeight: 1.02,
              letterSpacing: 0.6,
              color: COLORS.cream,
              textShadow: textEdge(4),
              transform: `translateY(${(1 - reveal) * 26}px)`,
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
