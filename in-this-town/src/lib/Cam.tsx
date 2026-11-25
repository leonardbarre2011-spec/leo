import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

export type V3 = [number, number, number];

export const ease = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const lerp3 = (a: V3, b: V3, p: number): V3 => [
  lerp(a[0], b[0], p),
  lerp(a[1], b[1], p),
  lerp(a[2], b[2], p),
];

// Deterministic pseudo-noise for camera shake (no Math.random).
const n = (x: number) => Math.sin(x * 12.9898) * 0.5 + Math.sin(x * 4.1414 + 1.3) * 0.5;

export const Cam: React.FC<{
  from: V3;
  to?: V3;
  look: V3;
  lookTo?: V3;
  p: number;
  fov?: number;
  fovTo?: number;
  shake?: number;
  t?: number;
  linear?: boolean;
}> = ({ from, to, look, lookTo, p, fov = 40, fovTo, shake = 0, t = 0, linear }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const k = linear ? p : ease(p);
  const pos = lerp3(from, to ?? from, k);
  const tgt = lerp3(look, lookTo ?? look, k);
  // subtle handheld drift keeps every shot alive
  const drift = 0.04;
  const sx = n(t * 1.7) * (drift + shake);
  const sy = n(t * 2.3 + 5) * (drift + shake);
  useLayoutEffect(() => {
    camera.position.set(pos[0] + sx, pos[1] + sy, pos[2]);
    camera.lookAt(tgt[0], tgt[1], tgt[2]);
    camera.fov = lerp(fov, fovTo ?? fov, k);
    camera.near = 0.1;
    camera.far = 400;
    camera.updateProjectionMatrix();
  });
  return null;
};
