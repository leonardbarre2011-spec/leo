import React, { useLayoutEffect, useMemo, useRef } from "react";
import { CanvasTexture, Color, InstancedMesh, Object3D, SRGBColorSpace } from "three";
import { B } from "../../lib/Sets";
import { Bird, RoundTree, PerfectHouse, THEMES } from "./Brightwater";

type V3 = [number, number, number];

/* ---------------- text on a plane (signs, labels) ---------------- */
export const TextSign: React.FC<{
  text: string;
  p?: V3;
  r?: V3;
  w: number;
  h: number;
  bg?: string;
  fg?: string;
  glow?: boolean;
  border?: string;
}> = ({ text, p, r, w, h, bg = "#ffffff", fg = "#111111", glow, border }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    const pxW = 1024;
    const pxH = Math.round((pxW * h) / w);
    c.width = pxW;
    c.height = pxH;
    const g = c.getContext("2d")!;
    g.fillStyle = bg;
    g.fillRect(0, 0, pxW, pxH);
    if (border) {
      g.strokeStyle = border;
      g.lineWidth = pxH * 0.08;
      g.strokeRect(pxH * 0.06, pxH * 0.06, pxW - pxH * 0.12, pxH - pxH * 0.12);
    }
    g.fillStyle = fg;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const lines = text.split("\n");
    let size = (pxH / lines.length) * 0.6;
    g.font = `900 ${size}px MontserratLocal, "DejaVu Sans", sans-serif`;
    const widest = Math.max(...lines.map((l) => g.measureText(l).width));
    if (widest > pxW * 0.86) size *= (pxW * 0.86) / widest;
    g.font = `900 ${size}px MontserratLocal, "DejaVu Sans", sans-serif`;
    lines.forEach((l, i) => g.fillText(l, pxW / 2, (pxH / lines.length) * (i + 0.55)));
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [text, w, h, bg, fg, border]);
  return (
    <mesh position={p} rotation={r}>
      <planeGeometry args={[w, h]} />
      {glow ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshStandardMaterial map={tex} roughness={0.7} />}
    </mesh>
  );
};

