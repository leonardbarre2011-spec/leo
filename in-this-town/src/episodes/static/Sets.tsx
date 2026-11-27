import React from "react";
import { B } from "../../lib/Sets";
import type { Look } from "../../lib/Character";
import { Character } from "../../lib/Character";
import { PerfectHouse, Theme } from "../smiling/Brightwater";
import { TextSign } from "../smiling/Props";

type V3 = [number, number, number];

/* ---------------- original cast ---------------- */
export const SAM: Look = { skin: "#f1c27d", shirt: "#c0392b", pants: "#3a4a7a", shoes: "#e8e8e8", hair: "#5a3820", hairStyle: "short" };
export const LENA: Look = { skin: "#c68b59", shirt: "#f2b632", pants: "#2f3a5e", shoes: "#ffffff", hair: "#2a1a10", hairStyle: "long" };
export const THEO: Look = { skin: "#8d5a3b", shirt: "#3a8a7a", pants: "#4a4a5a", shoes: "#222", hair: "#141010", hairStyle: "spiky" };
export const TOBY: Look = { skin: "#f3cfa8", shirt: "#6a5acd", pants: "#3a3f52", shoes: "#e8e8e8", hair: "#c0662e", hairStyle: "short" };
export const TOBY_MOM: Look = { skin: "#f0c8a0", shirt: "#c27a9a", pants: "#3a3a4a", hair: "#8a5a2a", hairStyle: "bun" };
export const FACELESS: Look = { skin: "#2c2c32", shirt: "#1e1e24", pants: "#1a1a1f", shoes: "#141418", hair: "#2c2c32", hairStyle: "bald" };

// "the other side": cold, desaturated
export const GRAY = "grayscale(1) sepia(0.25) hue-rotate(175deg) saturate(1.4) brightness(1.0) contrast(1.1)";

/* ---------------- props ---------------- */
export const Walkie: React.FC<{ p?: V3; r?: V3; s?: number; led?: number; red?: boolean; channel?: string }> = ({ p, r, s = 1, led = 0, red, channel = "09" }) => (
  <group position={p} rotation={r} scale={s}>
    <B s={[0.7, 1.3, 0.35]} p={[0, 0.65, 0]} c="#2a2c30" />
    <B s={[0.08, 1.0, 0.08]} p={[0.22, 1.8, 0]} c="#111" />
    <B s={[0.5, 0.4, 0.05]} p={[0, 0.45, 0.19]} c="#3a3c42" />
    {Array.from({ length: 4 }).map((_, i) => (
      <B key={i} s={[0.4, 0.04, 0.06]} p={[0, 0.32 + i * 0.08, 0.2]} c="#151517" />
    ))}
    <B s={[0.12, 0.12, 0.06]} p={[-0.2, 1.18, 0.19]} c={red ? "#ff2a1a" : "#3aff6a"} e={red ? "#ff2010" : "#2aff5a"} ei={led * 3} />
    <TextSign text={channel} p={[0.08, 0.98, 0.19]} w={0.34} h={0.18} bg="#1a3a1a" fg="#8aff8a" glow />
  </group>
);

export const Flashlight: React.FC<{ p: V3; r?: V3; on?: number }> = ({ p, r, on = 1 }) => (
  <group position={p} rotation={r}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.12, 0.1, 0.8, 10]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.14, 0.14, 0.05, 10]} />
      <meshBasicMaterial color={on ? "#fff6d0" : "#555"} toneMapped={false} />
    </mesh>
    {on ? <pointLight position={[0, 0, 1.2]} intensity={on * 18} color="#fff1c8" distance={9} decay={1.6} /> : null}
  </group>
);

export const Ash: React.FC<{ t: number; dir?: 1 | -1; center?: V3; spread?: number; count?: number }> = ({ t, dir = 1, center = [0, 0, 0], spread = 10, count = 90 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const x = ((i * 37.3) % spread) - spread / 2;
      const z = ((i * 53.7) % spread) - spread / 2;
      const y = (((i * 13.1) % 8) + dir * t * 0.6 + 80) % 8;
      return <B key={i} s={[0.07, 0.07, 0.07]} p={[center[0] + x + Math.sin(t + i) * 0.2, center[1] + y, center[2] + z]} c="#d8d8d8" />;
    })}
  </>
);

