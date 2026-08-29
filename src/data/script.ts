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
  /** Hero beats dim the footage and take the centre of the frame. */
  hero?: boolean;
};

/**
 * The b-roll track. Every window is aligned to what the voice-over is saying at
 * that exact moment (timings come from whisper + a silero-VAD pass on the
 * original audio), so the graphics illustrate the claim being made.
 */
export const BEATS: Beat[] = [
  {kind: 'profile', from: 0.15, to: 2.55}, // "since I started this account"
  {kind: 'alone', from: 2.75, to: 4.95}, // "help the young ballers... train alone"
  {kind: 'tiktok', from: 4.95, to: 7.45}, // "...with some TikTok workout"
  {kind: 'funnel', from: 7.7, to: 10.6}, // "a solution, but only for the best"
  {kind: 'program', from: 11.05, to: 14.05, hero: true}, // "12-week program, your position"
  {kind: 'drills', from: 14.15, to: 17.85}, // "specialized drills and advice"
  {kind: 'proof', from: 17.9, to: 21.95}, // "beta testers loved it / releasing"
  {kind: 'you', from: 22.0, to: 23.25}, // "so if you want one"
  {kind: 'bio', from: 23.3, to: 25.9, hero: true}, // "check the link in my bio"
];

export type Headline = {from: number; to: number; kicker?: string; lines: string[]};

/**
 * Top-zone headline track. It reinforces the voice-over for the ~80% of the
 * audience watching on mute, and turns the soft spoken opener into a
 * scroll-stopping on-screen hook.
 */
export const HEADLINES: Headline[] = [
  {from: 0.0, to: 2.62, kicker: 'FOR SOLO HOOPERS', lines: ['IF YOU TRAIN ALONE,', 'WATCH THIS.']},
  {from: 2.62, to: 7.5, kicker: 'THE PROBLEM', lines: ['RANDOM TIKTOK DRILLS', "AREN'T A PLAN"]},
  {from: 7.5, to: 11.0, kicker: 'THE FIX', lines: ['SO I BUILT', 'THE REAL THING']},
  {from: 11.0, to: 14.05, kicker: 'WHAT IT IS', lines: ['12 WEEKS.', 'YOUR POSITION.']},
  {from: 14.05, to: 17.9, kicker: "WHAT'S INSIDE", lines: ['SPECIALIZED DRILLS', '+ COACHING ADVICE']},
  {from: 17.9, to: 22.0, kicker: 'STATUS', lines: ['BETA-TESTED.', 'NOW OFFICIAL.']},
  {from: 22.0, to: 25.9, kicker: 'YOUR MOVE', lines: ['GRAB YOURS', 'LINK IN BIO']},
];

export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];
