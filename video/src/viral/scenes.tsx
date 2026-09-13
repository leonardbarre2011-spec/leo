import React from 'react';
import { F, V } from '../theme';
import { Ball, BallShadow } from '../elements/Ball';
import { CourtPlane, SPOTS } from '../elements/Court';
import {
  BallOnPlane,
  COURT_STRONG,
  COURT_STROKE,
  CourtLabel,
  LEAN,
  ZOOM,
} from '../elements/Tactical';
import { CheckRow, Display, Odometer, Panel, Rule, Tag, Typed, Wire } from '../elements/Ui';
import { clamp, EASE, mix, prog, pulse, ramp, rand, track } from '../lib/anim';
import { S, W } from '../generated/timeline-viral';

/**
 * The short cut's shot list.
 *
 * Everything lives between y=200 and y=1060 — below that is the caption band,
 * which is twice the size it was in v1. Compositions are correspondingly
 * tighter and more central: on a phone, a frame that is half empty reads as
 * nothing happening, and nothing happening is a scroll.
 */

const TOP = 248;

/* =====================================================================
 * 00 · HOOK — the ball is already on the floor on frame one. No runway,
 * no fade up: the first thing that happens is an impact, and the title
 * states the whole problem before the voice finishes its first clause.
 * ===================================================================== */
export const Hook: React.FC<{ t: number; frozen?: boolean }> = ({ t, frozen }) => {
  const tt = frozen ? 0 : t; // exactly frame one, so the loop point is invisible
  const reps = Math.floor(ramp(tt, 0.0, 1.5, 41260, 47318, EASE.out));
  // squash on contact, then one settling bounce
  const hit = prog(tt, 0, 0.09, EASE.out);
  const rise = Math.abs(Math.sin(Math.max(0, tt - 0.06) * 3.1)) * Math.exp(-1.5 * Math.max(0, tt - 0.06));
  const squash = 1 - (1 - hit) * 0.28;
  const ballY = 800 - rise * 210;
  const floor = 880;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* the title: the whole argument, readable in under half a second */}
      <div style={{ position: 'absolute', left: 58, right: 58, top: TOP }}>
        <Display size={96} color={V.text} weight={800}>
          365 days of work
        </Display>
        <div
          style={{
            display: 'inline-block',
            marginTop: 14,
            background: V.accent,
            color: V.bg,
            padding: '4px 22px 12px',
            borderRadius: 16,
            transform: `scale(${mix(1.14, 1, prog(tt, 0.0, 0.22, EASE.snap))}) rotate(-1.2deg)`,
          }}
        >
          <Display size={96} color={V.bg} weight={800}>
            0.0% better
          </Display>
        </div>
      </div>

      {/* shockwave from the contact */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {[0, 1, 2].map((i) => {
          const p = clamp((tt - i * 0.07) / 0.6);
          return p <= 0 ? null : (
            <ellipse
              key={i}
              cx={540}
              cy={floor}
              rx={90 + p * 420}
              ry={(90 + p * 420) * 0.22}
              fill="none"
              stroke={V.accent}
              strokeWidth={4 - p * 2.4}
              opacity={(1 - p) * 0.5}
            />
          );
        })}
        <line x1={120} x2={960} y1={floor} y2={floor} stroke={V.lineStrong} strokeWidth={3} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 540,
          top: floor,
          transform: 'translate(-50%,-50%)',
          opacity: 0.55,
        }}
      >
        <BallShadow size={230} spread={1 - rise * 0.3} opacity={0.6} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - 115,
          top: ballY - 115,
          transform: `scaleY(${squash}) scaleX(${2 - squash})`,
          transformOrigin: '50% 100%',
        }}
      >
        <Ball size={230} spin={0.1 + tt * 0.5} tumble={tt * 0.16} tilt={0.32} />
      </div>

      {/* the counter, and the number that never moves */}
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          top: 930,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Tag size={20} color={V.faint}>
            Reps logged
          </Tag>
          <div style={{ marginTop: 10 }}>
            <Odometer value={reps} digits={5} size={108} color={V.text} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 22px',
            borderRadius: 999,
            border: `3px solid ${V.accent}`,
            background: V.surface,
            opacity: clamp(prog(tt, 0.18, 0.34)),
          }}
        >
          <Tag size={18} color={V.faint}>
            Δ Skill
          </Tag>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 42, color: V.text }}>+0.0%</div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
 * 01 · MORE OF THE SAME — one object, multiplied. Each step leaves its
 * outline so you can see the shape never changed, only the size.
 * ===================================================================== */
const STEPS = [
  { t: 4.51, size: 170, label: '×1' },
  { t: 4.94, size: 300, label: '×10' },
  { t: 5.4, size: 430, label: '×100' },
  { t: 5.8, size: 560, label: '×1 000' },
];

