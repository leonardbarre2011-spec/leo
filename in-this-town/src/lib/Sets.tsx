import React from "react";

type V3 = [number, number, number];

export const B: React.FC<{
  s: V3;
  p?: V3;
  c: string;
  r?: V3;
  e?: string;
  ei?: number;
  metal?: number;
}> = ({ s, p, c, r, e, ei, metal }) => (
  <mesh position={p} rotation={r}>
    <boxGeometry args={s} />
    <meshStandardMaterial
      color={c}
      roughness={metal ? 0.45 : 0.9}
      metalness={metal ?? 0}
      emissive={e ?? "#000"}
      emissiveIntensity={ei ?? 0}
    />
  </mesh>
);

const Cyl: React.FC<{ a: [number, number, number, number?]; p?: V3; r?: V3; c: string; metal?: number; e?: string; ei?: number }> = ({
  a,
  p,
  r,
  c,
  metal,
  e,
  ei,
}) => (
  <mesh position={p} rotation={r}>
    <cylinderGeometry args={[a[0], a[1], a[2], a[3] ?? 16]} />
    <meshStandardMaterial color={c} roughness={0.6} metalness={metal ?? 0} emissive={e ?? "#000"} emissiveIntensity={ei ?? 0} />
  </mesh>
);

/* ------------------------------------------------------------------ */
/* TOWN (surface)                                                      */
/* ------------------------------------------------------------------ */

