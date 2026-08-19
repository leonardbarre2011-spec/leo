import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, uiStyle } from "../theme";
import { HEIGHT, WIDTH } from "./timing";

/* ------------------------------------------------------------------ *
 *  TACTICS BOARD
 *  A top-down half court drawn entirely in Remotion. The hoop is at
 *  the top, the ball-handler comes from the bottom — the way a player
 *  actually sees the read.
 * ------------------------------------------------------------------ */

export const HOOP = { x: 540, y: 318 };
/** Where the two players stand at the top of the key. */
/** Both boards open from the same stance, off to one side, so the
 *  move across has real distance to cover. */
export const START = { you: { x: 404, y: 1214 }, def: { x: 436, y: 872 } };

const LINE = "rgba(255,255,255,0.40)";
const LINE_SOFT = "rgba(255,255,255,0.26)";

export const CourtFloor: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (p <= 0.002) return null;
  return (
    <AbsoluteFill style={{ background: "#0A0C11" }}>
      {/* faint hardwood grain so it does not read as a slide */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 2px, rgba(255,255,255,0) 2px 46px)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(86% 58% at 50% 36%, rgba(216,255,62,0.10) 0%, rgba(0,0,0,0) 72%)",
        }}
      />
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <g
          opacity={p}
          stroke={LINE}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        >
          {/* baseline + sidelines */}
          <line x1={0} y1={196} x2={WIDTH} y2={196} />
          {/* the paint */}
          <rect x={378} y={196} width={324} height={624} />
          {/* free-throw circle: solid toward the hoop, dashed behind */}
          <path d="M 390 820 A 150 150 0 0 1 690 820" />
          <path
            d="M 690 820 A 150 150 0 0 1 390 820"
            strokeDasharray="20 18"
            stroke={LINE_SOFT}
          />
          {/* three-point line */}
          <line x1={72} y1={196} x2={72} y2={624} stroke={LINE_SOFT} />
          <line x1={1008} y1={196} x2={1008} y2={624} stroke={LINE_SOFT} />
          <path d="M 72 624 Q 540 1300 1008 624" stroke={LINE_SOFT} />
          {/* backboard + rim */}
          <line x1={414} y1={252} x2={666} y2={252} strokeWidth={9} stroke="rgba(255,255,255,0.72)" />
          <circle cx={HOOP.x} cy={HOOP.y} r={54} strokeWidth={8} stroke="rgba(255,255,255,0.82)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  MARKERS
 * ------------------------------------------------------------------ */
export const Marker: React.FC<{
  x: number;
  y: number;
  kind: "you" | "def";
  label?: string;
  at: number;
  /** 0 = balanced, ±1 = weight thrown to that side */
  lean?: number;
  opacity?: number;
  ball?: boolean;
}> = ({ x, y, kind, label, at, lean = 0, opacity = 1, ball = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (p <= 0.002) return null;
  const isYou = kind === "you";
  const col = isYou ? C.volt : C.red;
  const r = 68;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g opacity={p * opacity} transform={`translate(${x} ${y})`}>
        {/* weight shift, drawn as the shadow the marker sits off */}
        {Math.abs(lean) > 0.01 && (
          <ellipse
            cx={lean * 34}
            cy={16}
            rx={r * 0.95}
            ry={r * 0.46}
            fill={col}
            opacity={0.22}
          />
        )}
        {isYou && (
          <circle r={r * 1.5} fill={col} opacity={0.13} transform={`translate(${lean * 18} 0)`} />
        )}
        <circle
          r={r}
          fill={isYou ? col : "transparent"}
          fillOpacity={isYou ? 0.92 : 0}
          stroke={col}
          strokeWidth={isYou ? 0 : 10}
          transform={`translate(${lean * 18} 0)`}
        />
        {!isYou && (
          <circle r={r - 26} fill={col} fillOpacity={0.2} transform={`translate(${lean * 18} 0)`} />
        )}
        {ball && (
          <circle
            cx={lean * 18 + 64}
            cy={42}
            r={23}
            fill="#E8873B"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth={3}
          />
        )}
        {label && (
          <text
            x={0}
            y={r + 54}
            textAnchor="middle"
            fill={col}
            style={{ ...uiStyle(32, 900) } as React.CSSProperties}
          >
            {label}
          </text>
        )}
      </g>
    </svg>
  );
};

/* A path that draws itself, used for every movement on the board. */
export const Path: React.FC<{
  d: string;
  at: number;
  len: number;
  draw?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  head?: { x: number; y: number; rot: number };
  opacity?: number;
}> = ({
  d,
  at,
  len,
  draw = 20,
  color = C.volt,
  width = 8,
  dashed = false,
  head,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = interpolate(t, [0, draw], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  if (t < 0 || p <= 0.002) return null;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g opacity={opacity}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? `18 16` : `${len * p} ${len}`}
          strokeDashoffset={dashed ? -len * (1 - p) : 0}
          opacity={dashed ? p : 1}
        />
        {head && p > 0.97 && (
          <g transform={`translate(${head.x} ${head.y}) rotate(${head.rot})`}>
            <path d="M 0 0 l -40 -24 l 11 24 l -11 24 z" fill={color} />
          </g>
        )}
      </g>
    </svg>
  );
};

/** The lane that opens once the defender has committed. */
export const OpenLane: React.FC<{
  at: number;
  d: string;
  opacity?: number;
}> = ({ at, d, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (p <= 0.002) return null;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <path d={d} fill={C.volt} opacity={p * 0.2 * opacity} />
      <path
        d={d}
        fill="none"
        stroke={C.volt}
        strokeWidth={4}
        opacity={p * 0.6 * opacity}
        strokeDasharray="16 14"
      />
    </svg>
  );
};

/** A single red block: the read that fails. */
export const Blocked: React.FC<{ at: number; x: number; y: number }> = ({
  at,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (p <= 0.002) return null;
  const r = 50;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g
        opacity={p}
        transform={`translate(${x} ${y}) scale(${interpolate(p, [0, 1], [1.3, 1])})`}
        stroke={C.red}
        strokeWidth={13}
        strokeLinecap="round"
      >
        <line x1={-r * 0.52} y1={-r * 0.52} x2={r * 0.52} y2={r * 0.52} />
        <line x1={-r * 0.52} y1={r * 0.52} x2={r * 0.52} y2={-r * 0.52} />
        <circle r={r} fill="none" strokeWidth={7} opacity={0.6} />
      </g>
    </svg>
  );
};
