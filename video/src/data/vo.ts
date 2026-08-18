import wordsJson from './words.json';
import {FPS, VO_OFFSET} from '../theme';

export type Word = {w: string; s: number; e: number};
export const WORDS = wordsJson as Word[];

/** Word index -> composition frame of its onset. */
export const at = (i: number) => Math.round((WORDS[i].s + VO_OFFSET) * FPS);
/** Word index -> composition frame where the next word begins. */
export const end = (i: number) => Math.round((WORDS[i].e + VO_OFFSET) * FPS);

export const VO_START = Math.round(VO_OFFSET * FPS);
export const VO_END = Math.round((WORDS[WORDS.length - 1].e + VO_OFFSET) * FPS);

/**
 * 1 while nobody is speaking, 0.42 in the middle of a word.
 * Every sound effect is multiplied by this so a transition hit can never sit
 * on top of a spoken syllable — the voice is the product, the effects are trim.
 */
export const speechDuck = (frame: number) => {
  const t = frame / FPS - VO_OFFSET;
  for (const w of WORDS) {
    const spoken = Math.min(w.e, w.s + 0.42);
    if (t >= w.s - 0.06 && t <= spoken + 0.1) return 0.42;
  }
  return 1;
};

/** Named cues, by word index, so scenes read like an edit decision list. */
export const CUE = {
  ifYoure: 0,
  serious: 2,
  basketball1: 4,
  youNeed: 5,
  stop1: 8,
  training1: 9,
  likeThis: 10,
  this: 11,

  doing: 12,
  hundred: 14,
  random: 15,
  shots: 16,
  wont: 17,
  better1: 21,
  scorer: 22,
  because: 23,

  inGames: 24,
  games: 25,
  never: 27,
  same: 30,
  shot: 31,
  twice: 32,

  train: 33,
  pressure: 35,
  movement: 36,
  decisions: 38,

  sprint: 39,
  change: 40,
  direction: 41,
  create: 42,
  space: 43,
  then: 44,
  shoot: 45,

  make: 46,
  every: 47,
  rep: 48,
  feel: 49,
  game: 52,

  stop2: 53,
  training2: 54,
  look: 56,
  good: 57,

  start: 58,
  become: 61,
  impossible: 62,
  guard: 64,

  follow: 65,
  actually: 68,
  want: 69,
  getBetter: 71,
  better2: 72,
  basketball2: 74,
} as const;