const House: React.FC<{ p: V3; c: string; roof: string; rot?: number; w?: number }> = ({ p, c, roof, rot = 0, w = 8 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <B s={[w, 6, 7]} p={[0, 3, 0]} c={c} />
    <mesh position={[0, 7.6, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[w * 0.78, 3.4, 4]} />
      <meshStandardMaterial color={roof} roughness={0.9} />
    </mesh>
    <B s={[1.6, 3, 0.2]} p={[0, 1.5, 3.55]} c="#5a3a24" />
    <B s={[1.6, 1.4, 0.2]} p={[-2.4, 3.6, 3.55]} c="#ffd27a" e="#ffb84a" ei={0.9} />
    <B s={[1.6, 1.4, 0.2]} p={[2.4, 3.6, 3.55]} c="#ffd27a" e="#ffb84a" ei={0.9} />
  </group>
);

const Tree: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <B s={[0.8, 3, 0.8]} p={[0, 1.5, 0]} c="#5b3b22" />
    <B s={[3.2, 2.4, 3.2]} p={[0, 4, 0]} c="#2f6b3a" />
    <B s={[2.2, 1.6, 2.2]} p={[0, 5.8, 0]} c="#367a42" />
  </group>
);

export const Siren: React.FC<{ p: V3; t: number; on?: boolean }> = ({ p, t, on = true }) => {
  const pulse = on ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
  return (
    <group position={p}>
      <Cyl a={[0.25, 0.3, 12]} p={[0, 6, 0]} c="#6d6d6d" metal={0.6} />
      <B s={[2.4, 1.2, 1.2]} p={[0, 12.2, 0]} c="#9a9a9a" metal={0.5} />
      <Cyl a={[0.55, 0.7, 1, 12]} p={[-1.4, 12.2, 0]} r={[0, 0, Math.PI / 2]} c="#b0b0b0" metal={0.5} />
      <Cyl a={[0.55, 0.7, 1, 12]} p={[1.4, 12.2, 0]} r={[0, 0, -Math.PI / 2]} c="#b0b0b0" metal={0.5} />
      <B s={[0.8, 0.6, 0.8]} p={[0, 13.1, 0]} c="#ff2a2a" e="#ff1a1a" ei={0.4 + pulse * 3} />
      <pointLight position={[0, 13.4, 1]} color="#ff2020" intensity={pulse * 260} distance={45} decay={1.6} />
    </group>
  );
};

export const Hatch: React.FC<{ p: V3; lidOpen?: number }> = ({ p, lidOpen = 1 }) => (
  <group position={p}>
    <B s={[6, 1.2, 6]} p={[0, 0.6, 0]} c="#7d7f80" />
    <B s={[4, 0.1, 4]} p={[0, 1.21, 0]} c="#0d0d0f" />
    <group position={[0, 1.25, -2]} rotation={[-lidOpen * 1.9, 0, 0]}>
      <B s={[4.2, 0.3, 4.2]} p={[0, 0, 2.1]} c="#5a646b" metal={0.6} />
      <B s={[3.4, 0.1, 0.3]} p={[0, 0.2, 2.1]} c="#e3b23c" />
      <B s={[0.3, 0.1, 3.4]} p={[0, 0.2, 2.1]} c="#e3b23c" />
    </group>
    {/* yellow/black hazard ring */}
    {[-1, 1].map((sx) => (
      <B key={sx} s={[0.3, 0.05, 6]} p={[sx * 2.9, 1.22, 0]} c="#f2c230" />
    ))}
  </group>
);

export const Town: React.FC<{ t: number; mood?: "dusk" | "night"; siren?: boolean; fog?: number }> = ({
  t,
  mood = "dusk",
  siren = true,
  fog,
}) => {
  const night = mood === "night";
  return (
    <>
      <color attach="background" args={[night ? "#0b1220" : "#3d2f52"]} />
      <fog attach="fog" args={[night ? "#0f1a24" : "#5b4466", 10, fog ?? (night ? 70 : 120)]} />
      <hemisphereLight args={[night ? "#3a4c70" : "#ffb58a", night ? "#0a0f14" : "#2a2440", night ? 0.5 : 1.0]} />
      <directionalLight position={[-30, 25, 20]} intensity={night ? 0.35 : 1.4} color={night ? "#8fa8ff" : "#ff9d6b"} />
      {/* ground */}
      <B s={[300, 0.2, 300]} p={[0, -0.1, 0]} c={night ? "#1d3324" : "#3d6b3a"} />
      {/* road */}
      <B s={[10, 0.05, 300]} p={[0, 0.02, 0]} c={night ? "#26282c" : "#45474c"} />
      {Array.from({ length: 30 }).map((_, i) => (
        <B key={i} s={[0.4, 0.06, 3]} p={[0, 0.04, -120 + i * 8]} c="#d9c35a" />
      ))}
      {/* sidewalks */}
      <B s={[3, 0.3, 300]} p={[-6.5, 0.15, 0]} c="#8d8d8a" />
      <B s={[3, 0.3, 300]} p={[6.5, 0.15, 0]} c="#8d8d8a" />
      {/* houses */}
      {[
        [-14, -10, "#e9d8b0", "#8a3b2e"],
        [-14, -26, "#a8c6d9", "#3b4a6b"],
        [-14, -42, "#e7b3a0", "#5b3a2e"],
        [-14, -58, "#cfd9a8", "#6b3a3a"],
        [14, -18, "#f0e6d0", "#2e5b4a"],
        [14, -34, "#d9b0c6", "#4a2e3b"],
        [14, -50, "#b0d9c6", "#7a4a2a"],
        [-14, 6, "#d0c0e6", "#3b2e5b"],
        [14, 0, "#e6d0a0", "#5b2e2e"],
      ].map(([x, z, c, r], i) => (
        <House key={i} p={[x as number, 0, z as number]} c={c as string} roof={r as string} rot={(x as number) < 0 ? Math.PI / 2 : -Math.PI / 2} />
      ))}
      {[
        [-20, -2],
        [-9, -18],
        [20, -8],
        [9, -42],
        [-9, -50],
        [22, -26],
        [-22, -34],
        [9, 10],
      ].map(([x, z], i) => (
        <Tree key={i} p={[x, 0, z]} s={0.9 + (i % 3) * 0.15} />
      ))}
      {/* street lamps */}
      {[-30, -6, 18].map((z) => (
        <group key={z} position={[5.6, 0, z]}>
          <Cyl a={[0.15, 0.2, 7]} p={[0, 3.5, 0]} c="#333" />
          <B s={[1.2, 0.3, 0.6]} p={[-0.5, 7, 0]} c="#333" />
          <B s={[0.8, 0.15, 0.5]} p={[-0.6, 6.82, 0]} c="#fff2c0" e="#ffe08a" ei={night ? 2 : 0.6} />
          {night ? <pointLight position={[-0.6, 6.4, 0]} color="#ffd58a" intensity={70} distance={18} decay={1.5} /> : null}
        </group>
      ))}
      {siren ? <Siren p={[-6.5, 0, -14]} t={t} /> : null}
      <Hatch p={[-11, 0, 14]} />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* BUNKER interior. Room x[-7,7] z[-12,9], height 8. Door in back wall */
/* ------------------------------------------------------------------ */

export const Bunk: React.FC<{ p: V3; rot?: number; blanket?: string; blanket2?: string }> = ({
  p,
  rot = 0,
  blanket = "#6b3a3a",
  blanket2 = "#3a4f6b",
}) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[
      [-1.6, -3.2],
      [1.6, -3.2],
      [-1.6, 3.2],
      [1.6, 3.2],
    ].map(([x, z], i) => (
      <B key={i} s={[0.25, 7, 0.25]} p={[x, 3.5, z]} c="#4b5359" metal={0.5} />
    ))}
    <B s={[3.2, 0.3, 6.4]} p={[0, 1.4, 0]} c="#4b5359" metal={0.4} />
    <B s={[3, 0.45, 6.2]} p={[0, 1.75, 0]} c={blanket} />
    <B s={[2.2, 0.4, 1]} p={[0, 2.1, -2.5]} c="#e8e4da" />
    <B s={[3.2, 0.3, 6.4]} p={[0, 4.6, 0]} c="#4b5359" metal={0.4} />
    <B s={[3, 0.45, 6.2]} p={[0, 4.95, 0]} c={blanket2} />
    <B s={[2.2, 0.4, 1]} p={[0, 5.3, -2.5]} c="#e8e4da" />
  </group>
);

export const Lamp: React.FC<{ p: V3; on?: number; swing?: number }> = ({ p, on = 1, swing = 0 }) => (
  <group position={p} rotation={[0, 0, swing]}>
    <Cyl a={[0.03, 0.03, 1.2]} p={[0, -0.6, 0]} c="#222" />
    <mesh position={[0, -1.4, 0]}>
      <coneGeometry args={[0.8, 0.6, 16, 1, true]} />
      <meshStandardMaterial color="#3d4a3d" side={2} roughness={0.6} />
    </mesh>
    <mesh position={[0, -1.6, 0]}>
      <sphereGeometry args={[0.22, 12, 12]} />
      <meshStandardMaterial color="#fff3c4" emissive="#ffd27a" emissiveIntensity={on * 3} />
    </mesh>
    {on > 0 ? <pointLight position={[0, -1.9, 0]} color="#ffbf6b" intensity={on * 90} distance={22} decay={1.6} /> : null}
  </group>
);

export const SteelDoor: React.FC<{ open?: number; shake?: number; wheel?: number }> = ({ open = 0, shake = 0, wheel = 0 }) => (
  // hinge at x = -1.8 of the back wall (z = -12)
  <group position={[-1.8 + shake * 0.05, 0, -12 + shake * 0.08]} rotation={[0, open * 1.7, 0]}>
    <B s={[3.6, 5.6, 0.5]} p={[1.8, 2.8, 0]} c="#59636b" metal={0.65} />
    {/* rivets / plates */}
    <B s={[3.2, 0.2, 0.1]} p={[1.8, 1.0, 0.28]} c="#3e464d" metal={0.6} />
    <B s={[3.2, 0.2, 0.1]} p={[1.8, 4.6, 0.28]} c="#3e464d" metal={0.6} />
    <B s={[2.6, 0.35, 0.06]} p={[1.8, 5.1, 0.28]} c="#e3b23c" />
    {/* wheel */}
    <group position={[1.8, 2.8, 0.45]} rotation={[0, 0, wheel]}>
      <mesh>
        <torusGeometry args={[0.75, 0.1, 10, 24]} />
        <meshStandardMaterial color="#b33a2e" roughness={0.5} metalness={0.4} />
      </mesh>
      <B s={[1.5, 0.12, 0.12]} c="#b33a2e" />
      <B s={[0.12, 1.5, 0.12]} c="#b33a2e" />
      <Cyl a={[0.2, 0.2, 0.2]} r={[Math.PI / 2, 0, 0]} c="#7a2a22" />
    </group>
    {/* bolt */}
    <B s={[0.9, 0.3, 0.3]} p={[3.4, 2.8, 0.35]} c="#8a9298" metal={0.8} />
  </group>
);

export const Bunker: React.FC<{
  t: number;
  mood?: "warm" | "night";
  door?: number;
  doorShake?: number;
  wheel?: number;
  outside?: boolean;
  swing?: number;
}> = ({ t, mood = "warm", door = 0, doorShake = 0, wheel = 0, outside = true, swing }) => {
  const night = mood === "night";
  const lampOn = night ? 0 : 1;
  const sw = swing ?? Math.sin(t * 1.4) * 0.04;
  const wall = "#6e7275";
  return (
    <>
      <color attach="background" args={["#050607"]} />
      <fog attach="fog" args={[night ? "#060a10" : "#140f0a", 8, night ? 34 : 44]} />
      <ambientLight intensity={night ? 0.55 : 0.18} color={night ? "#5a78b8" : "#ffd9b0"} />
      {night ? (
        <>
          <pointLight position={[0, 6.5, -2]} color="#5a7ac8" intensity={160} distance={34} decay={1.4} />
          <pointLight position={[0, 4.5, -8.5]} color="#8aa6e8" intensity={50} distance={14} decay={1.5} />
          {/* tiny red emergency light above door */}
          <B s={[0.5, 0.3, 0.3]} p={[0, 6.5, -11.7]} c="#ff3b2a" e="#ff2a1a" ei={2.5} />
          <pointLight position={[0, 6.4, -11.2]} color="#ff3b2a" intensity={3} distance={4} decay={2} />
        </>
      ) : null}
      {/* floor / ceiling */}
      <B s={[14, 0.2, 22]} p={[0, -0.1, -1.5]} c="#4a4d4f" />
      <B s={[14, 0.2, 22]} p={[0, 8.1, -1.5]} c="#3e4143" />
      {/* floor stripes */}
      <B s={[0.3, 0.02, 20]} p={[-2.6, 0.01, -1.5]} c="#c9a227" />
      <B s={[0.3, 0.02, 20]} p={[2.6, 0.01, -1.5]} c="#c9a227" />
      {/* side walls */}
      <B s={[0.4, 8.2, 22]} p={[-7.2, 4, -1.5]} c={wall} />
      <B s={[0.4, 8.2, 22]} p={[7.2, 4, -1.5]} c={wall} />
      <B s={[14.4, 8.2, 0.4]} p={[0, 4, 9.5]} c={wall} />
      {/* back wall with opening (x -1.8..1.8, y 0..5.6) */}
      <B s={[5.4, 8.2, 0.6]} p={[-4.5, 4, -12.3]} c={wall} />
      <B s={[5.4, 8.2, 0.6]} p={[4.5, 4, -12.3]} c={wall} />
      <B s={[3.6, 2.6, 0.6]} p={[0, 6.9, -12.3]} c={wall} />
      {/* door frame */}
      <B s={[0.35, 5.8, 0.8]} p={[-1.95, 2.9, -12.2]} c="#3a4045" metal={0.6} />
      <B s={[0.35, 5.8, 0.8]} p={[1.95, 2.9, -12.2]} c="#3a4045" metal={0.6} />
      <B s={[4.25, 0.35, 0.8]} p={[0, 5.75, -12.2]} c="#3a4045" metal={0.6} />
      <SteelDoor open={door} shake={doorShake} wheel={wheel} />
      {/* wall paint band + sign */}
      <B s={[0.05, 1.2, 22]} p={[-6.98, 1.1, -1.5]} c="#3f5a48" />
      <B s={[0.05, 1.2, 22]} p={[6.98, 1.1, -1.5]} c="#3f5a48" />
      <B s={[3.2, 0.9, 0.05]} p={[-4.5, 6.2, -11.98]} c="#e3b23c" />
      <B s={[2.6, 0.18, 0.06]} p={[-4.5, 6.2, -11.95]} c="#1b1b1b" />
      {/* ceiling pipes */}
      {[-5.5, -4.8, 5.2].map((x, i) => (
        <Cyl key={i} a={[0.18, 0.18, 22]} p={[x, 7.5, -1.5]} r={[Math.PI / 2, 0, 0]} c={i === 2 ? "#7a3a2a" : "#5a6066"} metal={0.5} />
      ))}
      {/* bunks */}
      <Bunk p={[-5.2, 0, -6.5]} blanket="#7a3b3b" blanket2="#3b5a7a" />
      <Bunk p={[-5.2, 0, 1]} blanket="#3b6a4a" blanket2="#7a6a3b" />
      <Bunk p={[5.2, 0, -6.5]} blanket="#5a3b7a" blanket2="#7a3b5a" />
      {/* table + crates on right */}
      <B s={[3, 0.25, 4]} p={[4.8, 2.4, 2.5]} c="#7a5a3a" />
      {[
        [3.6, 1.1],
        [6, 1.1],
        [3.6, 3.9],
        [6, 3.9],
      ].map(([x, z], i) => (
        <B key={i} s={[0.25, 2.4, 0.25]} p={[x, 1.2, z]} c="#5a4028" />
      ))}
      <B s={[0.5, 0.6, 0.5]} p={[4.4, 2.82, 2.0]} c="#c9c9c9" metal={0.6} />
      <B s={[0.4, 0.5, 0.4]} p={[5.2, 2.77, 3.0]} c="#b33a2e" metal={0.4} />
      <B s={[2, 1.6, 2]} p={[5.6, 0.8, 6.8]} c="#6b5a3a" />
      <B s={[1.6, 1.2, 1.6]} p={[5.4, 2.2, 6.8]} c="#7b6a48" />
      <B s={[1.8, 1.4, 1.8]} p={[-5.6, 0.7, 7]} c="#5b6b3a" />
      {/* shelves with cans on back wall right */}
      <B s={[4, 0.15, 1]} p={[4.6, 3.2, -11.4]} c="#5a4028" />
      <B s={[4, 0.15, 1]} p={[4.6, 4.6, -11.4]} c="#5a4028" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Cyl key={i} a={[0.22, 0.22, 0.6]} p={[3.0 + i * 0.5, i % 2 ? 4.98 : 3.58, -11.4]} c={["#c9a227", "#b33a2e", "#3a7ab3", "#c9c9c9"][i % 4]} metal={0.5} />
      ))}
      <Lamp p={[0, 8, -6]} on={lampOn} swing={sw} />
      <Lamp p={[0, 8, 3]} on={lampOn} swing={-sw} />
      {outside ? <OutsideCorridor t={t} /> : null}
    </>
  );
};

