import React from "react";
import { B } from "../../lib/Sets";
import { Character, walk } from "../../lib/Character";
import type { Look } from "../../lib/Character";
import { Bus, PerfectHouse, RoundTree, THEMES } from "../smiling/Brightwater";
import { TextSign } from "../smiling/Props";
import { ZOMBIES } from "../../lib/cast";

type V3 = [number, number, number];

/* ---------------- cast (original) ---------------- */
export const JONAH: Look = { skin: "#e9b98f", shirt: "#3a7d5a", pants: "#3a3f52", shoes: "#e8e8e8", hair: "#4a2f1d", hairStyle: "short" };
export const IVY: Look = { skin: "#c68b59", shirt: "#8a3a2a", pants: "#2b2b33", shoes: "#3a2a1a", hair: "#141010", hairStyle: "long" };
export const MAYOR: Look = { skin: "#f0c8a0", shirt: "#2a2f45", pants: "#2a2f45", shoes: "#111", hair: "#d0d0d0", hairStyle: "short", mustache: "#bdbdbd" };
export const DAWSON: Look = { skin: "#8aa070", shirt: "#c9a86a", pants: "#5a5a6a", shoes: "#3a2a1a", hair: "#9a9a9a", hairStyle: "short", zombie: true };
export const SURVIVORS: Look[] = [
  { skin: "#f2c8a0", shirt: "#5a7a9a", pants: "#3a3a3a", hair: "#7a4a2a", hairStyle: "bun" },
  { skin: "#8d5a3b", shirt: "#a07a3a", pants: "#2b2b33", hair: "#141010", hairStyle: "short" },
  { skin: "#efc9a4", shirt: "#6a8a5a", pants: "#4a4a5a", hair: "#e6e6e6", hairStyle: "bun" },
  { skin: "#c68b59", shirt: "#9a4a5a", pants: "#2f3a5e", hair: "#2a1a10", hairStyle: "long" },
  { skin: "#f3cfa8", shirt: "#d8a040", pants: "#3a3f52", hair: "#c0662e", hairStyle: "spiky" },
];

export const HockeyStick: React.FC<{ p?: V3; r?: V3 }> = ({ p, r }) => (
  <group position={p} rotation={r}>
    <B s={[0.14, 3.4, 0.14]} p={[0, -1.7, 0]} c="#c9a06a" />
    <B s={[0.16, 0.25, 0.9]} p={[0, -3.35, 0.38]} c="#1b1b1b" />
    <B s={[0.17, 0.3, 0.17]} p={[0, -0.6, 0]} c="#1b1b1b" />
  </group>
);

