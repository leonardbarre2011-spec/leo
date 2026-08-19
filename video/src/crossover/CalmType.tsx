import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { C, displayStyle, legible, uiStyle } from "../theme";
import { WIDTH } from "./timing";

/* ------------------------------------------------------------------ *
 *  CALM CAPTIONS
 *  A whole line arrives at once, softly, and stays put. No per-word
 *  pops, no scale punches, no shake — the reader is never chasing the
 *  text. Emphasis is colour only.
 * ------------------------------------------------------------------ */

export type Seg = { t: string; hi?: boolean; red?: boolean };

const soft = (t: number, inLen = 9) =>
  interpolate(t, [0, inLen], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const CalmLine: React.FC<{
  segs: Seg[];
  at: number;
  out?: number;
  y: number;
  size?: number;
  maxWidth?: number;
  align?: "center" | "left";
}> = ({ segs, at, out, y, size = 74, maxWidth = 940, align = "center" }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const appear = soft(t);
  const leave =
    out === undefined
      ? 1
      : interpolate(frame, [out, out + 9], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        });
  const o = appear * leave;
  if (o <= 0.002) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: (WIDTH - maxWidth) / 2,
          width: maxWidth,
          textAlign: align,
          opacity: o,
          transform: `translateY(${(1 - appear) * 22}px)`,
        }}
      >
        <span style={{ ...displayStyle(size), ...legible(1.05) }}>
          {segs.map((sg, i) => (
            <span
              key={i}
              style={{
                color: sg.red ? C.red : sg.hi ? C.volt : C.white,
              }}
            >
              {sg.t}
              {i < segs.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Small tracked-out label. Used sparingly, one at a time. */
export const Label: React.FC<{
  text: string;
  at: number;
  out?: number;
  y: number;
  color?: string;
  size?: number;
  align?: "center" | "left";
  x?: number;
}> = ({ text, at, out, y, color = C.white, size = 28, align = "center", x }) => {
  const frame = useCurrentFrame();
  const appear = soft(frame - at, 8);
  const leave =
    out === undefined
      ? 1
      : interpolate(frame, [out, out + 8], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const o = appear * leave;
  if (o <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x ?? 0,
        width: x === undefined ? WIDTH : undefined,
        textAlign: align,
        opacity: o,
      }}
    >
      <span style={{ ...uiStyle(size, 800), color, ...legible(0.9) }}>
        {text}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 *  STEP LIST — the roadmap, and the same list is ticked through the
 *  three teaching shots so the viewer always knows where they are.
 * ------------------------------------------------------------------ */
export const StepList: React.FC<{
  at: number;
  out?: number;
  active?: number; // -1 = none yet
  y: number;
  compact?: boolean;
}> = ({ at, out, active = -1, y, compact = false }) => {
  const frame = useCurrentFrame();
  const items = ["ATTACK HARD", "FREEZE", "SNAP ACROSS"];
  const leave =
    out === undefined
      ? 1
      : interpolate(frame, [out, out + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  if (leave <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: WIDTH,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? 10 : 22,
        opacity: leave,
      }}
    >
      {items.map((it, i) => {
        const a = soft(frame - (at + i * 9), 10);
        const on = i === active;
        const done = active > i;
        return (
          <div
            key={it}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: compact ? 470 : 520,
              gap: 18,
              opacity: a * (done ? 0.5 : on || active < 0 ? 1 : 0.62),
              transform: `translateY(${(1 - a) * 14}px)`,
            }}
          >
            <div
              style={{
                width: compact ? 40 : 52,
                height: compact ? 40 : 52,
                border: `2px solid ${on ? C.volt : "rgba(255,255,255,0.42)"}`,
                background: on ? C.volt : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  ...uiStyle(compact ? 23 : 26, 900),
                  color: on ? C.ink : C.white,
                  lineHeight: 1,
                  letterSpacing: 0,
                }}
              >
                {i + 1}
              </span>
            </div>
            <span
              style={{
                ...uiStyle(compact ? 30 : 36, 800),
                color: on ? C.volt : C.white,
                ...legible(0.9),
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

/* A literal half-second, drawn. */
export const HalfSecondBar: React.FC<{
  at: number;
  fillFrames: number;
  y: number;
  width?: number;
}> = ({ at, fillFrames, y, width = 620 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const appear = soft(t, 8);
  if (appear <= 0.002) return null;
  const p = interpolate(t, [6, 6 + fillFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: (WIDTH - width) / 2,
        width,
        opacity: appear,
      }}
    >
      <div
        style={{
          height: 14,
          background: "rgba(255,255,255,0.18)",
          border: "2px solid rgba(255,255,255,0.34)",
        }}
      >
        <div style={{ height: "100%", width: `${p * 100}%`, background: C.volt }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
        }}
      >
        <span style={{ ...uiStyle(24, 800), color: "rgba(255,255,255,0.7)" }}>
          0.0s
        </span>
        <span style={{ ...uiStyle(24, 900), color: C.volt }}>0.5s</span>
      </div>
    </div>
  );
};