/* corridor behind the door: z from -12.6 to -40, with stairs up and green fog */
export const OutsideCorridor: React.FC<{ t: number; bright?: number }> = ({ t, bright = 1 }) => (
  <group>
    <B s={[8, 0.2, 30]} p={[0, -0.1, -27]} c="#2e3330" />
    <B s={[0.4, 9, 30]} p={[-4, 4.5, -27]} c="#3b423d" />
    <B s={[0.4, 9, 30]} p={[4, 4.5, -27]} c="#3b423d" />
    <B s={[8, 0.3, 30]} p={[0, 9, -27]} c="#2b302c" />
    {Array.from({ length: 8 }).map((_, i) => (
      <B key={i} s={[7.6, 0.9 * (i + 1), 1.4]} p={[0, 0.45 * (i + 1), -30 - i * 1.4]} c="#3a3f3b" />
    ))}
    <pointLight position={[0, 6, -26]} color="#7dff8a" intensity={bright * (80 + Math.sin(t * 3) * 6)} distance={30} decay={1.4} />
    <pointLight position={[0, 3, -16]} color="#5adf6a" intensity={bright * 30} distance={14} decay={1.5} />
  </group>
);

/* narrow dark corridor for the shoes shot */
export const ShoesCorridor: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={["#030405"]} />
    <fog attach="fog" args={["#05070a", 4, 26]} />
    <ambientLight intensity={0.05} />
    <B s={[5, 0.2, 40]} p={[0, -0.1, -10]} c="#3a3d3f" />
    <B s={[0.4, 7, 40]} p={[-2.5, 3.5, -10]} c="#4e5356" />
    <B s={[0.4, 7, 40]} p={[2.5, 3.5, -10]} c="#4e5356" />
    <B s={[5, 0.3, 40]} p={[0, 7, -10]} c="#2e3133" />
    <Cyl a={[0.12, 0.12, 40]} p={[-2.0, 6.5, -10]} r={[Math.PI / 2, 0, 0]} c="#5a6066" metal={0.5} />
    <Lamp p={[0, 7, 0.5]} on={1.1 + 0.04 * Math.sin(t * 20)} />
    <ambientLight intensity={0.25} color="#8a8070" />
    {/* the shoes */}
    {[-0.32, 0.32].map((x, i) => (
      <group key={x} position={[x, 0, 0]} rotation={[0, i ? -0.25 : 0.15, 0]}>
        <B s={[0.5, 0.18, 1.1]} p={[0, 0.09, 0]} c="#efefef" />
        <B s={[0.5, 0.4, 0.75]} p={[0, 0.38, -0.15]} c="#ff4a4a" />
        <B s={[0.36, 0.06, 0.4]} p={[0, 0.6, 0.0]} c="#f5f5f5" />
      </group>
    ))}
  </>
);
