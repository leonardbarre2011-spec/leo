import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../../font";

const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Persistent retention HUD: progress bar + "ALIVE" counter + hook text + day stamps. */
export const HarvestHud: React.FC<{
  alive: [number, number][]; // [time, count]
  days: [number, string][]; // [time, label]
  hookEnd: number;
  end: number;
  hookLines?: [string, string];
}> = ({ alive, days, hookEnd, end, hookLines = ["24 ENTER.", "1 LEAVES."] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = f / fps;
  let count = alive[0][1];
  let changedAt = -10;
  for (const [t, n] of alive) if (T >= t) {
    count = n;
    changedAt = t;
  }
  const bump = interpolate(T - changedAt, [0, 0.12, 0.4], [1.6, 1.15, 1], c);
  const flash = T - changedAt < 0.4 && changedAt > 0;
  const day = [...days].reverse().find(([t]) => T >= t && T < t + 1.4);
  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
      {/* progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(T / end) * 100}%`, background: "#ffe14a" }} />
      {/* ALIVE counter */}
      <div style={{ position: "absolute", top: 190, left: 56, display: "flex", alignItems: "center", gap: 16, transform: `scale(${bump})`, transformOrigin: "left center" }}>
        <div style={{ width: 22, height: 22, borderRadius: 99, background: "#ff2a1a", boxShadow: "0 0 18px #ff2a1a" }} />
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 44, letterSpacing: 3, WebkitTextStroke: "7px #000", paintOrder: "stroke fill" }}>ALIVE</div>
        <div style={{ color: flash ? "#ff3b2a" : "#ffe14a", fontWeight: 900, fontSize: 76, WebkitTextStroke: "9px #000", paintOrder: "stroke fill" }}>{count}</div>
      </div>
      {/* hook (first seconds) */}
      {T < hookEnd ? (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 360 }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: hookLines[0].length > 11 ? 90 : 118, lineHeight: 1, textAlign: "center", WebkitTextStroke: "12px #000", paintOrder: "stroke fill", transform: `scale(${interpolate(T, [0, 0.12, 0.25], [1.4, 0.95, 1], c)})` }}>
            {hookLines[0]}
          </div>
          <div style={{ color: "#ff3b2a", fontWeight: 900, fontSize: hookLines[1].length > 11 ? 90 : 118, lineHeight: 1, marginTop: 12, textAlign: "center", WebkitTextStroke: "12px #000", paintOrder: "stroke fill", opacity: T > 0.9 ? 1 : 0, transform: `scale(${interpolate(T, [0.9, 1.02, 1.15], [1.4, 0.95, 1], c)})` }}>
            {hookLines[1]}
          </div>
        </AbsoluteFill>
      ) : null}
      {/* day stamp */}
      {day ? (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 420 }}>
          <div style={{ color: "#ffe14a", fontWeight: 900, fontSize: 150, letterSpacing: 6, WebkitTextStroke: "14px #000", paintOrder: "stroke fill", transform: `scale(${interpolate(T - day[0], [0, 0.1, 0.25], [1.5, 0.95, 1], c)})`, opacity: interpolate(T - day[0], [1.1, 1.4], [1, 0], c) }}>
            {day[1]}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
