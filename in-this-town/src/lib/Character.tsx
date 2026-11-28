import React from "react";
import { roundedBox } from "./detail";

// Original blocky characters (our own style – no third-party assets).
// Units: legs 0..2, torso 2..4, head 4..5.25. Feet on y = 0.

export type Face =
  | "neutral"
  | "smile"
  | "laugh"
  | "scared"
  | "worried"
  | "sleep"
  | "smug"
  | "zombie"
  | "grin"
  | "blank";

export type Look = {
  skin: string;
  shirt: string;
  pants: string;
  shoes?: string;
  hair?: string;
  hairStyle?: "short" | "long" | "spiky" | "cap" | "capBack" | "bald" | "bun";
  mustache?: string;
  headset?: boolean;
  earpiece?: boolean;
  helmet?: boolean;
  patch?: string;
  capColor?: string;
  beard?: string;
  backpack?: string;
  zombie?: boolean;
};

export type Pose = {
  armL?: number; // x rotation (forward = negative)
  armR?: number;
  armLz?: number; // sideways
  armRz?: number;
  legL?: number;
  legR?: number;
  headX?: number;
  headY?: number;
  headZ?: number;
  lean?: number;
  sit?: boolean;
  lie?: boolean;
};

const M: React.FC<{ c: string; e?: string; ei?: number }> = ({ c, e, ei }) => (
  <meshStandardMaterial
    color={c}
    roughness={0.85}
    metalness={0}
    emissive={e ?? "#000000"}
    emissiveIntensity={ei ?? 0}
  />
);

const Box: React.FC<{
  s: [number, number, number];
  p?: [number, number, number];
  c: string;
  e?: string;
  ei?: number;
  round?: number;
}> = ({ s, p, c, e, ei, round }) =>
  round ? (
    <mesh position={p} geometry={roundedBox(s[0], s[1], s[2], round)}>
      <M c={c} e={e} ei={ei} />
    </mesh>
  ) : (
    <mesh position={p}>
      <boxGeometry args={s} />
      <M c={c} e={e} ei={ei} />
    </mesh>
  );

