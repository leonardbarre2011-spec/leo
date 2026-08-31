import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import wordsData from '../data/words.json';
import {C, display} from '../theme';
import {clamp, envSmooth} from '../util';

type Word = {w: string; s: number; e: number};
export const WORDS = wordsData as Word[];

/** Group words into 2–3 word chunks that break on natural pauses. */
const buildChunks = () => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (let i = 0; i < WORDS.length; i++) {
    const w = WORDS[i];
    const prev = cur[cur.length - 1];
    const gap = prev ? w.s - prev.e : 0;
    const span = prev ? w.e - cur[0].s : 0;
    const chars = cur.reduce((n, c) => n + c.w.length, 0) + w.w.length;
    if (cur.length && (cur.length >= 3 || gap > 11 || span > 46 || chars > 17)) {
      chunks.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

export const CHUNKS = buildChunks();

/** Emphasis words get the orange slab instead of plain white. */
const HOT = new Set([
  'SAVE',
  'TIME',
  'STRUGGLING',
  'BASKETBALL',
  'MISSING',
  'COOKED',
  'DEFENSE',
  'BAD',
  'DECIDED',
  'BEST',
  'EXERCISES',
  'BETTER',
  'MONTHS',
  'LEVEL',
  'SKYROCKETED',
  'WORKED',
  'TESTERS',
  'STUNNED',
  'EVERYONE',
  'LINK',
  'BIO',
  'HERE',
]);

const STROKE =
  '0 6px 0 rgba(0,0,0,0.55), 0 0 34px rgba(0,0,0,0.75), 0 0 90px rgba(0,0,0,0.55)';

/** On a cream shot the white fill disappears — flip to ink on a light halo. */
const LIGHT_STROKE = '0 5px 0 rgba(11,10,9,0.16), 0 0 30px rgba(251,247,240,0.95)';

export const Captions: React.FC<{y?: number; tone?: 'onDark' | 'onLight'}> = ({y = 1402, tone = 'onDark'}) => {
  const frame = useCurrentFrame();
  const chunk = CHUNKS.find((c) => frame >= c[0].s - 3 && frame <= c[c.length - 1].e + 6);
  if (!chunk) return null;

  const onLight = tone === 'onLight';
  const start = chunk[0].s - 3;
  const inT = clamp((frame - start) / 4, 0, 1);
  const e = envSmooth(frame);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '14px 30px',
        padding: '0 70px',
        transform: `scale(${0.94 + inT * 0.06 + e * 0.014})`,
        transformOrigin: '50% 50%',
      }}
    >
      {chunk.map((w, i) => {
        const active = frame >= w.s && frame <= w.e + 3;
        const t = frame - w.s;
        const pop = active ? interpolate(clamp(t, 0, 7), [0, 3, 7], [1.16, 1.06, 1.02]) : 1;
        const hot = HOT.has(w.w.replace(/[^A-Z']/g, ''));
        const seen = frame >= w.s;
        return (
          <span
            key={i}
            style={{
              ...display(86),
              color: active && hot ? C.ink : onLight ? C.ink : C.white,
              background: active && hot ? C.orange : 'transparent',
              padding: active && hot ? '2px 20px 12px' : '2px 0 12px',
              borderRadius: 14,
              transform: `scale(${pop}) rotate(${active ? (i % 2 ? 1.1 : -1.1) : 0}deg)`,
              display: 'inline-block',
              whiteSpace: 'nowrap',
              textShadow: active && hot ? 'none' : onLight ? LIGHT_STROKE : STROKE,
              opacity: seen ? 1 : 0.34,
              WebkitTextStroke: active && !hot && !onLight ? `2px rgba(0,0,0,0.25)` : undefined,
              filter: active ? 'none' : 'saturate(0.7)',
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
