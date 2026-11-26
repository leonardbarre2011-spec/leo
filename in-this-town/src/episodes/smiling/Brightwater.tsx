import React from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { B } from "../../lib/Sets";

type V3 = [number, number, number];

/* ---------------- "too perfect" town: Brightwater ---------------- */

const Cyl: React.FC<{ a: [number, number, number, number?]; p?: V3; r?: V3; c: string; e?: string; ei?: number }> = ({ a, p, r, c, e, ei }) => (
  <mesh position={p} rotation={r}>
    <cylinderGeometry args={[a[0], a[1], a[2], a[3] ?? 20]} />
    <meshStandardMaterial color={c} roughness={0.6} emissive={e ?? "#000"} emissiveIntensity={ei ?? 0} />
  </mesh>
);

// Every house is identical on purpose.
export type Theme = { wall: string; roof: string; door: string; grass: string; sky: string; fog: string; road?: string };
export const THEMES: Record<string, Theme> = {
  brightwater: { wall: "#f4efe4", roof: "#5f8fc9", door: "#d64545", grass: "#62c15a", sky: "#8fd0ff", fog: "#cdeeff" },
  snow: { wall: "#e8eef5", roof: "#8a4a5a", door: "#3a6a4a", grass: "#f2f6fb", sky: "#b9c9dc", fog: "#dfe8f2" },
  desert: { wall: "#f0d9a8", roof: "#c0603a", door: "#3a7a8a", grass: "#e3c27a", sky: "#ffcf8f", fog: "#ffe3b8" },
  candy: { wall: "#ffe0ef", roof: "#c05ab0", door: "#5ab0c0", grass: "#9fe0b0", sky: "#ffb8de", fog: "#ffd8ec" },
  night: { wall: "#c9d0e8", roof: "#3a3a6a", door: "#c08a2a", grass: "#2f5a3a", sky: "#1a2347", fog: "#2a3360" },
};

export const PerfectHouse: React.FC<{ p: V3; rot: number; th?: Theme }> = ({ p, rot, th = THEMES.brightwater }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <B s={[8, 5.5, 7]} p={[0, 2.75, 0]} c={th.wall} />
    <mesh position={[0, 7.0, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[6.3, 3, 4]} />
      <meshStandardMaterial color={th.roof} roughness={0.8} />
    </mesh>
    <B s={[1.6, 3, 0.2]} p={[0, 1.5, 3.55]} c={th.door} />
    <B s={[1.6, 1.4, 0.2]} p={[-2.4, 3.4, 3.55]} c="#bfe3ff" />
    <B s={[1.6, 1.4, 0.2]} p={[2.4, 3.4, 3.55]} c="#bfe3ff" />
    <B s={[1.8, 0.25, 0.3]} p={[-2.4, 2.6, 3.7]} c="#ffffff" />
    <B s={[1.8, 0.25, 0.3]} p={[2.4, 2.6, 3.7]} c="#ffffff" />
    {/* lawn + picket fence */}
    <B s={[10, 0.12, 6]} p={[0, 0.06, 6.5]} c={th.grass} />
    {Array.from({ length: 13 }).map((_, i) => (
      <B key={i} s={[0.25, 1.2, 0.15]} p={[-4.8 + i * 0.8, 0.6, 9.4]} c="#ffffff" />
    ))}
    <B s={[10, 0.15, 0.12]} p={[0, 0.9, 9.4]} c="#ffffff" />
    <B s={[1, 0.6, 1]} p={[3.5, 0.3, 5.5]} c="#e07ab0" />
    <B s={[1, 0.6, 1]} p={[-3.5, 0.3, 5.5]} c="#ffd34a" />
  </group>
);

export const RoundTree: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <B s={[0.8, 3, 0.8]} p={[0, 1.5, 0]} c="#7a4f2a" />
    <B s={[3.4, 3.0, 3.4]} p={[0, 4.4, 0]} c="#3fae4a" />
    <B s={[2.4, 1.6, 2.4]} p={[0, 6.4, 0]} c="#4cc457" />
  </group>
);