/* ---------------- Milo's bedroom ---------------- */
export const Bedroom: React.FC<{ t: number; empty?: boolean; bird?: boolean; night?: boolean }> = ({ t, bird = true, night }) => (
  <>
    <color attach="background" args={["#0a0c10"]} />
    <ambientLight intensity={night ? 0.25 : 0.5} color={night ? "#6a80c0" : "#fff0dd"} />
    <pointLight position={[0, 7, 2]} intensity={night ? 10 : 60} color="#ffe2b0" distance={20} decay={1.5} />
    <pointLight position={[4.5, 5, -2]} intensity={night ? 30 : 50} color={night ? "#6a8ad8" : "#bfe6ff"} distance={14} decay={1.5} />
    <B s={[12, 0.2, 12]} p={[0, -0.1, 0]} c="#b88a5a" />
    <B s={[12, 8, 0.2]} p={[0, 4, -6]} c="#9cc8ee" />
    <B s={[0.2, 8, 12]} p={[-6, 4, 0]} c="#9cc8ee" />
    <B s={[0.2, 8, 12]} p={[6, 4, 0]} c="#9cc8ee" />
    <B s={[12, 0.2, 12]} p={[0, 8, 0]} c="#f2efe8" />
    {/* window on right wall */}
    <B s={[0.1, 3, 3.6]} p={[5.88, 4.6, -1.5]} c={night ? "#1a2a55" : "#bfe9ff"} e={night ? "#22336a" : "#bfe9ff"} ei={0.8} />
    <B s={[0.15, 0.2, 3.8]} p={[5.85, 4.6, -1.5]} c="#ffffff" />
    <B s={[0.15, 3.2, 0.2]} p={[5.85, 4.6, -1.5]} c="#ffffff" />
    {/* bed */}
    <B s={[3.4, 1, 6]} p={[-4, 0.5, -2.6]} c="#7a5a3a" />
    <B s={[3.2, 0.5, 5.8]} p={[-4, 1.25, -2.6]} c="#f2f2f2" />
    <B s={[3.3, 0.35, 4]} p={[-4, 1.55, -1.6]} c="#d23c3c" />
    <B s={[2.4, 0.5, 1]} p={[-4, 1.7, -5]} c="#ffffff" />
    <B s={[3.4, 2.4, 0.3]} p={[-4, 1.6, -5.7]} c="#7a5a3a" />
    {/* desk with the shoebox */}
    <B s={[3.6, 0.25, 1.8]} p={[2.6, 2.4, -4.8]} c="#a87a4a" />
    <B s={[0.2, 2.4, 0.2]} p={[1.0, 1.2, -4.1]} c="#7a5a3a" />
    <B s={[0.2, 2.4, 0.2]} p={[4.2, 1.2, -4.1]} c="#7a5a3a" />
    <B s={[1.6, 0.7, 1.1]} p={[2.2, 2.88, -4.8]} c="#e3b07a" />
    <B s={[1.4, 0.05, 0.9]} p={[2.2, 3.24, -4.8]} c="#2a1a10" />
    {bird ? <Bird p={[2.2, 3.35, -4.8]} heading={0.4} flap={0.35} s={0.5} /> : null}
    {/* poster + rug + bike */}
    <B s={[2.2, 2.8, 0.05]} p={[-1, 5.2, -5.85]} c="#ffd34a" />
    <B s={[1.4, 1.4, 0.06]} p={[-1, 5.5, -5.8]} c="#2f6fd6" />
    <B s={[5, 0.05, 3.4]} p={[0.5, 0.02, 0.5]} c="#5ab08a" />
    {/* desk lamp */}
    <B s={[0.3, 1.2, 0.3]} p={[3.8, 3.1, -5.1]} c="#333" />
    <B s={[0.8, 0.4, 0.6]} p={[3.8, 3.8, -4.9]} c="#d23c3c" e="#ffcf7a" ei={night ? 0.8 : 0.2} />
    <group position={[0, 0, 0]} rotation={[0, t * 0, 0]} />
  </>
);

/* ---------------- bakery interior ---------------- */
export const BakeryInside: React.FC = () => (
  <>
    <color attach="background" args={["#1a0f10"]} />
    <ambientLight intensity={0.55} color="#fff0e6" />
    <pointLight position={[0, 7, 1]} intensity={90} color="#ffe2c0" distance={24} decay={1.5} />
    <B s={[16, 0.2, 14]} p={[0, -0.1, 0]} c="#f3e3d0" />
    {Array.from({ length: 8 }).map((_, i) =>
      Array.from({ length: 7 }).map((__, j) =>
        (i + j) % 2 ? <B key={`${i}-${j}`} s={[2, 0.02, 2]} p={[-7 + i * 2, 0.01, -6 + j * 2]} c="#e0a0b0" /> : null,
      ),
    )}
    <B s={[16, 8, 0.2]} p={[0, 4, -7]} c="#f7c6d0" />
    <B s={[0.2, 8, 14]} p={[-8, 4, 0]} c="#f7c6d0" />
    <B s={[0.2, 8, 14]} p={[8, 4, 0]} c="#f7c6d0" />
    <B s={[16, 0.2, 14]} p={[0, 8, 0]} c="#fff6ee" />
    {/* shelves with bread */}
    {[2.6, 4.2, 5.8].map((y) => (
      <React.Fragment key={y}>
        <B s={[10, 0.2, 1]} p={[0, y, -6.4]} c="#a87a4a" />
        {Array.from({ length: 8 }).map((_, i) => (
          <B key={i} s={[0.9, 0.5, 0.6]} p={[-4.2 + i * 1.2, y + 0.35, -6.4]} c={["#d79a4a", "#c9803a", "#e8b46a"][i % 3]} />
        ))}
      </React.Fragment>
    ))}
    {/* counter + glass display */}
    <B s={[10, 2.6, 1.8]} p={[0, 1.3, -2.6]} c="#ffffff" />
    <B s={[10.2, 0.2, 2]} p={[0, 2.7, -2.6]} c="#e0475f" />
    <mesh position={[-2, 3.4, -2.2]}>
      <boxGeometry args={[5, 1.2, 1.2]} />
      <meshStandardMaterial color="#cfeeff" transparent opacity={0.35} roughness={0.1} />
    </mesh>
    {Array.from({ length: 6 }).map((_, i) => (
      <B key={i} s={[0.6, 0.35, 0.5]} p={[-4 + i * 0.8, 3.0, -2.2]} c={["#f2c26a", "#e07ab0", "#8a5a3a"][i % 3]} />
    ))}
    {/* cash register */}
    <B s={[1.2, 0.8, 0.9]} p={[3.5, 3.2, -2.6]} c="#5a5d66" />
    <B s={[0.8, 0.3, 0.1]} p={[3.5, 3.5, -2.1]} c="#2fd16a" e="#2fd16a" ei={0.5} />
    <TextSign text="BRIGHTWATER BAKERY" p={[0, 6.9, -6.85]} w={8} h={1} bg="#e0475f" fg="#ffffff" />
  </>
);

