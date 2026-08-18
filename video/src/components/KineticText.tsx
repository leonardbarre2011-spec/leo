import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {C, F} from '../theme';
import {sp, SLAM, SNAP, clamp01, nrnd} from './anim';

type Align = 'left' | 'center' | 'right';

export type SlamProps = {
  children: React.ReactNode;
  /** frame (relative to the enclosing Sequence) the word lands on */
  at: number;
  /** frame the word leaves; omit to keep it on screen */
  out?: number;
  size: number;
  color?: string;
  font?: string;
  /** italic skew in degrees, the classic sports-graphic lean */
  skew?: number;
  rotate?: number;
  tracking?: number;
  lineHeight?: number;
  outline?: string;
  shadow?: boolean;
  align?: Align;
  /** how the word arrives */
  from?: 'scale' | 'up' | 'side' | 'squash' | 'stamp';
  opacityFloor?: number;
  style?: React.CSSProperties;
};

/**
 * One headline word/phrase. Everything about it is tuned for a phone held at
 * arm's length: very large, very heavy, high contrast, and it *lands* rather
 * than fades — a fade is invisible on a feed scrolling at speed.
 */
export const Slam: React.FC<SlamProps> = ({
  children,
  at,
  out,
  size,
  color = C.white,
  font = F.display,
  skew = 0,
  rotate = 0,
  tracking = -0.02,
  lineHeight = 0.86,
  outline,
  shadow = true,
  align = 'center',
  from = 'scale',
  opacityFloor = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, from === 'stamp' ? SNAP : SLAM);

  const leaving = out === undefined ? 0 : clamp01((frame - out) / 4);
  if (frame < at - 1) return null;
  if (out !== undefined && frame > out + 5) return null;

  let tx = 0;
  let ty = 0;
  let scale = 1;
  let scaleY = 1;
  let blur = 0;

  if (from === 'scale') {
    scale = interpolate(s, [0, 1], [2.15, 1]);
    blur = interpolate(s, [0, 0.55], [26, 0], {extrapolateRight: 'clamp'});
  } else if (from === 'up') {
    ty = interpolate(s, [0, 1], [size * 0.85, 0]);
    scale = interpolate(s, [0, 1], [0.86, 1]);
    blur = interpolate(s, [0, 0.5], [14, 0], {extrapolateRight: 'clamp'});
  } else if (from === 'side') {
    tx = interpolate(s, [0, 1], [-size * 1.6, 0]);
    blur = interpolate(s, [0, 0.45], [30, 0], {extrapolateRight: 'clamp'});
  } else if (from === 'squash') {
    scale = interpolate(s, [0, 1], [1.55, 1]);
    scaleY = interpolate(s, [0, 0.4, 1], [0.35, 1.14, 1]);
    blur = interpolate(s, [0, 0.5], [18, 0], {extrapolateRight: 'clamp'});
  } else if (from === 'stamp') {
    scale = interpolate(s, [0, 1], [1.42, 1]);
    blur = interpolate(s, [0, 0.3], [10, 0], {extrapolateRight: 'clamp'});
  }

  const opacity = Math.max(
    opacityFloor,
    interpolate(s, [0, 0.28], [0, 1], {extrapolateRight: 'clamp'}) * (1 - leaving)
  );
  const exitScale = 1 - leaving * 0.14;
  const exitBlur = leaving * 16;

  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        lineHeight,
        color,
        letterSpacing: `${tracking}em`,
        textAlign: align,
        textTransform: 'uppercase',
        transform: `translate3d(${tx}px, ${ty + leaving * -size * 0.12}px, 0) scale(${
          scale * exitScale
        }, ${scaleY * scale * exitScale}) rotate(${rotate}deg) skewX(${-skew}deg)`,
        filter: `blur(${blur + exitBlur}px)`,
        opacity,
        WebkitTextStroke: outline ? `4px ${outline}` : undefined,
        textShadow: shadow ? '0 14px 46px rgba(0,0,0,0.72), 0 3px 0 rgba(0,0,0,0.35)' : undefined,
        willChange: 'transform, filter, opacity',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Text that jitters a couple of pixels per frame. Used sparingly — on the two or
 * three moments that need to feel physically loud.
 */
export const Rattle: React.FC<{children: React.ReactNode; amount?: number; seed?: number}> = ({
  children,
  amount = 4,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        transform: `translate3d(${nrnd(frame * 2.3 + seed) * amount}px, ${
          nrnd(frame * 3.1 + seed + 50) * amount
        }px, 0)`,
      }}
    >
      {children}
    </div>
  );
};

/** Small all-caps label with a coloured bar — reads as "broadcast", not "template". */
export const Chip: React.FC<{
  at: number;
  out?: number;
  label: string;
  color?: string;
  fg?: string;
  size?: number;
}> = ({at, out, label, color = C.lime, fg = C.black, size = 42}) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, SNAP);
  const leaving = out === undefined ? 0 : clamp01((frame - out) / 4);
  if (frame < at - 1) return null;
  if (out !== undefined && frame > out + 5) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        background: color,
        color: fg,
        fontFamily: F.kicker,
        fontWeight: 800,
        fontStyle: 'italic',
        fontSize: size,
        letterSpacing: '0.1em',
        padding: `${size * 0.14}px ${size * 0.42}px ${size * 0.1}px`,
        transform: `scaleX(${interpolate(s, [0, 1], [0.1, 1])}) scaleY(${interpolate(
          s,
          [0, 1],
          [0.6, 1]
        )}) skewX(-9deg)`,
        opacity: (1 - leaving) * interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
        transformOrigin: 'left center',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};

/** Full-screen text layer positioned by flexbox — keeps scene files readable. */
export const TextLayer: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties['justifyContent'];
  aligni?: React.CSSProperties['alignItems'];
  padding?: number | string;
  style?: React.CSSProperties;
}> = ({children, justify = 'center', aligni = 'center', padding = 70, style}) => (
  <AbsoluteFill
    style={{
      justifyContent: justify,
      alignItems: aligni,
      flexDirection: 'column',
      padding,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