/* ---------------- the creature with no face ---------------- */
export const Faceless: React.FC<{ p: V3; rotY?: number; lean?: number; t: number; walkT?: number; reach?: number }> = ({ p, rotY = 0, lean = 0, t, walkT, reach = 0 }) => {
  const w = walkT !== undefined ? Math.sin(walkT * 4) * 0.4 : 0;
  return (
    <group position={p} rotation={[0, rotY, 0]} scale={[0.85, 1.55, 0.85]}>
      <Character
        look={FACELESS}
        face="blank"
        pose={{ lean, armL: -0.3 - reach + w, armR: -0.2 - reach - w, legL: -w, legR: w, headZ: Math.sin(t * 1.7) * 0.15, headX: 0.1 }}
      />
    </group>
  );
};

/* ---------------- Toby's room ---------------- */
export const TobyRoom: React.FC<{ t: number; lights?: boolean; crack?: number; closet?: number; ash?: 1 | -1 | 0; walkieLed?: number; walkieRed?: boolean; flash?: boolean }> = ({
  t,
  lights = true,
  crack = 0,
  closet = 0,
  ash = 0,
  walkieLed = 0,
  walkieRed,
  flash,
}) => (
  <>
    <color attach="background" args={["#05060a"]} />
    <ambientLight intensity={ash ? 0.95 : lights ? 0.45 : 0.3} color={ash ? "#ffffff" : lights ? "#ffe6c8" : "#6a80c0"} />
    {ash ? <pointLight position={[0, 7, 1]} intensity={40} color="#ffffff" distance={18} decay={1.5} /> : null}
    {lights ? <pointLight position={[0, 7, 1]} intensity={60} color="#ffd6a0" distance={18} decay={1.5} /> : null}
    <pointLight position={[5, 5, -1.5]} intensity={22} color="#6a80d0" distance={12} decay={1.6} />
    {flash ? <pointLight position={[1, 4, 3]} intensity={30} color="#fff1c8" distance={12} decay={1.5} /> : null}
    <B s={[12, 0.2, 12]} p={[0, -0.1, 0]} c="#7a5a3a" />
    <B s={[12, 8, 0.2]} p={[0, 4, -6]} c="#5a7a6a" />
    <B s={[0.2, 8, 12]} p={[-6, 4, 0]} c="#5a7a6a" />
    <B s={[0.2, 8, 12]} p={[6, 4, 0]} c="#5a7a6a" />
    <B s={[12, 0.2, 12]} p={[0, 8, 0]} c="#e8e0d0" />
    <B s={[12, 0.9, 0.22]} p={[0, 0.45, -5.9]} c="#4a3a2a" />
    {/* window */}
    <B s={[0.1, 3, 3.4]} p={[5.88, 4.6, -1.6]} c="#141c38" e="#1c2850" ei={0.6} />
    <B s={[0.15, 0.2, 3.6]} p={[5.85, 4.6, -1.6]} c="#ffffff" />
    <B s={[0.15, 3.2, 0.2]} p={[5.85, 4.6, -1.6]} c="#ffffff" />
    {/* posters */}
    <B s={[2.2, 3, 0.05]} p={[-2, 5.2, -5.85]} c="#1a1a3a" />
    <B s={[1.6, 0.4, 0.06]} p={[-2, 6.2, -5.8]} c="#e0392b" />
    <B s={[1.2, 1.2, 0.06]} p={[-2, 4.8, -5.8]} c="#f2b632" />
    <B s={[1.8, 2.4, 0.05]} p={[1.4, 5.4, -5.85]} c="#3a7ad0" />
    {/* bed */}
    <B s={[3.4, 1, 6]} p={[-4, 0.9, -2.6]} c="#5a3a24" />
    {[
      [-5.5, -5.4],
      [-2.5, -5.4],
      [-5.5, 0.2],
      [-2.5, 0.2],
    ].map(([x, z], i) => (
      <B key={i} s={[0.3, 0.5, 0.3]} p={[x, 0.25, z]} c="#4a2a14" />
    ))}
    <B s={[3.2, 0.4, 5.8]} p={[-4, 1.6, -2.6]} c="#f2f2f2" />
    <B s={[3.3, 0.3, 4]} p={[-4, 1.85, -1.6]} c="#2f5a8a" />
    <B s={[2.4, 0.4, 1]} p={[-4, 1.95, -5]} c="#ffffff" />
    {/* the crack under the bed */}
    {crack > 0 ? (
      <>
        <B s={[0.1, 0.03, 3.4]} p={[-3.4, 0.02, -2.6]} r={[0, 0.25, 0]} c="#dff4ff" e="#bfe8ff" ei={crack * 8} />
        <pointLight position={[-3.4, 0.3, -2.6]} intensity={crack * 40} color="#a8d8ff" distance={8} decay={1.6} />
      </>
    ) : null}
    {/* desk */}
    <B s={[3.4, 0.25, 1.6]} p={[2.6, 2.4, -5]} c="#8a6a4a" />
    <B s={[0.2, 2.4, 0.2]} p={[1.1, 1.2, -4.4]} c="#6a4a2a" />
    <B s={[0.2, 2.4, 0.2]} p={[4.1, 1.2, -4.4]} c="#6a4a2a" />
    <B s={[1.4, 1.0, 1.0]} p={[2.2, 3.05, -5.1]} c="#c8c0b0" />
    <B s={[1.1, 0.75, 0.05]} p={[2.2, 3.1, -4.58]} c="#1a2a1a" e="#2a5a2a" ei={0.4} />
    {/* walkie on the bed */}
    <Walkie p={[-3.2, 1.8, -1.2]} r={[-Math.PI / 2, 0, 0.3]} s={0.7} led={walkieLed * (Math.floor(t * 4) % 2 ? 1 : 0.2)} red={walkieRed} />
    {/* closet on the left wall */}
    <B s={[0.1, 5.6, 3.2]} p={[-5.88, 2.8, 3.4]} c="#020203" />
    <group position={[-5.75, 0, 1.8]} rotation={[0, -closet * 1.6, 0]}>
      <B s={[0.15, 5.6, 3.2]} p={[0, 2.8, 1.6]} c="#c8b89a" />
      <B s={[0.2, 0.5, 0.2]} p={[0.12, 2.8, 2.9]} c="#8a7a5a" />
    </group>
    {ash ? <Ash t={t} dir={ash} center={[0, 0, -1]} spread={11} /> : null}
  </>
);