/* ---------------- bike ---------------- */
export const Bike: React.FC<{ p: V3; rot?: number; t: number; speed?: number }> = ({ p, rot = 0, t, speed = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[-1.3, 1.3].map((z) => (
      <group key={z} position={[0, 1, z]} rotation={[-t * speed * 3, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.9, 0.12, 8, 24]} />
          <meshStandardMaterial color="#1b1b1b" roughness={0.7} />
        </mesh>
        <B s={[0.06, 1.7, 0.08]} c="#9a9a9a" />
      </group>
    ))}
    <B s={[0.18, 0.18, 2.6]} p={[0, 1.6, 0]} r={[0.25, 0, 0]} c="#2f6fd6" />
    <B s={[0.18, 1.4, 0.18]} p={[0, 1.6, 0.45]} r={[-0.3, 0, 0]} c="#2f6fd6" />
    <B s={[0.5, 0.15, 0.8]} p={[0, 2.35, 0.65]} c="#1b1b1b" />
    <B s={[0.18, 1.2, 0.18]} p={[0, 2.0, -1.2]} r={[0.2, 0, 0]} c="#2f6fd6" />
    <B s={[1.6, 0.12, 0.12]} p={[0, 2.6, -1.35]} c="#1b1b1b" />
  </group>
);
// Milo's pose while pedalling (character placed at bike position, raised)
export const pedal = (t: number) => ({
  legL: -1.1 + Math.sin(t * 9) * 0.5,
  legR: -1.1 - Math.sin(t * 9) * 0.5,
  armL: -1.25,
  armR: -1.25,
  lean: 0.25,
});

/* ---------------- lake, boat and the painted sky ---------------- */
const useSkyWallTexture = (seams: boolean) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, "#5fb4f0");
    grad.addColorStop(1, "#bfe6ff");
    g.fillStyle = grad;
    g.fillRect(0, 0, 2048, 1024);
    g.fillStyle = "rgba(255,255,255,0.95)";
    [
      [300, 300, 260],
      [900, 220, 320],
      [1500, 330, 280],
      [1850, 160, 200],
    ].forEach(([x, y, w]) => {
      g.fillRect(x - w / 2, y - 40, w, 80);
      g.fillRect(x - w / 4, y - 90, w / 2, 70);
    });
    // panel seams: the giveaway
    g.strokeStyle = seams ? "rgba(40,80,120,0.35)" : "rgba(0,0,0,0)";
    g.lineWidth = 4;
    for (let x = 0; x <= 2048; x += 256) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, 1024);
      g.stroke();
    }
    for (let y = 0; y <= 1024; y += 256) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(2048, y);
      g.stroke();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [seams]);

export const SKY_WALL_Z = -150;

