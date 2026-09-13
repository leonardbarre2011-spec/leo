import React from 'react';
import { F, V, VSAFE } from '../theme';
import { CAPTIONS } from '../generated/timeline-viral';
import { clamp, EASE, mix, prog } from '../lib/anim';

/**
 * Captions for the short cut.
 *
 * v1 set these small and low, in the strip the app covers with its own UI.
 * Here they are twice the size, centred in the frame, and the accented word
 * is knocked out of a solid block — on a phone that block is the thing the
 * eye lands on, and it keeps reading with the sound off, which is how most
 * of the audience will watch.
 */

type Line = (typeof CAPTIONS)[number] & { until: number };

const LINES: Line[] = CAPTIONS.map((c, i) => {
  const next = CAPTIONS[i + 1];
  const until = Math.min(next ? next.t : c.out + 1.1, c.out + 0.55);
  return { ...c, until: Math.max(until, c.t + 0.38) };
});

const IN = 0.17;
const OUT = 0.12;

export const Captions: React.FC<{ t: number; hidden?: boolean }> = ({ t, hidden }) => {
  if (hidden) return null;
  const line = LINES.find((l) => t >= l.t - IN * 0.4 && t < l.until + OUT);
  if (!line) return null;

  const words = line.text.split(' ');
  const firstHot = words.findIndex((w) =>
    line.accent.includes(w.replace(/[^A-Za-z']/g, '').toLowerCase())
  );
  const span = Math.max(0.12, Math.min(0.32, (line.until - line.t) * 0.5));
  const leave = prog(t, line.until, line.until + OUT, EASE.in);
  // the whole line breathes forward while it is up — nothing is ever static
  const drift = prog(t, line.t, line.until + OUT, EASE.out);

  return (
    <div
      style={{
        position: 'absolute',
        left: VSAFE.side,
        right: VSAFE.side,
        bottom: VSAFE.bottom,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px 16px',
        opacity: 1 - leave,
        transform: `scale(${mix(1, 1.03, drift)}) translateY(${leave * -14}px)`,
      }}
    >
      {words.map((w, i) => {
        const key = w.replace(/[^A-Za-z']/g, '').toLowerCase();
        const isAccent = line.accent.includes(key);
        // only one knocked-out block per line — two in a row reads as a glitch,
        // and the block stops being the thing the eye lands on
        const hot = isAccent && i === firstHot;
        const wt = line.t + (i / Math.max(1, words.length)) * span;
        const p = prog(t, wt - 0.02, wt + 0.13, EASE.snap);
        return (
          <span
            key={i}
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 118,
              lineHeight: 1.0,
              letterSpacing: '0.004em',
              color: hot ? V.bg : isAccent ? V.accent : V.text,
              background: hot ? V.accent : 'transparent',
              padding: hot ? '2px 18px 8px' : '2px 0 8px',
              borderRadius: hot ? 14 : 0,
              opacity: clamp(p * 1.6),
              transform: `scale(${mix(0.72, 1, p)}) translateY(${(1 - p) * 18}px)`,
              display: 'inline-block',
              textShadow: hot ? 'none' : '0 10px 40px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** The frame is wordless only where the picture is doing the talking. */
export const captionsHiddenAt = (t: number) => t > 36.2;
