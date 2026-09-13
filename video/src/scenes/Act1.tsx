import React from 'react';
import { C, F } from '../theme';
import { Ball, BallShadow } from '../elements/Ball';
import { Display, Meter, Odometer, Rule, Tag } from '../elements/Ui';
import { clamp, EASE, mix, prog, pulse, ramp, rand } from '../lib/anim';
import { S, W } from '../generated/timeline';

/* =====================================================================
 * 00 · HOOK — a rep counter at full sprint next to a number that will not
 * move. The whole argument of the film, in one second, with no words.
 * ===================================================================== */
export const Hook: React.FC<{ t: number }> = ({ t }) => {
  const spin = prog(t, 0, 0.9, EASE.out);
  const reps = Math.floor(ramp(t, 0.02, 0.9, 0, 47318, EASE.out));
  const orbit = ramp(t, 0, 0.92, 0, 3.4, EASE.out) * Math.PI * 2;
  const rx = 340;
  const ry = 146;
  const locked = t > 0.9;
  const lock = prog(t, 0.9, 1.02, EASE.snap);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* the closed orbit — it ends exactly where it began */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <ellipse
          cx={540}
          cy={760}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={C.accent}
          strokeWidth={3}
          opacity={0.28 + 0.3 * spin}
          strokeDasharray={2 * Math.PI * ((rx + ry) / 2)}
          strokeDashoffset={2 * Math.PI * ((rx + ry) / 2) * (1 - clamp(spin * 1.2))}
        />
        <ellipse cx={540} cy={760} rx={rx} ry={ry} fill="none" stroke={C.line} strokeWidth={2} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 540 + Math.cos(orbit) * rx * (1 - lock),
          top: 760 + Math.sin(orbit) * ry * (1 - lock),
          transform: `translate(-50%,-50%) scale(${1 + lock * 0.25})`,
        }}
      >
        <Ball size={132} spin={orbit / (Math.PI * 2)} tumble={spin * 0.4} tilt={0.32} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 468,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <Tag size={24} color={C.faint} dim={clamp(prog(t, 0.04, 0.22))}>
          Reps logged
        </Tag>
        <Odometer value={reps} digits={5} size={168} color={locked ? C.text : C.muted} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 968,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, 0.4, 0.56)),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '16px 30px',
            borderRadius: 999,
            border: `2px solid ${C.line}`,
            background: C.surface,
          }}
        >
          <Tag size={22} color={C.faint}>
            Δ Skill
          </Tag>
          <div
            style={{
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 46,
              color: C.muted,
              letterSpacing: '0.02em',
            }}
          >
            +0.0%
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
 * 01 · THE LOOP — three hundred and sixty-five identical days, and a skill
 * line that refuses to move. At "the same player" the year collapses into
 * a single square.
 * ===================================================================== */
const COLS = 25;
const ROWS = 15;
const DAYS = 365;

