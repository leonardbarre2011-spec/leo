import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, CanvasTexture, Color, DirectionalLight, InstancedMesh, Mesh, Object3D, PCFSoftShadowMap, RepeatWrapping, SRGBColorSpace } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/* Shared rounded-box geometries (cached by size) so blocky parts get soft bevels. */
const cache = new Map<string, BufferGeometry>();
export const roundedBox = (w: number, h: number, d: number, r = 0.08): BufferGeometry => {
  const key = `${w}|${h}|${d}|${r}`;
  let g = cache.get(key);
  if (!g) {
    g = new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2.2, h / 2.2, d / 2.2));
    cache.set(key, g);
  }
  return g;
};

/* Turns on soft shadows for every mesh and directional light in the scene, every frame. */
export const AutoShadows: React.FC = () => {
  const { scene, gl } = useThree();
  useLayoutEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap;
    scene.traverse((o) => {
      if ((o as Mesh).isMesh) {
        const m = o as Mesh;
        const big = m.geometry?.boundingSphere ? m.geometry.boundingSphere.radius > 60 : false;
        m.castShadow = !big;
        m.receiveShadow = true;
      }
      if ((o as DirectionalLight).isDirectionalLight) {
        const l = o as DirectionalLight;
        if (!l.castShadow) {
          l.castShadow = true;
          l.shadow.mapSize.set(2048, 2048);
          const c = l.shadow.camera;
          c.left = -70;
          c.right = 70;
          c.top = 70;
          c.bottom = -70;
          c.near = 1;
          c.far = 300;
          l.shadow.bias = -0.0004;
          l.shadow.normalBias = 0.04;
          l.shadow.radius = 4;
          c.updateProjectionMatrix();
        }
      }
    });
  });
  return null;
};

/* ---------- procedural textures (deterministic) ---------- */

const texCache = new Map<string, CanvasTexture>();
// speckled noise texture around a base colour (grass, stone, dirt, concrete)
export const noiseTexture = (base: string, variance = 0.18, repeat = 40, kind: "speckle" | "tiles" | "planks" = "speckle"): CanvasTexture => {
  const key = `${base}|${variance}|${repeat}|${kind}`;
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  const n = parseInt(base.replace("#", ""), 16);
  const r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2600; i++) {
    const k = 1 + (rnd() - 0.5) * 2 * variance;
    g.fillStyle = `rgb(${Math.min(255, r * k)},${Math.min(255, gg * k)},${Math.min(255, b * k)})`;
    const s = 2 + rnd() * 5;
    g.fillRect(rnd() * 256, rnd() * 256, s, s);
  }
  if (kind === "tiles") {
    g.strokeStyle = "rgba(0,0,0,0.25)";
    g.lineWidth = 3;
    for (let x = 0; x <= 256; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(256, x); g.stroke(); }
  }
  if (kind === "planks") {
    g.strokeStyle = "rgba(0,0,0,0.3)";
    g.lineWidth = 2;
    for (let y = 0; y <= 256; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeat, repeat);
  texCache.set(key, t);
  return t;
};

export const TexturedGround: React.FC<{ size?: number; color: string; repeat?: number; kind?: "speckle" | "tiles" | "planks"; y?: number; variance?: number }> = ({ size = 400, color, repeat = 60, kind = "speckle", y = 0, variance = 0.18 }) => (
  <mesh position={[0, y - 0.1, 0]}>
    <boxGeometry args={[size, 0.2, size]} />
    <meshStandardMaterial map={noiseTexture(color, variance, repeat, kind)} roughness={0.95} />
  </mesh>
);

/* instanced grass tufts / pebbles scattered on a ring or disc (deterministic) */
export const Scatter: React.FC<{ count: number; rMin: number; rMax: number; color: string; size: [number, number, number]; y?: number; center?: [number, number] }> = ({ count, rMin, rMax, color, size, y = 0, center = [0, 0] }) => {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    const col = new Color();
    for (let i = 0; i < count; i++) {
      const a = i * 2.39996;
      const r = rMin + ((i * 0.6180339) % 1) * (rMax - rMin);
      const s = 0.6 + ((i * 0.37) % 1) * 0.8;
      o.position.set(center[0] + Math.sin(a) * r, y + (size[1] * s) / 2, center[1] + Math.cos(a) * r);
      o.rotation.set(0, i, 0);
      o.scale.set(s, s, s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      col.set(color).multiplyScalar(0.8 + ((i * 0.53) % 1) * 0.4);
      m.setColorAt(i, col);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count, rMin, rMax, color, size, y, center]);
  const geo = useMemo(() => size, [size]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={geo} />
      <meshStandardMaterial roughness={0.9} />
    </instancedMesh>
  );
};
