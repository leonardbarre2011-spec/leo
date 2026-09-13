import React from 'react';
import { C } from '../theme';

/**
 * The ball is the only object that survives every cut, so it is built rather
 * than drawn: the seams are real curves on a unit sphere, rotated in 3D and
 * clipped to the visible hemisphere. Spin it and the seams sweep round the
 * limb the way leather does, which is the part clip-art always gets wrong.
 */

type V3 = [number, number, number];

const rotate = (p: V3, yaw: number, pitch: number, roll: number): V3 => {
  let [x, y, z] = p;
  // roll (z)
  let c = Math.cos(roll), s = Math.sin(roll);
  [x, y] = [x * c - y * s, x * s + y * c];
  // yaw (y)
  c = Math.cos(yaw); s = Math.sin(yaw);
  [x, z] = [x * c + z * s, -x * s + z * c];
  // pitch (x)
  c = Math.cos(pitch); s = Math.sin(pitch);
  [y, z] = [y * c - z * s, y * s + z * c];
  return [x, y, z];
};

const SAMPLES = 88;

/** two perpendicular great circles + the two waisted seams of an 8-panel ball */
const SEAM_CURVES: V3[][] = (() => {
  const A = 0.62;
  const curves: V3[][] = [[], [], [], []];
  for (let i = 0; i <= SAMPLES; i++) {
    const th = (i / SAMPLES) * Math.PI * 2;
    curves[0].push([0, Math.cos(th), Math.sin(th)]);
    curves[1].push([Math.cos(th), 0, Math.sin(th)]);
    for (const [k, sign] of [[2, 1], [3, -1]] as const) {
      const ph = sign * A * Math.sin(2 * th);
      curves[k].push([Math.cos(ph) * Math.cos(th), Math.cos(ph) * Math.sin(th), Math.sin(ph)]);
    }
  }
  return curves;
})();

/** project the visible arcs of one curve to SVG sub-paths in a -100..100 box */
function seamPaths(curve: V3[], yaw: number, pitch: number, roll: number) {
  const out: string[] = [];
  let run: string[] = [];
  for (const p of curve) {
    const [x, y, z] = rotate(p, yaw, pitch, roll);
    if (z > 0.04) {
      run.push(`${(x * 97).toFixed(2)},${(-y * 97).toFixed(2)}`);
    } else if (run.length > 1) {
      out.push(`M${run.join('L')}`);
      run = [];
    } else run = [];
  }
  if (run.length > 1) out.push(`M${run.join('L')}`);
  return out;
}

export type BallProps = {
  size: number;
  /** revolutions; fractional values are fine */
  spin?: number;
  tumble?: number;
  tilt?: number;
  /** 0 = flat wireframe (diagram mode), 1 = full leather */
  material?: number;
  opacity?: number;
  color?: string;
  style?: React.CSSProperties;
};

export const Ball: React.FC<BallProps> = ({
  size,
  spin = 0,
  tumble = 0,
  tilt = 0.38,
  material = 1,
  opacity = 1,
  color,
  style,
}) => {
  const yaw = spin * Math.PI * 2;
  const pitch = tilt + tumble * Math.PI * 2 * 0.35;
  const roll = tumble * 0.5;
  const id = React.useId().replace(/[:]/g, '');

  const seams = SEAM_CURVES.map((c) => seamPaths(c, yaw, pitch, roll).join(' '));
  const seamColor = color ?? `rgba(20,8,3,${0.34 + 0.5 * material})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      style={{ overflow: 'visible', opacity, display: 'block', ...style }}
    >
      <defs>
        <radialGradient id={`sk${id}`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#FF8A4C" />
          <stop offset="42%" stopColor={C.leather} />
          <stop offset="82%" stopColor="#7E2E0E" />
          <stop offset="100%" stopColor={C.leatherDark} />
        </radialGradient>
        <radialGradient id={`oc${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <pattern id={`pb${id}`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="0.85" fill="rgba(0,0,0,0.22)" />
          <circle cx="5.2" cy="4.6" r="0.85" fill="rgba(0,0,0,0.22)" />
        </pattern>
        <clipPath id={`cp${id}`}>
          <circle cx="0" cy="0" r="97" />
        </clipPath>
      </defs>

      {material > 0.02 ? (
        <>
          <circle cx="0" cy="0" r="97" fill={`url(#sk${id})`} opacity={material} />
          <circle
            cx="0"
            cy="0"
            r="97"
            fill={`url(#pb${id})`}
            opacity={material * 0.55}
            clipPath={`url(#cp${id})`}
          />
          <circle cx="0" cy="0" r="97" fill={`url(#oc${id})`} opacity={material} />
        </>
      ) : null}

      {/* diagram ring — reads as a vector object when material is low */}
      <circle
        cx="0"
        cy="0"
        r="97"
        fill="none"
        stroke={color ?? (material > 0.5 ? 'rgba(0,0,0,0.35)' : C.accent)}
        strokeWidth={material > 0.5 ? 2 : 2.6}
        opacity={material > 0.5 ? 0.8 : 1}
      />

      <g
        fill="none"
        stroke={seamColor}
        strokeWidth={material > 0.5 ? 3.4 : 2.2}
        strokeLinecap="round"
        clipPath={`url(#cp${id})`}
      >
        {seams.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {material > 0.02 ? (
        <ellipse
          cx="-30"
          cy="-38"
          rx="34"
          ry="22"
          fill="rgba(255,225,200,0.18)"
          transform="rotate(-24)"
          opacity={material}
        />
      ) : null}
    </svg>
  );
};

/** Soft contact shadow. Kept as a gradient div — SVG blur filters are slow. */
export const BallShadow: React.FC<{ size: number; spread?: number; opacity?: number }> = ({
  size,
  spread = 1,
  opacity = 0.5,
}) => (
  <div
    style={{
      width: size * 1.5 * spread,
      height: size * 0.34 * spread,
      borderRadius: '50%',
      background: `radial-gradient(closest-side, rgba(0,0,0,${opacity}), rgba(0,0,0,0))`,
    }}
  />
);

/** Flat glyph version, for when hundreds of them appear at once. */
export const BallGlyph: React.FC<{ size: number; color?: string; opacity?: number }> = ({
  size,
  color = C.accent,
  opacity = 1,
}) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ display: 'block', opacity }}>
    <circle cx="0" cy="0" r="9" fill="none" stroke={color} strokeWidth="1.7" />
    <path d="M-9 0 H9 M0 -9 V9" stroke={color} strokeWidth="1.1" opacity="0.75" />
  </svg>
);
