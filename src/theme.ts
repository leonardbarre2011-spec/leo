import {staticFile} from 'remotion';

/**
 * One place for every design decision, so the whole reel reads as one system.
 * Layout is expressed in absolute pixels on the 1080x1920 canvas.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** The source reel: 25.9s @30fps. Not a single frame is trimmed. */
export const SOURCE_DURATION_IN_FRAMES = 777;

export const COLORS = {
  ink: '#07090c',
  inkSoft: '#11141b',
  panel: 'rgba(11,13,18,0.82)',
  panelSolid: '#0d1017',
  line: 'rgba(247,244,238,0.14)',
  cream: '#f7f4ee',
  creamDim: 'rgba(247,244,238,0.62)',
  orange: '#ff5a1f',
  amber: '#ffb020',
  green: '#16e08a',
  red: '#ff3b30',
  blue: '#3d8bff',
} as const;

export const FONTS = {
  display: '"AntonReel", "Anton", Impact, "Haettenschweiler", sans-serif',
  ui: '"InterReel", "Inter", system-ui, -apple-system, sans-serif',
} as const;

/**
 * Vertical zoning of the frame. The middle band is reserved for the untouched
 * source footage; everything else is additive real estate that the original
 * export wasted on black bars.
 */
export const ZONES = {
  /** Platform chrome lives here - keep it clear. */
  safeTop: 148,
  headlineTop: 152,
  headlineHeight: 152,
  cardTop: 320,
  /** Native size of the cropped source (1080x1164) - rendered 1:1. */
  cardHeight: 1164,
  captionCenter: 1655,
  ctaTop: 1790,
  safeBottom: 1846,
} as const;

export const CARD_BOTTOM = ZONES.cardTop + ZONES.cardHeight; // 1484

export const ASSETS = {
  clip: () => staticFile('clip.mp4'),
  bg: () => staticFile('bg-blur.mp4'),
  voice: () => staticFile('audio.mp3'),
  still: (n: number) => staticFile(`stills/g${n}.jpg`),
  sfx: (name: 'whoosh' | 'impact' | 'tick' | 'riser') => staticFile(`sfx/${name}.wav`),
  font: (file: string) => staticFile(`fonts/${file}`),
};

/** Text stroke that keeps captions readable over any frame of footage. */
export const textEdge = (px: number, color = '#000') =>
  [
    `${px}px ${px}px 0 ${color}`,
    `-${px}px ${px}px 0 ${color}`,
    `${px}px -${px}px 0 ${color}`,
    `-${px}px -${px}px 0 ${color}`,
    `0 ${px}px 0 ${color}`,
    `0 -${px}px 0 ${color}`,
    `${px}px 0 0 ${color}`,
    `-${px}px 0 0 ${color}`,
    `0 ${Math.round(px * 2.2)}px ${Math.round(px * 3)}px rgba(0,0,0,0.55)`,
  ].join(', ');

export const sec = (s: number) => Math.round(s * FPS);