/* ---------------- Millbrook, 1985, at night ---------------- */
const EIGHTIES: Theme = { wall: "#d8c8a8", roof: "#6a3a2a", door: "#2f5a8a", grass: "#3a5a30", sky: "#141a30", fog: "#1a2038" };
export const Pine: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <B s={[0.6, 2.4, 0.6]} p={[0, 1.2, 0]} c="#4a2f1a" />
    {[0, 1, 2].map((k) => (
      <mesh key={k} position={[0, 3 + k * 1.6, 0]}>
        <coneGeometry args={[2.4 - k * 0.6, 2.6, 6]} />
        <meshStandardMaterial color={["#1f4a2a", "#245530", "#2a6035"][k]} roughness={0.9} />
      </mesh>
    ))}
  </group>
);

export const Millbrook: React.FC<{ t: number; dusk?: boolean; redWindows?: number; bright?: boolean }> = ({ t, dusk, redWindows = 0, bright }) => (
  <>
    <color attach="background" args={[dusk ? "#3a2a4a" : "#0e1428"]} />
    <fog attach="fog" args={[dusk ? "#4a3858" : "#141c34", 30, 150]} />
    <hemisphereLight args={[dusk ? "#ff9a6a" : "#7a90d0", "#141824", dusk ? 0.9 : bright ? 2.6 : 1.1]} />
    <directionalLight position={[-40, 40, 30]} intensity={dusk ? 1.0 : 0.5} color={dusk ? "#ff8a5a" : "#9fb4ff"} />
    <B s={[400, 0.2, 400]} p={[0, -0.1, 0]} c={EIGHTIES.grass} />
    <B s={[9, 0.05, 200]} p={[0, 0.02, 40]} c="#2a2c32" />
    {Array.from({ length: 20 }).map((_, i) => (
      <B key={i} s={[0.3, 0.06, 2.6]} p={[0, 0.05, -20 + i * 8]} c="#c9b04a" />
    ))}
    {Array.from({ length: 6 }).flatMap((_, i) => [
      <PerfectHouse key={`l${i}`} p={[-18, 0, -4 + i * 14]} rot={Math.PI / 2} th={EIGHTIES} />,
      <PerfectHouse key={`r${i}`} p={[18, 0, 2 + i * 14]} rot={-Math.PI / 2} th={EIGHTIES} />,
    ])}
    {redWindows > 0
      ? Array.from({ length: 6 }).flatMap((_, i) => [
          <B key={`rw${i}`} s={[0.3, 1.2, 1.4]} p={[-14.3, 3.4, -4 + i * 14 + 2.4]} c="#ff2a1a" e="#ff2010" ei={redWindows * (Math.floor(t * 3 + i) % 2 ? 2 : 0.3)} />,
          <B key={`rv${i}`} s={[0.3, 1.2, 1.4]} p={[14.3, 3.4, 2 + i * 14 - 2.4]} c="#ff2a1a" e="#ff2010" ei={redWindows * (Math.floor(t * 3 + i + 1) % 2 ? 2 : 0.3)} />,
        ])
      : null}
    {[-10, 10, 30, 50].map((z, i) => (
      <group key={i} position={[i % 2 ? 5.6 : -5.6, 0, z]}>
        <B s={[0.25, 7, 0.25]} p={[0, 3.5, 0]} c="#3a3a3a" />
        <B s={[0.9, 0.25, 0.6]} p={[0, 7, 0]} c="#fff0b0" e="#ffcf6a" ei={2} />
        <pointLight position={[0, 6.4, 0]} color="#ffb84a" intensity={60} distance={16} decay={1.5} />
      </group>
    ))}
    {Array.from({ length: 14 }).map((_, i) => (
      <Pine key={i} p={[(i % 2 ? 1 : -1) * (30 + (i % 4) * 7), 0, -30 + i * 9]} s={1.3} />
    ))}
  </>
);

