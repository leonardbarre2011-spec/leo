import React from "react";
import { AbsoluteFill } from "remotion";
import { fontFamily } from "../../font";

// Makes the 3D shot look like it is playing on one monitor in the wall of screens.
export const ScreenOverlay: React.FC<{ label: string; t: number; zoom?: number }> = ({ label, t, zoom = 1 }) => {
  const inset = { left: 70, right: 70, top: 330, bottom: 560 };
  const s = zoom;
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>
      {/* bezel + surrounding dark wall with neighbour screens */}
      <div
        style={{
          position: "absolute",
          left: inset.left,
          right: inset.right,
          top: inset.top,
          bottom: inset.bottom,
          borderRadius: 26,
          boxShadow: "0 0 0 14px #121317, 0 0 0 3000px #050507",
        }}
      />
      {[
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
      ].map(([dx, dy], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: inset.left + dx * 980,
            width: 940,
            top: inset.top + dy * 1060,
            height: 1030,
            borderRadius: 26,
            background: ["#3a6fd8", "#d8a040", "#5ac0a0", "#c05ab0"][i % 4],
            opacity: 0.35 + 0.05 * Math.sin(t * 3 + i),
          }}
        />
      ))}
      {/* scanlines */}
      <div
        style={{
          position: "absolute",
          left: inset.left,
          right: inset.right,
          top: inset.top,
          bottom: inset.bottom,
          borderRadius: 26,
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 5px)",
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: inset.left + 30,
          top: inset.top + 26,
          fontFamily,
          fontWeight: 900,
          fontSize: 40,
          color: "#fff",
          letterSpacing: 2,
          textShadow: "0 2px 6px rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span style={{ width: 22, height: 22, borderRadius: 99, background: "#ff2a1a", opacity: Math.floor(t * 2) % 2 ? 0.3 : 1 }} />
        {label}
      </div>
    </AbsoluteFill>
  );
};
