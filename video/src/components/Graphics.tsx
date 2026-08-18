import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, uiStyle } from "../theme";
import { HEIGHT, WIDTH } from "../timing";

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none", ...style }}>
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {children}
    </svg>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ *
 *  BRACKET — analysis reticle. Corners only, never a full box.
 * ------------------------------------------------------------------ */
export const Bracket: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  hold?: number;
  arm?: number;
  sw?: number;
}> = ({ at, x, y, w, h, color = C.red, hold, arm = 46, sw = 5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 18, mass: 0.5, stiffness: 180 },
    durationInFrames: 15,
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 8, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < -1 || out <= 0.001) return null;
  const grow = interpolate(sp, [0, 1], [1.22, 1]);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const a = arm * sp;
  const corners = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  return (
    <Svg>
      <g
        opacity={sp * out}
        transform={`translate(${cx} ${cy}) scale(${grow}) translate(${-cx} ${-cy})`}
      >
        {corners.map(([px, py, sx, sy], i) => (
          <path
            key={i}
            d={`M ${px} ${py + sy * a} L ${px} ${py} L ${px + sx * a} ${py}`}
            stroke={color}
            strokeWidth={sw}
            fill="none"
            strokeLinecap="square"
          />
        ))}
      </g>
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  HIP LINE — the fix, made visible. A ghost line marks where the
 *  hips were; the live line travels down to where they should be.
 * ------------------------------------------------------------------ */
export const HipLine: React.FC<{
  at: number;
  yFrom: number;
  yTo: number;
  travel: number; // frames of travel
  x0?: number;
  x1?: number;
  color?: string;
  label?: string;
  hold?: number;
}> = ({
  at,
  yFrom,
  yTo,
  travel,
  x0 = 120,
  x1 = 960,
  color = C.volt,
  label = "HIP LINE",
  hold,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const draw = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(t, [6, 6 + travel], [yFrom, yTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 8, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < 0 || out <= 0.001) return null;
  const w = (x1 - x0) * draw;
  const dropping = y > yFrom + 4;
  return (
    <Svg>
      <g opacity={out}>
        {/* ghost: where the hips started */}
        <line
          x1={x0}
          y1={yFrom}
          x2={x0 + w}
          y2={yFrom}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={3}
          strokeDasharray="14 12"
        />
        {/* live hip line */}
        <line
          x1={x0}
          y1={y}
          x2={x0 + w}
          y2={y}
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={x0 + w} cy={y} r={9} fill={color} />
        {/* travel arrow */}
        {dropping && (
          <g opacity={interpolate(t, [6, 12], [0, 1], { extrapolateRight: "clamp" })}>
            <line
              x1={x0 + 34}
              y1={yFrom + 12}
              x2={x0 + 34}
              y2={y - 16}
              stroke={color}
              strokeWidth={5}
            />
            <path
              d={`M ${x0 + 34} ${y} l -15 -22 l 15 9 l 15 -9 z`}
              fill={color}
            />
          </g>
        )}
      </g>
      <foreignObject x={x0} y={y + 16} width={520} height={60} opacity={out}>
        <div style={{ ...uiStyle(25, 900), color, lineHeight: 1 }}>{label}</div>
      </foreignObject>
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  FOOT HIGHLIGHT — pulsing ring + load indicator on one foot.
 * ------------------------------------------------------------------ */
export const FootHighlight: React.FC<{
  at: number;
  x: number;
  y: number;
  r?: number;
  color?: string;
  label?: string;
  hold?: number;
  load?: boolean;
  labelSide?: "left" | "right";
  labelAbove?: boolean;
}> = ({
  at,
  x,
  y,
  r = 120,
  color = C.volt,
  label,
  hold,
  load = false,
  labelSide = "right",
  labelAbove = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 200 },
    durationInFrames: 16,
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 8, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < -1 || out <= 0.001) return null;
  const pulse = 1 + Math.sin(t / 7) * 0.035;
  const ping = (t % 30) / 30;
  const dash = 2 * Math.PI * r;
  const loadP = load
    ? interpolate(t, [4, 34], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.3, 0, 0.2, 1),
      })
    : 0;
  return (
    <Svg>
      <g opacity={sp * out}>
        {/* outward ping */}
        <circle
          cx={x}
          cy={y}
          r={r * (1 + ping * 0.55)}
          fill="none"
          stroke={color}
          strokeWidth={3}
          opacity={(1 - ping) * 0.5}
        />
        <ellipse
          cx={x}
          cy={y}
          rx={r * pulse * interpolate(sp, [0, 1], [1.5, 1])}
          ry={r * 0.62 * pulse * interpolate(sp, [0, 1], [1.5, 1])}
          fill={color}
          fillOpacity={0.14}
          stroke={color}
          strokeWidth={5}
        />
        {load && (
          <circle
            cx={x}
            cy={y}
            r={r + 26}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeDasharray={`${dash * loadP} ${dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${x} ${y})`}
            opacity={0.95}
          />
        )}
        {/* downward force */}
        {load && (
          <g opacity={loadP}>
            <line
              x1={x}
              y1={y - r - 92}
              x2={x}
              y2={y - r - 26}
              stroke={color}
              strokeWidth={7}
            />
            <path
              d={`M ${x} ${y - r - 6} l -17 -26 l 17 10 l 17 -10 z`}
              fill={color}
            />
          </g>
        )}
      </g>
      {label && (
        <foreignObject
          x={labelSide === "right" ? x + r * 0.7 : x - r * 0.7 - 460}
          y={labelAbove ? y - r - 118 : y + r * 0.6}
          width={470}
          height={70}
          opacity={sp * out}
        >
          <div
            style={{
              ...uiStyle(26, 900),
              color: C.ink,
              background: color,
              display: "inline-block",
              padding: "9px 15px 7px",
              lineHeight: 1,
              float: labelSide === "right" ? "left" : "right",
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  DIRECTION ARROW — the attack path. Draws on, then the head lands.
 * ------------------------------------------------------------------ */
export const DirectionArrow: React.FC<{
  at: number;
  d: string;
  len?: number; // path length estimate
  draw?: number; // frames to draw
  color?: string;
  width?: number;
  hold?: number;
  head?: { x: number; y: number; rot: number };
  label?: string;
  labelAt?: { x: number; y: number };
}> = ({
  at,
  d,
  len = 1200,
  draw = 14,
  color = C.volt,
  width = 12,
  hold,
  head,
  label,
  labelAt,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = interpolate(t, [0, draw], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.6, 0.2, 1),
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 8, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < 0 || out <= 0.001) return null;
  return (
    <Svg>
      <g opacity={out}>
        <path
          d={d}
          fill="none"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth={width + 8}
          strokeLinecap="round"
          strokeDasharray={`${len * p} ${len}`}
        />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={`${len * p} ${len}`}
        />
        {head && p > 0.92 && (
          <g
            transform={`translate(${head.x} ${head.y}) rotate(${head.rot})`}
            opacity={interpolate(p, [0.92, 1], [0, 1])}
          >
            <path
              d={`M 0 0 l -52 -30 l 14 30 l -14 30 z`}
              fill={color}
              stroke="rgba(0,0,0,0.35)"
              strokeWidth={3}
            />
          </g>
        )}
      </g>
      {label && labelAt && (
        <foreignObject x={labelAt.x} y={labelAt.y} width={520} height={70} opacity={out * p}>
          <div
            style={{
              ...uiStyle(26, 900),
              color: C.ink,
              background: color,
              display: "inline-block",
              padding: "9px 15px 7px",
              lineHeight: 1,
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  DEFENDER MARK — red marker on the foot being attacked.
 * ------------------------------------------------------------------ */
export const DefenderMark: React.FC<{
  at: number;
  x: number;
  y: number;
  label?: string;
  hold?: number;
  r?: number;
}> = ({ at, x, y, label = "TOP FOOT", hold, r = 78 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 14, mass: 0.4, stiffness: 220 },
    durationInFrames: 14,
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 7, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < -1 || out <= 0.001) return null;
  return (
    <Svg>
      <g opacity={sp * out} transform={`translate(${x} ${y}) scale(${interpolate(sp, [0, 1], [1.5, 1])})`}>
        <ellipse rx={r} ry={r * 0.6} fill="rgba(255,46,46,0.16)" stroke={C.red} strokeWidth={5} />
        <line x1={-r * 0.42} y1={-r * 0.28} x2={r * 0.42} y2={r * 0.28} stroke={C.red} strokeWidth={6} />
        <line x1={-r * 0.42} y1={r * 0.28} x2={r * 0.42} y2={-r * 0.28} stroke={C.red} strokeWidth={6} />
      </g>
      <foreignObject x={x - 240} y={y - r - 74} width={480} height={64} opacity={sp * out}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              ...uiStyle(25, 900),
              color: C.white,
              background: C.red,
              display: "inline-block",
              padding: "8px 14px 6px",
              lineHeight: 1,
            }}
          >
            {label}
          </div>
        </div>
      </foreignObject>
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  GATE — the target the player explodes through.
 * ------------------------------------------------------------------ */
export const Gate: React.FC<{
  at: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  hold?: number;
  broken?: number; // frame at which it blows open
}> = ({ at, x, y, w = 250, h = 210, color = C.volt, hold, broken }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const sp = interpolate(t, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bt = broken === undefined ? -1 : frame - broken;
  const spread = bt < 0 ? 0 : interpolate(bt, [0, 16], [0, 190], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bfade = bt < 0 ? 1 : interpolate(bt, [0, 18], [1, 0], { extrapolateRight: "clamp" });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 8, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < 0 || out * bfade <= 0.001) return null;
  const post = (sx: number) => (
    <g transform={`translate(${x + sx * (w / 2 + spread)} ${y})`}>
      <rect x={-7} y={(-h / 2) * sp} width={14} height={h * sp} fill={color} rx={2} />
      <rect x={-24} y={(-h / 2) * sp - 16} width={48} height={12} fill={color} />
      <rect x={-24} y={(h / 2) * sp + 4} width={48} height={12} fill={color} />
    </g>
  );
  return (
    <Svg>
      <g opacity={sp * out * bfade}>
        {post(-1)}
        {post(1)}
      </g>
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 *  SPLIT — before / after comparison wipe.
 * ------------------------------------------------------------------ */
export const SplitDivider: React.FC<{
  at: number;
  x: number;
  color?: string;
}> = ({ at, x, color = C.volt }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const g = interpolate(t, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 4,
        top: 0,
        width: 8,
        height: HEIGHT,
        background: color,
        opacity: g,
        boxShadow: "0 0 40px rgba(0,0,0,0.6)",
      }}
    />
  );
};

/* ------------------------------------------------------------------ *
 *  STRIKE — the red slash used exactly twice (DEAD, MORE MOVES).
 * ------------------------------------------------------------------ */
export const Strike: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  angle?: number;
  color?: string;
  thickness?: number;
}> = ({ at, x, y, w, angle = -6, color = C.red, thickness = 16 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = interpolate(t, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (t < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w * p,
        height: thickness,
        background: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "left center",
        boxShadow: "0 6px 22px rgba(0,0,0,0.5)",
      }}
    />
  );
};

/* Replay affordance for the run-it-back beat. */
export const ReplayPips: React.FC<{
  at: number;
  active: number;
  total?: number;
  y: number;
}> = ({ at, active, total = 3, y }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        gap: 12,
      }}
    >
      {new Array(total).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 76 : 30,
            height: 8,
            background: i <= active ? C.volt : "rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </div>
  );
};