export const Lake: React.FC<{ t: number; still?: number; door?: number; townFar?: boolean; seams?: boolean }> = ({ t, still = 0, door = 0, townFar = true, seams = false }) => {
  const tex = useSkyWallTexture(seams);
  const amp = 1 - still;
  return (
    <>
      <color attach="background" args={["#8fd0ff"]} />
      <fog attach="fog" args={["#cdeeff", 60, 260]} />
      <hemisphereLight args={["#ffffff", "#3a6a8a", 1.2]} />
      <directionalLight position={[30, 50, 25]} intensity={1.5} color="#fff4dc" />
      {/* water */}
      <B s={[600, 0.2, 170]} p={[0, -0.1, -65]} c="#3f8fcf" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = ((i * 37) % 60) - 30;
        const z = -((i * 53) % 150);
        return <B key={i} s={[2.2, 0.06, 0.25]} p={[x + Math.sin(t * 1.5 + i) * amp, 0.05 + Math.sin(t * 2 + i) * 0.05 * amp, z]} c="#8fc8f0" />;
      })}
      {/* shore + dock */}
      <B s={[600, 0.6, 120]} p={[0, 0.2, 80]} c="#62c15a" />
      <B s={[600, 0.3, 4]} p={[0, 0.05, 19]} c="#e6d6a8" />
      <B s={[3, 0.3, 10]} p={[0, 0.6, 14]} c="#a87a4a" />
      {townFar
        ? [-40, -26, -12, 2, 16, 30, 44].map((x, i) => <PerfectHouse key={i} p={[x, 0.5, 52]} rot={Math.PI} th={THEMES.brightwater} />)
        : null}
      {[-50, -20, 25, 55].map((x, i) => (
        <RoundTree key={i} p={[x, 0.5, 30]} s={1.2} />
      ))}
      {/* the painted sky */}
      <mesh position={[0, 60, SKY_WALL_Z]}>
        <planeGeometry args={[600, 140]} />
        <meshBasicMaterial map={tex} toneMapped={false} fog={false} />
      </mesh>
      {/* tiny door at water level */}
      <group position={[0, 0, SKY_WALL_Z + 0.05]}>
        <B s={[3.2, 4.6, 0.1]} p={[0, 2.3, 0]} c="#7fbfe8" />
        <group position={[-1.5, 0, 0.06]} rotation={[0, -door * 1.6, 0]}>
          <B s={[3.0, 4.4, 0.12]} p={[1.5, 2.2, 0]} c="#9fd4f4" />
        </group>
        <B s={[3.4, 0.12, 0.12]} p={[0, 4.6, 0.1]} c="#4f8fc0" />
        <B s={[0.12, 4.6, 0.12]} p={[-1.65, 2.3, 0.1]} c="#4f8fc0" />
        <B s={[0.12, 4.6, 0.12]} p={[1.65, 2.3, 0.1]} c="#4f8fc0" />
        <TextSign text="STAFF ONLY" p={[0, 3.6, 0.2]} w={2.2} h={0.55} bg="#f2f2f2" fg="#c0392b" />
        {door > 0 ? <B s={[3, 4.4, 0.05]} p={[0, 2.2, -0.1]} c="#020203" /> : null}
      </group>
    </>
  );
};

export const Boat: React.FC<{ p: V3; rot?: number; row?: number; t: number }> = ({ p, rot = 0, row = 0, t }) => {
  const o = Math.sin(t * 4) * 0.6 * row;
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <B s={[2.6, 0.9, 5.6]} p={[0, 0.45, 0]} c="#a8683a" />
      <B s={[2.2, 0.2, 5.2]} p={[0, 0.85, 0]} c="#7a4a2a" />
      <B s={[1.6, 0.9, 1.4]} p={[0, 0.45, -3.2]} r={[0, Math.PI / 4, 0]} c="#a8683a" />
      <B s={[2.4, 0.2, 0.6]} p={[0, 1.0, 0.6]} c="#c98a4a" />
      {[-1, 1].map((sx) => (
        <group key={sx} position={[sx * 1.3, 1.2, 0.6]} rotation={[o, 0, sx * 0.5]}>
          <B s={[0.12, 0.12, 4]} p={[sx * 0.2, 0, 0]} r={[0, sx * 0.2, 0]} c="#7a4a2a" />
        </group>
      ))}
    </group>
  );
};

