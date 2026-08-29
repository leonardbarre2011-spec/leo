import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CAPTIONS} from '../data/script';
import {COLORS, FONTS, WIDTH, ZONES, textEdge} from '../theme';
import {EASE_OUT, pop} from './anim';

/**
 * Word-by-word ("karaoke") captions. Roughly 8 in 10 short-form views start
 * muted, so the voice-over only converts if it is also readable - and the
 * moving highlight is one of the strongest known retention devices.
 *
 * Word timings come from the whisper transcript, refined by distributing each
 * word over the cumulative speech energy of its VAD segment.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const chunk = CAPTIONS.find((c) => t >= c.s - 0.08 && t < c.e + 0.18);
  if (!chunk) return null;

  const text = chunk.words.map((w) => w.w).join(' ');
  const fontSize = text.length > 19 ? 74 : text.length > 15 ? 84 : 94;

  const startFrame = chunk.s * fps;
  const enter = pop(frame - startFrame, fps, 0, 14);
  const scale = interpolate(enter, [0, 1], [0.86, 1]);
  const opacity = interpolate(frame - startFrame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: ZONES.captionCenter - 90,
        left: 0,
        width: WIDTH,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 70px',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 34px',
          justifyContent: 'center',
          fontFamily: FONTS.display,
          fontSize,
          lineHeight: 1.02,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.s - 0.02 && t < w.e;
          const hit = pop((t - w.s) * fps, fps, 0, 9);
          const wordScale = active ? 1 + 0.06 * (1 - Math.abs(1 - hit)) : 1;
          return (
            <span
              key={`${w.w}-${i}`}
              style={{
                color: active ? COLORS.amber : COLORS.cream,
                textShadow: textEdge(6),
                transform: `scale(${wordScale}) translateY(${active ? -4 : 0}px)`,
                display: 'inline-block',
                transformOrigin: 'center bottom',
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
