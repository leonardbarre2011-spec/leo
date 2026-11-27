import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { fontFamily } from "../../font";

const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* name card for crew intros */
export const NameCard: React.FC<{ name: string; role: string; t: number; status?: string; statusColor?: string }> = ({ name, role, t, status, statusColor = "#ff3b2a" }) => {
  const k = interpolate(t, [0, 0.25], [0, 1], c);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingTop: 300, paddingLeft: 70, fontFamily }}>
      <div style={{ transform: `translateX(${(1 - k) * -60}px)`, opacity: k }}>
        <div style={{ background: "#ffd34a", color: "#111", fontWeight: 900, fontSize: 30, padding: "6px 16px", letterSpacing: 3, display: "inline-block" }}>{role}</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 84, lineHeight: 1, marginTop: 10, textShadow: "0 4px 0 #000, 0 0 30px rgba(0,0,0,0.6)", WebkitTextStroke: "8px #000", paintOrder: "stroke fill" }}>{name}</div>
        {status ? (
          <div style={{ marginTop: 14, color: statusColor, fontWeight: 900, fontSize: 40, letterSpacing: 4, WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>{status}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* "classified file" header used on the opening shots */
export const FileStamp: React.FC<{ t: number; title: string; sub: string }> = ({ t, title, sub }) => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 260, fontFamily }}>
    <div style={{ border: "6px solid #e0392b", color: "#e0392b", fontWeight: 900, fontSize: 64, padding: "10px 26px", transform: `rotate(-6deg) scale(${interpolate(t, [0, 0.15, 0.3], [1.6, 0.95, 1], c)})`, opacity: interpolate(t, [0, 0.15], [0, 1], c), background: "rgba(0,0,0,0.35)", letterSpacing: 6 }}>
      {title}
    </div>
    <div style={{ marginTop: 26, color: "#fff", fontWeight: 900, fontSize: 40, letterSpacing: 4, textShadow: "0 3px 0 #000", opacity: interpolate(t, [0.2, 0.4], [0, 1], c) }}>{sub}</div>
  </AbsoluteFill>
);

/* fake TV news lower third */
export const NewsChyron: React.FC<{ t: number }> = ({ t }) => {
  const k = interpolate(t, [0, 0.3], [0, 1], c);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", paddingTop: 1480, fontFamily }}>
      <div style={{ transform: `translateX(${(1 - k) * -1080}px)` }}>
        <div style={{ background: "#c0392b", color: "#fff", fontWeight: 900, fontSize: 34, padding: "6px 22px", display: "inline-block", letterSpacing: 3 }}>BREAKING NEWS</div>
        <div style={{ background: "#fff", color: "#111", fontWeight: 900, fontSize: 42, padding: "14px 22px" }}>ONLY SURVIVOR OF 2011 JUPITER MISSION</div>
        <div style={{ background: "#1a2a6a", color: "#fff", fontWeight: 600, fontSize: 30, padding: "8px 22px" }}>Commander refuses to answer questions · Odyssey JX-11</div>
      </div>
    </AbsoluteFill>
  );
};

/* CCTV / black-box HUD */
export const CctvHud: React.FC<{ t: number; cam: string; clock: string }> = ({ t, cam, clock }) => (
  <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)" }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.85)" }} />
    <div style={{ position: "absolute", top: 120, left: 60, color: "#d8ffd8", fontWeight: 900, fontSize: 40, letterSpacing: 3, textShadow: "0 2px 4px #000" }}>{cam}</div>
    <div style={{ position: "absolute", top: 120, right: 60, color: "#d8ffd8", fontWeight: 900, fontSize: 40, letterSpacing: 2, display: "flex", alignItems: "center", gap: 14, textShadow: "0 2px 4px #000" }}>
      <span style={{ width: 26, height: 26, borderRadius: 99, background: "#ff2a1a", opacity: Math.floor(t * 2) % 2 ? 0.25 : 1 }} />
      REC
    </div>
    <div style={{ position: "absolute", top: 176, right: 60, color: "#d8ffd8", fontWeight: 600, fontSize: 32, textShadow: "0 2px 4px #000" }}>{clock}</div>
    <div style={{ position: "absolute", top: 176, left: 60, color: "#d8ffd8", fontWeight: 600, fontSize: 28, textShadow: "0 2px 4px #000" }}>ODYSSEY JX-11 · 08/29/2011</div>
  </AbsoluteFill>
);

/* transcript line typed on screen (black box format) */
export const Transcript: React.FC<{ t: number; stamp: string; who: string; text: string; color: string; dur: number }> = ({ t, stamp, who, text, color, dur }) => {
  const n = Math.round(interpolate(t, [0, Math.max(0.3, dur * 0.8)], [0, text.length], c));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1180, fontFamily }}>
      <div style={{ width: 920, background: "rgba(0,0,0,0.78)", border: "3px solid rgba(216,255,216,0.4)", padding: "22px 28px" }}>
        <div style={{ color: "#9aa09a", fontWeight: 600, fontSize: 30, letterSpacing: 2 }}>{stamp}</div>
        <div style={{ color, fontWeight: 900, fontSize: 40, marginTop: 6, letterSpacing: 2 }}>{who}</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 64, lineHeight: 1.1, marginTop: 8 }}>
          {text.slice(0, n)}
          <span style={{ opacity: Math.floor(t * 4) % 2 ? 0 : 1 }}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BigText: React.FC<{ t: number; lines: string[]; sub?: string; color?: string }> = ({ t, lines, sub, color = "#fff" }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily, background: "rgba(0,0,0,0.55)" }}>
    {lines.map((l, i) => (
      <div key={i} style={{ color: i === 0 ? "#ff3b2a" : color, fontWeight: 900, fontSize: i === 0 ? 96 : 64, letterSpacing: 4, opacity: interpolate(t, [i * 0.4, i * 0.4 + 0.2], [0, 1], c), textAlign: "center", maxWidth: 900 }}>
        {l}
      </div>
    ))}
    {sub ? <div style={{ marginTop: 30, color: "#d8d8d8", fontWeight: 600, fontSize: 40, opacity: interpolate(t, [1, 1.3], [0, 1], c) }}>{sub}</div> : null}
  </AbsoluteFill>
);