/* ---------------- kitchen with the birthday cake ---------------- */
export const Kitchen: React.FC<{ t: number; flame?: number; dark?: boolean }> = ({ t, flame = 1, dark }) => {
  const fl = flame * (0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7));
  return (
    <>
      <color attach="background" args={["#0a0b0d"]} />
      <ambientLight intensity={dark ? 0.06 : 0.35} color="#c0c8d0" />
      {!dark ? <pointLight position={[5, 5, -2]} intensity={40} color="#cfd8e0" distance={14} decay={1.5} /> : null}
      <pointLight position={[0, 3.6, -2]} intensity={fl * 12} color="#ffb04a" distance={7} decay={1.8} />
      <B s={[12, 0.2, 12]} p={[0, -0.1, 0]} c="#c8c0b0" />
      {Array.from({ length: 6 }).map((_, i) =>
        Array.from({ length: 6 }).map((__, j) => ((i + j) % 2 ? <B key={`${i}${j}`} s={[2, 0.02, 2]} p={[-5 + i * 2, 0.01, -5 + j * 2]} c="#a8a090" /> : null)),
      )}
      <B s={[12, 8, 0.2]} p={[0, 4, -6]} c="#e8dcc0" />
      <B s={[0.2, 8, 12]} p={[-6, 4, 0]} c="#e8dcc0" />
      <B s={[0.2, 8, 12]} p={[6, 4, 0]} c="#e8dcc0" />
      {/* window */}
      <B s={[3.4, 2.4, 0.1]} p={[2.5, 4.6, -5.88]} c={dark ? "#2a3038" : "#c8d4dc"} e={dark ? "#141820" : "#b8c4cc"} ei={0.6} />
      <B s={[3.6, 0.15, 0.2]} p={[2.5, 4.6, -5.85]} c="#ffffff" />
      <B s={[0.15, 2.6, 0.2]} p={[2.5, 4.6, -5.85]} c="#ffffff" />
      {/* counters */}
      <B s={[12, 2.6, 1.6]} p={[0, 1.3, -5.1]} c="#7a9ab0" />
      <B s={[12, 0.2, 1.7]} p={[0, 2.7, -5.1]} c="#e8e8e8" />
      <B s={[2, 4.8, 1.8]} p={[-4.8, 2.4, -5.0]} c="#d8d8d8" />
      {/* table + cake */}
      <B s={[4, 0.25, 3]} p={[0, 2.4, -1.6]} c="#a87a4a" />
      {[
        [-1.7, -2.9],
        [1.7, -2.9],
        [-1.7, -0.3],
        [1.7, -0.3],
      ].map(([x, z], i) => (
        <B key={i} s={[0.25, 2.4, 0.25]} p={[x, 1.2, z]} c="#7a5a3a" />
      ))}
      <mesh position={[0, 2.85, -1.6]}>
        <cylinderGeometry args={[0.8, 0.8, 0.7, 20]} />
        <meshStandardMaterial color="#f5e6f0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.21, -1.6]}>
        <cylinderGeometry args={[0.82, 0.82, 0.08, 20]} />
        <meshStandardMaterial color="#e07ab0" />
      </mesh>
      <B s={[0.08, 0.45, 0.08]} p={[0, 3.47, -1.6]} c="#7ab0e0" />
      {flame > 0.02 ? (
        <mesh position={[0, 3.78, -1.6]} scale={[1, 0.6 + fl * 0.6, 1]}>
          <coneGeometry args={[0.07, 0.28, 8]} />
          <meshBasicMaterial color="#ffcf6a" toneMapped={false} />
        </mesh>
      ) : null}
      <B s={[1.2, 0.1, 1.2]} p={[2.2, 2.56, -1.2]} c="#ffffff" />
    </>
  );
};

/* ---------------- the walled town ---------------- */
const Container: React.FC<{ p: V3; rot: number; c: string }> = ({ p, rot, c }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <B s={[10, 4.6, 4.6]} p={[0, 2.3, 0]} c={c} />
    {Array.from({ length: 9 }).map((_, i) => (
      <B key={i} s={[0.15, 4.4, 4.7]} p={[-4.4 + i * 1.1, 2.3, 0]} c={c} />
    ))}
  </group>
);

