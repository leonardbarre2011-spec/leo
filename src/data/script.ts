import captionData from './captions.json';
import {sec} from '../theme';

export type CaptionWord = {w: string; s: number; e: number};
export type CaptionChunk = {s: number; e: number; words: CaptionWord[]};

export const CAPTIONS = captionData.chunks as CaptionChunk[];

/**
 * Scene cuts of the source reel, detected with ffmpeg (`select='gt(scene,0.25)'`).
 * Used to time punch-ins and flash transitions so the added motion lands on the
 * existing edit instead of fighting it.
 */
export const CUTS_IN_SECONDS = [
  2.533, 5.567, 8.567, 13.367, 15.967, 18.1, 20.467, 21.067, 21.567, 22.933,
  23.5, 23.9, 25.067, 25.8,
];

export const CUTS = CUTS_IN_SECONDS.map(sec);

/** Cuts that additionally get a light flash + whoosh (the loudest visual beats). */
export const ACCENT_CUTS = [2.533, 8.567, 13.367, 18.1, 20.467, 23.9].map(sec);

export type BrollKind =
  | 'profile'
  | 'alone'
  | 'tiktok'
  | 'funnel'
  | 'program'
  | 'drills'
  | 'proof'
  | 'you'
  | 'bio';

export type Beat = {
  kind: BrollKind;
  /** seconds */
  from: number;
  to: number;
  /** Hero beats dim the footage slightly and sit closer to centre. */
  hero?: boolean;
  /**
   * Every module is drawn at half its natural footprint (0.7 linear = ~50% of
   * the area) and pinned to the bottom edge of the footage card, so the b-roll
   * lives over the floor and the basketball action stays visible.
   */
  originX: number;
};

/**
 * The b-roll track. Every window is aligned to what the voice-over is saying at
 * that exact moment (timings come from whisper + a silero-VAD pass on the
 * original audio), so the graphics illustrate the claim being made.
 */
export const BEATS: Beat[] = [
  {kind: 'profile', from: 0.15, to: 2.55, originX: 96}, // "since I started this account"
  {kind: 'alone', from: 2.75, to: 4.95, originX: 984}, // "young ballers... train alone"
  {kind: 'tiktok', from: 4.95, to: 7.45, originX: 984}, // "...with some TikTok workout"
  {kind: 'funnel', from: 7.7, to: 10.6, originX: 540}, // "but only for the best"
  {kind: 'program', from: 11.05, to: 14.05, hero: true, originX: 540}, // the offer
  {kind: 'drills', from: 14.15, to: 17.85, originX: 540}, // "specialized drills and advice"
  {kind: 'proof', from: 17.9, to: 21.95, originX: 540}, // "beta testers loved it"
  {kind: 'you', from: 22.0, to: 23.25, originX: 540}, // "so if you want one"
  {kind: 'bio', from: 23.3, to: 25.9, hero: true, originX: 540}, // "link in my bio"
];

export type Headline = {from: number; to: number; lines: string[]};

/**
 * One hook, and nothing else. The spoken opener is a slow build, so the reel
 * states who it is for before the first word lands - then gets out of the way
 * and lets the captions carry the rest.
 */
export const HEADLINES: Headline[] = [
  {from: 0.0, to: 2.55, lines: ['IF YOU TRAIN ALONE,', 'WATCH THIS.']},
];

export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];
