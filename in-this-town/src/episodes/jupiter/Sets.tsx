import React, { useLayoutEffect, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, CanvasTexture, Points, SRGBColorSpace } from "three";
import { B } from "../../lib/Sets";
import type { Look } from "../../lib/Character";
import { TextSign } from "../smiling/Props";

type V3 = [number, number, number];

/* ---------------- crew (names from the meme; simple representative blocky skins) ---------------- */
const suit = (skin: string, hair: string, color: string, patch: string, extra: Partial<Look> = {}): Look => ({
  skin,
  shirt: color,
  pants: color,
  shoes: "#e8e8e8",
  hair,
  hairStyle: "short",
  patch,
  ...extra,
});
export const CASEOH = suit("#5a3a22", "#141010", "#2a3a6a", "#ffd34a");
export const SPEED = suit("#6b4428", "#141010", "#e0702a", "#2a3a6a");
export const KREEK = suit("#f1c9a0", "#6a4a2a", "#5a6a3a", "#e0702a", { hairStyle: "spiky" });
export const JOE = suit("#eec39a", "#2a1a10", "#e8e8e8", "#3a7ad0");
export const MATEO = suit("#c68b59", "#141010", "#5ab0e0", "#e0392b");
export const CREW = { CASEOH, SPEED, KREEK, JOE, MATEO };
export const withHelmet = (l: Look): Look => ({ ...l, helmet: true });

/* ---------------- space backdrop: stars + Jupiter ---------------- */
const useJupiterTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const g = c.getContext("2d")!;
    const bands = ["#e8d2b0", "#c88a5a", "#f0e0c8", "#b8764a", "#e8c8a0", "#a8683a", "#f2dcc0", "#c89a6a", "#e0c0a0", "#b07a50"];
    const h = 512 / bands.length;
    bands.forEach((b, i) => {
      g.fillStyle = b;
      g.fillRect(0, i * h, 1024, h + 1);
    });
    for (let i = 0; i < 60; i++) {
      g.fillStyle = `rgba(${150 + ((i * 37) % 80)},${90 + ((i * 23) % 60)},${60 + ((i * 11) % 40)},0.35)`;
      g.fillRect((i * 173) % 1024, (i * 97) % 512, 120 + ((i * 31) % 200), 6 + (i % 9));
    }
    // the giant red storm
    g.fillStyle = "#b0402a";
    g.beginPath();
    g.ellipse(640, 330, 70, 38, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#d8664a";
    g.beginPath();
    g.ellipse(640, 330, 42, 20, 0, 0, Math.PI * 2);
    g.fill();
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

const Stars: React.FC<{ count?: number }> = ({ count = 1500 }) => {
  const ref = useRef<Points>(null);
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i * 2.399) % (Math.PI * 2);
      const b = Math.acos(1 - 2 * ((i * 0.618) % 1));
      const r = 700;
      pos[i * 3] = Math.sin(b) * Math.cos(a) * r;
      pos[i * 3 + 1] = Math.abs(Math.cos(b)) * r * 0.9 + 20;
      pos[i * 3 + 2] = Math.sin(b) * Math.sin(a) * r;
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useLayoutEffect(() => undefined, []);
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#ffffff" size={1.6} sizeAttenuation={false} fog={false} />
    </points>
  );
};

export const Jupiter: React.FC<{ p?: V3; r?: number; t: number }> = ({ p = [-60, 170, -380], r = 300, t }) => {
  const tex = useJupiterTexture();
  return (
    <mesh position={p} rotation={[0.25, t * 0.02 + 1.2, 0.1]}>
      <sphereGeometry args={[r, 48, 32]} />
      <meshBasicMaterial map={tex} fog={false} toneMapped={false} />
    </mesh>
  );
};