export const Clone: React.FC<{ t: number }> = ({ t }) => {
  const cy = 720;
  const current = STEPS.reduce((acc, st, i) => (t >= st.t ? i : acc), 0);
  const grow = prog(t, STEPS[current].t, STEPS[current].t + 0.24, EASE.snap);
  const prev = current > 0 ? STEPS[current - 1].size : 170;
  const size = prev + (STEPS[current].size - prev) * grow;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {STEPS.slice(0, current + 1).map((st, i) => (
          <circle
            key={i}
            cx={540}
            cy={cy}
            r={(i === current ? size : st.size) / 2}
            fill="none"
            stroke={V.line}
            strokeWidth={2.5}
            strokeDasharray="10 13"
            opacity={i === current ? 0 : 0.8}
          />
        ))}
      </svg>

      <div style={{ position: 'absolute', left: 540 - size / 2, top: cy - size / 2 }}>
        <Ball size={size} spin={0.08 + (t - 4.44) * 0.16} tumble={(t - 4.44) * 0.04} tilt={0.34} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: TOP + 40, textAlign: 'center' }}>
        <Display size={140} color={V.accent} weight={800}>
          {STEPS[current].label}
        </Display>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1010,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, 5.9, 6.15)),
        }}
      >
        <Tag size={24} color={V.muted}>
          Same shape · bigger
        </Tag>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: V.accent,
          opacity: pulse(t, STEPS[current].t, 0.04, 0.18) * 0.07,
        }}
      />
    </div>
  );
};

/* =====================================================================
 * 02 · FIVE JOBS, ONE PROGRAM — the wiring is the argument.
 * ===================================================================== */
const NODES: [keyof typeof SPOTS, string, string][] = [
  ['PG', 'PG', 'Initiate · read'],
  ['SG', 'SG', 'Relocate'],
  ['SF', 'SF', 'Closeouts'],
  ['PF', 'PF', 'Short roll'],
  ['C', 'C', 'Seal · finish'],
];

