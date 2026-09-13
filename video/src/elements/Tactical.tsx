import React from 'react';
import { C, F } from '../theme';
import { Ball } from './Ball';

/**
 * Shared machinery for the scenes that live on the court plane: the camera
 * constants, text that survives the perspective, and a real (shaded, spinning)
 * ball placed at a court coordinate but drawn above the plane so it stays a
 * sphere instead of flattening into an ellipse.
 */
export const LEAN = 52;
export const ZOOM = 1.58;

/** text on the plane has to be stretched back out or the perspective eats it */
export const UPRIGHT = `scale(1, ${(1 / Math.cos((LEAN * Math.PI) / 180)).toFixed(3)})`;

/** court centimetres → screen pixels, matching CourtPlane's viewBox mapping */
export const CM = (1080 / 1580) * ZOOM;

export const COURT_STROKE = 'rgba(236,231,223,0.20)';
export const COURT_STRONG = 'rgba(236,231,223,0.34)';

export const CourtLabel: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  opacity?: number;
  anchor?: 'middle' | 'start' | 'end';
  weight?: number;
  mono?: boolean;
}> = ({ x, y, children, size = 40, color = C.text, opacity = 1, anchor = 'middle', weight = 700, mono }) => (
  <g transform={`translate(${x} ${y}) ${UPRIGHT}`} opacity={opacity}>
    <text
      x={0}
      y={0}
      textAnchor={anchor}
      fontFamily={mono ? F.mono : F.display}
      fontWeight={weight}
      fontSize={size}
      fill={color}
      letterSpacing={mono ? 3 : 0.5}
      style={{ textTransform: 'uppercase' }}
    >
      {children}
    </text>
  </g>
);

export const BallOnPlane: React.FC<{
  x: number;
  y: number;
  height: number;
  czoom: number;
  panX: number;
  panY: number;
  yOff: number;
  spin: number;
  size?: number;
}> = ({ x, y, height, czoom, panX, panY, yOff, spin, size = 104 }) => {
  const k = CM * czoom;
  const lean = Math.cos((LEAN * Math.PI) / 180);
  const sx = 540 + (x - panX) * k;
  const sy = 960 + yOff + (y - panY) * k * lean - height * k * 0.62;
  const px = size * czoom * (1 + height / 1400);
  return (
    <div style={{ position: 'absolute', left: sx - px / 2, top: sy - px / 2 }}>
      <Ball size={px} spin={spin} tumble={spin * 0.3} tilt={0.3} />
    </div>
  );
};
