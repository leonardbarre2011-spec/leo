import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {C} from '../theme';
import {sp, SLAM, clamp01, nrnd} from './anim';

const draw = (frame: number, at: number, dur: number) =>
  interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 2.6),
  });

/** Ellipse drawn on with a marker-like wobble, as a coach would circle a player. */
export const CircleMark: React.FC<{
  at: number;
  out?: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color?: string;
  width?: number;
  dur?: number;
}> = ({at, out, cx, cy, rx, ry, color = C.red, width = 11, dur = 9}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, at, dur);
  const fade = out === undefined ? 1 : 1 - clamp01((frame - out) / 5);
  if (p <= 0 || fade <= 0) return null;
  const per = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry))) * 1.06;
  const jitter = nrnd(Math.floor(frame / 2)) * 2.2;
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{overflow: 'visible'}}>
        <ellipse
          cx={cx + jitter}
          cy={cy - jitter}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={per}
          strokeDashoffset={per * (1 - p)}
          transform={`rotate(-8 ${cx} ${cy})`}
          style={{filter: `drop-shadow(0 6px 18px rgba(0,0,0,0.6))`}}
        />
      </svg>
    </AbsoluteFill>
  );
};

/** Big X stamped over the frame — the "this is wrong" beat. */
export const XStamp: React.FC<{
  at: number;
  out?: number;
  cx?: number;
  cy?: number;
  size?: number;
  color?: string;
}> = ({at, out, cx = 540, cy = 900, size = 340, color = C.red}) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, {damping: 11, stiffness: 400, mass: 0.5});
  const fade = out === undefined ? 1 : 1 - clamp01((frame - out) / 5);
  if (frame < at || fade <= 0) return null;
  const sc = interpolate(s, [0, 1], [2.4, 1]);
  const o = interpolate(s, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'}) * fade;
  const d1 = draw(frame, at + 1, 4);
  const d2 = draw(frame, at + 3, 4);
  const L = size / 2;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{overflow: 'visible'}}>
        <g transform={`translate(${cx} ${cy}) scale(${sc}) rotate(-6)`}>
          {[
            {x1: -L, y1: -L, x2: L, y2: L, p: d1},
            {x1: L, y1: -L, x2: -L, y2: L, p: d2},
          ].map((l, i) => {
            const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
            return (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={color}
                strokeWidth={size * 0.115}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - l.p)}
                style={{filter: 'drop-shadow(0 8px 26px rgba(0,0,0,0.7))'}}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Check mark — the "do this instead" counterpart to XStamp. */
export const CheckMark: React.FC<{
  at: number;
  out?: number;
  cx?: number;
  cy?: number;
  size?: number;
  color?: string;
}> = ({at, out, cx = 540, cy = 900, size = 300, color = C.lime}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, at, 8);
  const s = sp(frame, at, SLAM);
  const fade = out === undefined ? 1 : 1 - clamp01((frame - out) / 5);
  if (p <= 0 || fade <= 0) return null;
  const path = `M ${-size * 0.42} ${0} L ${-size * 0.1} ${size * 0.32} L ${size * 0.46} ${-size * 0.38}`;
  const len = size * 1.35;
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{overflow: 'visible'}}>
        <g transform={`translate(${cx} ${cy}) scale(${interpolate(s, [0, 1], [1.5, 1])})`}>
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.13}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
            style={{filter: 'drop-shadow(0 8px 26px rgba(0,0,0,0.65))'}}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Measurement bracket with a label — used to make "create space" literal. */
export const Bracket: React.FC<{
  at: number;
  out?: number;
  x1: number;
  x2: number;
  y: number;
  label: string;
  color?: string;
}> = ({at, out, x1, x2, y, label, color = C.lime}) => {
  const frame = useCurrentFrame();
  const p = draw(frame, at, 8);
  const fade = out === undefined ? 1 : 1 - clamp01((frame - out) / 5);
  if (p <= 0 || fade <= 0) return null;
  const w = (x2 - x1) * p;
  const mid = x1 + w / 2;
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{overflow: 'visible'}}>
        <g stroke={color} strokeWidth={7} strokeLinecap="round" fill="none">
          <line x1={x1} y1={y} x2={x1 + w} y2={y} />
          <line x1={x1} y1={y - 26} x2={x1} y2={y + 26} />
          <line x1={x1 + w} y1={y - 26} x2={x1 + w} y2={y + 26} />
        </g>
        <text
          x={mid}
          y={y - 46}
          fill={color}
          fontFamily="BarlowCondLocal, sans-serif"
          fontWeight={800}
          fontStyle="italic"
          fontSize={56}
          textAnchor="middle"
          letterSpacing="0.08em"
          opacity={p}
        >
          {label}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
