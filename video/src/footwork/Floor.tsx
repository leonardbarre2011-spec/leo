import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, uiStyle } from "../theme";
import { HEIGHT, WIDTH } from "./timing";

/* ------------------------------------------------------------------ *
 *  FLOOR BOARD
 *  Where CROSSOVER used a half court seen from above, this film works
 *  at floor level — a few feet of hardwood, close enough that a single
 *  plant reads. Everything here is drawn, nothing is footage.
 * ------------------------------------------------------------------ */

const Svg: React.FC<{ children: React.ReactNode; opacity?: number }> = ({
  children,
  opacity = 1,
}) => (
  <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
  >
    {children}
  </svg>
);

const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const Floor: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = ease(frame - at, 0, 24);
  if (p <= 0.002) return null;
  return (
    <AbsoluteFill style={{ background: "#0A0C11" }}>
      {/* hardwood, running the way the boards actually run */}
      <AbsoluteFill
        style={{
          opacity: p,
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 2px, rgba(255,255,255,0) 2px 92px)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: p,
          background:
            "radial-gradient(70% 44% at 50% 54%, rgba(216,255,62,0.09) 0%, rgba(0,0,0,0) 72%)",
        }}
      />
      <Svg opacity={p}>
        {/* one court line for orientation, nothing more */}
        <line
          x1={0}
          y1={848}
          x2={WIDTH}
          y2={848}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={5}
        />
      </Svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  FOOTPRINT — the unit of this whole film.
 * ------------------------------------------------------------------ */
const SHOE =
  "M 0 -62 C 26 -62 36 -40 36 -14 C 36 16 30 46 20 60 C 12 71 -12 71 -20 60 C -30 46 -36 16 -36 -14 C -36 -40 -26 -62 0 -62 Z";

export const Footprint: React.FC<{
  x: number;
  y: number;
  rot?: number;
  at: number;
  filled?: boolean;
  color?: string;
  scale?: number;
  label?: string;
  opacity?: number;
  /** a ghost of where the foot used to be */
  ghost?: boolean;
}> = ({
  x,
  y,
  rot = 0,
  at,
  filled = false,
  color = C.volt,
  scale = 1,
  label,
  opacity = 1,
  ghost = false,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame - at, 0, 12);
  if (p <= 0.002) return null;
  return (
    <Svg opacity={p * opacity}>
      <g
        transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale * interpolate(p, [0, 1], [0.82, 1])})`}
      >
        <path
          d={SHOE}
          fill={filled ? color : "transparent"}
          fillOpacity={filled ? 0.9 : 0}
          stroke={color}
          strokeWidth={ghost ? 4 : 6}
          strokeDasharray={ghost ? "14 12" : undefined}
          opacity={ghost ? 0.5 : 1}
        />
      </g>
      {label && (
        <text
          x={x}
          y={y + 132 * scale}
          textAnchor="middle"
          fill={color}
          style={{ ...uiStyle(30, 900) } as React.CSSProperties}
        >
          {label}
        </text>
      )}
    </Svg>
  );
};

/** The stamp: rings coming off a foot that just went into the floor. */
export const Plant: React.FC<{ x: number; y: number; at: number }> = ({
  x,
  y,
  at,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const rings = [0, 10, 20];
  return (
    <Svg>
      {rings.map((d, i) => {
        const k = interpolate(t - d, [0, 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (k <= 0 || k >= 1) return null;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={80 + k * 170}
            ry={(80 + k * 170) * 0.42}
            fill="none"
            stroke={C.volt}
            strokeWidth={5}
            opacity={(1 - k) * 0.75}
          />
        );
      })}
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  DEFENDER — a marker with a weight bar, because the whole point of
 *  the freeze is what his weight does while nothing else happens.
 * ------------------------------------------------------------------ */
export const Defender: React.FC<{
  x: number;
  y: number;
  at: number;
  /** −1 all weight left, 0 balanced, 1 all weight right */
  weight?: number;
  label?: string;
  showBar?: boolean;
  barAt?: number;
}> = ({ x, y, at, weight = 0, label = "DEFENDER", showBar = false, barAt = 0 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame - at, 0, 14);
  if (p <= 0.002) return null;
  const barP = ease(frame - barAt, 0, 10);
  const bw = 392;
  return (
    <Svg opacity={p}>
      <g transform={`translate(${x} ${y})`}>
        {Math.abs(weight) > 0.01 && (
          <ellipse
            cx={weight * 46}
            cy={26}
            rx={84}
            ry={36}
            fill={C.red}
            opacity={0.22}
          />
        )}
        <circle
          cx={weight * 26}
          r={78}
          fill={C.red}
          fillOpacity={0.16}
          stroke={C.red}
          strokeWidth={9}
        />
        <text
          y={138}
          textAnchor="middle"
          fill={C.red}
          style={{ ...uiStyle(32, 900) } as React.CSSProperties}
        >
          {label}
        </text>
      </g>
      {showBar && barP > 0.01 && (
        <g transform={`translate(${x - bw / 2} ${y - 156})`} opacity={barP}>
          <rect
            width={bw}
            height={16}
            fill="rgba(255,255,255,0.16)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={2}
          />
          <rect
            x={weight < 0 ? bw / 2 + (weight * bw) / 2 : bw / 2}
            width={(Math.abs(weight) * bw) / 2}
            height={16}
            fill={C.red}
          />
          <line x1={bw / 2} y1={-10} x2={bw / 2} y2={26} stroke="rgba(255,255,255,0.55)" strokeWidth={3} />
          <text
            x={bw / 2}
            y={-26}
            textAnchor="middle"
            fill={C.red}
            style={{ ...uiStyle(26, 900) } as React.CSSProperties}
          >
            WEIGHT
          </text>
        </g>
      )}
    </Svg>
  );
};

/** Push-off: the line of force that actually creates the separation. */
export const PushArrow: React.FC<{
  at: number;
  d: string;
  len: number;
  draw?: number;
  color?: string;
  head?: { x: number; y: number; rot: number };
  width?: number;
}> = ({ at, d, len, draw = 20, color = C.volt, head, width = 12 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = interpolate(t, [0, draw], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  if (t < 0 || p <= 0.002) return null;
  return (
    <Svg>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${len * p} ${len}`}
      />
      {head && p > 0.96 && (
        <g transform={`translate(${head.x} ${head.y}) rotate(${head.rot})`}>
          <path d="M 0 0 l -44 -26 l 12 26 l -12 26 z" fill={color} />
        </g>
      )}
    </Svg>
  );
};