/* ---------------- the frozen moon ---------------- */
export const MoonSurface: React.FC<{ t: number; night?: boolean }> = ({ t, night }) => (
  <>
    <color attach="background" args={["#020208"]} />
    <fog attach="fog" args={[night ? "#0a0c18" : "#1a1830", 60, 340]} />
    <hemisphereLight args={[night ? "#5a6a9a" : "#ffd8b0", "#1a2030", night ? 0.6 : 1.1]} />
    <directionalLight position={[-60, 80, -100]} intensity={night ? 0.5 : 1.3} color="#ffcf9a" />
    <Stars />
    <Jupiter t={t} />
    <B s={[900, 0.4, 900]} p={[0, -0.2, 0]} c={night ? "#5a6a80" : "#c8d8e8"} />
    {Array.from({ length: 26 }).map((_, i) => {
      const x = ((i * 71.3) % 220) - 110;
      const z = ((i * 43.7) % 220) - 130;
      const r = 3 + (i % 5) * 2;
      return (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[r, r * 1.15, 0.5, 18]} />
            <meshStandardMaterial color={night ? "#4a5a70" : "#a8bccf"} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[r * 0.8, r * 0.8, 0.5, 18]} />
            <meshStandardMaterial color={night ? "#3a4a60" : "#93a8bd"} />
          </mesh>
        </group>
      );
    })}
    {Array.from({ length: 18 }).map((_, i) => (
      <B key={`r${i}`} s={[2 + (i % 3), 1.2 + (i % 4) * 0.6, 2 + (i % 2)]} p={[((i * 53.1) % 160) - 80, 0.5, ((i * 29.3) % 140) - 90]} r={[0.2, i, 0.1]} c={night ? "#6a7a90" : "#dfe9f2"} />
    ))}
  </>
);

/* ---------------- the ship: Odyssey JX-11 ---------------- */
export const Lander: React.FC<{ p?: V3; rot?: number; door?: number; lights?: boolean }> = ({ p = [0, 0, -20], rot = 0, door = 0, lights = true }) => (
  <group position={p} rotation={[0, rot, 0]}>
    {/* legs */}
    {[
      [-6, -5],
      [6, -5],
      [-6, 5],
      [6, 5],
    ].map(([x, z], i) => (
      <React.Fragment key={i}>
        <B s={[0.6, 6, 0.6]} p={[x, 3, z]} r={[0, 0, x > 0 ? -0.3 : 0.3]} c="#9a9a9a" />
        <B s={[2, 0.3, 2]} p={[x * 1.15, 0.15, z]} c="#7a7a7a" />
      </React.Fragment>
    ))}
    {/* body */}
    <B s={[12, 7, 10]} p={[0, 8.5, 0]} c="#ececec" />
    <B s={[12.2, 1.2, 10.2]} p={[0, 5.4, 0]} c="#3a3a3a" />
    <mesh position={[0, 14.5, 0]} rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[3.5, 7.5, 5, 4]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
    <B s={[3, 1.8, 0.2]} p={[0, 15.6, 3.3]} c="#1a2a40" e="#2a4a80" ei={lights ? 0.8 : 0} />
    {/* solar panels */}
    {[-1, 1].map((sx) => (
      <group key={sx} position={[sx * 6, 9, 0]}>
        <B s={[1.4, 0.3, 0.3]} p={[sx * 0.7, 0, 0]} c="#9a9a9a" />
        <B s={[9, 0.15, 4]} p={[sx * 5.8, 0, 0]} c="#1a2a6a" metal={0.4} />
        {Array.from({ length: 6 }).map((_, k) => (
          <B key={k} s={[0.08, 0.17, 4]} p={[sx * (1.8 + k * 1.5), 0, 0]} c="#9aa0b0" />
        ))}
      </group>
    ))}
    {/* markings */}
    <TextSign text="ODYSSEY JX-11" p={[0, 10.6, 5.02]} w={7} h={1.2} bg="#ececec" fg="#1a2a6a" />
    <B s={[12.1, 0.5, 0.1]} p={[0, 9.4, 5.02]} c="#e0392b" />
    <TextSign text="USA · 2011" p={[-3.6, 7.2, 5.03]} w={3} h={0.6} bg="#ececec" fg="#333333" />
    {/* airlock */}
    <B s={[3.2, 4.4, 0.1]} p={[3.2, 7.6, 5.02]} c="#202020" />
    <group position={[1.6, 5.4, 5.08]} rotation={[0, -door * 1.7, 0]}>
      <B s={[3.2, 4.4, 0.25]} p={[1.6, 2.2, 0]} c="#c8c8c8" />
      <B s={[1.4, 1.4, 0.1]} p={[1.6, 3, 0.15]} c="#3a5a8a" />
    </group>
    {/* ramp */}
    <B s={[3, 0.3, 7]} p={[3.2, 2.7, 8.2]} r={[0.72, 0, 0]} c="#9a9a9a" />
    {lights ? (
      <>
        <B s={[0.5, 0.5, 0.5]} p={[-6, 12, 5]} c="#ff3b2a" e="#ff2a1a" ei={2} />
        <B s={[0.5, 0.5, 0.5]} p={[6, 12, 5]} c="#3bff6a" e="#2aff5a" ei={2} />
        <pointLight position={[3.2, 9, 8]} intensity={40} color="#fff1d8" distance={14} decay={1.6} />
      </>
    ) : null}
  </group>
);

