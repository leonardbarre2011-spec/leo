import React from 'react';
import { C, F, SAFE } from '../theme';
import { CAPTIONS } from '../generated/timeline';
import { clamp, EASE, prog, ramp } from '../lib/anim';

/**
 * Captions are cut from the same forced-alignment data as the audio, so each
 * word arrives on the syllable that says it. One line at a time, held until
 * the next one is due — no stacked blocks, no karaoke confetti.
 */

type Line = (typeof CAPTIONS)[number] & { until: number };

const LINES: Line[] = CAPTIONS.map((c, i) => {
  const next = CAPTIONS[i + 1];
  // hold until the next line, but never past a long silence after the phrase
  const until = Math.min(next ? next.t : c.out + 1.4, c.out + 0.62);
  return { ...c, until: Math.max(until, c.t + 0.45) };
});

const IN = 0.22;
const OUT = 0.16;

export const Captions: React.FC<{ t: number; hidden?: boolean }> = ({ t, hidden }) => {
  if (hidden) return null;
  const line = LINES.find((l) => t >= l.t - IN * 0.4 && t < l.until + OUT);
  if (!line) return null;

  const words = line.text.split(' ');
  const span = Math.max(0.16, Math.min(0.42, (line.until - line.t) * 0.55));
  const appear = prog(t, line.t - 0.04, line.t + IN, EASE.out);
  const leave = prog(t, line.until, line.until + OUT, EASE.in);

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '0 18px',
        opacity: 1 - leave,
        transform: `translateY(${(1 - appear) * 16 + leave * -10}px)`,
      }}
    >
      {words.map((w, i) => {
        const key = w.replace(/[^A-Za-z']/g, '').toLowerCase();
        const hot = line.accent.includes(key);
        const wt = line.t + (i / Math.max(1, words.length)) * span;
        const p = prog(t, wt - 0.02, wt + 0.17, EASE.out);
        return (
          <span
            key={i}
            style={{
              fontFamily: F.display,
              fontWeight: hot ? 800 : 700,
              fontSize: 86,
              lineHeight: 1.0,
              letterSpacing: '0.004em',
              color: hot ? C.accent : C.text,
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              display: 'inline-block',
              textShadow: '0 8px 34px rgba(0,0,0,0.65)',
            }}
          >
            {w}
          </span>
        );
      })}
      {/* the accent rule under the line — draws with the words, not after */}
      <div
        style={{
          width: '100%',
          height: 3,
          marginTop: 18,
          background: C.accent,
          opacity: 0.5,
          transform: `scaleX(${ramp(t, line.t, line.t + span + 0.2, 0, 1)})`,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
};

/** Times where the frame is intentionally wordless. */
export const captionsHiddenAt = (t: number) => t < 1.0 || (t > 51.2 && t < 52.0);

export const captionOpacity = (t: number) => clamp(1);