export const WALL_R = 42;
export const Fort: React.FC<{
  t: number;
  night?: boolean;
  outside?: boolean;
  window?: number;
  ring?: number;
  turn?: number;
  surge?: number;
  toward?: V3;
  rope?: boolean;
  hallOpen?: boolean;
  emptyJar?: boolean;
}> = ({ t, night, outside, window = 1, ring = 0, turn = 0, surge = 0, toward, rope = true, hallOpen, emptyJar }) => {
  const segs = 26;
  return (
    <>
      <color attach="background" args={[night ? "#18243a" : "#9fb4c4"]} />
      <fog attach="fog" args={[night ? "#1c2a40" : "#b4c4cc", night ? 25 : 40, night ? 150 : 220]} />
      <hemisphereLight args={[night ? "#7a94c8" : "#ffffff", night ? "#1a2230" : "#5a6a4a", night ? 1.15 : 1.0]} />
      <directionalLight position={[-30, 60, 120]} intensity={night ? 1.3 : 1.3} color={night ? "#a8c0ff" : "#fff1dc"} />
      <B s={[500, 0.2, 500]} p={[0, -0.1, 0]} c={night ? "#3a4630" : "#6f8a4e"} />
      {/* wall ring: alternating school buses and containers */}
      {Array.from({ length: segs }).map((_, i) => {
        const a = (i / segs) * Math.PI * 2;
        const x = Math.sin(a) * WALL_R;
        const z = Math.cos(a) * WALL_R;
        const rot = a + Math.PI / 2;
        return i % 2 ? (
          <Container key={i} p={[x, 0, z]} rot={rot} c={["#a8402e", "#2e5a8a", "#4a7a3a"][i % 3]} />
        ) : (
          <group key={i} position={[x, 0, z]} rotation={[0, rot + Math.PI / 2, 0]}>
            <Bus p={[0, 0, 0]} />
          </group>
        );
      })}
      {/* spikes on top of the wall */}
      {Array.from({ length: 52 }).map((_, i) => {
        const a = (i / 52) * Math.PI * 2;
        return <B key={i} s={[0.2, 2, 0.2]} p={[Math.sin(a) * WALL_R, 5.6, Math.cos(a) * WALL_R]} r={[0.3, a, 0]} c="#6a6a6a" />;
      })}
      {/* inside: houses, tents, garden, stage */}
      {[
        [-20, -14, 0.6],
        [-26, 6, 1.3],
        [18, -18, -0.5],
        [24, 8, -1.4],
      ].map(([x, z, r], i) => (
        <PerfectHouse key={i} p={[x, 0, z]} rot={r} th={THEMES.brightwater} />
      ))}
      {[
        [-8, 16],
        [8, 18],
        [0, 22],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.4, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[2.4, 2.8, 4]} />
            <meshStandardMaterial color={["#d8c08a", "#8aa0b8", "#b88a8a"][i]} />
          </mesh>
        </group>
      ))}
      {[-30, 30].map((x, i) => (
        <RoundTree key={i} p={[x, 0, -4]} s={1.2} />
      ))}
      {/* town hall with the Mayor's window */}
      <group position={[0, 0, -26]}>
        <B s={[12, 12, 8]} p={[0, 6, 0]} c="#d8cfc0" />
        <B s={[13, 1, 9]} p={[0, 12.5, 0]} c="#8a7a6a" />
        <B s={[2.4, 2.4, 0.2]} p={[0, 9, 4.05]} c={night ? "#ffd27a" : "#9ab0c0"} e="#ffb84a" ei={night ? window * 2 : 0} />
        {hallOpen ? (
          <>
            <B s={[2.6, 3.6, 0.2]} p={[0, 1.8, 4.02]} c="#0c0c0c" />
            <B s={[2.6, 3.6, 0.2]} p={[1.6, 0.6, 5.2]} r={[-1.3, 0.4, 0]} c="#5a3a24" />
          </>
        ) : (
          <B s={[2.6, 3.6, 0.2]} p={[0, 1.8, 4.05]} c="#5a3a24" />
        )}
        {night && window > 0 ? <pointLight position={[0, 9, 6]} intensity={window * 30} color="#ffbf6b" distance={14} decay={1.6} /> : null}
      </group>
      {/* stage + jar */}
      <group position={[0, 0, -10]}>
        <B s={[10, 1, 5]} p={[0, 0.5, 0]} c="#8a6a4a" />
        <B s={[1.2, 2.2, 1]} p={[0, 2.1, 0.6]} c="#5a3a24" />
        <mesh position={[0, 3.8, 0.6]}>
          <cylinderGeometry args={[0.55, 0.55, 1.2, 16]} />
          <meshStandardMaterial color="#cfeeff" transparent opacity={0.45} roughness={0.1} />
        </mesh>
        {Array.from({ length: emptyJar ? 0 : 10 }).map((_, i) => (
          <B key={i} s={[0.3, 0.05, 0.2]} p={[Math.sin(i * 2.4) * 0.3, 3.35 + (i % 4) * 0.12, 0.6 + Math.cos(i * 2.4) * 0.3]} r={[0, i, 0.3]} c="#fff8e0" />
        ))}
        {/* bunting */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-5.5 + i, 6 - Math.sin((i / 11) * Math.PI) * 0.8, -1.5]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.35, 0.7, 3]} />
            <meshStandardMaterial color={["#e0475f", "#ffd34a", "#3a7ad0"][i % 3]} />
          </mesh>
        ))}
        <B s={[0.2, 6.5, 0.2]} p={[-5.8, 3.25, -1.5]} c="#5a3a24" />
        <B s={[0.2, 6.5, 0.2]} p={[5.8, 3.25, -1.5]} c="#5a3a24" />
      </group>
      {outside ? <Horde t={t} turn={turn} surge={surge} toward={toward} /> : null}
      {outside ? <BellTower p={[0, 0, 95]} t={t} ring={ring} /> : null}
      {outside && rope ? (
        // the rope from the bell all the way back to the Mayor's window
        <mesh position={[0, 14.2, 36.5]} rotation={[Math.atan2(117, 10.4), 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 117.5, 6]} />
          <meshStandardMaterial color="#8a7a5a" />
        </mesh>
      ) : null}
      <TextSign text={"LAST SAFE TOWN\nKEEP QUIET"} p={[0, 7.6, WALL_R + 2.4]} r={[0, 0, 0]} w={6} h={2} bg="#e8e0c8" fg="#8a1a1a" />
    </>
  );
};

