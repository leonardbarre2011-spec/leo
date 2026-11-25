import React from "react";
import { fontFamily } from "./font";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";


// End card: the monster's eyes open in the dark, a question that loops the
// viewer back, then a "Follow for Part 2" button that gets tapped.
export const Cta: React.FC<{ question?: string; sub?: string; button?: string; motif?: "eyes" | "rec" }> = ({
  question = "What was outside?",
  sub = "Part 2 is coming.",
  button = "+ Follow for Part 2",
  motif = "eyes",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const eyes = interpolate(f, [6, 16], [0, 1], c);
  const blink = f > 70 && f < 76 ? 0.1 : 1;
  const q = spring({ frame: f - 14, fps, config: { damping: 200 } });
  const btn = spring({ frame: f - 34, fps, config: { damping: 14 } });
  const tap = f >= 66;
  const press = interpolate(f, [62, 66, 72], [1, 0.9, 1], c);
  const ring = interpolate(f, [66, 90], [0, 1], c);
  const fadeOut = interpolate(f, [108, 120], [1, 0], c);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", fontFamily, opacity: fadeOut }}>
      {/* eyes */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 470 }}>
        {motif === "rec" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: eyes, marginTop: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: 999, background: "#ff2a1a", boxShadow: "0 0 50px 14px rgba(255,40,20,0.55)", opacity: Math.floor(f / 12) % 2 ? 0.25 : 1 }} />
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 70, letterSpacing: 6 }}>REC</div>
          </div>
        ) : (
        <div style={{ display: "flex", gap: 150, opacity: eyes }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: 150,
                height: 70 * eyes * blink,
                marginTop: 35 - 35 * eyes * blink,
                background: "#ff3b2a",
                boxShadow: "0 0 60px 18px rgba(255,40,20,0.55)",
              }}
            />
          ))}
        </div>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 760 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: 92,
            textAlign: "center",
            lineHeight: 1.05,
            opacity: q,
            transform: `translateY(${(1 - q) * 30}px)`,
            maxWidth: 900,
          }}
        >
          {question}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontWeight: 600,
            fontSize: 46,
            marginTop: 26,
            opacity: q,
          }}
        >
          {sub}
        </div>
        <div style={{ marginTop: 90, position: "relative", transform: `scale(${btn * press})` }}>
          <div
            style={{
              position: "absolute",
              inset: -18,
              borderRadius: 999,
              border: "4px solid rgba(255,255,255,0.6)",
              opacity: tap ? 1 - ring : 0,
              transform: `scale(${1 + ring * 0.35})`,
            }}
          />
          <div
            style={{
              padding: "30px 74px",
              borderRadius: 999,
              background: tap ? "#2a2a2a" : "#fe2c55",
              color: "#fff",
              fontWeight: 900,
              fontSize: 54,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {tap ? "✓ Following" : button}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