export const Loop: React.FC<{ t: number }> = ({ t }) => {
  const s = S('loop');
  const collapse = prog(t, W('A', 10) - 0.1, W('A', 10) + 0.62, EASE.inOut);
  const cell = 31;
  const gap = 6;
  const gw = COLS * (cell + gap) - gap;
  const gh = ROWS * (cell + gap) - gap;
  const gx = (1080 - gw) / 2;
  const gy = 356;
  const cx = gx + gw / 2;
  const cy = gy + gh / 2;

  const bounce = Math.abs(Math.sin((t - s.from) * Math.PI * 1.12));

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: gx,
          top: 268,
          width: gw,
          display: 'flex',
          gap: 20,
          alignItems: 'baseline',
        }}
      >
        <Tag size={24} color={C.faint}>
          Days trained
        </Tag>
        <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 46, color: C.accent, fontWeight: 700 }}>
          {String(
            Math.max(1, Math.round(mix(ramp(t, 1.06, 2.46, 0, 365), 1, collapse)))
          ).padStart(3, '0')}
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {new Array(DAYS).fill(0).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const on = prog(t, 1.06 + (i / DAYS) * 1.34, 1.14 + (i / DAYS) * 1.34);
          const x = gx + col * (cell + gap);
          const y = gy + row * (cell + gap);
          const px = x + (cx - cell / 2 - x) * collapse;
          const py = y + (cy - cell / 2 - y) * collapse;
          const keep = i === Math.floor(DAYS / 2);
          const sc = keep ? 1 + collapse * 6.2 : 1 - collapse * 0.98;
          return (
            <rect
              key={i}
              x={px - (keep ? (cell * (sc - 1)) / 2 : 0)}
              y={py - (keep ? (cell * (sc - 1)) / 2 : 0)}
              width={cell * sc}
              height={cell * sc}
              rx={4}
              fill={C.accent}
              opacity={on * (0.26 + 0.4 * rand(i)) * (keep ? 1 : 1 - collapse)}
              stroke={C.accent}
              strokeWidth={1}
              strokeOpacity={on * 0.45 * (keep ? 1 : 1 - collapse)}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: cy + 160,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, W('A', 10) + 0.28, W('A', 10) + 0.6)),
        }}
      >
        <Tag size={22} color={C.muted}>
          One day · repeated 365×
        </Tag>
      </div>

      {/* the flat line */}
      <div style={{ position: 'absolute', left: gx, top: 972, width: gw }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Tag size={20} color={C.faint}>
            Skill index
          </Tag>
          <div style={{ fontFamily: F.mono, fontSize: 26, color: C.muted, fontWeight: 700 }}>
            {(0).toFixed(1)}
          </div>
        </div>
        <svg width={gw} height={186} style={{ marginTop: 18, overflow: 'visible' }}>
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={0}
              x2={gw}
              y1={i * 52 + 14}
              y2={i * 52 + 14}
              stroke={C.line}
              strokeWidth={i === 2 ? 2 : 1}
              strokeDasharray={i === 2 ? undefined : '6 10'}
            />
          ))}
          <path
            d={`M0 118 H${gw}`}
            stroke={C.muted}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={gw}
            strokeDashoffset={gw * (1 - prog(t, 1.45, 3.45))}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: gw * clamp(prog(t, 1.45, 3.45)) - 26,
            top: 18 + 118 - 26 - bounce * 54,
          }}
        >
          <Ball size={52} spin={(t - s.from) * 0.7} tilt={0.3} />
        </div>
      </div>

      {/* open loop: a marker nobody has explained yet */}
      <div
        style={{
          position: 'absolute',
          left: gx,
          top: 1300,
          opacity: clamp(prog(t, 4.62, 4.95)) * 0.55,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}
      >
        <div style={{ width: 34, height: 2, background: C.bronze }} />
        <Tag size={19} color={C.bronze}>
          Wk 01 / 12
        </Tag>
      </div>
    </div>
  );
};

/* =====================================================================
 * 02 · WAITING — the ball hangs, the meter shines, and nothing loads.
 * ===================================================================== */