/* ---------------- living golden keys ---------------- */
export const Key: React.FC<{
  p: V3;
  rotY?: number;
  t: number;
  awake?: number; // 0 asleep (lying), 1 awake (standing)
  walk?: number;
  s?: number;
  eyes?: number;
  angry?: boolean;
}> = ({ p, rotY = 0, t, awake = 1, walk = 0, s = 1, eyes, angry = true }) => {
  const w = Math.sin(t * 9) * 0.5 * walk;
  const open = eyes ?? awake;
  return (
    <group position={p} rotation={[(-Math.PI / 2) * (1 - awake), rotY, 0]} scale={s}>
      {/* legs */}
      <group position={[-0.25, 1.2, 0]} rotation={[w, 0, 0]}>
        <B s={[0.12, 1.2, 0.12]} p={[0, -0.6, 0]} c="#3a2a10" />
        <B s={[0.3, 0.1, 0.4]} p={[0, -1.2, 0.1]} c="#3a2a10" />
      </group>
      <group position={[0.25, 1.2, 0]} rotation={[-w, 0, 0]}>
        <B s={[0.12, 1.2, 0.12]} p={[0, -0.6, 0]} c="#3a2a10" />
        <B s={[0.3, 0.1, 0.4]} p={[0, -1.2, 0.1]} c="#3a2a10" />
      </group>
      {/* shaft with teeth */}
      <B s={[0.45, 1.8, 0.25]} p={[0, 2.1, 0]} c="#d8a82a" metal={0.6} />
      <B s={[0.4, 0.3, 0.25]} p={[0.35, 1.5, 0]} c="#d8a82a" metal={0.6} />
      <B s={[0.3, 0.25, 0.25]} p={[0.3, 1.95, 0]} c="#d8a82a" metal={0.6} />
      {/* skinny arms */}
      <B s={[0.1, 0.9, 0.1]} p={[-0.45, 2.4, 0]} r={[0, 0, 0.6 + w * 0.3]} c="#3a2a10" />
      <B s={[0.1, 0.9, 0.1]} p={[0.45, 2.4, 0]} r={[0, 0, -0.6 - w * 0.3]} c="#3a2a10" />
      {/* ring head */}
      <mesh position={[0, 3.7, 0]}>
        <torusGeometry args={[0.85, 0.26, 10, 24]} />
        <meshStandardMaterial color="#e8b830" metalness={0.65} roughness={0.3} emissive="#6a4a00" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 3.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.1, 20]} />
        <meshStandardMaterial color="#c8962a" metalness={0.5} roughness={0.4} />
      </mesh>
      <group position={[0, 3.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* face drawn on the disc (local z = up after rotation) */}
      </group>
      <B s={[0.18, 0.08 + 0.18 * open, 0.04]} p={[-0.24, 3.85, 0.07]} c={open > 0.5 ? "#ffffff" : "#2a1a00"} />
      <B s={[0.18, 0.08 + 0.18 * open, 0.04]} p={[0.24, 3.85, 0.07]} c={open > 0.5 ? "#ffffff" : "#2a1a00"} />
      {open > 0.5 ? (
        <>
          <B s={[0.08, 0.1, 0.05]} p={[-0.22, 3.84, 0.09]} c="#111" />
          <B s={[0.08, 0.1, 0.05]} p={[0.26, 3.84, 0.09]} c="#111" />
          {angry ? (
            <>
              <B s={[0.24, 0.05, 0.05]} p={[-0.24, 4.03, 0.09]} r={[0, 0, -0.4]} c="#2a1a00" />
              <B s={[0.24, 0.05, 0.05]} p={[0.24, 4.03, 0.09]} r={[0, 0, 0.4]} c="#2a1a00" />
            </>
          ) : null}
          <B s={[0.4, 0.14, 0.05]} p={[0, 3.48, 0.08]} c="#2a0a00" />
          <B s={[0.07, 0.07, 0.06]} p={[-0.1, 3.53, 0.1]} c="#ffffff" />
          <B s={[0.07, 0.07, 0.06]} p={[0.1, 3.53, 0.1]} c="#ffffff" />
        </>
      ) : null}
    </group>
  );
};

