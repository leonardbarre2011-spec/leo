import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { C } from "../theme";
import { HEIGHT, WIDTH } from "../timing";

/* ------------------------------------------------------------------ *
 *  IMPACT FLASH — a single-frame-ish hit, never a strobe.
 * ------------------------------------------------------------------ */
export const ImpactFlash: React.FC<{
  at: number;
  len?: number;
  color?: string;
  strength?: number;
  blend?: React.CSSProperties["mixBlendMode"];
}> = ({ at, len = 6, color = C.white, strength = 0.85, blend = "screen" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 1, at, at + len], [0, strength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{ background: color, opacity: o, mixBlendMode: blend }}
    />
  );
};

/* ------------------------------------------------------------------ *
 *  SHAKE — decaying, deterministic, subtle. Wraps a layer.
 * ------------------------------------------------------------------ */
export const Shake: React.FC<{
  at: number;
  amount?: number;
  len?: number;
  seed?: string;
  children: React.ReactNode;
}> = ({ at, amount = 16, len = 14, seed = "s", children }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const decay =
    t < 0 || t > len ? 0 : Math.pow(1 - t / len, 2.2) * amount;
  const x = decay ? (random(`${seed}x${frame}`) - 0.5) * 2 * decay : 0;
  const y = decay ? (random(`${seed}y${frame}`) - 0.5) * 2 * decay : 0;
  const r = decay ? (random(`${seed}r${frame}`) - 0.5) * decay * 0.06 : 0;
  return (
    <AbsoluteFill
      style={{
        transform: decay
          ? `translate(${x}px, ${y}px) rotate(${r}deg) scale(${1 + decay / 420})`
          : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  FILM GRAIN + VIGNETTE — the premium finish layer.
 * ------------------------------------------------------------------ */
const GRAIN_URI = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='3' seed='4'/></filter><rect width='320' height='320' filter='url(%23n)'/></svg>`,
)}")`;

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  /* pan a single decoded texture instead of re-generating it */
  const x = (frame * 37) % 320;
  const y = (frame * 91) % 320;
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        backgroundImage: GRAIN_URI,
        backgroundSize: "320px 320px",
        backgroundPosition: `${x}px ${y}px`,
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.55,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(120% 78% at 50% 46%, rgba(0,0,0,0) 38%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Keeps captions readable over bright hardwood without a muddy scrim. */
export const CaptionScrim: React.FC<{ opacity?: number }> = ({
  opacity = 1,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity,
      background:
        "linear-gradient(to top, rgba(4,6,10,0.78) 0%, rgba(4,6,10,0.55) 16%, rgba(4,6,10,0.0) 46%)",
    }}
  />
);

/** A soft dark pool behind a mid-frame type block, so big words read
 *  over busy crowd backgrounds without a flat box. */
export const TypePool: React.FC<{
  y: number;
  h?: number;
  strength?: number;
}> = ({ y, h = 620, strength = 0.62 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(78% ${h}px at 50% ${y}px, rgba(3,5,8,${strength}) 0%, rgba(3,5,8,${strength * 0.7}) 45%, rgba(3,5,8,0) 100%)`,
    }}
  />
);

/* ------------------------------------------------------------------ *
 *  SPEED STREAKS — directional energy without cheap motion graphics.
 * ------------------------------------------------------------------ */
export const Streaks: React.FC<{
  at: number;
  len?: number;
  count?: number;
  dir?: 1 | -1;
  color?: string;
  seed?: string;
  opacity?: number;
}> = ({
  at,
  len = 26,
  count = 14,
  dir = 1,
  color = C.white,
  seed = "st",
  opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > len) return null;
  const g = interpolate(t, [0, len * 0.25, len], [0, 1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: g * opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const y = random(`${seed}y${i}`) * HEIGHT;
        const w = 180 + random(`${seed}w${i}`) * 620;
        const sp = 1400 + random(`${seed}s${i}`) * 2400;
        const x0 = random(`${seed}x${i}`) * WIDTH;
        const x = x0 + dir * sp * (t / 60) - (dir > 0 ? w : 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - WIDTH * 0.4,
              top: y,
              width: w,
              height: 1.5 + random(`${seed}h${i}`) * 3,
              background: `linear-gradient(${dir > 0 ? "90deg" : "270deg"}, rgba(255,255,255,0), ${color})`,
              filter: "blur(0.6px)",
              opacity: 0.25 + random(`${seed}o${i}`) * 0.6,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  WHIP — directional blur wipe used only on hard section changes.
 * ------------------------------------------------------------------ */
export const WhipVeil: React.FC<{
  at: number;
  len?: number;
  dir?: 1 | -1;
}> = ({ at, len = 9, dir = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > len) return null;
  const p = t / len;
  const x = interpolate(p, [0, 1], [dir * -WIDTH * 1.25, dir * WIDTH * 1.25]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: -40,
          width: WIDTH * 1.1,
          height: HEIGHT + 80,
          background:
            "linear-gradient(90deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.96) 42%, rgba(6,8,12,0.96) 58%, rgba(6,8,12,0) 100%)",
          filter: "blur(22px)",
        }}
      />
    </AbsoluteFill>
  );
};

/* Full-frame scanning line used once, in the hook diagnostic beat. */
export const ScanLine: React.FC<{
  at: number;
  len: number;
  color?: string;
}> = ({ at, len, color = C.red }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > len) return null;
  const y = interpolate(t, [0, len], [HEIGHT * 0.12, HEIGHT * 0.99], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fade = interpolate(t, [0, 6, len - 8, len], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fade }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          width: WIDTH,
          height: 3,
          background: color,
          boxShadow: `0 0 26px ${color}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: y - 150,
          left: 0,
          width: WIDTH,
          height: 150,
          background: `linear-gradient(to bottom, rgba(255,46,46,0) 0%, rgba(255,46,46,0.16) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
