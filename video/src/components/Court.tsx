import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, F} from '../theme';
import {sp, SNAP, clamp01} from './anim';

/**
 * Top-down half court in real NBA proportions (50ft x 47ft), drawn in court
 * units: x 0..500, y 0..470, baseline at y=0, hoop at (250, 52.5).
 * Everything else in this file works in those units so drill geometry stays
 * honest instead of being eyeballed in pixels.
 */
export const HOOP = {x: 250, y: 52.5};

export const courtToScreen = (x: number, y: number, k = 1.9, ox = 65, oy = 470) => ({
  x: ox + x * k,
  y: oy + y * k,
});

const reveal = (frame: number, at: number, dur: number) =>
  interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

export const CourtMarkings: React.FC<{at?: number; color?: string; opacity?: number}> = ({
  at = 0,
  color = 'rgba(255,255,255,0.30)',
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, at, 12);
  const lw = 3.2;
  return (
    <g opacity={p * opacity} stroke={color} strokeWidth={lw} fill="none" strokeLinecap="round">
      {/* boundary */}
      <rect x={0} y={0} width={500} height={470} />
      {/* paint */}
      <rect x={170} y={0} width={160} height={190} />
      {/* free-throw circle */}
      <circle cx={250} cy={190} r={60} />
      {/* backboard + rim */}
      <line x1={220} y1={40} x2={280} y2={40} strokeWidth={lw * 1.8} />
      <circle cx={HOOP.x} cy={HOOP.y} r={9} strokeWidth={lw * 1.6} />
      {/* three-point line: corners then arc */}
      <line x1={30} y1={0} x2={30} y2={142} />
      <line x1={470} y1={0} x2={470} y2={142} />
      <path d="M 30 142 A 237.5 237.5 0 0 0 470 142" />
      {/* restricted area */}
      <path d="M 210 52.5 A 40 40 0 0 0 290 52.5" opacity={0.7} />
    </g>
  );
};

export const OffenseDot: React.FC<{
  x: number;
  y: number;
  at: number;
  label?: string;
  color?: string;
  r?: number;
  pulse?: boolean;
}> = ({x, y, at, label, color = C.lime, r = 16, pulse = false}) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, SNAP);
  if (frame < at) return null;
  const beat = pulse ? 1 + Math.sin(frame * 0.34) * 0.09 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${interpolate(s, [0, 1], [0, 1]) * beat})`}>
      {pulse ? <circle r={r * 2.1} fill={color} opacity={0.14} /> : null}
      <circle r={r} fill={color} stroke={C.black} strokeWidth={3} />
      {label ? (
        <text
          y={r * 0.42}
          fill={C.black}
          fontFamily={F.ui}
          fontWeight={900}
          fontSize={r * 1.1}
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** Defenders are crosses, the way they are drawn on an actual whiteboard. */
export const DefenseX: React.FC<{x: number; y: number; at: number; color?: string; r?: number}> = ({
  x,
  y,
  at,
  color = C.red,
  r = 16,
}) => {
  const frame = useCurrentFrame();
  const s = sp(frame, at, SNAP);
  if (frame < at) return null;
  const k = interpolate(s, [0, 1], [0, 1]);
  return (
    <g
      transform={`translate(${x} ${y}) scale(${k}) rotate(12)`}
      stroke={color}
      strokeWidth={7}
      strokeLinecap="round"
    >
      <line x1={-r} y1={-r} x2={r} y2={r} />
      <line x1={r} y1={-r} x2={-r} y2={r} />
    </g>
  );
};

/** Movement path. Dashed = cut without the ball, solid = drive; both draw on. */
export const Route: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  arrow?: boolean;
  length: number;
}> = ({d, at, dur = 10, color = C.lime, width = 8, dashed = false, arrow = true, length}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, at, dur);
  if (p <= 0) return null;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? `${width * 2.4} ${width * 2}` : length}
        strokeDashoffset={dashed ? 0 : length * (1 - p)}
        opacity={dashed ? p : 1}
        markerEnd={arrow && p > 0.985 ? 'url(#route-arrow)' : undefined}
        style={{filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.55))'}}
      />
    </g>
  );
};

/** A shot: arcing line to the rim plus a ball that travels along it. */
export const ShotArc: React.FC<{
  fromX: number;
  fromY: number;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  opacity?: number;
  ball?: boolean;
}> = ({fromX, fromY, at, dur = 8, color = C.orange, width = 6, opacity = 1, ball = false}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, at, dur);
  if (p <= 0) return null;
  const mx = (fromX + HOOP.x) / 2;
  const my = (fromY + HOOP.y) / 2;
  const dx = HOOP.x - fromX;
  const dy = HOOP.y - fromY;
  const len = Math.hypot(dx, dy);
  // bow the line perpendicular to the shot so overlapping shots stay readable
  const bow = 0.16;
  const cx = mx + (-dy / len) * len * bow;
  const cy = my + (dx / len) * len * bow;
  const d = `M ${fromX} ${fromY} Q ${cx} ${cy} ${HOOP.x} ${HOOP.y}`;
  const approx = len * 1.08;
  const bt = p * p;
  const bx = (1 - bt) * (1 - bt) * fromX + 2 * (1 - bt) * bt * cx + bt * bt * HOOP.x;
  const by = (1 - bt) * (1 - bt) * fromY + 2 * (1 - bt) * bt * cy + bt * bt * HOOP.y;
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={approx}
        strokeDashoffset={approx * (1 - p)}
      />
      {ball ? <circle cx={bx} cy={by} r={13} fill={C.orange} stroke={C.black} strokeWidth={3} /> : null}
    </g>
  );
};

/** Ripple at the rim when a shot lands. */
export const Swish: React.FC<{at: number; color?: string}> = ({at, color = C.lime}) => {
  const frame = useCurrentFrame();
  const k = clamp01((frame - at) / 11);
  if (frame < at || k >= 1) return null;
  return (
    <circle
      cx={HOOP.x}
      cy={HOOP.y}
      r={12 + k * 66}
      fill="none"
      stroke={color}
      strokeWidth={9 * (1 - k)}
      opacity={1 - k}
    />
  );
};

export const CourtDefs: React.FC = () => (
  <defs>
    <marker id="route-arrow" markerWidth={5} markerHeight={5} refX={2.6} refY={2.5} orient="auto">
      <path d="M0,0 L5,2.5 L0,5 z" fill={C.lime} />
    </marker>
  </defs>
);

/** Wrapper that sets up the court coordinate space inside the 1080x1920 canvas. */
export const CourtStage: React.FC<{
  children: React.ReactNode;
  k?: number;
  ox?: number;
  oy?: number;
}> = ({children, k = 1.9, ox = 65, oy = 470}) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1080 1920"
    style={{position: 'absolute', inset: 0, overflow: 'visible'}}
  >
    <CourtDefs />
    <g transform={`translate(${ox} ${oy}) scale(${k})`}>{children}</g>
  </svg>
);
