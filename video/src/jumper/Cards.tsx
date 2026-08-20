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
import { DRILLS, WIDTH } from "./timing";

const soft = (t: number, len = 10) =>
  interpolate(t, [0, len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/* ------------------------------------------------------------------ *
 *  PROGRESS — 1/5 … 5/5. It never leaves the frame during the list,
 *  because knowing how many are left is what keeps people watching.
 * ------------------------------------------------------------------ */
export const Progress: React.FC<{ active: number; at: number }> = ({
  active,
  at,
}) => {
  const frame = useCurrentFrame();
  const p = soft(frame - at, 12);
  if (p <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 148,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        opacity: p,
      }}
    >
      {DRILLS.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 92 : 44,
            height: 7,
            background: i <= active ? C.volt : "rgba(255,255,255,0.32)",
          }}
        />
      ))}
      <span
        style={{
          ...uiStyle(24, 900),
          color: C.volt,
          marginLeft: 14,
          ...legible(0.8),
        }}
      >
        {active + 1}/5
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 *  CHAPTER NUMBER
 *  Lands big on the spoken count, then settles into the corner as the
 *  name arrives. One motion per drill — that is the whole rhythm.
 * ------------------------------------------------------------------ */
export const Chapter: React.FC<{
  n: string;
  at: number;
  settleAt: number;
}> = ({ n, at, settleAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  if (t < -1) return null;
  const pop = spring({
    frame: t,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 190 },
    durationInFrames: 18,
  });
  const k = interpolate(frame, [settleAt, settleAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  /* big and centred → small and cornered */
  const size = interpolate(k, [0, 1], [268, 96]);
  const x = interpolate(k, [0, 1], [WIDTH / 2, 128]);
  const y = interpolate(k, [0, 1], [880, 300]);
  const box = interpolate(k, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* the frame dims only while the number owns it */}
      <AbsoluteFill
        style={{
          background: "rgba(6,8,12,0.55)",
          opacity: (1 - k) * pop,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
          width: size * 0.86,
          height: size * 0.86,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: box > 0.5 ? C.volt : "transparent",
          opacity: pop,
        }}
      >
        <span
          style={{
            ...displayStyle(size),
            color: box > 0.5 ? C.ink : C.volt,
            lineHeight: 1,
            marginTop: size * 0.06,
            ...legible(box > 0.5 ? 0 : 1.2),
          }}
        >
          {n}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  DRILL CARD — name and the reason it exists.
 * ------------------------------------------------------------------ */
export const DrillCard: React.FC<{
  name: string;
  why: string;
  at: number;
  whyAt: number;
  size?: number;
}> = ({ name, why, at, whyAt, size = 78 }) => {
  const frame = useCurrentFrame();
  const p = soft(frame - at, 10);
  const q = soft(frame - whyAt, 10);
  if (p <= 0.002) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 1268,
          left: 60,
          width: WIDTH - 120,
          opacity: p,
          transform: `translateY(${(1 - p) * 20}px)`,
        }}
      >
        <span style={{ ...displayStyle(size), color: C.white, ...legible(1.1) }}>
          {name}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1416,
          left: 60,
          width: WIDTH - 120,
          opacity: q,
          transform: `translateY(${(1 - q) * 14}px)`,
        }}
      >
        <span style={{ ...uiStyle(31, 800), color: C.volt, ...legible(0.9) }}>
          {why}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  HOOK COUNTER — shots going up, and up, and up.
 * ------------------------------------------------------------------ */
export const ShotCounter: React.FC<{ at: number; to: number }> = ({
  at,
  to,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = soft(t, 8);
  if (p <= 0.002) return null;
  const v = Math.round(
    interpolate(t, [4, 100], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: p }}>
      <div
        style={{
          position: "absolute",
          top: 856,
          width: WIDTH,
          textAlign: "center",
        }}
      >
        <span
          style={{
            ...displayStyle(232),
            color: C.white,
            fontVariantNumeric: "tabular-nums",
            ...legible(1.2),
          }}
        >
          {v.toLocaleString("en-US")}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1132,
          width: WIDTH,
          textAlign: "center",
        }}
      >
        <span style={{ ...uiStyle(38, 800), color: "rgba(255,255,255,0.8)", ...legible() }}>
          SHOTS UP
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  THE LIST — shown once up front so people know what they are
 *  staying for, and once at the end as the thing to screenshot.
 * ------------------------------------------------------------------ */
export const DrillList: React.FC<{
  at: number;
  stagger?: number;
  title?: string;
  titleColor?: string;
  compactWhy?: boolean;
  y?: number;
}> = ({
  at,
  stagger = 7,
  title,
  titleColor = C.volt,
  compactWhy = false,
  y = 560,
}) => {
  const frame = useCurrentFrame();
  const head = soft(frame - at, 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {title && (
        <div
          style={{
            position: "absolute",
            top: y - 118,
            left: 0,
            width: WIDTH,
            textAlign: "center",
            opacity: head,
          }}
        >
          <span style={{ ...uiStyle(34, 900), color: titleColor, ...legible(0.9) }}>
            {title}
          </span>
        </div>
      )}
      {DRILLS.map((d, i) => {
        const p = soft(frame - (at + 6 + i * stagger), 12);
        if (p <= 0.002) return null;
        return (
          <div
            key={d.n}
            style={{
              position: "absolute",
              top: y + i * 150,
              left: 96,
              width: WIDTH - 192,
              display: "flex",
              alignItems: "flex-start",
              gap: 22,
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                flexShrink: 0,
                background: C.volt,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 6,
              }}
            >
              <span
                style={{
                  ...displayStyle(38),
                  color: C.ink,
                  lineHeight: 1,
                  marginTop: 3,
                }}
              >
                {d.n}
              </span>
            </div>
            <div>
              <div>
                <span style={{ ...displayStyle(52), color: C.white, ...legible(0.9) }}>
                  {d.name}
                </span>
              </div>
              {compactWhy && (
                <div style={{ marginTop: 6 }}>
                  <span style={{ ...uiStyle(23, 700), color: "rgba(255,255,255,0.66)" }}>
                    {d.why}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
