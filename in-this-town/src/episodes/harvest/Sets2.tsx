import React from "react";
import { B } from "../../lib/Sets";
import type { Look } from "../../lib/Character";
import { Scatter, TexturedGround, noiseTexture } from "../../lib/detail";
import { Pine } from "../static/Sets";

type V3 = [number, number, number];

export const PRESIDENT: Look = { skin: "#e9b98f", shirt: "#2a2a30", pants: "#2a2a30", shoes: "#111", hair: "#9a9a9a", hairStyle: "short", patch: "#c8a84a" };

/* a small house whose windows can be lit or dark */
const Cottage: React.FC<{ p: V3; rot: number; lit: number }> = ({ p, rot, lit }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <mesh position={[0, 2.4, 0]}>
      <boxGeometry args={[6, 4.8, 5]} />
      <meshStandardMaterial map={noiseTexture("#8a7a62", 0.15, 2, "planks")} roughness={0.9} />
    </mesh>
    <mesh position={[0, 5.9, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[4.6, 2.4, 4]} />
      <meshStandardMaterial color="#4a3a32" roughness={0.9} />
    </mesh>
    <B s={[0.8, 1.4, 0.6]} p={[1.8, 6.4, 0.6]} c="#5a4a42" />
    <B s={[1.2, 2.2, 0.1]} p={[-1.6, 1.1, 2.52]} c="#3a2a1a" />
    {[0.6, 2.2].map((x) => (
      <React.Fragment key={x}>
        <B s={[1.1, 1.1, 0.1]} p={[x, 2.8, 2.52]} c={lit ? "#ffcf7a" : "#141820"} e="#ffb84a" ei={lit * 1.6} />
        <B s={[1.25, 0.12, 0.15]} p={[x, 2.8, 2.55]} c="#3a2a1a" />
      </React.Fragment>
    ))}
    {lit > 0 ? <pointLight position={[1.4, 2.8, 3.6]} intensity={lit * 10} color="#ffb84a" distance={7} decay={1.8} /> : null}
  </group>
);

/* a village of cottages along a dirt road; each house goes dark at its own time */
export const Village: React.FC<{ t: number; offAt?: (i: number) => number; x?: number }> = ({ t, offAt, x = 0 }) => {
  const houses: [number, number, number][] = [];
  for (let i = 0; i < 8; i++) {
    houses.push([x - 9, -30 + i * 9, Math.PI / 2]);
    houses.push([x + 9, -26 + i * 9, -Math.PI / 2]);
  }
  return (
    <>
      {houses.map(([hx, hz, r], i) => (
        <Cottage key={i} p={[hx, 0, hz]} rot={r} lit={offAt ? (t < offAt(i) ? 1 : 0) : 1} />
      ))}
      <mesh position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 120]} />
        <meshStandardMaterial map={noiseTexture("#5a4a3a", 0.25, 6)} roughness={1} />
      </mesh>
    </>
  );
};

export const Countryside: React.FC<{ t: number; children?: React.ReactNode }> = ({ children }) => (
  <>
    <color attach="background" args={["#070a14"]} />
    <fog attach="fog" args={["#0a0e1a", 40, 220]} />
    <hemisphereLight args={["#6a7ab0", "#0a0c10", 0.9]} />
    <directionalLight position={[-30, 50, 20]} intensity={0.6} color="#a8b8ff" />
    <TexturedGround color="#243424" repeat={80} />
    <Scatter count={700} rMin={14} rMax={120} color="#2e4a2e" size={[0.2, 0.7, 0.2]} />
    {Array.from({ length: 40 }).map((_, i) => (
      <Pine key={i} p={[((i * 47) % 200) - 100, 0, ((i * 31) % 200) - 100]} s={1.4} />
    ))}
    {children}
  </>
);

/* white questioning room */
export const WhiteRoom: React.FC = () => (
  <>
    <color attach="background" args={["#e8ecf0"]} />
    <ambientLight intensity={0.9} color="#f2f6ff" />
    <directionalLight position={[2, 12, 6]} intensity={1.2} color="#ffffff" />
    <mesh position={[0, -0.1, 0]}>
      <boxGeometry args={[16, 0.2, 16]} />
      <meshStandardMaterial map={noiseTexture("#d8dce2", 0.06, 4, "tiles")} roughness={0.6} />
    </mesh>
    <B s={[16, 9, 0.2]} p={[0, 4.5, -6]} c="#f2f4f8" />
    <B s={[0.2, 9, 16]} p={[-8, 4.5, 0]} c="#eceff4" />
    <B s={[0.2, 9, 16]} p={[8, 4.5, 0]} c="#eceff4" />
    <B s={[5, 2.6, 0.12]} p={[0, 4.6, -5.88]} c="#2a3038" />
    <B s={[3, 0.2, 2]} p={[0, 2.2, -2]} c="#b8bcc4" metal={0.5} />
    {[-1, 1].map((sx) => (
      <B key={sx} s={[1.2, 0.2, 1.2]} p={[sx * 2, 1.5, -2]} c="#9aa0aa" metal={0.4} />
    ))}
    <B s={[1.6, 0.1, 1.6]} p={[0, 8.9, 0]} c="#ffffff" e="#ffffff" ei={1} />
  </>
);

/* glass booth floating high above the arena */
export const Booth: React.FC<{ p: V3; alarm?: number }> = ({ p, alarm = 0 }) => (
  <group position={p}>
    <B s={[10, 0.6, 7]} p={[0, 0, 0]} c="#2a2c34" metal={0.6} />
    <mesh position={[0, 3, 0]}>
      <boxGeometry args={[10, 5.6, 7]} />
      <meshStandardMaterial color="#9fd0ff" transparent opacity={0.22} roughness={0.05} metalness={0.3} />
    </mesh>
    <B s={[10.2, 0.4, 7.2]} p={[0, 5.9, 0]} c="#2a2c34" metal={0.6} />
    <B s={[3, 1.2, 1.4]} p={[0, 0.9, -2]} c="#3a3e46" />
    <B s={[0.5, 0.15, 0.5]} p={[0.8, 1.56, -2]} c="#ff2a1a" e="#ff2010" ei={1 + alarm * 3} />
    <pointLight position={[0, 4, 0]} intensity={30} color="#ffe6c8" distance={14} decay={1.6} />
  </group>
);

export const Campfire: React.FC<{ p: V3; t: number }> = ({ p, t }) => (
  <group position={p}>
    {[0, 1.2, 2.4].map((a) => (
      <B key={a} s={[0.3, 0.3, 1.8]} p={[0, 0.15, 0]} r={[0, a, 0]} c="#5a3a1a" />
    ))}
    <mesh position={[0, 0.8 + Math.sin(t * 12) * 0.05, 0]} scale={[1, 1 + Math.sin(t * 17) * 0.15, 1]}>
      <coneGeometry args={[0.6, 1.4, 8]} />
      <meshBasicMaterial color="#ffa83a" toneMapped={false} />
    </mesh>
    <pointLight position={[0, 1.6, 0]} intensity={40 + Math.sin(t * 13) * 6} color="#ff9a3a" distance={14} decay={1.6} />
  </group>
);