/* ---------------- the horde ---------------- */
// deterministic scatter of the dead around the bell tower
const HORDE: [number, number, number][] = Array.from({ length: 70 }).map((_, i) => {
  const a = i * 2.399;
  const r = 6 + Math.sqrt(i) * 4.2;
  return [Math.sin(a) * r, 95 + Math.cos(a) * r * 0.9, i % ZOMBIES.length];
});
export const Horde: React.FC<{ t: number; turn?: number; surge?: number; toward?: V3 }> = ({ t, turn = 0, surge = 0, toward = [0, 0, 95] }) => (
  <>
    {HORDE.map(([x, z, k], i) => {
      const face = Math.atan2(toward[0] - x, toward[2] - z);
      const idle = (i * 1.3) % (Math.PI * 2);
      const ry = idle * (1 - turn) + face * turn;
      const mx = x + (toward[0] - x) * surge * 0.35;
      const mz = z + (toward[2] - z) * surge * 0.35;
      return (
        <Character
          key={i}
          look={ZOMBIES[k]}
          pose={surge > 0 ? walk(t + i, 5, 0.5) : { armL: -1.3, armR: -1.2, headZ: Math.sin(t * 0.8 + i) * 0.15, lean: 0.1 }}
          position={[mx + Math.sin(t * 0.7 + i) * 0.15, 0, mz]}
          rotY={ry}
        />
      );
    })}
  </>
);

export const BellTower: React.FC<{ p: V3; t: number; ring?: number }> = ({ p, t, ring = 0 }) => {
  const swing = ring * Math.sin(t * 6) * 0.5;
  return (
    <group position={p}>
      {[
        [-2, -2],
        [2, -2],
        [-2, 2],
        [2, 2],
      ].map(([x, z], i) => (
        <B key={i} s={[0.5, 16, 0.5]} p={[x, 8, z]} c="#6a4a2a" />
      ))}
      {[4, 8, 12].map((y) => (
        <React.Fragment key={y}>
          <B s={[4.5, 0.3, 0.3]} p={[0, y, -2]} c="#6a4a2a" />
          <B s={[4.5, 0.3, 0.3]} p={[0, y, 2]} c="#6a4a2a" />
          <B s={[0.3, 0.3, 4.5]} p={[-2, y, 0]} c="#6a4a2a" />
          <B s={[0.3, 0.3, 4.5]} p={[2, y, 0]} c="#6a4a2a" />
        </React.Fragment>
      ))}
      {/* ladder */}
      {Array.from({ length: 16 }).map((_, i) => (
        <B key={i} s={[1.4, 0.15, 0.15]} p={[0, 0.8 + i, -2.3]} c="#8a6a4a" />
      ))}
      <B s={[0.15, 16, 0.15]} p={[-0.7, 8, -2.3]} c="#8a6a4a" />
      <B s={[0.15, 16, 0.15]} p={[0.7, 8, -2.3]} c="#8a6a4a" />
      <B s={[5, 0.4, 5]} p={[0, 16, 0]} c="#7a5a3a" />
      <mesh position={[0, 21, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4, 2.6, 4]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <B s={[0.3, 3.4, 0.3]} p={[-1.8, 18, 0]} c="#6a4a2a" />
      <B s={[0.3, 3.4, 0.3]} p={[1.8, 18, 0]} c="#6a4a2a" />
      <B s={[4, 0.3, 0.3]} p={[0, 19.6, 0]} c="#6a4a2a" />
      <group position={[0, 19.4, 0]} rotation={[swing, 0, 0]}>
        <mesh position={[0, -1.1, 0]}>
          <cylinderGeometry args={[0.7, 1.3, 1.8, 16, 1, true]} />
          <meshStandardMaterial color="#b8862e" metalness={0.7} roughness={0.35} side={2} />
        </mesh>
        <mesh position={[0, -2.1, 0]}>
          <sphereGeometry args={[0.25, 10, 10]} />
          <meshStandardMaterial color="#6a4a1a" metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
