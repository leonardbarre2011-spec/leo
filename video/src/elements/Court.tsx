import React from 'react';
import { C } from '../theme';

/**
 * A half court drawn to FIBA dimensions in centimetres (viewBox 1500×1400),
 * so anything placed on it — positions, passing lanes, help rotations — sits
 * where it would sit on a real floor. Everything tactical in the film is
 * expressed in this coordinate space.
 */
export const COURT_W = 1500;
export const COURT_L = 1400;
export const BASKET: [number, number] = [750, 157.5];

/** canonical spots, in court centimetres */
export const SPOTS = {
  PG: [750, 850] as [number, number],
  SG: [300, 640] as [number, number],
  SF: [1200, 640] as [number, number],
  PF: [1080, 330] as [number, number],
  C: [560, 260] as [number, number],
  wing: [1240, 700] as [number, number],
  corner: [95, 210] as [number, number],
  elbow: [995, 580] as [number, number],
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

export const CourtLines: React.FC<{
  stroke?: string;
  strong?: string;
  width?: number;
  opacity?: number;
}> = ({ stroke = C.line, strong = C.lineStrong, width = 4, opacity = 1 }) => {
  const yMeet = 157.5 + Math.sqrt(675 ** 2 - 660 ** 2);
  return (
    <g fill="none" strokeWidth={width} opacity={opacity} strokeLinecap="round">
      <g stroke={strong}>
        <path d={`M0 0 H${COURT_W} M0 0 V${COURT_L} M${COURT_W} 0 V${COURT_L} M0 ${COURT_L} H${COURT_W}`} />
      </g>
      <g stroke={stroke}>
        {/* key + free-throw circle */}
        <path d="M505 0 V580 H995 V0" />
        <path d={arc(750, 580, 180, Math.PI, 0)} />
        <path d={arc(750, 580, 180, 0, Math.PI)} strokeDasharray="26 22" opacity={0.6} />
        {/* three-point line */}
        <path d={`M90 0 V${yMeet.toFixed(1)}`} />
        <path d={`M1410 0 V${yMeet.toFixed(1)}`} />
        <path d={arc(750, 157.5, 675, Math.PI - 0.2216, 0.2216)} />
        {/* restricted area + rim + backboard */}
        <path d={arc(750, 157.5, 125, Math.PI, 0)} opacity={0.7} />
        <circle cx={750} cy={157.5} r={22.5} />
        <path d="M660 120 H840" strokeWidth={width * 1.6} />
        {/* centre circle */}
        <path d={arc(750, COURT_L, 180, Math.PI, 0)} />
        {/* lane marks */}
        {[175, 260, 345, 430].map((y) => (
          <path key={y} d={`M480 ${y} H505 M995 ${y} H1020`} opacity={0.8} />
        ))}
      </g>
    </g>
  );
};

/**
 * The tactical table: the court laid down in perspective. `lean` tips it,
 * `turn` rotates it under the camera, and children are drawn in court space
 * on the same plane.
 */
export const CourtPlane: React.FC<{
  lean?: number;
  turn?: number;
  zoom?: number;
  x?: number;
  y?: number;
  /** camera in court centimetres: what the frame is centred on, and how close */
  panX?: number;
  panY?: number;
  czoom?: number;
  opacity?: number;
  lineOpacity?: number;
  stroke?: string;
  strong?: string;
  lineWidth?: number;
  children?: React.ReactNode;
}> = ({
  lean = 58,
  turn = 0,
  zoom = 1,
  x = 0,
  y = 0,
  panX = COURT_W / 2,
  panY = COURT_L / 2,
  czoom = 1,
  opacity = 1,
  lineOpacity = 1,
  stroke,
  strong,
  lineWidth,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: 1900,
      opacity,
    }}
  >
    <div
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotateX(${lean}deg) rotateZ(${turn}deg) scale(${zoom})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg
        width={1080}
        height={1008}
        viewBox={`-40 -40 ${COURT_W + 80} ${COURT_L + 80}`}
        style={{ overflow: 'visible', display: 'block' }}
      >
        <g
          transform={`translate(${COURT_W / 2} ${COURT_L / 2}) scale(${czoom}) translate(${-panX} ${-panY})`}
        >
          <CourtLines opacity={lineOpacity} stroke={stroke} strong={strong} width={lineWidth} />
          {children}
        </g>
      </svg>
    </div>
  </div>
);
