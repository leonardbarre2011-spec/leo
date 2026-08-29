import React from 'react';
import {COLORS, FONTS} from '../theme';

/** Frosted graphite panel - the shared container for every b-roll module. */
export const Panel: React.FC<{
  style?: React.CSSProperties;
  children: React.ReactNode;
  accent?: string;
}> = ({style, children, accent = COLORS.orange}) => (
  <div
    style={{
      position: 'absolute',
      background: 'linear-gradient(165deg, rgba(18,21,28,0.93) 0%, rgba(9,11,15,0.95) 100%)',
      border: '2px solid rgba(247,244,238,0.13)',
      borderRadius: 26,
      boxShadow: `0 26px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(247,244,238,0.08), 0 0 0 1px ${accent}22`,
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, color = COLORS.creamDim, size = 22, style}) => (
  <div
    style={{
      fontFamily: FONTS.ui,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 2.6,
      color,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Display: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, color = COLORS.cream, size = 56, style}) => (
  <div
    style={{
      fontFamily: FONTS.display,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: 0.5,
      color,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Redacted content bar - stands in for text without inventing any. */
export const Bar: React.FC<{w: number; h?: number; c?: string; r?: number}> = ({
  w,
  h = 12,
  c = 'rgba(247,244,238,0.22)',
  r = 999,
}) => <div style={{width: w, height: h, borderRadius: r, background: c}} />;

export const Avatar: React.FC<{size: number; ring?: string}> = ({size, ring}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(150deg, #2a3040, #12151d)',
      border: ring ? `3px solid ${ring}` : '2px solid rgba(247,244,238,0.16)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24">
      <circle cx="12" cy="8.6" r="4.1" fill="rgba(247,244,238,0.5)" />
      <path d="M3.6 24c0-5 3.8-8.2 8.4-8.2s8.4 3.2 8.4 8.2z" fill="rgba(247,244,238,0.5)" />
    </svg>
  </div>
);

export const Cross: React.FC<{size?: number; color?: string; stroke?: number}> = ({
  size = 40,
  color = COLORS.red,
  stroke = 4,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 5l14 14M19 5L5 19" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Check: React.FC<{size?: number; color?: string; progress?: number}> = ({
  size = 40,
  color = COLORS.green,
  progress = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4.5 12.6l4.7 4.7L19.5 7"
      stroke={color}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={26}
      strokeDashoffset={26 * (1 - progress)}
    />
  </svg>
);

export const LinkIcon: React.FC<{size?: number; color?: string}> = ({size = 30, color = COLORS.amber}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M10 13.5a4 4 0 005.7.3l2.6-2.6a4 4 0 10-5.7-5.7l-1.3 1.3M14 10.5a4 4 0 00-5.7-.3l-2.6 2.6a4 4 0 105.7 5.7l1.3-1.3"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </svg>
);

export const PlayGlyph: React.FC<{size?: number; color?: string}> = ({
  size = 34,
  color = 'rgba(247,244,238,0.55)',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M8 5.5v13l11-6.5z" fill={color} />
  </svg>
);

export const Chevron: React.FC<{size?: number; color?: string; rotate?: number}> = ({
  size = 46,
  color = COLORS.amber,
  rotate = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{transform: `rotate(${rotate}deg)`}}>
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Half-court plan view used by the "training alone" and "drills" modules. */
export const CourtPlan: React.FC<{w: number; h: number; stroke?: string}> = ({
  w,
  h,
  stroke = 'rgba(247,244,238,0.28)',
}) => (
  <svg width={w} height={h} viewBox="0 0 300 220" fill="none" style={{position: 'absolute', inset: 0}}>
    <rect x="4" y="4" width="292" height="212" rx="8" stroke={stroke} strokeWidth="2.5" />
    <path d="M150 4v212" stroke={stroke} strokeWidth="1.4" strokeDasharray="7 9" />
    <rect x="4" y="70" width="70" height="80" stroke={stroke} strokeWidth="2" />
    <circle cx="74" cy="110" r="26" stroke={stroke} strokeWidth="2" />
    <path d="M4 26a108 108 0 010 168" stroke={stroke} strokeWidth="2" />
    <circle cx="150" cy="110" r="34" stroke={stroke} strokeWidth="2" />
  </svg>
);