export const Positions: React.FC<{ t: number }> = ({ t }) => {
  const s = S('five');
  const tStamp = W('G', 7); // "position"
  const boxP = prog(t, s.from + 0.72, s.from + 1.1, EASE.out);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CourtPlane
        lean={LEAN}
        turn={ramp(t, s.from, s.to, -6, 3, EASE.inOut)}
        zoom={ramp(t, s.from, s.to, ZOOM * 1.02, ZOOM * 1.12, EASE.out)}
        y={ramp(t, s.from, s.from + 0.6, -190, -260, EASE.out)}
        lineOpacity={clamp(prog(t, s.from, s.from + 0.35))}
        stroke={COURT_STROKE}
        strong={COURT_STRONG}
        czoom={0.64}
        panY={700}
      >
        <g opacity={boxP}>
          <rect
            x={300}
            y={1140}
            width={900}
            height={200}
            rx={18}
            fill={V.surface}
            stroke={COURT_STRONG}
            strokeWidth={4}
          />
          <CourtLabel x={750} y={1228} size={86} color={V.text}>
            One generic program
          </CourtLabel>
          <CourtLabel x={750} y={1298} size={42} color={V.faint} mono weight={400}>
            Applied to all five
          </CourtLabel>
        </g>

        {NODES.map(([spot, label, job], i) => {
          const [x, y] = SPOTS[spot];
          const p = prog(t, s.from + 0.2 + i * 0.11, s.from + 0.42 + i * 0.11, EASE.snap);
          return (
            <g key={spot}>
              <Wire
                d={`M750 1140 C 750 ${mix(1140, y, 0.4)} ${x} ${mix(1140, y, 0.55)} ${x} ${y + 92}`}
                p={prog(t, s.from + 1.0 + i * 0.06, s.from + 1.3 + i * 0.06)}
                color={V.faint}
                width={4}
                length={1400}
                opacity={0.85}
              />
              <circle cx={x} cy={y} r={92 * p} fill={V.bg} stroke={V.accent} strokeWidth={7} />
              <circle cx={x} cy={y} r={126 * p} fill="none" stroke={V.accent} strokeWidth={3} opacity={0.3} />
              <CourtLabel x={x} y={y + 32} size={92} color={V.accent} opacity={p}>
                {label}
              </CourtLabel>
              <CourtLabel
                x={x}
                y={y - 150}
                size={46}
                color={V.muted}
                opacity={clamp(prog(t, s.from + 0.4 + i * 0.11, s.from + 0.66 + i * 0.11))}
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
          top: 1062,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, tStamp, tStamp + 0.16)),
          transform: `scale(${mix(1.2, 1, prog(t, tStamp, tStamp + 0.24, EASE.snap))}) rotate(-2deg)`,
        }}
      >
        <div
          style={{
            border: `5px solid ${V.crit}`,
            color: V.crit,
            padding: '8px 26px 14px',
            borderRadius: 12,
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 72,
            letterSpacing: '0.03em',
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
 * 03 · ONE PLAN, TWO BODIES — the same checklist, literally copied across.
 * ===================================================================== */
const PLAN = ['Ball-handling · 20 min', 'Form shooting · 50', 'Suicides · ×6', 'Free throws · 100'];

const Body: React.FC<{ cm: number; color: string; p: number; label: string }> = ({ cm, color, p, label }) => {
  const H = 330;
  const px = (v: number) => (v / 215) * H;
  const h = px(cm) * clamp(p);
  return (
    <svg width={210} height={H + 20} style={{ overflow: 'visible' }}>
      {new Array(6).fill(0).map((_, i) => {
        const y = H - px((i + 1) * 30);
        return <line key={i} x1={0} x2={i % 2 ? 12 : 24} y1={y} y2={y} stroke={V.line} strokeWidth={2} />;
      })}
      <line x1={0} x2={0} y1={0} y2={H} stroke={V.line} strokeWidth={2} />
      <rect x={44} y={H - h} width={124} height={h} rx={10} fill={color} opacity={0.12} />
      <rect x={44} y={H - h} width={124} height={h} rx={10} fill="none" stroke={color} strokeWidth={3} />
      <line x1={30} x2={182} y1={H - h} y2={H - h} stroke={color} strokeWidth={3} opacity={clamp(p)} />
      {cm < 200 ? (
        <line
          x1={182}
          x2={560}
          y1={H - h}
          y2={H - h}
          stroke={V.accent}
          strokeWidth={2}
          strokeDasharray="8 10"
          opacity={clamp(p) * 0.65}
        />
      ) : null}
      <line x1={0} x2={210} y1={H} y2={H} stroke={V.lineStrong} strokeWidth={3} />
      <text
        x={106}
        y={H - h - 20}
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

export const TwoBodies: React.FC<{ t: number }> = ({ t }) => {
  const s = S('two');
  const tGuard = W('H', 4);
  const tBig = W('H', 7);
  const copy = prog(t, tBig + 0.1, tBig + 0.5, EASE.out);

  const col = (side: 'L' | 'R', title: string, meta: string, cm: number, height: string, appear: number, listP: number) => (
    <div
      style={{
        position: 'absolute',
        left: side === 'L' ? 64 : 556,
        top: TOP + 20,
        width: 460,
        opacity: clamp(appear * 1.5),
        transform: `translateY(${(1 - clamp(appear)) * 16}px)`,
      }}
    >
      <Display size={92} color={V.text} weight={800}>
        {title}
      </Display>
      <Tag size={21} color={V.faint} style={{ marginTop: 6 }}>
        {meta}
      </Tag>
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'flex-end', height: 350 }}>
        <Body cm={cm} label={height} color={side === 'L' ? V.accent : V.bronze} p={appear} />
      </div>
      <Rule p={appear} color={V.lineStrong} />
      <div style={{ marginTop: 10 }}>
        {PLAN.map((item, i) => {
          const p = prog(t, listP + i * 0.055, listP + 0.17 + i * 0.055);
          return (
            <div
              key={item}
              style={{
                fontFamily: F.mono,
                fontSize: 24,
                color: V.muted,
                padding: '11px 0',
                letterSpacing: '0.03em',
                opacity: clamp(p),
                transform: `translateX(${(1 - clamp(p)) * (side === 'L' ? -14 : 14)}px)`,
              }}
            >
              <span style={{ color: V.faint, marginRight: 12 }}>{String(i + 1).padStart(2, '0')}</span>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {col('L', 'Guard', '82 kg · handles', 185, "6'1\"", prog(t, tGuard - 0.1, tGuard + 0.26), tGuard + 0.12)}
      {col('R', 'Big', '109 kg · finishes', 208, "6'10\"", prog(t, tBig - 0.1, tBig + 0.26), tBig + 0.14)}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: TOP + 20,
          height: 700,
          width: 2,
          background: V.line,
          opacity: clamp(prog(t, s.from + 0.15, s.from + 0.45)),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1000,
          transform: 'translate(-50%,0)',
          opacity: copy,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 24px',
          borderRadius: 999,
          background: V.surface,
          border: `2px solid ${V.lineStrong}`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="4" y="4" width="11" height="14" rx="2" fill="none" stroke={V.faint} strokeWidth="2" />
          <rect x="9" y="7" width="11" height="14" rx="2" fill="none" stroke={V.bronze} strokeWidth="2" />
        </svg>
        <Tag size={21} color={V.bronze}>
          Identical plan · duplicated
        </Tag>
      </div>
    </div>
  );
};

/* =====================================================================
 * 04 · ONE POSSESSION — a single continuous shot in three beats: the
 * guard's half-second read, the pass hanging, and the big solving the
 * help before the ball ever arrives.
 * ===================================================================== */
const HELP: [number, number][] = [
  [980, 500],
  [430, 470],
];

export const Possession: React.FC<{ t: number }> = ({ t }) => {
  const READ = S('read').from;
  const AIR = S('air').from;
  const HELPT = S('help').from;
  const END = S('help').to;
  const tRead = W('I', 6);
  const tCatch = W('K', 7);

  const czoom = track(
    [[READ, 0.9], [AIR - 0.2, 0.95], [AIR + 0.4, 0.72], [HELPT + 0.5, 0.84], [END, 0.9]],
    t
  );
  const panX = track([[READ, 760], [AIR, 750], [HELPT, 700], [END, 680]], t);
  const panY = track([[READ, 780], [AIR, 720], [HELPT, 520], [END, 480]], t);
  const turn = track([[READ, -7], [AIR, -2], [END, 5]], t);
  const yOff = ramp(t, READ, END, -230, -310, EASE.inOut);

  const flight = prog(t, AIR + 0.12, tCatch, EASE.inOut);
  const from = SPOTS.PG;
  const to: [number, number] = [590, 300];
  const bx = mix(from[0], to[0], flight);
  const by = mix(from[1], to[1], flight);
  const height = Math.sin(Math.PI * flight) * 300;
  const clock = Math.max(0, 0.5 - (t - READ - 0.7) * 0.28);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CourtPlane
        lean={LEAN}
        turn={turn}
        zoom={ZOOM}
        y={yOff}
        stroke={COURT_STROKE}
        strong={COURT_STRONG}
        czoom={czoom}
        panX={panX}
        panY={panY}
      >
        {([
          [380, 520],
          [590, 300],
          [1150, 720],
        ] as [number, number][]).map(([x, y], i) => {
          const chosen = i === 1;
          const p = prog(t, READ + 0.35 + i * 0.1, READ + 0.6 + i * 0.1);
          const kill = chosen ? 0 : clamp(prog(t, tRead, tRead + 0.18));
          return (
            <Wire
              key={i}
              d={`M${from[0]} ${from[1]} L${x} ${y}`}
              p={p}
              color={chosen && t > tRead ? V.good : V.muted}
              width={chosen && t > tRead ? 7 : 3.5}
              length={900}
              opacity={(1 - kill * 0.55) * (1 - clamp(prog(t, AIR + 0.35, AIR + 0.8)) * (chosen ? 0.5 : 1))}
            />
          );
        })}

        {HELP.map(([hx, hy], i) => {
          const p = prog(t, HELPT + 0.08 + i * 0.15, HELPT + 0.75 + i * 0.15, EASE.inOut);
          const cx = mix(hx, to[0] + (i ? -150 : 150), p);
          const cy = mix(hy, to[1] + 130, p);
          return (
            <g key={i} opacity={clamp(prog(t, HELPT, HELPT + 0.2))}>
              <Wire d={`M${hx} ${hy} L${cx} ${cy}`} p={p} color={V.crit} width={3.5} length={700} opacity={0.6} />
              <path
                d={`M${cx} ${cy} L${cx - 130} ${cy - 210} A250 250 0 0 1 ${cx + 130} ${cy - 210} Z`}
                fill={V.crit}
                opacity={0.12 * p}
              />
              <circle cx={cx} cy={cy} r={62} fill="none" stroke={V.crit} strokeWidth={5} />
            </g>
          );
        })}

        <g opacity={clamp(1 - prog(t, HELPT, HELPT + 0.45) * 0.55)}>
          <circle cx={from[0]} cy={from[1]} r={78} fill={V.bg} stroke={V.accent} strokeWidth={6} />
          <CourtLabel x={from[0]} y={from[1] + 28} size={78} color={V.accent}>
            PG
          </CourtLabel>
        </g>

        <g opacity={clamp(prog(t, AIR + 0.25, AIR + 0.6))}>
          <circle cx={to[0]} cy={to[1] + 120} r={78} fill={V.bg} stroke={V.bronze} strokeWidth={6} />
          <CourtLabel x={to[0]} y={to[1] + 148} size={78} color={V.bronze}>
            C
          </CourtLabel>
          <CourtLabel
            x={to[0] + 430}
            y={to[1] + 60}
            size={56}
            color={V.good}
            mono
            weight={400}
            opacity={clamp(prog(t, W('K', 4), W('K', 4) + 0.25))}
          >
            Read the help
          </CourtLabel>
        </g>

        <path
          d={`M${from[0]} ${from[1]} Q ${mix(from[0], to[0], 0.5)} ${mix(from[1], to[1], 0.5) - 260} ${to[0]} ${to[1] + 90}`}
          fill="none"
          stroke={V.accent}
          strokeWidth={3}
          strokeDasharray="10 14"
          opacity={clamp(prog(t, AIR, AIR + 0.2)) * (1 - clamp(prog(t, tCatch, tCatch + 0.35)))}
        />
        <ellipse
          cx={bx}
          cy={by}
          rx={34}
          ry={12}
          fill="#000"
          opacity={clamp(prog(t, AIR, AIR + 0.18)) * 0.45 * (1 - height / 400)}
        />
      </CourtPlane>

      {t >= AIR ? (
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

      <Readout
        label="Decision window"
        value={clock.toFixed(2)}
        color={clock < 0.12 ? V.crit : V.text}
        opacity={clamp(prog(t, READ + 0.3, READ + 0.55)) * (1 - clamp(prog(t, AIR - 0.25, AIR)))}
      />
      <Readout
        label="Ball in flight"
        value={(0.38 * (1 - flight)).toFixed(2)}
        color={V.accent}
        opacity={clamp(prog(t, AIR + 0.2, AIR + 0.45)) * (1 - clamp(prog(t, tCatch - 0.5, tCatch - 0.22)))}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: V.good,
          opacity: pulse(t, tCatch, 0.04, 0.26) * 0.08,
        }}
      />
    </div>
  );
};

const Readout: React.FC<{ label: string; value: string; color: string; opacity: number }> = ({
  label,
  value,
  color,
  opacity,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: TOP,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity,
    }}
  >
    <Tag size={22} color={V.faint}>
      {label}
    </Tag>
    <div
      style={{
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 128,
        color,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
      <span style={{ fontSize: 52, color: V.faint }}>s</span>
    </div>
  </div>
);

/* =====================================================================
 * 05 · DIFFERENT JOB — two jobs, as two shapes of work.
 * ===================================================================== */
export const DifferentJob: React.FC<{ t: number }> = ({ t }) => {
  const s = S('diff');
  const p = prog(t, s.from, s.from + 0.26, EASE.out);
  const field = (seed: number, color: string, dir: number) => (
    <svg width={420} height={420} style={{ overflow: 'visible' }}>
      {new Array(7).fill(0).map((_, r) =>
        new Array(7).fill(0).map((_, c) => {
          const i = r * 7 + c;
          const a = dir * (Math.sin((r + seed) * 0.9) + Math.cos((c + seed) * 1.3)) * 1.4;
          const on = prog(t, s.from + 0.03 + i * 0.004, s.from + 0.24 + i * 0.004);
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
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.3 + 0.65 * on}
              />
              <circle cx={x} cy={y} r={3.5} fill={color} opacity={0.4 * on} />
            </g>
          );
        })
      )}
    </svg>
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 64, top: TOP + 30 }}>
        <Tag size={26} color={V.accent}>
          Guard
        </Tag>
        <div style={{ marginTop: 16 }}>{field(0, V.accent, 1)}</div>
      </div>
      <div style={{ position: 'absolute', left: 596, top: TOP + 30 }}>
        <Tag size={26} color={V.bronze}>
          Big
        </Tag>
        <div style={{ marginTop: 16 }}>{field(3.4, V.bronze, -1)}</div>
      </div>
      <div style={{ position: 'absolute', left: 540, top: TOP + 30, height: 480, width: 2, background: V.line }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 830,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${mix(1.12, 1, p)})`,
          opacity: p,
        }}
      >
        <Display size={168} color={V.text} weight={800}>
          Different job
        </Display>
      </div>
    </div>
  );
};

/* =====================================================================
 * 06 · SAME DRILLS — both fields collapse into one stamped list.
 * ===================================================================== */
export const SameDrills: React.FC<{ t: number }> = ({ t }) => {
  const s = S('drills');
  const collapse = prog(t, s.from, s.from + 0.28, EASE.inOut);
  const slam = prog(t, W('M', 0), W('M', 0) + 0.2, EASE.snap);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: TOP + 60, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 660, opacity: clamp(prog(t, s.from + 0.06, s.from + 0.3)) }}>
          {PLAN.map((item, i) => (
            <div
              key={item}
              style={{
                display: 'flex',
                gap: 18,
                fontFamily: F.mono,
                fontSize: 32,
                color: V.muted,
                padding: '22px 0',
                borderBottom: `2px solid ${V.line}`,
                transform: `translateX(${(1 - collapse) * (i % 2 ? 280 : -280)}px)`,
              }}
            >
              <span style={{ color: V.faint }}>{String(i + 1).padStart(2, '0')}</span>
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
          top: 830,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${mix(1.26, 1, slam)}) rotate(${-1.5 * (1 - slam)}deg)`,
          opacity: slam,
        }}
      >
        <Display size={176} color={V.crit} weight={800}>
          Same drills
        </Display>
      </div>
    </div>
  );
};

/* =====================================================================
 * 07 · NOTHING CHANGES — the flat line, and the counter stopping.
 * ===================================================================== */
export const Flatline: React.FC<{ t: number }> = ({ t }) => {
  const s = S('flat');
  const tStop = W('N', 3);
  const drain = prog(t, tStop, tStop + 0.45, EASE.out);
  const gw = 860;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        filter: `saturate(${1 - drain * 0.9}) brightness(${1 - drain * 0.12})`,
      }}
    >
      <div style={{ position: 'absolute', left: 110, top: TOP + 40, width: gw }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Tag size={24} color={V.faint}>
            Skill index · 52 weeks
          </Tag>
          <div style={{ fontFamily: F.mono, fontSize: 32, color: V.muted, fontWeight: 700 }}>0.0</div>
        </div>
        <svg width={gw} height={400} style={{ marginTop: 24, overflow: 'visible' }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={0} x2={gw} y1={i * 66 + 10} y2={i * 66 + 10} stroke={V.line} strokeDasharray="5 12" />
          ))}
          <path
            d={`M0 340 H${gw}`}
            stroke={V.muted}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={gw}
            strokeDashoffset={gw * (1 - prog(t, s.from, s.from + 0.7))}
          />
        </svg>
      </div>

      <div style={{ position: 'absolute', left: 110, top: 900, display: 'flex', alignItems: 'baseline', gap: 22, width: gw }}>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 116,
            color: V.muted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.floor(t < tStop ? ramp(t, s.from, tStop, 47318, 61240) : 61240).toLocaleString('en-US')}
        </div>
        <Tag size={22} color={V.faint}>
          reps
        </Tag>
        <div
          style={{
            marginLeft: 'auto',
            fontFamily: F.mono,
            fontSize: 46,
            color: t >= tStop ? V.crit : V.muted,
            letterSpacing: '0.06em',
          }}
        >
          +0.0%
        </div>
      </div>
      <div style={{ position: 'absolute', left: 110, top: 1040, width: gw }}>
        <Rule p={1} color={V.lineStrong} />
      </div>
    </div>
  );
};