export const ClockTower: React.FC<{ p: V3; hour?: number; minute?: number }> = ({ p, hour = 8, minute = 0 }) => {
  const mAng = -(minute / 60) * Math.PI * 2;
  const hAng = -((hour % 12) / 12 + minute / 720) * Math.PI * 2;
  return (
    <group position={p}>
      <B s={[5, 15, 5]} p={[0, 7.5, 0]} c="#e9dcc0" />
      <B s={[5.6, 0.6, 5.6]} p={[0, 15.2, 0]} c="#c9b48a" />
      <mesh position={[0, 17.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.2, 4.4, 4]} />
        <meshStandardMaterial color="#5f8fc9" roughness={0.7} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r) => (
        <group key={r} rotation={[0, r, 0]}>
          <group position={[0, 12, 2.55]}>
            <Cyl a={[1.7, 1.7, 0.2, 32]} r={[Math.PI / 2, 0, 0]} c="#fffdf5" />
            <Cyl a={[1.85, 1.85, 0.12, 32]} p={[0, 0, -0.06]} r={[Math.PI / 2, 0, 0]} c="#3a3a3a" />
            <group rotation={[0, 0, mAng]} position={[0, 0, 0.14]}>
              <B s={[0.12, 1.4, 0.06]} p={[0, 0.65, 0]} c="#1b1b1b" />
            </group>
            <group rotation={[0, 0, hAng]} position={[0, 0, 0.18]}>
              <B s={[0.18, 0.95, 0.06]} p={[0, 0.42, 0]} c="#1b1b1b" />
            </group>
            {Array.from({ length: 12 }).map((_, i) => (
              <B key={i} s={[0.12, 0.3, 0.05]} p={[Math.sin((i / 12) * Math.PI * 2) * 1.45, Math.cos((i / 12) * Math.PI * 2) * 1.45, 0.12]} r={[0, 0, -(i / 12) * Math.PI * 2]} c="#1b1b1b" />
            ))}
          </group>
        </group>
      ))}
    </group>
  );
};

export const Bakery: React.FC<{ p: V3; rot?: number }> = ({ p, rot = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <B s={[9, 6, 7]} p={[0, 3, 0]} c="#f7c6d0" />
    <B s={[9.4, 0.6, 7.4]} p={[0, 6.3, 0]} c="#e88aa0" />
    {/* striped awning */}
    {Array.from({ length: 9 }).map((_, i) => (
      <B key={i} s={[1, 0.25, 2]} p={[-4 + i, 4.2, 4.3]} r={[0.35, 0, 0]} c={i % 2 ? "#ffffff" : "#e0475f"} />
    ))}
    <B s={[3.2, 2.4, 0.2]} p={[-2, 1.9, 3.55]} c="#fff1c9" e="#ffd27a" ei={0.3} />
    <B s={[1.6, 3, 0.2]} p={[2.6, 1.5, 3.55]} c="#7a4a2a" />
    {/* giant bread sign */}
    <group position={[0, 7.6, 2.8]}>
      <B s={[3.6, 1.4, 0.8]} c="#d79a4a" />
      <B s={[0.25, 1.0, 0.1]} p={[-0.9, 0.3, 0.42]} r={[0, 0, 0.4]} c="#b9782f" />
      <B s={[0.25, 1.0, 0.1]} p={[0, 0.3, 0.42]} r={[0, 0, 0.4]} c="#b9782f" />
      <B s={[0.25, 1.0, 0.1]} p={[0.9, 0.3, 0.42]} r={[0, 0, 0.4]} c="#b9782f" />
    </group>
  </group>
);

export const BusStop: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Cyl a={[0.1, 0.1, 3.4]} p={[0, 1.7, 0]} c="#6d6d6d" />
    <B s={[1.2, 0.8, 0.1]} p={[0, 3.3, 0]} c="#2f6fd6" />
    <B s={[0.8, 0.3, 0.12]} p={[0, 3.3, 0]} c="#ffffff" />
  </group>
);

