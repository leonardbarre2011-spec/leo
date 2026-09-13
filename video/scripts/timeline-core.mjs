import { SEGMENTS, COLD_OPEN, TAIL } from './vo-data.mjs';

/**
 * Collapses the source voice-over into its trimmed timeline.
 * Pure function of vo-data.mjs, so the audio renderer, the SFX cue sheet and
 * the React scenes all read exactly the same numbers.
 */
export function buildTimeline() {
  let cursor = COLD_OPEN;
  const phrases = SEGMENTS.map((seg) => {
    const offset = cursor - seg.start;
    const words = seg.words.map(([w, t]) => ({ w, t: +(t + offset).toFixed(4) }));
    const real = words.filter((x) => x.w !== '·');
    const phrase = {
      id: seg.id,
      start: +cursor.toFixed(4),
      end: +(cursor + (seg.end - seg.start)).toFixed(4),
      // when the last audible word finishes ringing
      out: +(words[words.length - 1].t).toFixed(4),
      words: real,
      caption: seg.caption.map(([text, i]) => ({
        text,
        t: real[Math.min(i, real.length - 1)].t,
      })),
      accent: seg.accent ?? [],
    };
    cursor = cursor + (seg.end - seg.start) + seg.gapAfter;
    return phrase;
  });

  const byId = Object.fromEntries(phrases.map((p) => [p.id, p]));
  const voDuration = +(cursor - SEGMENTS[SEGMENTS.length - 1].gapAfter).toFixed(4);
  const duration = +(voDuration + TAIL).toFixed(4);

  return { coldOpen: COLD_OPEN, phrases, byId, voDuration, duration };
}

/** word start time, by phrase id + word index */
export function w(tl, id, i) {
  const p = tl.byId[id];
  return p.words[Math.min(i, p.words.length - 1)].t;
}
