/**
 * Visual system for the video.
 * Palette is deliberately narrow: near-black grounds, one hot accent, one cold accent.
 * Everything else is white. That is what makes broadcast sports graphics read on a phone.
 */
export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** The voice-over is nudged later so frame 0 can land a purely visual punch. */
export const VO_OFFSET = 0.2;

export const C = {
  black: '#050506',
  ink: '#0B0B0F',
  paper: '#F4F3EF',
  white: '#FFFFFF',
  /** hot accent — mistakes, tension, the "wrong" side */
  red: '#FF2318',
  redDeep: '#B00C05',
  /** cold accent — the fix, the "right" side */
  lime: '#C6FF2E',
  /** court / leather */
  orange: '#FF7A18',
  smoke: 'rgba(255,255,255,0.62)',
} as const;

export const F = {
  display: '"AntonLocal", "Arial Black", sans-serif',
  slab: '"ArchivoBlackLocal", "Arial Black", sans-serif',
  kicker: '"BarlowCondLocal", "Arial Narrow", sans-serif',
  ui: '"InterLocal", system-ui, sans-serif',
} as const;

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);
/** voice-over seconds -> composition frames */
export const vo = (sec: number) => Math.round((sec + VO_OFFSET) * FPS);