/* =====================================================================
 * 08 · THE TURN → THE PUNCHLINE — one continuous act. The flat line is
 * cut loose and unrolled into twelve weeks; only then does the product
 * appear, and only the features it actually has.
 * ===================================================================== */
const X0 = 120;
const GW = 840;
const WEEKS = 12;
const curve = (p: number) => Math.pow(p, 0.78);
const nodeX = (i: number) => X0 + (i / (WEEKS - 1)) * GW;

export const Progression: React.FC<{ t: number }> = ({ t }) => {
  const turn = S('turn');
  const climb = S('climb');
  const cardio = S('cardio');

  const boxY = track([[turn.from, 330], [28.3, 330], [28.9, 400], [cardio.to, 400]], t);
  const boxH = track(
    [[turn.from, 330], [25.3, 330], [25.8, 250], [28.3, 250], [28.9, 470], [cardio.to, 470]],
    t
  );
  const base = boxY + boxH;

  const snap = prog(t, turn.from, turn.from + 0.2, EASE.snap);
  const unroll = prog(t, turn.from + 0.1, 25.5, EASE.out);
  const panelIn = prog(t, 25.5, 25.86, EASE.out);
  const panelOut = prog(t, 28.04, 28.4, EASE.in);
  const panel = panelIn * (1 - panelOut);

  const ride = track(
    [[turn.from, 0], [25.4, 1.1], [climb.from, 1.1], [31.0, WEEKS - 1], [cardio.to, WEEKS - 1]],
    t
  );
  const ri = clamp(ride / (WEEKS - 1));
  const ballX = X0 + ri * GW;
  const ballY = base - curve(ri) * boxH * 0.86;

  const ghost = prog(t, climb.from, climb.from + 0.45, EASE.out);
  const ghostBounce = Math.abs(Math.sin((t - cardio.from) * Math.PI * 1.35));

  const pathD = (upto: number) => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const p = (i / 60) * upto;
      pts.push(`${(X0 + p * GW).toFixed(1)} ${(base - curve(p) * boxH * 0.86).toFixed(1)}`);
    }
    return `M${pts.join(' L')}`;
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: X0, top: boxY - 76, width: GW }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <Tag size={28} color={V.accent}>
            12-week block
          </Tag>
          <Tag size={28} color={V.faint}>
            · your position
          </Tag>
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: F.mono,
              fontSize: 32,
              color: V.text,
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            {`WK ${String(Math.min(WEEKS, Math.floor(ride) + 1)).padStart(2, '0')}`}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Rule p={snap} color={V.lineStrong} />
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line
          x1={X0}
          x2={X0 + GW}
          y1={base}
          y2={base}
          stroke={V.faint}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={mix(0.9, 0.55, snap) * (t > climb.from ? 0.55 + 0.45 * ghost : 1)}
          strokeDasharray={t > climb.from ? '14 16' : undefined}
        />

        {new Array(WEEKS).fill(0).map((_, i) => {
          const p = prog(t, turn.from + 0.3 + i * 0.072, turn.from + 0.5 + i * 0.072, EASE.snap);
          const x = nodeX(i);
          const y = base - curve(i / (WEEKS - 1)) * boxH * 0.86;
          return (
            <g key={i} opacity={p}>
              <line x1={x} x2={x} y1={base + 14} y2={y} stroke={V.line} strokeWidth={1.8} />
              <circle cx={x} cy={y} r={13} fill={V.bg} stroke={i === 0 ? V.bronze : V.accent} strokeWidth={4.5} />
              <text
                x={x}
                y={base + 50}
                textAnchor="middle"
                fontFamily={F.mono}
                fontSize={22}
                fill={ride >= i ? V.muted : V.faint}
                letterSpacing={1}
              >
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          );
        })}

        <path
          d={pathD(1)}
          fill="none"
          stroke={V.accent}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={1600}
          strokeDashoffset={1600 * (1 - unroll)}
          opacity={0.35}
        />
        <path d={pathD(Math.max(0.001, ri))} fill="none" stroke={V.accent} strokeWidth={7} strokeLinecap="round" />
      </svg>

      <div style={{ position: 'absolute', left: ballX - 42, top: ballY - 42 }}>
        <Ball size={84} spin={ride * 0.5} tumble={ride * 0.12} tilt={0.32} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: X0 + GW - 420,
          top: ballY + 116,
          width: 420,
          opacity: clamp(prog(t, 30.2, 30.5)) * (1 - clamp(prog(t, 33.9, 34.06))),
          textAlign: 'right',
        }}
      >
        <Display size={84} color={V.accent} weight={800}>
          Different player
        </Display>
      </div>

      {t > climb.from ? (
        <div
          style={{
            position: 'absolute',
            left: X0 + GW - 30,
            top: base - 30 - ghostBounce * (t > cardio.from ? 40 : 0),
            opacity: ghost * 0.8,
          }}
        >
          <Ball size={62} spin={t * 0.2} tilt={0.3} material={0.18} color={V.faint} />
        </div>
      ) : null}

      {/* the deadpan readout */}
      <div
        style={{
          position: 'absolute',
          left: X0,
          top: base + 96,
          width: GW,
          opacity: clamp(prog(t, cardio.from + 0.2, cardio.from + 0.5)),
        }}
      >
        <Rule p={1} color={V.line} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0' }}>
          <Tag size={24} color={V.muted}>
            Conditioning
          </Tag>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {new Array(5).fill(0).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 13,
                  borderRadius: 2,
                  background: V.good,
                  opacity: clamp(prog(t, cardio.from + 0.42 + i * 0.06, cardio.from + 0.56 + i * 0.06)),
                }}
              />
            ))}
            <div style={{ fontFamily: F.mono, fontSize: 24, color: V.good, marginLeft: 14 }}>EXCELLENT</div>
          </div>
        </div>
        <Rule p={1} color={V.line} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0' }}>
          <Tag size={24} color={V.muted}>
            Skill
          </Tag>
          <div style={{ fontFamily: F.mono, fontSize: 32, color: V.faint, letterSpacing: '0.2em' }}>—</div>
        </div>
        <Rule p={1} color={V.line} />
      </div>

      {/* the program itself */}
      {panel > 0.01 ? (
        <div style={{ position: 'absolute', left: 64, right: 64, top: 690 }}>
          <Panel p={panel} accent style={{ transform: `translateY(${(1 - panelIn) * 30}px)`, borderColor: V.accent }}>
            <div
              style={{
                padding: '26px 30px',
                borderBottom: `2px solid ${V.line}`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: V.surface2,
              }}
            >
              <Ball size={44} spin={t * 0.18} tilt={0.32} />
              <div>
                <Display size={48} color={V.text} weight={800}>
                  12-week position program
                </Display>
                <Tag size={17} color={V.faint} style={{ marginTop: 5 }}>
                  Video evaluation → personalised plan
                </Tag>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  fontFamily: F.mono,
                  fontSize: 17,
                  color: V.accent,
                  border: `2px solid ${V.accent}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  letterSpacing: '0.14em',
                }}
              >
                PDF
              </div>
            </div>

            <div style={{ display: 'flex', gap: 9, padding: '18px 30px 6px' }}>
              {['PG', 'SG', 'SF', 'PF', 'C'].map((pos, i) => {
                const active = pos === 'PG';
                return (
                  <div
                    key={pos}
                    style={{
                      fontFamily: F.mono,
                      fontSize: 20,
                      padding: '7px 17px',
                      borderRadius: 999,
                      letterSpacing: '0.1em',
                      color: active ? V.bg : V.faint,
                      background: active ? V.accent : 'transparent',
                      border: `2px solid ${active ? V.accent : V.line}`,
                      opacity: clamp(prog(t, 25.9 + i * 0.04, 26.04 + i * 0.04)),
                    }}
                  >
                    {pos}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '6px 30px 22px' }}>
              {[
                ['Individualised in-app program', 'wk 01–12'],
                ['Regular video feedback', 'per block'],
                ['Progress tracked in numbers', 'weekly'],
                ['Monthly challenges + community', 'cohort'],
              ].map(([label, note], i) => (
                <CheckRow key={label} p={prog(t, 26.14 + i * 0.36, 26.52 + i * 0.36)} label={label} note={note} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, opacity: clamp(prog(t, 27.58, 27.84)) }}>
                <Tag size={18} color={V.bronze}>
                  Quarterly reviews
                </Tag>
                <Tag size={18} color={V.faint}>
                  Cohort · limited spots
                </Tag>
              </div>
            </div>
          </Panel>
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: V.accent,
          opacity: pulse(t, turn.from, 0.04, 0.3) * 0.12,
        }}
      />
    </div>
  );
};

/* =====================================================================
 * 09 · END CARD — the ask, then a hand-off straight back to frame one so
 * the replay is seamless and a second watch costs the viewer nothing.
 * ===================================================================== */
export const EndCard: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const s = S('end');
  // gone before the loop dissolve starts, so the hand-off isn't a double exposure
  const exit = 1 - prog(t, 37.06, 37.42, EASE.in);
  const typed = prog(t, 34.46, 34.9);
  const roll = prog(t, s.from + 0.15, 36.3, EASE.inOut);
  const drop = prog(t, 35.9, 36.3, EASE.in);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exit }}>
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          top: TOP,
          textAlign: 'center',
          opacity: clamp(prog(t, s.from, s.from + 0.26)),
        }}
      >
        <Tag size={22} color={V.faint} style={{ marginBottom: 18 }}>
          Position-specific · 12 weeks
        </Tag>
        <Display size={104} color={V.text} weight={800}>
          The 12-week
          <br />
          position program
        </Display>
      </div>

      <div style={{ position: 'absolute', left: mix(-180, 540, roll) - 66, top: 690 + drop * 44 }}>
        <Ball size={132} spin={roll * 2.8} tilt={0.3} />
      </div>

      <div style={{ position: 'absolute', left: 58, right: 58, top: 880, opacity: clamp(prog(t, 34.2, 34.5)) }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '26px 30px',
            borderRadius: 18,
            background: V.surface,
            border: `3px solid ${V.accent}`,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              background: V.surface2,
              border: `2px solid ${V.line}`,
              flex: 'none',
            }}
          />
          <Typed text="GAME" p={typed} size={48} frame={frame} font={F.mono} />
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: F.ui,
              fontWeight: 700,
              fontSize: 30,
              color: clamp(prog(t, 34.98, 35.2)) > 0.5 ? V.accent : V.faint,
            }}
          >
            Post
          </div>
        </div>
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', opacity: clamp(prog(t, 35.2, 35.5)) }}>
          <Display size={62} color={V.text} weight={800}>
            Train the job.<span style={{ color: V.accent }}> Not the drill.</span>
          </Display>
        </div>
      </div>
    </div>
  );
};

/** Persistent ask, from the moment the film turns. */
export const CtaChip: React.FC<{ t: number }> = ({ t }) => {
  const p = clamp(prog(t, 24.3, 24.7)) * (1 - clamp(prog(t, 33.9, 34.1)));
  if (p <= 0.01) return null;
  const blink = 0.55 + 0.45 * Math.sin(t * 4.2) ** 2;
  return (
    <div
      style={{
        position: 'absolute',
        right: 58,
        top: 126,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 18px',
        borderRadius: 999,
        background: V.surface,
        border: `2px solid ${V.lineStrong}`,
        opacity: p,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ opacity: blink }}>
        <path
          d="M4 5.5h16v11H10l-5 4v-4H4z"
          fill="none"
          stroke={V.accent}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
      <Tag size={18} color={V.text}>
        Comment “game”
      </Tag>
    </div>
  );
};

/** Ambient floor. Present, never legible. */
export const Backdrop: React.FC<{ t: number }> = ({ t }) => {
  const court = t >= S('five').from && t < S('help').to;
  if (court) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.8 }}>
      <CourtPlane
        lean={68}
        turn={ramp(t, 0, 37.75, -12, 10, EASE.inOut)}
        zoom={1.6}
        y={520}
        czoom={0.9}
        lineOpacity={0.55}
        opacity={0.55}
      />
    </div>
  );
};

export const seed = rand;