// darker shade of a hex colour (for belts, cuffs, soles)
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${((f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, "0")}`;
};

const FaceFeatures: React.FC<{ face: Face }> = ({ face }) => {
  const z = 0.63;
  const ink = "#1b1b1f";
  switch (face) {
    case "sleep":
      return (
        <>
          <Box s={[0.26, 0.05, 0.02]} p={[-0.25, 0.1, z]} c={ink} />
          <Box s={[0.26, 0.05, 0.02]} p={[0.25, 0.1, z]} c={ink} />
          <Box s={[0.16, 0.05, 0.02]} p={[0, -0.25, z]} c={ink} />
        </>
      );
    case "laugh":
      return (
        <>
          <Box s={[0.24, 0.06, 0.02]} p={[-0.25, 0.14, z]} c={ink} />
          <Box s={[0.24, 0.06, 0.02]} p={[0.25, 0.14, z]} c={ink} />
          <Box s={[0.5, 0.24, 0.02]} p={[0, -0.24, z]} c={ink} />
          <Box s={[0.36, 0.08, 0.025]} p={[0, -0.31, z]} c="#d9534f" />
        </>
      );
    case "scared":
      return (
        <>
          <Box s={[0.2, 0.34, 0.02]} p={[-0.25, 0.1, z]} c="#ffffff" />
          <Box s={[0.2, 0.34, 0.02]} p={[0.25, 0.1, z]} c="#ffffff" />
          <Box s={[0.1, 0.14, 0.025]} p={[-0.25, 0.08, z]} c={ink} />
          <Box s={[0.1, 0.14, 0.025]} p={[0.25, 0.08, z]} c={ink} />
          <Box s={[0.22, 0.22, 0.02]} p={[0, -0.3, z]} c={ink} />
        </>
      );
    case "worried":
      return (
        <>
          <Box s={[0.13, 0.24, 0.02]} p={[-0.25, 0.08, z]} c={ink} />
          <Box s={[0.13, 0.24, 0.02]} p={[0.25, 0.08, z]} c={ink} />
          <mesh position={[-0.27, 0.32, z]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.24, 0.05, 0.02]} />
            <M c={ink} />
          </mesh>
          <mesh position={[0.27, 0.32, z]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.24, 0.05, 0.02]} />
            <M c={ink} />
          </mesh>
          <Box s={[0.26, 0.05, 0.02]} p={[0, -0.28, z]} c={ink} />
        </>
      );
    case "smug":
      return (
        <>
          <Box s={[0.24, 0.08, 0.02]} p={[-0.25, 0.1, z]} c={ink} />
          <Box s={[0.24, 0.08, 0.02]} p={[0.25, 0.1, z]} c={ink} />
          <mesh position={[0.06, -0.26, z]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.36, 0.06, 0.02]} />
            <M c={ink} />
          </mesh>
        </>
      );
    case "zombie":
      return (
        <>
          <Box s={[0.2, 0.16, 0.02]} p={[-0.25, 0.12, z]} c="#f4ff7a" e="#d8ff3a" ei={2.2} />
          <Box s={[0.2, 0.16, 0.02]} p={[0.25, 0.12, z]} c="#f4ff7a" e="#d8ff3a" ei={2.2} />
          <Box s={[0.5, 0.14, 0.02]} p={[0, -0.27, z]} c="#140d0d" />
          <Box s={[0.07, 0.07, 0.025]} p={[-0.14, -0.22, z]} c="#e8e2c8" />
          <Box s={[0.07, 0.07, 0.025]} p={[0.1, -0.32, z]} c="#e8e2c8" />
        </>
      );
    case "blank":
      return null;
    case "grin":
      return (
        <>
          <Box s={[0.13, 0.22, 0.02]} p={[-0.25, 0.14, z]} c={ink} />
          <Box s={[0.13, 0.22, 0.02]} p={[0.25, 0.14, z]} c={ink} />
          <Box s={[0.84, 0.3, 0.02]} p={[0, -0.3, z]} c={ink} />
          <Box s={[0.76, 0.1, 0.025]} p={[0, -0.22, z]} c="#ffffff" />
          <Box s={[0.08, 0.16, 0.02]} p={[-0.44, -0.18, z]} c={ink} />
          <Box s={[0.08, 0.16, 0.02]} p={[0.44, -0.18, z]} c={ink} />
        </>
      );
    case "smile":
      return (
        <>
          <Box s={[0.05, 0.06, 0.025]} p={[-0.22, 0.17, z]} c="#ffffff" />
          <Box s={[0.05, 0.06, 0.025]} p={[0.28, 0.17, z]} c="#ffffff" />
          <Box s={[0.13, 0.22, 0.02]} p={[-0.25, 0.1, z]} c={ink} />
          <Box s={[0.13, 0.22, 0.02]} p={[0.25, 0.1, z]} c={ink} />
          <Box s={[0.3, 0.06, 0.02]} p={[0, -0.3, z]} c={ink} />
          <Box s={[0.06, 0.1, 0.02]} p={[-0.17, -0.25, z]} c={ink} />
          <Box s={[0.06, 0.1, 0.02]} p={[0.17, -0.25, z]} c={ink} />
        </>
      );
    default:
      return (
        <>
          <Box s={[0.05, 0.06, 0.025]} p={[-0.22, 0.17, z]} c="#ffffff" />
          <Box s={[0.05, 0.06, 0.025]} p={[0.28, 0.17, z]} c="#ffffff" />
          <Box s={[0.13, 0.22, 0.02]} p={[-0.25, 0.1, z]} c={ink} />
          <Box s={[0.13, 0.22, 0.02]} p={[0.25, 0.1, z]} c={ink} />
          <Box s={[0.24, 0.05, 0.02]} p={[0, -0.26, z]} c={ink} />
        </>
      );
  }
};

const Hair: React.FC<{ look: Look }> = ({ look }) => {
  const h = look.hair ?? "#3a2a1e";
  switch (look.hairStyle) {
    case "bald":
      return null;
    case "long":
      return (
        <>
          <Box s={[1.32, 0.3, 1.32]} p={[0, 0.6, 0]} c={h} />
          <Box s={[1.32, 1.3, 0.3]} p={[0, 0.05, -0.52]} c={h} />
          <Box s={[0.2, 1.0, 1.2]} p={[-0.6, 0.1, -0.05]} c={h} />
          <Box s={[0.2, 1.0, 1.2]} p={[0.6, 0.1, -0.05]} c={h} />
        </>
      );
    case "bun":
      return (
        <>
          <Box s={[1.32, 0.3, 1.32]} p={[0, 0.6, 0]} c={h} />
          <Box s={[1.32, 0.7, 0.3]} p={[0, 0.3, -0.52]} c={h} />
          <Box s={[0.5, 0.45, 0.5]} p={[0, 0.9, -0.3]} c={h} />
        </>
      );
    case "spiky":
      return (
        <>
          <Box s={[1.32, 0.3, 1.32]} p={[0, 0.6, 0]} c={h} />
          <Box s={[1.32, 0.6, 0.3]} p={[0, 0.35, -0.52]} c={h} />
          <mesh position={[-0.3, 0.85, 0.2]} rotation={[0.3, 0, 0.3]}>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
            <M c={h} />
          </mesh>
          <mesh position={[0.05, 0.9, 0.3]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 0.3]} />
            <M c={h} />
          </mesh>
          <mesh position={[0.35, 0.85, 0.15]} rotation={[0.3, 0, -0.3]}>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
            <M c={h} />
          </mesh>
        </>
      );
    case "capBack":
      return (
        <>
          <Box s={[1.32, 0.3, 0.3]} p={[0, 0.3, 0.55]} c={h} />
          <Box s={[1.34, 0.4, 1.34]} p={[0, 0.58, 0]} c={look.capColor ?? "#d23c3c"} />
          <Box s={[1.2, 0.08, 0.6]} p={[0, 0.42, -0.9]} c={look.capColor ?? "#d23c3c"} />
          <Box s={[0.5, 0.12, 0.05]} p={[0, 0.62, 0.68]} c="#ffffff" />
        </>
      );
    case "cap":
      return (
        <>
          <Box s={[1.34, 0.4, 1.34]} p={[0, 0.58, 0]} c={look.capColor ?? "#2d4a3a"} />
          <Box s={[1.3, 0.08, 0.6]} p={[0, 0.42, 0.85]} c={look.capColor ?? "#2d4a3a"} />
          <Box s={[1.34, 0.3, 0.2]} p={[0, 0.25, -0.6]} c={h} />
        </>
      );
    default:
      return (
        <>
          <Box s={[1.32, 0.28, 1.32]} p={[0, 0.6, 0]} c={h} />
          <Box s={[1.32, 0.55, 0.3]} p={[0, 0.35, -0.52]} c={h} />
          <Box s={[1.32, 0.16, 0.2]} p={[0, 0.45, 0.58]} c={h} />
        </>
      );
  }
};

export const Character: React.FC<{
  look: Look;
  face?: Face;
  pose?: Pose;
  position?: [number, number, number];
  rotY?: number;
  scale?: number;
}> = ({ look, face = "neutral", pose = {}, position = [0, 0, 0], rotY = 0, scale = 1 }) => {
  const shoes = look.shoes ?? "#2b2b2b";
  const sitDrop = pose.sit ? 1.6 : 0;
  const legRot = pose.sit ? -Math.PI / 2 : 0;
  const torn = look.zombie;
  return (
    <group
      position={position}
      rotation={[pose.lie ? -Math.PI / 2 : 0, rotY, 0]}
      scale={scale}
    >
      <group position={[0, -sitDrop, 0]} rotation={[pose.lean ?? 0, 0, 0]}>
        {/* legs */}
        {([-0.5, 0.5] as const).map((x, i) => (
          <group
            key={x}
            position={[x, 2, 0]}
            rotation={[legRot + (i === 0 ? pose.legL ?? 0 : pose.legR ?? 0), 0, 0]}
          >
            <Box s={[0.98, 1.7, 0.98]} p={[0, -0.85, 0]} c={look.pants} round={0.12} />
            <Box s={[1.02, 0.3, 1.1]} p={[0, -1.82, 0.05]} c={shoes} round={0.1} />
            <Box s={[1.04, 0.08, 1.14]} p={[0, -1.96, 0.05]} c={shade(shoes, 0.55)} />
            {torn && i === 0 ? <Box s={[0.6, 0.4, 0.02]} p={[0, -1.2, 0.5]} c={look.skin} /> : null}
          </group>
        ))}
        {/* torso */}
        <Box s={[2, 2, 1]} p={[0, 3, 0]} c={look.shirt} round={0.14} />
        <Box s={[2.04, 0.22, 1.04]} p={[0, 2.08, 0]} c={shade(look.pants, 0.6)} />
        <Box s={[0.3, 0.18, 0.06]} p={[0, 2.08, 0.53]} c="#c8b070" />
        <Box s={[0.9, 0.16, 0.04]} p={[0, 3.92, 0.5]} c={shade(look.shirt, 0.78)} />
        {torn ? (
          <>
            <Box s={[0.5, 0.5, 0.02]} p={[0.45, 2.6, 0.51]} c={look.skin} />
            <Box s={[0.3, 0.3, 0.02]} p={[-0.5, 3.4, 0.51]} c="#5b2b2b" />
          </>
        ) : null}
        {look.patch ? <Box s={[0.5, 0.5, 0.02]} p={[-0.5, 3.4, 0.51]} c={look.patch} /> : null}
        {look.helmet ? (
          <>
            <Box s={[2.2, 0.35, 1.2]} p={[0, 4.05, 0]} c="#d8d8d8" />
            <Box s={[1.4, 1.8, 0.7]} p={[0, 3.0, -0.85]} c="#e8e8e8" />
          </>
        ) : null}
        {look.backpack ? (
          <>
            <Box s={[1.5, 1.6, 0.6]} p={[0, 3.0, -0.8]} c={look.backpack} />
            <Box s={[0.18, 1.9, 0.08]} p={[-0.55, 3.0, 0.52]} c="#222" />
            <Box s={[0.18, 1.9, 0.08]} p={[0.55, 3.0, 0.52]} c="#222" />
          </>
        ) : null}
        {/* arms */}
        {([-1.5, 1.5] as const).map((x, i) => (
          <group
            key={x}
            position={[x, 3.85, 0]}
            rotation={[
              i === 0 ? pose.armL ?? 0 : pose.armR ?? 0,
              0,
              i === 0 ? pose.armLz ?? 0 : pose.armRz ?? 0,
            ]}
          >
            <Box s={[0.96, 1.4, 0.96]} p={[0, -0.55, 0]} c={look.shirt} round={0.12} />
            <Box s={[0.98, 0.14, 0.98]} p={[0, -1.18, 0]} c={shade(look.shirt, 0.75)} />
            <Box s={[0.9, 0.55, 0.9]} p={[0, -1.52, 0]} c={look.skin} round={0.14} />
          </group>
        ))}
        {/* head */}
        <group position={[0, 4.62, 0]} rotation={[pose.headX ?? 0, pose.headY ?? 0, pose.headZ ?? 0]}>
          <Box s={[1.25, 1.25, 1.25]} c={look.skin} round={0.16} />
          <Box s={[0.5, 0.3, 0.5]} p={[0, -0.72, 0]} c={shade(look.skin, 0.88)} />
          <FaceFeatures face={look.zombie ? "zombie" : face} />
          <Hair look={look} />
          {look.earpiece ? (
            <>
              <Box s={[0.1, 0.22, 0.18]} p={[0.66, -0.05, 0]} c="#111" />
              <Box s={[0.05, 0.06, 0.06]} p={[0.72, 0.0, 0.0]} c="#ff3b2a" e="#ff2010" ei={2} />
            </>
          ) : null}
          {look.mustache ? <Box s={[0.6, 0.14, 0.08]} p={[0, -0.13, 0.65]} c={look.mustache} /> : null}
          {look.headset ? (
            <>
              <Box s={[1.45, 0.12, 0.3]} p={[0, 0.72, 0]} c="#222" />
              <Box s={[0.14, 0.5, 0.5]} p={[-0.68, 0, 0]} c="#222" />
              <Box s={[0.14, 0.5, 0.5]} p={[0.68, 0, 0]} c="#222" />
              <Box s={[0.06, 0.06, 0.6]} p={[-0.6, -0.3, 0.35]} c="#222" />
              <Box s={[0.12, 0.12, 0.12]} p={[-0.45, -0.32, 0.66]} c="#111" e="#ff2a1a" ei={1.5} />
            </>
          ) : null}
          {look.helmet ? (
            <mesh>
              <sphereGeometry args={[1.08, 20, 16]} />
              <meshStandardMaterial color="#cfe8ff" transparent opacity={0.28} roughness={0.05} metalness={0.2} />
            </mesh>
          ) : null}
          {look.beard ? (
            <>
              <Box s={[1.28, 0.45, 0.2]} p={[0, -0.45, 0.58]} c={look.beard} />
              <Box s={[0.5, 0.12, 0.05]} p={[0, -0.18, 0.66]} c={look.beard} />
            </>
          ) : null}
        </group>
      </group>
    </group>
  );
};

// Helpers for motion
export const walk = (t: number, speed = 7, amp = 0.7): Pose => {
  const s = Math.sin(t * speed) * amp;
  return { armL: s, armR: -s, legL: -s, legR: s };
};
export const breathe = (t: number, amp = 0.03): Pose => ({
  armL: Math.sin(t * 2) * amp,
  armR: -Math.sin(t * 2) * amp,
  headX: Math.sin(t * 1.3) * amp,
});

export const wave = (t: number, arm: "L" | "R" = "R"): Pose =>
  arm === "R"
    ? { armR: -2.8, armRz: -0.35 + Math.sin(t * 9) * 0.35 }
    : { armL: -2.8, armLz: 0.35 + Math.sin(t * 9) * 0.35 };