/** The gap the move actually bought, measured. */
export const GapMeter: React.FC<{
  at: number;
  x1: number;
  x2: number;
  y: number;
  label?: string;
}> = ({ at, x1, x2, y, label = "SEPARATION" }) => {
  const frame = useCurrentFrame();
  const p = ease(frame - at, 0, 16);
  if (p <= 0.002) return null;
  const w = (x2 - x1) * p;
  return (
    <Svg opacity={p}>
      <line x1={x1} y1={y} x2={x1 + w} y2={y} stroke={C.volt} strokeWidth={5} />
      <line x1={x1} y1={y - 26} x2={x1} y2={y + 26} stroke={C.volt} strokeWidth={6} />
      <line x1={x1 + w} y1={y - 26} x2={x1 + w} y2={y + 26} stroke={C.volt} strokeWidth={6} />
      <text
        x={x1 + w / 2}
        y={y - 42}
        textAnchor="middle"
        fill={C.volt}
        style={{ ...uiStyle(30, 900) } as React.CSSProperties}
      >
        {label}
      </text>
    </Svg>
  );
};

/** A training cone, for the beat about not stopping at the drill. */
export const Cone: React.FC<{
  x: number;
  y: number;
  at: number;
  color?: string;
  struck?: number;
}> = ({ x, y, at, color = "rgba(255,255,255,0.72)", struck }) => {
  const frame = useCurrentFrame();
  const p = ease(frame - at, 0, 12);
  if (p <= 0.002) return null;
  const sp = struck === undefined ? 0 : ease(frame - struck, 0, 10);
  return (
    <Svg opacity={p}>
      <g transform={`translate(${x} ${y})`}>
        <ellipse cy={58} rx={82} ry={26} fill={color} opacity={0.28} />
        <path d="M 0 -94 L 58 58 L -58 58 Z" fill={color} opacity={0.85} />
        {sp > 0.01 && (
          <g stroke={C.red} strokeWidth={11} strokeLinecap="round" opacity={sp}>
            <line x1={-74} y1={-74} x2={74 * sp} y2={74 * sp} />
            <line x1={-74} y1={74} x2={74 * sp} y2={-74 * sp} />
          </g>
        )}
      </g>
    </Svg>
  );
};