// a deterministic field of keys
export const KEY_FIELD: [number, number, number][] = Array.from({ length: 80 }).map((_, i) => {
  const a = i * 2.399;
  const r = 3 + Math.sqrt(i) * 3.2;
  return [Math.sin(a) * r, Math.cos(a) * r + 30, (i * 1.7) % (Math.PI * 2)];
});

/* ---------------- ship interior ---------------- */
export const ShipInterior: React.FC<{ t: number; alarm?: boolean; vent?: number; keysIn?: number; dark?: boolean }> = ({ t, alarm, vent = 0, keysIn = 0, dark }) => {
  const a = alarm ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <ambientLight intensity={dark ? 0.12 : 0.4} color="#d8e4ff" />
      {!dark ? (
        <>
          <pointLight position={[0, 6.6, -4]} intensity={50} color="#e8f0ff" distance={16} decay={1.5} />
          <pointLight position={[0, 6.6, 6]} intensity={50} color="#e8f0ff" distance={16} decay={1.5} />
        </>
      ) : null}
      {alarm ? <pointLight position={[0, 6, 1]} intensity={a * 90} color="#ff2a1a" distance={22} decay={1.4} /> : null}
      {/* corridor: x[-4,4], z[-14,14], h 7.5 */}
      <B s={[8, 0.2, 28]} p={[0, -0.1, 0]} c="#3a3e46" />
      {Array.from({ length: 14 }).map((_, i) => (
        <B key={i} s={[7.6, 0.03, 0.15]} p={[0, 0.02, -13 + i * 2]} c="#22252c" />
      ))}
      <B s={[0.3, 7.6, 28]} p={[-4, 3.8, 0]} c="#c8ccd4" />
      <B s={[0.3, 7.6, 28]} p={[4, 3.8, 0]} c="#c8ccd4" />
      <B s={[8, 0.3, 28]} p={[0, 7.6, 0]} c="#9aa0aa" />
      <B s={[8, 7.6, 0.3]} p={[0, 3.8, -14]} c="#b8bcc4" />
      {/* wall panels + light strips */}
      {Array.from({ length: 7 }).map((_, i) => (
        <React.Fragment key={i}>
          <B s={[0.1, 4.6, 3.4]} p={[-3.82, 3.4, -12 + i * 4]} c="#b0b4bc" />
          <B s={[0.1, 4.6, 3.4]} p={[3.82, 3.4, -12 + i * 4]} c="#b0b4bc" />
          <B s={[7.6, 0.1, 0.4]} p={[0, 7.42, -12 + i * 4]} c="#ffffff" e="#ffffff" ei={dark ? 0.05 : 0.9} />
        </React.Fragment>
      ))}
      {/* pipes */}
      <mesh position={[-3.5, 6.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 28, 10]} />
        <meshStandardMaterial color="#e0702a" />
      </mesh>
      {/* the vent (ceiling) */}
      <group position={[1.6, 7.42, 2]}>
        <B s={[2.2, 0.1, 2.2]} c="#2a2c32" />
        <group position={[-1.1, 0, 0]} rotation={[0, 0, -vent * 1.3]}>
          <B s={[2.2, 0.08, 2.2]} p={[1.1, -0.06, 0]} c="#8a8e96" />
          {Array.from({ length: 5 }).map((_, i) => (
            <B key={i} s={[2.0, 0.1, 0.12]} p={[1.1, -0.1, -0.8 + i * 0.4]} c="#5a5e66" />
          ))}
        </group>
      </group>
      {/* keys coming in */}
      {Array.from({ length: Math.round(keysIn * 10) }).map((_, i) => (
        <Key key={i} p={[1.6 + Math.sin(i * 2.1) * 2, 0, 2 - i * 1.6 + ((t * 3) % 1.6)]} rotY={Math.PI} t={t + i} walk={1} s={0.8} />
      ))}
      {/* airlock at the end */}
      <B s={[3.4, 5.4, 0.2]} p={[0, 2.7, -13.8]} c="#5a5e66" />
      <B s={[2.6, 2.6, 0.1]} p={[0, 3.6, -13.66]} c="#1a2a40" e="#2a4a80" ei={0.4} />
      <TextSign text="AIRLOCK" p={[0, 5.9, -13.6]} w={2.4} h={0.5} bg="#ffd34a" fg="#111" />
      <TextSign text="JX-11" p={[-3.8, 5.2, 4]} r={[0, Math.PI / 2, 0]} w={2} h={0.6} bg="#2a3a6a" fg="#ffffff" />
    </>
  );
};

