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
