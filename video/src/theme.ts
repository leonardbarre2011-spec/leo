/**
 * The film borrows its palette and type from the program's own interface, so
 * that when the product finally appears it reads as the thing we have been
 * looking at for fifty seconds — not as an ad pasted onto the end.
 */
export const C = {
  bg: '#0B0E14',
  surface: '#141A24',
  surface2: '#1B2230',
  line: 'rgba(236,231,223,0.10)',
  lineStrong: 'rgba(236,231,223,0.20)',
  text: '#ECE7DF',
  muted: '#9AA2AE',
  faint: '#6C7079',
  accent: '#FF5B2E',
  accentSoft: 'rgba(255,91,46,0.14)',
  bronze: '#D3A24C',
  good: '#57C08A',
  crit: '#E5695F',
  leather: '#C4551F',
  leatherDark: '#5C220B',
};

export const F = {
  display: '"Barlow Condensed", "Arial Narrow", Impact, sans-serif',
  ui: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

export const W = 1080;
export const H = 1920;

/** vertical safe area — TikTok chrome eats roughly this much */
export const SAFE = { top: 190, bottom: 430, side: 72 };

/**
 * The short cut runs hotter. Same family, pushed for a phone screen held at
 * arm's length in a bright room: a lifted floor so the blacks don't crush on
 * compression, a brighter cream, and an accent saturated enough to survive
 * whatever the app does to the file on upload.
 */
export const V = {
  ...C,
  bg: '#090C13',
  surface: '#161D29',
  surface2: '#1F2735',
  text: '#FFF6EC',
  muted: '#AEB6C2',
  line: 'rgba(255,246,236,0.13)',
  lineStrong: 'rgba(255,246,236,0.26)',
  accent: '#FF6B33',
  accentHot: '#FF9350',
  good: '#4ADE80',
  bronze: '#E4B45C',
  crit: '#FF5F52',
};

/** Captions sit centre-frame in the short cut, not down in the app's chrome. */
export const VSAFE = { top: 150, bottom: 380, side: 58 };