export const Bus: React.FC<{ p: V3; rot?: number }> = ({ p, rot = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <B s={[3.4, 3.6, 10]} p={[0, 2.4, 0]} c="#ffc83a" />
    <B s={[3.5, 0.5, 10.1]} p={[0, 1.0, 0]} c="#2f6fd6" />
    {[-3, -1, 1, 3].map((z) => (
      <React.Fragment key={z}>
        <B s={[0.1, 1.2, 1.6]} p={[1.72, 3.2, z]} c="#bfe3ff" />
        <B s={[0.1, 1.2, 1.6]} p={[-1.72, 3.2, z]} c="#bfe3ff" />
      </React.Fragment>
    ))}
    <B s={[3, 1.4, 0.1]} p={[0, 3.2, -5.02]} c="#bfe3ff" />
    <B s={[2.6, 0.45, 0.12]} p={[0, 4.3, -5.02]} c="#1b1b1b" />
    <B s={[1.4, 0.2, 0.14]} p={[0, 4.3, -5.06]} c="#ffd34a" e="#ffb000" ei={1} />
    {[
      [-1.6, -3.4],
      [1.6, -3.4],
      [-1.6, 3.4],
      [1.6, 3.4],
    ].map(([x, z], i) => (
      <Cyl key={i} a={[0.7, 0.7, 0.5]} p={[x, 0.7, z]} r={[0, 0, Math.PI / 2]} c="#222" />
    ))}
    <B s={[0.5, 0.4, 0.12]} p={[-1.2, 1.6, -5.06]} c="#fff8d0" e="#fff3a0" ei={1} />
    <B s={[0.5, 0.4, 0.12]} p={[1.2, 1.6, -5.06]} c="#fff8d0" e="#fff3a0" ei={1} />
  </group>
);

export const Dog: React.FC<{ p: V3; rot?: number; bark?: number; t: number }> = ({ p, rot = 0, bark = 0, t }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <B s={[1.4, 1.2, 2.4]} p={[0, 1.4, 0]} c="#c98a4a" />
    {[
      [-0.45, -0.8],
      [0.45, -0.8],
      [-0.45, 0.8],
      [0.45, 0.8],
    ].map(([x, z], i) => (
      <B key={i} s={[0.4, 0.9, 0.4]} p={[x, 0.45, z]} c="#a86f35" />
    ))}
    <group position={[0, 2.3, 1.3]} rotation={[-bark * 0.3, 0, 0]}>
      <B s={[1.2, 1.1, 1.1]} c="#c98a4a" />
      <B s={[0.6, 0.45, 0.6]} p={[0, -0.15 + bark * 0.05, 0.75]} c="#e3b07a" />
      <B s={[0.25, 0.18, 0.1]} p={[0, 0.05, 1.06]} c="#1b1b1b" />
      <B s={[0.5, 0.12 + bark * 0.25, 0.5]} p={[0, -0.45 - bark * 0.12, 0.72]} c="#7a2a2a" />
      <B s={[0.14, 0.18, 0.05]} p={[-0.3, 0.25, 0.56]} c="#1b1b1b" />
      <B s={[0.14, 0.18, 0.05]} p={[0.3, 0.25, 0.56]} c="#1b1b1b" />
      <B s={[0.3, 0.6, 0.2]} p={[-0.6, 0.35, -0.1]} r={[0, 0, 0.3]} c="#8a5a2a" />
      <B s={[0.3, 0.6, 0.2]} p={[0.6, 0.35, -0.1]} r={[0, 0, -0.3]} c="#8a5a2a" />
    </group>
    <group position={[0, 1.8, -1.2]} rotation={[0.6, Math.sin(t * 14) * 0.5, 0]}>
      <B s={[0.25, 0.25, 0.9]} p={[0, 0, -0.45]} c="#a86f35" />
    </group>
  </group>
);

export const Bird: React.FC<{ p: V3; heading?: number; flap?: number; red?: number; s?: number; pitch?: number }> = ({
  p,
  heading = 0,
  flap = 0,
  red = 0,
  s = 1,
  pitch = 0,
}) => (
  <group position={p} rotation={[pitch, heading, 0]} scale={s}>
    <B s={[0.8, 0.7, 1.4]} c="#4a8fe0" />
    <B s={[0.7, 0.4, 0.9]} p={[0, -0.2, 0.15]} c="#f2f2f2" />
    <B s={[0.7, 0.7, 0.7]} p={[0, 0.35, 0.8]} c="#4a8fe0" />
    <B s={[0.24, 0.18, 0.4]} p={[0, 0.3, 1.3]} c="#ffa62b" />
    <B s={[0.06, 0.2, 0.2]} p={[-0.37, 0.45, 0.95]} c="#111" />
    {/* the right eye holds the camera */}
    <B s={[0.06, 0.2, 0.2]} p={[0.37, 0.45, 0.95]} c="#111" />
    {red > 0.5 ? <B s={[0.04, 0.07, 0.07]} p={[0.405, 0.45, 0.95]} c="#ff4a3a" e="#ff2010" ei={3} /> : null}
    <B s={[0.5, 0.15, 0.6]} p={[0, 0.05, -0.95]} c="#2f6fc0" />
    <group position={[-0.4, 0.15, 0]} rotation={[0, 0, flap]}>
      <B s={[1.3, 0.1, 0.8]} p={[-0.65, 0, 0]} c="#3a7bd0" />
    </group>
    <group position={[0.4, 0.15, 0]} rotation={[0, 0, -flap]}>
      <B s={[1.3, 0.1, 0.8]} p={[0.65, 0, 0]} c="#3a7bd0" />
    </group>
  </group>
);

/* the bird's loop: over the bakery -> left at the clock tower -> behind the trees */
const LOOP = new CatmullRomCurve3(
  [
    [-26, 12, 10],
    [-15, 13, -2],
    [-6, 15, -12],
    [0, 16, -20],
    [10, 13, -24],
    [20, 9, -30],
    [26, 6, -36],
  ].map(([x, y, z]) => new Vector3(x, y, z)),
);
export const birdOnLoop = (u: number) => {
  const k = Math.min(1, Math.max(0, u));
  const pt = LOOP.getPointAt(k);
  const tan = LOOP.getTangentAt(k);
  return { p: [pt.x, pt.y, pt.z] as V3, heading: Math.atan2(tan.x, tan.z) };
};

export const Brightwater: React.FC<{ t: number; tint?: "day" | "eerie"; clockMin?: number; clockHour?: number; theme?: string; sun?: number }> = ({
  t,
  tint = "day",
  clockMin = 0,
  clockHour = 8,
  theme = "brightwater",
  sun = 0,
}) => {
  const th = THEMES[theme];
  const eerie = tint === "eerie";
  const houses: [number, number, number][] = [];
  for (let i = 0; i < 7; i++) {
    houses.push([-18, 8 + i * 12, Math.PI / 2]);
    houses.push([18, 8 + i * 12, -Math.PI / 2]);
  }
  return (
    <>
      <color attach="background" args={[eerie ? "#8fb3cf" : th.sky]} />
      <fog attach="fog" args={[eerie ? "#a9bccb" : th.fog, 40, 170]} />
      <hemisphereLight args={["#ffffff", "#6aa860", eerie ? 0.9 : 1.25]} />
      <directionalLight position={[30 * Math.cos(sun), 50, 25 * Math.sin(sun + 1)]} intensity={eerie ? 1.1 : theme === "night" ? 0.5 : 1.7} color="#fff4dc" />
      {/* identical clouds */}
      {[
        [-30, 40, -60],
        [10, 44, -70],
        [45, 40, -50],
        [-50, 46, -20],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x + Math.sin(t * 0.1) * 0.5, y, z]}>
          <B s={[12, 3, 6]} c="#ffffff" />
          <B s={[7, 3, 5]} p={[-2, 2.2, 0]} c="#ffffff" />
        </group>
      ))}
      <B s={[400, 0.2, 400]} p={[0, -0.1, 0]} c={th.grass} />
      {/* main street */}
      <B s={[9, 0.05, 200]} p={[0, 0.02, 40]} c="#5a5d66" />
      {Array.from({ length: 22 }).map((_, i) => (
        <B key={i} s={[0.35, 0.06, 2.6]} p={[0, 0.05, -2 + i * 7]} c="#ffffff" />
      ))}
      <B s={[3, 0.3, 200]} p={[-6, 0.15, 40]} c="#e6e1d6" />
      <B s={[3, 0.3, 200]} p={[6, 0.15, 40]} c="#e6e1d6" />
      {/* plaza */}
      <B s={[34, 0.25, 30]} p={[0, 0.12, -14]} c="#efe2c8" />
      {houses.map(([x, z, r], i) => (
        <PerfectHouse key={i} p={[x, 0, z]} rot={r} th={th} />
      ))}
      <ClockTower p={[0, 0, -18]} hour={clockHour} minute={clockMin} />
      <Bakery p={[-13, 0, -6]} rot={Math.PI / 2} />
      <BusStop p={[5.2, 0.3, 26]} />
      {/* the grove the bird disappears behind */}
      {[
        [16, -26],
        [20, -31],
        [24, -27],
        [18, -36],
        [26, -34],
        [13, -33],
      ].map(([x, z], i) => (
        <RoundTree key={i} p={[x, 0, z]} s={1.4 + (i % 2) * 0.2} />
      ))}
      {[
        [-9, 3],
        [9, 3],
        [-9, 40],
        [9, 52],
      ].map(([x, z], i) => (
        <RoundTree key={`s${i}`} p={[x, 0, z]} s={0.8} />
      ))}
    </>
  );
};