/* ---------------- river + closed bridge ---------------- */
export const BridgeSet: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={["#8fd0ff"]} />
    <fog attach="fog" args={["#cdeeff", 50, 200]} />
    <hemisphereLight args={["#ffffff", "#3a6a8a", 1.2]} />
    <directionalLight position={[30, 50, 25]} intensity={1.6} color="#fff4dc" />
    <B s={[400, 0.2, 400]} p={[0, -0.1, 0]} c="#62c15a" />
    <B s={[400, 0.3, 24]} p={[0, -0.05, -20]} c="#3f8fcf" />
    {Array.from({ length: 20 }).map((_, i) => (
      <B key={i} s={[2, 0.06, 0.25]} p={[((i * 23) % 80) - 40 + ((t * 2) % 8), 0.12, -12 - ((i * 7) % 16)]} c="#8fc8f0" />
    ))}
    {/* road to the bridge */}
    <B s={[8, 0.05, 80]} p={[0, 0.03, 30]} c="#5a5d66" />
    {/* bridge deck + rails */}
    <B s={[8, 0.8, 30]} p={[0, 1.4, -20]} c="#c8c0b0" />
    {[-1, 1].map((sx) => (
      <React.Fragment key={sx}>
        <B s={[0.4, 1.2, 30]} p={[sx * 3.8, 2.4, -20]} c="#a8a090" />
        {[-32, -8].map((z) => (
          <B key={z} s={[1.5, 6, 1.5]} p={[sx * 3.8, 3, z]} c="#a8a090" />
        ))}
      </React.Fragment>
    ))}
    <B s={[8, 0.6, 4]} p={[0, 0.7, -3]} r={[-0.35, 0, 0]} c="#c8c0b0" />
    {/* barrier + sign */}
    <B s={[7, 0.5, 0.3]} p={[0, 1.6, 0]} c="#ffffff" />
    {Array.from({ length: 7 }).map((_, i) => (
      <B key={i} s={[0.5, 0.52, 0.32]} p={[-3 + i, 1.6, 0]} c={i % 2 ? "#e0392b" : "#ffffff"} />
    ))}
    <B s={[0.3, 1.6, 0.3]} p={[-3.2, 0.8, 0]} c="#555" />
    <B s={[0.3, 1.6, 0.3]} p={[3.2, 0.8, 0]} c="#555" />
    <B s={[0.2, 3.4, 0.2]} p={[0, 1.7, 0.3]} c="#555" />
    <TextSign text={"CLOSED\nFOR REPAIRS"} p={[0, 3.6, 0.42]} w={3.6} h={1.8} bg="#ffd34a" fg="#111" border="#111" />
    {/* untouched tools and cones, with flowers grown in */}
    {[
      [-2.6, 3],
      [2.4, 2.4],
      [-1.2, 4.2],
    ].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.45, 1.2, 4]} />
          <meshStandardMaterial color="#ff7a1a" />
        </mesh>
        <B s={[0.2, 0.2, 0.2]} p={[0.5, 0.3, 0.2]} c="#e07ab0" />
        <B s={[0.08, 0.3, 0.08]} p={[0.5, 0.15, 0.2]} c="#3fae4a" />
      </group>
    ))}
    <B s={[1.4, 0.2, 0.5]} p={[2.6, 0.1, 4.6]} c="#8a8a8a" />
    <B s={[0.2, 0.15, 1.4]} p={[1.8, 0.08, 4.4]} c="#7a4a2a" />
    {[-30, -16, 16, 30].map((x, i) => (
      <RoundTree key={i} p={[x, 0, 8 + (i % 2) * 6]} s={1.3} />
    ))}
    <B s={[400, 0.2, 200]} p={[0, -0.1, -132]} c="#62c15a" />
  </>
);

