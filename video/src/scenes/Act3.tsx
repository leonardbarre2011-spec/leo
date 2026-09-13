import React from 'react';
import { C, F } from '../theme';
import { Ball } from '../elements/Ball';
import { CourtPlane, SPOTS } from '../elements/Court';
import { Display, Rule, Tag, Wire } from '../elements/Ui';
import { clamp, EASE, mix, prog, pulse, ramp, track } from '../lib/anim';
import { S, W } from '../generated/timeline';

const LEAN = 52;
const ZOOM = 1.58;
/** text on the plane has to be stretched back out or the perspective eats it */
const UPRIGHT = `scale(1, ${(1 / Math.cos((LEAN * Math.PI) / 180)).toFixed(3)})`;
/** court centimetres → screen pixels, matching CourtPlane's viewBox mapping */
const CM = (1080 / 1580) * ZOOM;

const CourtLabel: React.FC<{
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

/* =====================================================================
 * 07 · FIVE POSITIONS — five jobs on one floor, and a single program wired
 * to all of them. The wiring is the argument.
 * ===================================================================== */
const NODES: [keyof typeof SPOTS, string, string][] = [
  ['PG', 'PG', 'Initiate · read'],
  ['SG', 'SG', 'Relocate'],
  ['SF', 'SF', 'Closeouts'],
  ['PF', 'PF', 'Short roll'],
  ['C', 'C', 'Seal · finish'],
];

export const Positions: React.FC<{ t: number }> = ({ t }) => {
  const s = S('positions');
  const tStamp = W('G', 7); // "position"
  const boxP = prog(t, s.from + 1.0, s.from + 1.5, EASE.out);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CourtPlane
        lean={LEAN}
        turn={ramp(t, s.from, s.to, -5, 3, EASE.inOut)}
        zoom={ramp(t, s.from, s.to, ZOOM * 1.04, ZOOM * 1.12, EASE.out)}
        y={ramp(t, s.from, s.from + 0.6, -170, -250, EASE.out)}
        lineOpacity={clamp(prog(t, s.from, s.from + 0.5))}
        stroke="rgba(236,231,223,0.20)"
        strong="rgba(236,231,223,0.34)"
        czoom={0.66}
        panY={700}
      >
        {/* one box, five jobs */}
        <g opacity={boxP}>
          <rect
            x={300}
            y={1140}
            width={900}
            height={210}
            rx={18}
            fill={C.surface}
            stroke="rgba(236,231,223,0.34)"
            strokeWidth={4}
          />
          <CourtLabel x={750} y={1228} size={86} color={C.text}>
            One generic program
          </CourtLabel>
          <CourtLabel x={750} y={1302} size={44} color={C.faint} mono weight={400}>
            Applied to all five
          </CourtLabel>
        </g>

        {NODES.map(([spot, label, job], i) => {
          const [x, y] = SPOTS[spot];
          const p = prog(t, s.from + 0.35 + i * 0.15, s.from + 0.6 + i * 0.15, EASE.snap);
          return (
            <g key={spot}>
              <Wire
                d={`M750 1140 C 750 ${mix(1140, y, 0.4)} ${x} ${mix(1140, y, 0.55)} ${x} ${y + 92}`}
                p={prog(t, s.from + 1.35 + i * 0.07, s.from + 1.75 + i * 0.07)}
                color={C.faint}
                width={4}
                length={1400}
                opacity={0.8}
              />
              <circle cx={x} cy={y} r={92 * p} fill={C.bg} stroke={C.accent} strokeWidth={7} />
              <circle cx={x} cy={y} r={126 * p} fill="none" stroke={C.accent} strokeWidth={3} opacity={0.28} />
              <CourtLabel x={x} y={y + 32} size={92} color={C.accent} opacity={p}>
                {label}
              </CourtLabel>
              <CourtLabel
                x={x}
                y={y - 150}
                size={46}
                color={C.muted}
                opacity={clamp(prog(t, s.from + 0.6 + i * 0.15, s.from + 0.9 + i * 0.15))}
                mono
                weight={400}
              >
                {job}
              </CourtLabel>
            </g>
          );
        })}
      </CourtPlane>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1172,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, tStamp, tStamp + 0.2)),
          transform: `scale(${mix(1.18, 1, prog(t, tStamp, tStamp + 0.28, EASE.snap))}) rotate(-2deg)`,
        }}
      >
        <div
          style={{
            border: `4px solid ${C.crit}`,
            color: C.crit,
            padding: '10px 26px',
            borderRadius: 10,
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 66,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Position: not considered
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
 * 08 · ONE PLAN, TWO BODIES — the same checklist, literally copied across.
 * ===================================================================== */
const PLAN = ['Ball-handling · 20 min', 'Form shooting · 50', 'Suicides · ×6', 'Core circuit', 'Free throws · 100'];

/** An architect's height column rather than a clip-art silhouette. */
const Body: React.FC<{ cm: number; color: string; p: number; label: string }> = ({
  cm,
  color,
  p,
  label,
}) => {
  const H = 420;
  const px = (v: number) => (v / 215) * H;
  const h = px(cm) * clamp(p);
  return (
    <svg width={210} height={H + 30} style={{ overflow: 'visible' }}>
      {/* measure ticks every 30 cm */}
      {new Array(8).fill(0).map((_, i) => {
        const y = H - px((i + 1) * 30);
        return (
          <g key={i} opacity={0.5}>
            <line x1={0} x2={i % 2 ? 14 : 26} y1={y} y2={y} stroke={C.line} strokeWidth={2} />
          </g>
        );
      })}
      <line x1={0} x2={0} y1={0} y2={H} stroke={C.line} strokeWidth={2} />
      <rect x={44} y={H - h} width={124} height={h} rx={10} fill={color} opacity={0.1} />
      <rect x={44} y={H - h} width={124} height={h} rx={10} fill="none" stroke={color} strokeWidth={3} />
      <line x1={30} x2={182} y1={H - h} y2={H - h} stroke={color} strokeWidth={3} opacity={clamp(p)} />
      <line x1={0} x2={210} y1={H} y2={H} stroke={C.lineStrong} strokeWidth={3} />
      {/* the guard's height, carried across the gutter for comparison */}
      {cm < 200 ? (
        <line
          x1={182}
          x2={560}
          y1={H - h}
          y2={H - h}
          stroke={C.accent}
          strokeWidth={2}
          strokeDasharray="8 10"
          opacity={clamp(p) * 0.6}
        />
      ) : null}
      <text
        x={106}
        y={H - h - 22}
        textAnchor="middle"
        fontFamily={F.mono}
        fontSize={24}
        fill={color}
        opacity={clamp(p)}
        letterSpacing={2}
      >
        {label}
      </text>
    </svg>
  );
};

export const SamePlan: React.FC<{ t: number }> = ({ t }) => {
  const s = S('sameplan');
  const tGuard = W('H', 4);
  const tBig = W('H', 7);
  const copy = prog(t, tBig + 0.12, tBig + 0.62, EASE.out);

  const col = (
    side: 'L' | 'R',
    title: string,
    meta: string,
    cm: number,
    height: string,
    appear: number,
    listP: number
  ) => (
    <div
      style={{
        position: 'absolute',
        left: side === 'L' ? 84 : 566,
        top: 300,
        width: 430,
        opacity: clamp(appear * 1.4),
        transform: `translateY(${(1 - clamp(appear)) * 18}px)`,
      }}
    >
      <Display size={86} color={C.text}>
        {title}
      </Display>
      <Tag size={21} color={C.faint} style={{ marginTop: 8 }}>
        {meta}
      </Tag>
      <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-end', height: 450 }}>
        <Body cm={cm} label={height} color={side === 'L' ? C.accent : C.bronze} p={appear} />
      </div>
      <div style={{ marginTop: 10 }}>
        <Rule p={appear} color={C.lineStrong} />
      </div>
      <div style={{ marginTop: 14 }}>
        {PLAN.map((item, i) => (
          <div
            key={item}
            style={{
              fontFamily: F.mono,
              fontSize: 23,
              color: C.muted,
              padding: '10px 0',
              letterSpacing: '0.04em',
              opacity: clamp(prog(t, listP + i * 0.06, listP + 0.18 + i * 0.06)),
              transform: `translateX(${(1 - clamp(prog(t, listP + i * 0.06, listP + 0.18 + i * 0.06))) * (side === 'L' ? -14 : 14)}px)`,
            }}
          >
            <span style={{ color: C.faint, marginRight: 12 }}>{String(i + 1).padStart(2, '0')}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {col('L', 'Guard', '82 kg · handles', 185, "6'1\"", prog(t, tGuard - 0.1, tGuard + 0.3), tGuard + 0.15)}
      {col('R', 'Big', '109 kg · finishes', 208, "6'10\"", prog(t, tBig - 0.1, tBig + 0.3), tBig + 0.18)}

      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 300,
          bottom: 460,
          width: 2,
          background: C.line,
          transform: 'translateX(-1px)',
          opacity: clamp(prog(t, s.from + 0.2, s.from + 0.6)),
        }}
      />

      {/* the copy-paste, made visible */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1250,
          transform: 'translate(-50%,0)',
          opacity: copy,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 22px',
          borderRadius: 999,
          background: C.surface,
          border: `2px solid ${C.line}`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24">
          <rect x="4" y="4" width="11" height="14" rx="2" fill="none" stroke={C.faint} strokeWidth="2" />
          <rect x="9" y="7" width="11" height="14" rx="2" fill="none" stroke={C.bronze} strokeWidth="2" />
        </svg>
        <Tag size={19} color={C.bronze}>
          Identical plan · duplicated
        </Tag>
      </div>
    </div>
  );
};

/* =====================================================================
 * 09 · ONE POSSESSION — a single continuous shot, cut into three beats:
 * the guard's half-second read, the pass hanging in the air, and the big
 * reading the help before the ball ever gets there.
 * ===================================================================== */
const T_READ = 25.45;
const T_AIR = 28.45;
const T_HELP = 30.45;
const T_END = 33.05;

const HELP: [number, number][] = [
  [980, 500],
  [430, 470],
];

export const Possession: React.FC<{ t: number }> = ({ t }) => {
  const tRead = W('I', 6); // "read"
  const tCatch = W('K', 7); // "catches"

  // one camera move across all three beats
  const czoom = track(
    [
      [T_READ, 0.9],
      [T_AIR - 0.2, 0.95],
      [T_AIR + 0.5, 0.72],
      [T_HELP + 0.6, 0.84],
      [T_END, 0.9],
    ],
    t
  );
  const panX = track(
    [
      [T_READ, 760],
      [T_AIR, 750],
      [T_HELP, 700],
      [T_END, 680],
    ],
    t
  );
  const panY = track(
    [
      [T_READ, 780],
      [T_AIR, 720],
      [T_HELP, 520],
      [T_END, 480],
    ],
    t
  );
  const turn = track(
    [
      [T_READ, -7],
      [T_AIR, -2],
      [T_END, 5],
    ],
    t
  );

  // the pass
  const flight = prog(t, T_AIR + 0.15, tCatch, EASE.inOut);
  const from = SPOTS.PG;
  const to: [number, number] = [590, 300];
  const bx = mix(from[0], to[0], flight);
  const by = mix(from[1], to[1], flight);
  const height = Math.sin(Math.PI * flight) * 300;

  const clock = Math.max(0, 0.5 - (t - T_READ - 1.05) * 0.42);
  const yOff = ramp(t, T_READ, T_END, -180, -280, EASE.inOut);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CourtPlane
        lean={LEAN}
        turn={turn}
        zoom={ZOOM}
        y={yOff}
        stroke="rgba(236,231,223,0.20)"
        strong="rgba(236,231,223,0.34)"
        czoom={czoom}
        panX={panX}
        panY={panY}
      >
        {/* passing lanes considered, then chosen */}
        {([
          [380, 520],
          [590, 300],
          [1150, 720],
        ] as [number, number][]).map(([x, y], i) => {
          const chosen = i === 1;
          const p = prog(t, T_READ + 0.55 + i * 0.12, T_READ + 0.85 + i * 0.12);
          const kill = chosen ? 0 : clamp(prog(t, tRead, tRead + 0.2));
          return (
            <Wire
              key={i}
              d={`M${from[0]} ${from[1]} L${x} ${y}`}
              p={p}
              color={chosen && t > tRead ? C.good : C.muted}
              width={chosen && t > tRead ? 7 : 3.5}
              length={900}
              opacity={(1 - kill * 0.55) * (1 - clamp(prog(t, T_AIR + 0.4, T_AIR + 0.9)) * (chosen ? 0.5 : 1))}
            />
          );
        })}

        {/* help defence rotating onto the catch */}
        {HELP.map(([hx, hy], i) => {
          const p = prog(t, T_HELP + 0.1 + i * 0.18, T_HELP + 0.85 + i * 0.18, EASE.inOut);
          const cx = mix(hx, to[0] + (i ? -150 : 150), p);
          const cy = mix(hy, to[1] + 130, p);
          return (
            <g key={i} opacity={clamp(prog(t, T_HELP, T_HELP + 0.25))}>
              <Wire
                d={`M${hx} ${hy} L${cx} ${cy}`}
                p={p}
                color={C.crit}
                width={3}
                length={700}
                opacity={0.55}
              />
              <path
                d={`M${cx} ${cy} L${cx - 130} ${cy - 210} A250 250 0 0 1 ${cx + 130} ${cy - 210} Z`}
                fill={C.crit}
                opacity={0.1 * p}
              />
              <circle cx={cx} cy={cy} r={62} fill="none" stroke={C.crit} strokeWidth={5} />
            </g>
          );
        })}

        {/* the guard */}
        <g opacity={clamp(1 - prog(t, T_HELP, T_HELP + 0.5) * 0.55)}>
          <circle cx={from[0]} cy={from[1]} r={78} fill={C.bg} stroke={C.accent} strokeWidth={6} />
          <CourtLabel x={from[0]} y={from[1] + 28} size={78} color={C.accent}>
            PG
          </CourtLabel>
        </g>

        {/* the big, and what he has to solve before the ball lands */}
        <g opacity={clamp(prog(t, T_AIR + 0.3, T_AIR + 0.7))}>
          <circle cx={to[0]} cy={to[1] + 120} r={78} fill={C.bg} stroke={C.bronze} strokeWidth={6} />
          <CourtLabel x={to[0]} y={to[1] + 148} size={78} color={C.bronze}>
            C
          </CourtLabel>
          <CourtLabel
            x={to[0] + 430}
            y={to[1] + 60}
            size={56}
            color={C.good}
            mono
            weight={400}
            opacity={clamp(prog(t, W('K', 4), W('K', 4) + 0.3))}
          >
            Read the help
          </CourtLabel>
        </g>

        {/* flight path */}
        <path
          d={`M${from[0]} ${from[1]} Q ${mix(from[0], to[0], 0.5)} ${mix(from[1], to[1], 0.5) - 260} ${to[0]} ${to[1] + 90}`}
          fill="none"
          stroke={C.accent}
          strokeWidth={2.5}
          strokeDasharray="10 14"
          opacity={clamp(prog(t, T_AIR, T_AIR + 0.25)) * (1 - clamp(prog(t, tCatch, tCatch + 0.4)))}
        />
        <ellipse
          cx={bx}
          cy={by}
          rx={34}
          ry={12}
          fill="#000"
          opacity={clamp(prog(t, T_AIR, T_AIR + 0.2)) * 0.45 * (1 - height / 400)}
        />
      </CourtPlane>

      {/* the ball itself sits above the plane, so it stays a sphere */}
      {t >= T_AIR ? (
        <BallOnPlane x={bx} y={by} height={height} czoom={czoom} panX={panX} panY={panY} yOff={yOff} spin={flight * 2.4} />
      ) : (
        <BallOnPlane
          x={from[0] + 118}
          y={from[1] - 20}
          height={60}
          czoom={czoom}
          panX={panX}
          panY={panY}
          yOff={yOff}
          spin={t * 0.4}
        />
      )}

      {/* the half-second */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: clamp(prog(t, T_READ + 0.5, T_READ + 0.8)) * (1 - clamp(prog(t, T_AIR, T_AIR + 0.3))),
        }}
      >
        <Tag size={20} color={C.faint}>
          Decision window
        </Tag>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 108,
            color: clock < 0.12 ? C.crit : C.text,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {clock.toFixed(2)}
          <span style={{ fontSize: 44, color: C.faint }}>s</span>
        </div>
      </div>

      {/* the pass, still hanging */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity:
            clamp(prog(t, T_AIR + 0.25, T_AIR + 0.55)) * (1 - clamp(prog(t, tCatch - 0.1, tCatch + 0.2))),
        }}
      >
        <Tag size={20} color={C.faint}>
          Ball in flight
        </Tag>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 108,
            color: C.accent,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {(0.38 * (1 - flight)).toFixed(2)}
          <span style={{ fontSize: 44, color: C.faint }}>s</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.good,
          opacity: pulse(t, tCatch, 0.04, 0.3) * 0.07,
        }}
      />
    </div>
  );
};