export const Cockpit: React.FC<{ t: number; alarm?: boolean }> = ({ t, alarm }) => {
  const a = alarm ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
  return (
    <>
      <color attach="background" args={["#020208"]} />
      <ambientLight intensity={0.35} color="#d8e4ff" />
      <pointLight position={[0, 6, 2]} intensity={30} color="#cfe0ff" distance={12} decay={1.5} />
      {alarm ? <pointLight position={[0, 5, 0]} intensity={a * 70} color="#ff2a1a" distance={14} decay={1.4} /> : null}
      <Stars count={600} />
      <Jupiter t={t} p={[30, 40, -220]} r={70} />
      <B s={[10, 0.2, 10]} p={[0, -0.1, 0]} c="#2a2c32" />
      <B s={[0.3, 8, 10]} p={[-5, 4, 0]} c="#9aa0aa" />
      <B s={[0.3, 8, 10]} p={[5, 4, 0]} c="#9aa0aa" />
      <B s={[10, 0.3, 10]} p={[0, 8, 0]} c="#8a9098" />
      {/* window frame (open to space) */}
      <B s={[10, 2.6, 0.4]} p={[0, 1.3, -5]} c="#8a9098" />
      <B s={[10, 1.2, 0.4]} p={[0, 7.4, -5]} c="#8a9098" />
      <B s={[0.4, 4.4, 0.4]} p={[0, 4.6, -5]} c="#6a7078" />
      {/* consoles */}
      <B s={[9, 1.4, 2]} p={[0, 2.2, -3.6]} r={[-0.4, 0, 0]} c="#3a3e46" />
      {Array.from({ length: 16 }).map((_, i) => (
        <B key={i} s={[0.35, 0.08, 0.3]} p={[-3.6 + (i % 8) * 1.0, 2.95 - Math.floor(i / 8) * 0.25, -3.5 + Math.floor(i / 8) * 0.5]} c={["#3bff6a", "#ffd34a", "#ff3b2a", "#3ab0ff"][i % 4]} e={["#3bff6a", "#ffd34a", "#ff3b2a", "#3ab0ff"][i % 4]} ei={0.8 + 0.6 * Math.sin(t * 5 + i)} />
      ))}
      <B s={[2.2, 1.4, 0.1]} p={[-2.6, 3.6, -3.9]} c="#0a1a0a" e="#1a4a1a" ei={0.7} />
      <B s={[2.2, 1.4, 0.1]} p={[2.6, 3.6, -3.9]} c="#0a1a0a" e="#1a4a1a" ei={0.7} />
      {/* seats */}
      {[-2, 2].map((x) => (
        <React.Fragment key={x}>
          <B s={[2, 0.6, 2]} p={[x, 1.6, -0.6]} c="#2a3a6a" />
          <B s={[2, 2.6, 0.5]} p={[x, 3, 0.4]} c="#2a3a6a" />
        </React.Fragment>
      ))}
    </>
  );
};

export const EscapePod: React.FC<{ p: V3; t: number; flame?: number; r?: V3 }> = ({ p, t, flame = 0, r }) => (
  <group position={p} rotation={r}>
    <mesh position={[0, 2.5, 0]}>
      <cylinderGeometry args={[1.2, 2.2, 3.6, 16]} />
      <meshStandardMaterial color="#e8e8e8" />
    </mesh>
    <mesh position={[0, 4.8, 0]}>
      <coneGeometry args={[1.2, 1.4, 16]} />
      <meshStandardMaterial color="#d8d8d8" />
    </mesh>
    <B s={[0.9, 0.9, 0.1]} p={[0, 3, 1.75]} c="#1a2a40" e="#2a4a80" ei={0.6} />
    <TextSign text="POD-1" p={[0, 1.6, 2.05]} w={1.4} h={0.4} bg="#e8e8e8" fg="#e0392b" />
    {flame > 0 ? (
      <>
        <mesh position={[0, -0.6 - flame, 0]} rotation={[Math.PI, 0, 0]} scale={[1, flame * (1 + 0.2 * Math.sin(t * 40)), 1]}>
          <coneGeometry args={[1.2, 3, 12]} />
          <meshBasicMaterial color="#ffb84a" toneMapped={false} transparent opacity={0.85} />
        </mesh>
        <pointLight position={[0, -1, 0]} intensity={flame * 120} color="#ff9a3a" distance={30} decay={1.4} />
      </>
    ) : null}
  </group>
);