/* ---------------- staircase into the dark ---------------- */
export const Stairs: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={["#010102"]} />
    <fog attach="fog" args={["#010102", 10, 50]} />
    <ambientLight intensity={0.35} color="#7a8ab0" />
    {Array.from({ length: 70 }).map((_, i) => (
      <React.Fragment key={i}>
        <B s={[4, 0.5, 1]} p={[0, 0.25 + i * 0.5, -i]} c="#2a2c32" />
        {i % 5 === 0 ? (
          <>
            <B s={[0.25, 0.25, 0.25]} p={[-2.2, 1.2 + i * 0.5, -i]} c="#ffd27a" e="#ffb84a" ei={1.5} />
            <pointLight position={[-1.6, 1.6 + i * 0.5, -i]} color="#ffbf6b" intensity={16 + Math.sin(t * 3 + i) * 0.5} distance={9} decay={1.6} />
          </>
        ) : null}
      </React.Fragment>
    ))}
    <B s={[0.3, 40, 75]} p={[-2.2, 18, -35]} r={[0.46, 0, 0]} c="#16171b" />
    <B s={[0.3, 40, 75]} p={[2.2, 18, -35]} r={[0.46, 0, 0]} c="#16171b" />
  </>
);

/* ---------------- the room of screens ---------------- */
const useMiniTownTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 96;
    const g = c.getContext("2d")!;
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, 160, 58);
    g.fillStyle = "#c8c8c8";
    g.fillRect(0, 58, 160, 38);
    g.fillStyle = "#ffffff";
    [
      [20, 40],
      [62, 36],
      [104, 42],
    ].forEach(([x, y]) => {
      g.fillStyle = "#f0f0f0";
      g.fillRect(x, y, 30, 24);
      g.fillStyle = "#9a9a9a";
      g.beginPath();
      g.moveTo(x - 4, y);
      g.lineTo(x + 15, y - 14);
      g.lineTo(x + 34, y);
      g.fill();
    });
    g.fillStyle = "#555";
    g.fillRect(76, 66, 6, 12);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

const PALETTE = ["#8fd0ff", "#ffcf8f", "#b9c9dc", "#ffb8de", "#9fe0b0", "#c0b0ff", "#ffe08a", "#7ab8e8"];

export const ScreenRoom: React.FC<{ t: number; rows?: number; cols?: number; radius?: number; fogFar?: number }> = ({ t, rows = 18, cols = 72, radius = 70, fogFar = 160 }) => {
  const tex = useMiniTownTexture();
  const ref = useRef<InstancedMesh>(null);
  const count = rows * cols;
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    const col = new Color();
    let k = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = (c / cols) * Math.PI * 2;
        o.position.set(Math.sin(a) * radius, 2.2 + r * 3.0, -Math.cos(a) * radius);
        o.rotation.set(0, -a, 0);
        o.updateMatrix();
        m.setMatrixAt(k, o.matrix);
        const flick = 0.75 + 0.25 * Math.sin(t * 2 + k * 1.7);
        col.set(PALETTE[(k * 7 + r) % PALETTE.length]).multiplyScalar(flick);
        m.setColorAt(k, col);
        k++;
      }
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <>
      <color attach="background" args={["#000002"]} />
      <fog attach="fog" args={["#000002", 30, fogFar]} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 20, 0]} intensity={300} color="#6a8aff" distance={120} decay={1.2} />
      <B s={[400, 0.2, 400]} p={[0, -0.1, 0]} c="#0b0c10" />
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <planeGeometry args={[4.2, 2.6]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </instancedMesh>
    </>
  );
};

/* one big, specific screen inside the room (Channel 4,812) */
export const FeaturedScreen: React.FC<{ p: V3; label?: string }> = ({ p, label = "CHANNEL 4,812" }) => {
  const tex = useMiniTownTexture();
  return (
    <group position={p}>
      <B s={[4.6, 3.0, 0.2]} p={[0, 0, -0.12]} c="#15161a" />
      <mesh>
        <planeGeometry args={[4.2, 2.6]} />
        <meshBasicMaterial map={tex} color="#8fd0ff" toneMapped={false} />
      </mesh>
      <TextSign text={label} p={[0, -1.9, 0]} w={2.6} h={0.45} bg="#b8b8b8" fg="#111" />
    </group>
  );
};