/** Places a real (shaded, spinning) ball at a court coordinate, above the plane. */
const BallOnPlane: React.FC<{
  x: number;
  y: number;
  height: number;
  czoom: number;
  panX: number;
  panY: number;
  yOff: number;
  spin: number;
}> = ({ x, y, height, czoom, panX, panY, yOff, spin }) => {
  // court cm → screen px, matching CourtPlane's viewBox mapping and lean
  const k = CM * czoom;
  const lean = Math.cos((LEAN * Math.PI) / 180);
  const sx = 540 + (x - panX) * k;
  const sy = 960 + yOff + (y - panY) * k * lean - height * k * 0.62;
  const size = 104 * czoom * (1 + height / 1400);
  return (
    <div style={{ position: 'absolute', left: sx - size / 2, top: sy - size / 2 }}>
      <Ball size={size} spin={spin} tumble={spin * 0.3} tilt={0.3} />
    </div>
  );
};

/* =====================================================================
 * 10 · DIFFERENT JOB — two jobs, drawn as two different shapes of work.
 * ===================================================================== */
export const DifferentJob: React.FC<{ t: number }> = ({ t }) => {
  const s = S('differentjob');
  const p = prog(t, s.from, s.from + 0.32, EASE.out);
  const field = (seed: number, color: string, dir: number) => (
    <svg width={420} height={480} style={{ overflow: 'visible' }}>
      {new Array(8).fill(0).map((_, r) =>
        new Array(7).fill(0).map((_, c) => {
          const i = r * 7 + c;
          const a = dir * (Math.sin((r + seed) * 0.9) + Math.cos((c + seed) * 1.3)) * 1.4;
          const on = prog(t, s.from + 0.05 + i * 0.005, s.from + 0.3 + i * 0.005);
          const x = c * 60 + 30;
          const y = r * 60 + 30;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={y}
                x2={x + Math.cos(a) * 30 * on}
                y2={y + Math.sin(a) * 30 * on}
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.3 + 0.6 * on}
              />
              <circle cx={x} cy={y} r={3} fill={color} opacity={0.35 * on} />
            </g>
          );
        })
      )}
    </svg>
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 84, top: 340 }}>
        <Tag size={24} color={C.accent}>
          Guard
        </Tag>
        <div style={{ marginTop: 18 }}>{field(0, C.accent, 1)}</div>
      </div>
      <div style={{ position: 'absolute', left: 576, top: 340 }}>
        <Tag size={24} color={C.bronze}>
          Big
        </Tag>
        <div style={{ marginTop: 18 }}>{field(3.4, C.bronze, -1)}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 340,
          height: 540,
          width: 2,
          background: C.line,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 960,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${mix(1.1, 1, p)})`,
          opacity: p,
        }}
      >
        <Display size={148} color={C.text} weight={800}>
          Different job
        </Display>
      </div>
    </div>
  );
};

/* =====================================================================
 * 11 · SAME DRILLS — both fields collapse into one stamped list.
 * ===================================================================== */
export const SameDrills: React.FC<{ t: number }> = ({ t }) => {
  const s = S('samedrills');
  const collapse = prog(t, s.from, s.from + 0.34, EASE.inOut);
  const slam = prog(t, W('M', 0), W('M', 0) + 0.22, EASE.snap);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 640, opacity: clamp(prog(t, s.from + 0.1, s.from + 0.4)) }}>
          {PLAN.map((item, i) => (
            <div
              key={item}
              style={{
                display: 'flex',
                gap: 16,
                fontFamily: F.mono,
                fontSize: 30,
                color: C.muted,
                padding: '20px 0',
                borderBottom: `2px solid ${C.line}`,
                transform: `translateX(${(1 - collapse) * (i % 2 ? 260 : -260)}px)`,
              }}
            >
              <span style={{ color: C.faint }}>{String(i + 1).padStart(2, '0')}</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 960,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${mix(1.24, 1, slam)}) rotate(${-1.5 * (1 - slam)}deg)`,
          opacity: slam,
        }}
      >
        <Display size={156} color={C.crit} weight={800}>
          Same drills
        </Display>
      </div>
    </div>
  );
};

