import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CAPTIONS} from '../data/script';
import {COLORS, FONTS, WIDTH, ZONES, textEdge} from '../theme';
import {EASE_OUT, pop} from './anim';

/**
 * Karaoke captions, one or two words at a time. With the chrome stripped out
 * these are the loudest thing on screen: the active word sits in a filled
 * block, and the words that carry the pitch stay coloured even before they are
 * spoken. Most short-form views start muted, so this is where the offer lands.
 */

/** Words worth colouring on sight - they carry the offer, not the grammar. */
const POWER = new Set([
  'alone',
  'tiktok',
  'workout',
  '12-week',
  'position',
  'specialized',
  'drills',
  'advice',
  'loved',
  'beta',
  'testers',
  'officially',
  'releasing',
  'bio',
  'link',
  'best',
  'solution',
  'program',
  'basketball',
  'ballers',
]);

const bare = (w: string) => w.replace(/[^a-z0-9-]/gi, '').toLowerCase();

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const chunk = CAPTIONS.find((c) => t >= c.s - 0.06 && t < c.e + 0.14);
  if (!chunk) return null;

  const words = chunk.words;
  const joined = words.map((w) => w.w).join(' ');
  // Long pairs stack into a two-line block - it reads bigger on a phone.
  const stacked = words.length > 1 && joined.length > 11;
  const longest = stacked
    ? Math.max(...words.map((w) => w.w.length))
    : joined.length;
  const fontSize = longest > 13 ? 96 : longest > 10 ? 112 : 128;

  const startFrame = chunk.s * fps;
  // Deterministic per-card tilt - the slightly-off look of a hand-timed edit.
  const tiltCard = ((Math.round(startFrame) % 5) - 2) * 0.6;
  const enter = pop(frame - startFrame, fps, 0, 11);
  const scale = interpolate(enter, [0, 1], [0.78, 1]);
  const lift = interpolate(enter, [0, 1], [26, 0]);
  const opacity = interpolate(frame - startFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: ZONES.captionCenter - 170,
        left: 0,
        width: WIDTH,
        height: 340,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 46px',
        transform: `scale(${scale}) translateY(${lift}px) rotate(${tiltCard}deg)`,
        opacity,
      }}
    >
      {/* Soft scrim: the captions now sit over the play, and gym floors are bright. */}
      <div
        style={{
          position: 'absolute',
          inset: '-40px 0',
          background:
            'radial-gradient(58% 52% at 50% 50%, rgba(7,9,12,0.62) 0%, rgba(7,9,12,0.34) 55%, rgba(7,9,12,0) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          gap: stacked ? 8 : 26,
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.display,
          fontSize,
          lineHeight: 0.96,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          const active = t >= w.s - 0.02 && t < w.e;
          const hit = pop((t - w.s) * fps, fps, 0, 8);
          const power = POWER.has(bare(w.w));
          const wordScale = active ? 1 + 0.09 * (1 - Math.abs(1 - hit)) : 1;
          const tilt = active ? -1.6 : 0;

          if (active) {
            return (
              <span
                key={`${w.w}-${i}`}
                style={{
                  display: 'inline-block',
                  padding: '4px 20px 12px',
                  borderRadius: 16,
                  background: `linear-gradient(100deg, ${COLORS.orange}, ${COLORS.amber})`,
                  color: COLORS.ink,
                  transform: `scale(${wordScale}) rotate(${tilt}deg)`,
                  transformOrigin: 'center',
                  boxShadow: '0 18px 44px rgba(0,0,0,0.55)',
                }}
              >
                {w.w}
              </span>
            );
          }

          return (
            <span
              key={`${w.w}-${i}`}
              style={{
                display: 'inline-block',
                padding: '4px 0 12px',
                color: power ? COLORS.amber : COLORS.cream,
                textShadow: textEdge(7),
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