export const Wait: React.FC<{ t: number }> = ({ t }) => {
  const s = S('wait');
  const drop = prog(t, 8.42, 8.72, EASE.in);
  const rebound = prog(t, 8.72, 8.95, EASE.out);
  const y = 700 + drop * 300 - rebound * 118;
  const elapsed = Math.max(0, t - s.from);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <line x1={140} x2={940} y1={1000} y2={1000} stroke={C.lineStrong} strokeWidth={3} />
        <line
          x1={540}
          x2={540}
          y1={y + 105}
          y2={1000}
          stroke={C.line}
          strokeWidth={2}
          strokeDasharray="10 14"
          opacity={1 - drop}
        />
        {[0, 1, 2].map((i) => {
          const p = ((elapsed * 0.9 + i * 0.34) % 1);
          return (
            <circle
              key={i}
              cx={540}
              cy={1000}
              r={40 + p * 240}
              fill="none"
              stroke={C.accent}
              strokeWidth={2}
              opacity={(1 - p) * 0.16 * (1 - drop)}
            />
          );
        })}
      </svg>

      <div style={{ position: 'absolute', left: 540 - 105, top: y - 105 }}>
        <Ball size={210} spin={0.12 + elapsed * 0.06} tumble={elapsed * 0.02} tilt={0.34} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1000,
          transform: 'translate(-50%,-50%)',
          opacity: 0.35 + drop * 0.4,
        }}
      >
        <BallShadow size={210} spread={1 - drop * 0.35} />
      </div>

      <div style={{ position: 'absolute', left: 140, top: 400, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Tag size={22} color={C.muted}>
          Status: waiting
        </Tag>
        <div style={{ display: 'flex', gap: 7 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                background: C.accent,
                opacity: 0.25 + 0.75 * clamp(Math.sin((elapsed * 3.4 - i * 0.5) * Math.PI) ** 8),
              }}
            />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 22, color: C.faint }}>
          {`+${elapsed.toFixed(1)}s`}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 452, width: 800 }}>
        <Rule p={prog(t, s.from, s.from + 0.5)} />
      </div>

      <div style={{ position: 'absolute', left: 140, top: 1082 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26, marginBottom: 26 }}>
          <div
            style={{
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 150,
              lineHeight: 0.86,
              color: C.muted,
              letterSpacing: '-0.03em',
            }}
          >
            0<span style={{ fontSize: 70, color: C.faint }}>%</span>
          </div>
          <Tag size={21} color={C.faint} style={{ paddingBottom: 18 }}>
            improvement
          </Tag>
        </div>
        <Meter value={0} width={800} sheen={(elapsed * 0.52) % 1} />
        <div
          style={{
            marginTop: 22,
            fontFamily: F.mono,
            fontSize: 24,
            color: C.faint,
            letterSpacing: '0.12em',
          }}
        >
          No input change detected
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
 * 03 · SCALE — the same object, multiplied. Every step leaves its outline
 * behind so you can see the shape never changed, only the size.
 * ===================================================================== */
const STEPS = [
  { t: 9.16, size: 200, label: '×1' },
  { t: 9.62, size: 300, label: '×10' },
  { t: 10.05, size: 520, label: '×100' },
  { t: 10.52, size: 830, label: '×1 000' },
];

export const Scale: React.FC<{ t: number }> = ({ t }) => {
  const cy = 800;
  const current = STEPS.reduce((acc, st, i) => (t >= st.t ? i : acc), 0);
  const grow = prog(t, STEPS[current].t, STEPS[current].t + 0.3, EASE.snap);
  const prev = current > 0 ? STEPS[current - 1].size : 200;
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
            stroke={C.line}
            strokeWidth={2}
            strokeDasharray="9 12"
            opacity={i === current ? 0 : 0.7}
          />
        ))}
        {/* congruence marks: same shape, different scale */}
        {current > 0 ? (
          <g opacity={0.5}>
            <line
              x1={540}
              y1={cy}
              x2={540 + size * 0.36}
              y2={cy - size * 0.36}
              stroke={C.bronze}
              strokeWidth={1.6}
              strokeDasharray="5 9"
            />
          </g>
        ) : null}
      </svg>

      <div style={{ position: 'absolute', left: 540 - size / 2, top: cy - size / 2 }}>
        <Ball size={size} spin={0.08 + (t - 8.95) * 0.11} tumble={(t - 8.95) * 0.03} tilt={0.34} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Display size={112} color={C.accent} weight={800} style={{ opacity: 0.9 }}>
          {STEPS[current].label}
        </Display>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1236,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, 10.62, 10.95)) * 0.75,
        }}
      >
        <Tag size={21} color={C.faint}>
          Geometry unchanged
        </Tag>
      </div>

      {/* the step landing, felt rather than seen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.accent,
          opacity: pulse(t, STEPS[current].t, 0.04, 0.2) * 0.05,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
