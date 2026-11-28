import React from "react";
import { B } from "../../lib/Sets";
import { Character } from "../../lib/Character";
import type { Look } from "../../lib/Character";
import { Cam } from "../static/CamS";
import { Pine } from "../static/Sets";
import { TextSign } from "../smiling/Props";
import { Scatter, TexturedGround, noiseTexture } from "../../lib/detail";

type V3 = [number, number, number];

/* camera with a "punch-in" on every cut (fast zoom that settles) */
export const HCam: React.FC<React.ComponentProps<typeof Cam>> = (props) => {
  const t = props.t ?? 0;
  const base = props.fov ?? 44;
  const punch = 1 + 0.22 * Math.exp(-t * 7);
  return <Cam {...props} fov={base * punch} fovTo={(props.fovTo ?? base) * punch} />;
};

/* ---------------- original cast ---------------- */
export const MILA: Look = { skin: "#d9a374", shirt: "#4a5a3a", pants: "#2b2b33", shoes: "#3a2a1a", hair: "#3a2416", hairStyle: "long" };
export const TAM: Look = { skin: "#d9a374", shirt: "#bdb6a6", pants: "#5a5040", shoes: "#3a2a1a", hair: "#3a2416", hairStyle: "short" };
export const ASH: Look = { skin: "#f1c9a0", shirt: "#6a6a72", pants: "#3a3a40", shoes: "#2a2a2a", hair: "#d8b45a", hairStyle: "spiky" };
export const HOST: Look = { skin: "#f3cfa8", shirt: "#a83ad0", pants: "#a83ad0", shoes: "#111", hair: "#2ad0c0", hairStyle: "spiky" };
export const GUARD: Look = { skin: "#e8e8e8", shirt: "#f2f2f2", pants: "#f2f2f2", shoes: "#d8d8d8", hair: "#f2f2f2", hairStyle: "bald", helmet: true };
const TRIB_COLORS = ["#8a3a2a", "#2a5a8a", "#5a8a3a", "#8a7a2a", "#5a3a8a", "#2a7a7a", "#8a5a2a", "#4a4a4a"];
const SKINS = ["#f1c9a0", "#c68b59", "#8d5a3b", "#e9b98f", "#f3cfa8", "#6b4428"];
const HAIRS = ["#141010", "#4a2f1d", "#c0662e", "#d8b45a", "#2a1a10"];
export const tribute = (i: number): Look => ({
  skin: SKINS[i % SKINS.length],
  shirt: TRIB_COLORS[i % TRIB_COLORS.length],
  pants: "#2b2b33",
  shoes: "#2a2a2a",
  hair: HAIRS[i % HAIRS.length],
  hairStyle: (["short", "long", "spiky", "bun"] as const)[i % 4],
});

/* ---------------- the arena ---------------- */
export const PED_R = 14;
export const pedestal = (i: number, n = 24): V3 => {
  const a = (i / n) * Math.PI * 2;
  return [Math.sin(a) * PED_R, 0, Math.cos(a) * PED_R];
};

export const Drone: React.FC<{ p: V3; t: number }> = ({ p, t }) => (
  <group position={[p[0], p[1] + Math.sin(t * 2) * 0.2, p[2]]}>
    <B s={[1.2, 0.5, 1.2]} c="#2a2c30" />
    <B s={[0.4, 0.4, 0.3]} p={[0, -0.3, 0.6]} c="#111" />
    <B s={[0.15, 0.15, 0.1]} p={[0, -0.3, 0.78]} c="#ff2a1a" e="#ff2010" ei={Math.floor(t * 3) % 2 ? 3 : 0.5} />
    {[
      [-0.9, -0.9],
      [0.9, -0.9],
      [-0.9, 0.9],
      [0.9, 0.9],
    ].map(([x, z], i) => (
      <B key={i} s={[0.9, 0.04, 0.12]} p={[x, 0.3, z]} r={[0, t * 30 + i, 0]} c="#555" />
    ))}
  </group>
);

