import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, DirectionalLight, Mesh, PCFSoftShadowMap } from "three";
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
