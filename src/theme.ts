import {staticFile} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = 1215; // 40.5s

/** Pulled from the Playbook brand page (strategie-basket-premium.html). */
export const C = {
  orange: '#FF5B2E',
  orangeDeep: '#E8461B',
  ember: '#C6392E',
  gold: '#E0A64E',
  goldDeep: '#B77E1F',
  cream: '#FBF7F0',
  sand: '#F4EFE6',
  bone: '#ECE7DF',
  ink: '#0B0A09',
  ink2: '#141210',
  coal: '#1C1917',
  slate: '#6C7079',
  mist: '#9AA2AE',
  white: '#FFFFFF',
  red: '#E5695F',
  court: '#C98A4B',
  courtDark: '#8A5A2B',
} as const;

export const DISPLAY = 'PlaybookDisplay';
export const UI = 'PlaybookUI';

export const fontCss = `
@font-face {
  font-family: '${DISPLAY}';
  src: url('${staticFile('Anton-Regular.ttf')}') format('truetype');
  font-weight: 400;
  font-display: block;
}
@font-face {
  font-family: '${UI}';
  src: url('${staticFile('Inter-Var.ttf')}') format('truetype');
  font-weight: 100 900;
  font-display: block;
}
`;

export const display = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: `'${DISPLAY}', Impact, sans-serif`,
  fontSize: size,
  lineHeight: 0.9,
  letterSpacing: -size * 0.015,
  textTransform: 'uppercase',
  margin: 0,
  ...extra,
});

export const ui = (size: number, weight = 700, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: `'${UI}', system-ui, sans-serif`,
  fontSize: size,
  fontWeight: weight,
  margin: 0,
  ...extra,
});