/* ---------------- the woods ---------------- */
export const Woods: React.FC<{ t: number; day?: boolean }> = ({ day }) => (
  <>
    <color attach="background" args={[day ? "#7a8a8a" : "#0a1018"]} />
    <fog attach="fog" args={[day ? "#8a9a9a" : "#0e1620", 8, 60]} />
    <hemisphereLight args={[day ? "#cfe0e0" : "#4a5a80", "#141a10", day ? 0.9 : 0.5]} />
    <directionalLight position={[10, 30, 10]} intensity={day ? 0.8 : 0.3} color="#cfd8ff" />
    <B s={[300, 0.2, 300]} p={[0, -0.1, 0]} c="#2e3a22" />
    {Array.from({ length: 70 }).map((_, i) => {
      const x = ((i * 47.3) % 70) - 35;
      const z = ((i * 31.7) % 70) - 35;
      if (Math.abs(x) < 4 && Math.abs(z) < 6) return null;
      return <Pine key={i} p={[x, 0, z]} s={1.1 + (i % 3) * 0.25} />;
    })}
    {Array.from({ length: 40 }).map((_, i) => (
      <B key={`l${i}`} s={[0.4, 0.05, 0.3]} p={[((i * 13.7) % 16) - 8, 0.03, ((i * 7.3) % 16) - 8]} r={[0, i, 0]} c={["#6a4a1a", "#8a5a2a", "#4a3a1a"][i % 3]} />
    ))}
  </>
);