/* ------------- somewhere far away ------------- */
export const ControlRoom: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={["#020306"]} />
    <fog attach="fog" args={["#020306", 6, 30]} />
    <ambientLight intensity={0.06} />
    <B s={[30, 0.2, 30]} p={[0, -0.1, 0]} c="#15171c" />
    {/* wall of screens */}
    {Array.from({ length: 5 }).map((_, row) =>
      Array.from({ length: 7 }).map((__, col) => {
        const k = (row * 7 + col) * 1.7;
        const center = row === 2 && col === 3;
        const hue = ["#3a6fd8", "#4a9fe0", "#5ac0a0", "#e0b040", "#7a8fe0"][(row + col) % 5];
        return (
          <B
            key={`${row}-${col}`}
            s={[2.6, 1.6, 0.1]}
            p={[(col - 3) * 2.8, 1.6 + row * 1.8, -6]}
            c={center ? "#ff3b2a" : hue}
            e={center ? "#ff2010" : hue}
            ei={center ? 1.2 + 0.6 * Math.sin(t * 6) : 0.5 + 0.15 * Math.sin(t * 2 + k)}
          />
        );
      }),
    )}
    <pointLight position={[0, 5, -3]} color="#6a9fff" intensity={60} distance={18} decay={1.5} />
    <pointLight position={[0, 5.2, -4.5]} color="#ff3020" intensity={14} distance={8} decay={1.6} />
    {/* desk + consoles */}
    <B s={[10, 0.3, 2.4]} p={[0, 2.6, -2.2]} c="#22252c" />
    <B s={[10, 2.6, 0.3]} p={[0, 1.3, -1.1]} c="#1a1c22" />
    {Array.from({ length: 12 }).map((_, i) => (
      <B key={i} s={[0.3, 0.08, 0.3]} p={[-4 + i * 0.7, 2.8, -2.4]} c={i % 3 ? "#2fd16a" : "#ff8a2a"} e={i % 3 ? "#2fd16a" : "#ff8a2a"} ei={0.8 + 0.6 * Math.sin(t * 4 + i)} />
    ))}
  </>
);