export const Arena: React.FC<{ t: number; night?: boolean; dome?: boolean; supplies?: boolean }> = ({ t, night, dome = true, supplies = true }) => (
  <>
    <color attach="background" args={[night ? "#0a1020" : "#9fc4e0"]} />
    <fog attach="fog" args={[night ? "#0e1628" : "#b8d4e8", 30, 150]} />
    <hemisphereLight args={[night ? "#7a94d8" : "#ffffff", night ? "#1a2030" : "#4a6a3a", night ? 1.4 : 1.1]} />
    <directionalLight position={[30, 50, 20]} intensity={night ? 1.1 : 1.5} color={night ? "#a8c0ff" : "#fff1d8"} />
    <TexturedGround color={night ? "#2e4430" : "#4f7a3a"} repeat={70} />
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[22, 48]} />
      <meshStandardMaterial map={noiseTexture(night ? "#3a4030" : "#8a9a6a", 0.25, 8)} roughness={0.95} />
    </mesh>
    {/* grass tufts, pebbles and rocks */}
    <Scatter count={900} rMin={22} rMax={60} color={night ? "#3a5a34" : "#5f9a44"} size={[0.18, 0.7, 0.18]} />
    <Scatter count={260} rMin={4} rMax={22} color="#8a8a7a" size={[0.35, 0.22, 0.3]} />
    <Scatter count={40} rMin={23} rMax={30} color="#7a7a72" size={[1.6, 1.0, 1.3]} />
    {/* pedestals */}
    {Array.from({ length: 24 }).map((_, i) => {
      const [x, , z] = pedestal(i);
      return (
        <mesh key={i} position={[x, 0.3, z]}>
          <cylinderGeometry args={[1.2, 1.3, 0.6, 16]} />
          <meshStandardMaterial color="#a8acb4" metalness={0.6} roughness={0.35} />
        </mesh>
      );
    })}
    {/* supply pile in the middle */}
    {supplies ? (
      <group>
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[3.4, 5, 6]} />
          <meshStandardMaterial color="#c8a84a" metalness={0.7} roughness={0.3} />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => (
          <B key={i} s={[1.2, 0.9, 1.0]} p={[Math.sin(i * 1.3) * (3.2 + (i % 3)), 0.45 + (i % 2) * 0.9, Math.cos(i * 1.3) * (3.2 + (i % 3))]} r={[0, i, 0]} c={["#7a5a3a", "#3a5a3a", "#8a3a2a", "#3a4a6a"][i % 4]} />
        ))}
      </group>
    ) : null}
    {/* forest ring */}
    {Array.from({ length: 60 }).map((_, i) => {
      const a = (i / 60) * Math.PI * 2 + (i % 3) * 0.05;
      const r = 32 + (i % 4) * 6;
      return <Pine key={i} p={[Math.sin(a) * r, 0, Math.cos(a) * r]} s={1.6 + (i % 3) * 0.3} />;
    })}
    {/* force dome */}
    {dome ? (
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[90, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={night ? "#4a8aff" : "#ffffff"} wireframe transparent opacity={night ? 0.25 : 0.12} fog={false} />
      </mesh>
    ) : null}
  </>
);

/* ---------------- the town square (the draw) ---------------- */
export const Square: React.FC<{ t: number; screen?: number; screenText?: string; night?: boolean }> = ({ t, screen = 1, screenText = "THE HARVEST", night }) => (
  <>
    <color attach="background" args={[night ? "#0a0c14" : "#8a929a"]} />
    <fog attach="fog" args={[night ? "#0e1018" : "#9aa2aa", 40, 160]} />
    <hemisphereLight args={[night ? "#7a8ac0" : "#e8eef4", "#2a2a2a", night ? 1.2 : 1.0]} />
    <directionalLight position={[20, 40, 30]} intensity={night ? 0.8 : 1.1} color="#f0f0ff" />
    <TexturedGround size={300} color="#6a6a6a" repeat={30} kind="tiles" />
    {Array.from({ length: 12 }).map((_, i) =>
      Array.from({ length: 12 }).map((__, j) => ((i + j) % 2 ? <B key={`${i}-${j}`} s={[4, 0.03, 4]} p={[-22 + i * 4, 0.02, -10 + j * 4]} c="#5a5a5a" /> : null)),
    )}
    {/* hall + stage */}
    <mesh position={[0, 8, -22]}>
      <boxGeometry args={[40, 16, 6]} />
      <meshStandardMaterial map={noiseTexture("#b8b0a0", 0.12, 6, "tiles")} roughness={0.9} />
    </mesh>
    {[-15, -9, -3, 3, 9, 15].map((x) => (
      <B key={x} s={[1.6, 14, 1.6]} p={[x, 7, -18.4]} c="#d8d0c0" />
    ))}
    {[-12, 12].map((x) => (
      <B key={x} s={[3, 10, 0.2]} p={[x, 9, -18.9]} c="#a8202a" />
    ))}
    <B s={[18, 1.4, 6]} p={[0, 0.7, -14]} c="#4a4a4a" />
    {/* the jar */}
    <mesh position={[3.5, 2.6, -13]}>
      <cylinderGeometry args={[1.0, 1.0, 2.2, 18]} />
      <meshStandardMaterial color="#cfeeff" transparent opacity={0.4} roughness={0.1} />
    </mesh>
    {Array.from({ length: 16 }).map((_, i) => (
      <B key={i} s={[0.45, 0.06, 0.3]} p={[3.5 + Math.sin(i * 2.4) * 0.5, 1.8 + (i % 5) * 0.2, -13 + Math.cos(i * 2.4) * 0.5]} r={[0, i, 0.3]} c="#fff8e0" />
    ))}
    <B s={[1.2, 2.2, 1]} p={[0, 2.5, -13]} c="#2a2a2a" />
    {/* giant screen */}
    <B s={[22, 11, 0.6]} p={[0, 21, -21.5]} c="#111" />
    <B s={[21, 10, 0.1]} p={[0, 21, -21.15]} c={screen > 0 ? "#2a3a6a" : "#020202"} e={screen > 0 ? "#3a5aaa" : "#000"} ei={screen * 0.8} />
    {screen > 0 ? <TextSign text={screenText} p={[0, 21, -21.05]} w={18} h={4} bg="#2a3a6a" fg="#ffd34a" glow /> : null}
  </>
);

export const Crowd: React.FC<{ t: number; rows?: number; cols?: number; z0?: number; face?: "worried" | "scared" | "neutral" }> = ({ t, rows = 4, cols = 9, z0 = -4, face = "worried" }) => (
  <>
    {Array.from({ length: rows * cols }).map((_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      return (
        <Character
          key={i}
          look={{ ...tribute(i), shirt: ["#bdb6a6", "#d8d0c0", "#9a948a"][i % 3] }}
          face={face}
          pose={{ headZ: Math.sin(t + i) * 0.05 }}
          position={[-12 + c * 3, 0, z0 + r * 3.2]}
          rotY={Math.PI}
          scale={0.85}
        />
      );
    })}
  </>
);