/* =====================================================================
 * 12 · NOTHING CHANGES — back to the flat line, and the counter stops.
 * ===================================================================== */
export const Nothing: React.FC<{ t: number }> = ({ t }) => {
  const s = S('nothing');
  const tStop = W('N', 3); // "changes"
  const drain = prog(t, tStop, tStop + 0.5, EASE.out);
  const gw = 800;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        filter: `saturate(${1 - drain * 0.88}) brightness(${1 - drain * 0.14})`,
      }}
    >
      <div style={{ position: 'absolute', left: 140, top: 420, width: gw }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Tag size={22} color={C.faint}>
            Skill index · 52 weeks
          </Tag>
          <div style={{ fontFamily: F.mono, fontSize: 30, color: C.muted, fontWeight: 700 }}>0.0</div>
        </div>
        <svg width={gw} height={440} style={{ marginTop: 26, overflow: 'visible' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1={0} x2={gw} y1={i * 66 + 10} y2={i * 66 + 10} stroke={C.line} strokeDasharray="5 12" />
          ))}
          <path
            d={`M0 340 H${gw}`}
            stroke={C.muted}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={gw}
            strokeDashoffset={gw * (1 - prog(t, s.from, s.from + 0.8))}
          />
          {/* the dotted lead from the failure point, still hanging there */}
          <path
            d={`M${gw + 190} 80 C ${gw - 40} 80 ${gw + 60} 340 ${gw} 340`}
            fill="none"
            stroke={C.crit}
            strokeWidth={2}
            strokeDasharray="8 12"
            opacity={0.4 * clamp(prog(t, s.from + 0.3, s.from + 0.9))}
          />
        </svg>
      </div>

      <div style={{ position: 'absolute', left: 140, top: 1010, display: 'flex', alignItems: 'baseline', gap: 22 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 110,
            color: C.muted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.floor(t < tStop ? ramp(t, s.from, tStop, 47318, 61240) : 61240).toLocaleString('en-US')}
        </div>
        <Tag size={22} color={C.faint}>
          reps
        </Tag>
        <div
          style={{
            marginLeft: 'auto',
            fontFamily: F.mono,
            fontSize: 42,
            color: t >= tStop ? C.crit : C.muted,
            letterSpacing: '0.08em',
          }}
        >
          +0.0%
        </div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 1150, width: gw }}>
        <Rule p={1} color={C.lineStrong} />
      </div>
    </div>
  );
};
