import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, displayStyle, legible, uiStyle } from "../theme";
import { WIDTH } from "../timing";

export type Hi = "white" | "volt" | "red" | "dim";

const COLORS: Record<Hi, string> = {
  white: C.white,
  volt: C.volt,
  red: C.red,
  dim: "rgba(255,255,255,0.78)",
};

/* ------------------------------------------------------------------ *
 *  KINETIC CAPTION
 *  Chunked, mobile-first, high contrast. Words reserve their space so
 *  the line never reflows — only weight, colour and scale change.
 * ------------------------------------------------------------------ */
export type Word = {
  t: string;
  at: number; // absolute frame of the spoken onset
  hi?: Hi;
  /** multiplier on the base size for emphasised words */
  em?: number;
};

export const Caption: React.FC<{
  words: Word[];
  y: number;
  size?: number;
  maxWidth?: number;
  align?: "center" | "left";
  x?: number;
  shadow?: number;
}> = ({
  words,
  y,
  size = 78,
  maxWidth = 940,
  align = "center",
  x,
  shadow = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: x ?? (WIDTH - maxWidth) / 2,
          width: maxWidth,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: align === "center" ? "center" : "flex-start",
          alignItems: "flex-end",
          gap: `${size * 0.14}px ${size * 0.2}px`,
        }}
      >
        {words.map((w, i) => {
          const t = frame - w.at;
          const sp = spring({
            frame: t,
            fps,
            config: { damping: 15, mass: 0.42, stiffness: 190 },
            durationInFrames: 16,
          });
          const o = interpolate(t, [-2, 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const em = w.em ?? 1;
          const pop = interpolate(t, [0, 5, 12], [1.16, 1.03, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          });
          return (
            <span
              key={i}
              style={{
                ...displayStyle(size * em),
                color: COLORS[w.hi ?? "white"],
                opacity: o,
                transform: `translateY(${(1 - sp) * size * 0.24}px) scale(${pop})`,
                transformOrigin: "50% 70%",
                display: "inline-block",
                ...legible(shadow),
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  SLAM — the hero word. Scale punch, tight tracking, no glow.
 * ------------------------------------------------------------------ */
export const Slam: React.FC<{
  text: string;
  at: number;
  y: number;
  size?: number;
  color?: string;
  outline?: boolean;
  skew?: number;
  hold?: number;
  bar?: string;
  align?: "center";
}> = ({
  text,
  at,
  y,
  size = 190,
  color = C.white,
  outline = false,
  skew = 0,
  hold,
  bar,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 220 },
    durationInFrames: 18,
  });
  const sc = interpolate(sp, [0, 1], [1.42, 1]);
  const o = interpolate(t, [-1, 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 5, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (o * out <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          width: WIDTH,
          display: "flex",
          justifyContent: "center",
          opacity: o * out,
          transform: `scale(${sc}) skewX(${skew}deg)`,
        }}
      >
        <div
          style={{
            position: "relative",
            padding: bar ? "10px 26px 16px" : 0,
            background: bar ?? "transparent",
          }}
        >
          <span
            style={{
              ...displayStyle(size),
              color: outline ? "transparent" : color,
              WebkitTextStroke: outline ? `3px ${color}` : undefined,
              ...legible(outline ? 0.4 : 1.15),
              display: "block",
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  TAG — small UI label. Used sparingly.
 * ------------------------------------------------------------------ */
export const Tag: React.FC<{
  text: string;
  at: number;
  x: number;
  y: number;
  color?: string;
  fg?: string;
  size?: number;
  hold?: number;
  origin?: "left" | "center" | "right";
}> = ({
  text,
  at,
  x,
  y,
  color = C.red,
  fg = C.white,
  size = 30,
  hold,
  origin = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 16, mass: 0.4, stiffness: 200 },
    durationInFrames: 14,
  });
  const out =
    hold === undefined
      ? 1
      : interpolate(t, [hold - 6, hold], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (t < -1 || out <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${origin === "center" ? "-50%" : origin === "right" ? "-100%" : "0"}) scale(${interpolate(sp, [0, 1], [0.72, 1])})`,
        transformOrigin: origin === "center" ? "50% 50%" : `${origin} center`,
        opacity: sp * out,
        background: color,
        padding: `${size * 0.36}px ${size * 0.62}px ${size * 0.32}px`,
        display: "flex",
        alignItems: "center",
        gap: size * 0.3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
      }}
    >
      <span style={{ ...uiStyle(size, 900), color: fg, lineHeight: 1 }}>
        {text}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 *  STEP BADGE — numbered instruction marker (01 / 02 / 03)
 * ------------------------------------------------------------------ */
export const StepBadge: React.FC<{
  n: string;
  label: string;
  at: number;
  y: number;
  color?: string;
  hold?: number;
}> = ({ n, label, at, y, color = C.volt, hold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 17, mass: 0.45, stiffness: 190 },
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
  const w = interpolate(sp, [0, 1], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: 62,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: out,
      }}
    >
      <div
        style={{
          width: 78,
          height: 78,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])})`,
          boxShadow: "0 12px 34px rgba(0,0,0,0.5)",
        }}
      >
        <span
          style={{
            ...displayStyle(48),
            color: C.ink,
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          {n}
        </span>
      </div>
      <div
        style={{
          overflow: "hidden",
          width: `${w * 100}%`,
          maxWidth: 620,
        }}
      >
        <span
          style={{
            ...uiStyle(27, 800),
            color: C.white,
            whiteSpace: "nowrap",
            ...legible(0.9),
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 *  CHIP ROW — the drill's three beats, consumed one by one.
 * ------------------------------------------------------------------ */
export const ChipRow: React.FC<{
  items: string[];
  at: number;
  y: number;
  active: number; // -1 none, 3 = all done
  stagger?: number;
  out?: number;
}> = ({ items, at, y, active, stagger = 7, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade =
    out === undefined
      ? 1
      : interpolate(frame, [out, out + 12], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (fade <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        opacity: fade,
      }}
    >
      {items.map((it, i) => {
        const t = frame - (at + i * stagger);
        const sp = spring({
          frame: t,
          fps,
          config: { damping: 16, mass: 0.4, stiffness: 200 },
          durationInFrames: 14,
        });
        const all = active >= items.length;
        const on = all || i === active;
        const done = !all && i < active;
        return (
          <div
            key={it}
            style={{
              opacity: sp * (done ? 0.42 : 1),
              transform: `translateY(${(1 - sp) * 22}px) scale(${on ? 1.08 : 1})`,
              background: on ? C.volt : "rgba(255,255,255,0.10)",
              border: `2px solid ${on ? C.volt : "rgba(255,255,255,0.34)"}`,
              padding: "12px 22px 10px",
              backdropFilter: "blur(6px)",
            }}
          >
            <span
              style={{
                ...uiStyle(26, 900),
                color: on ? C.ink : C.white,
                lineHeight: 1,
              }}
            >
              {it}
            </span>
          </div>
        );
      })}
    </div>
  );
};
