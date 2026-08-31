import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {C, W, H, display, ui} from '../theme';
import {easeOut, clamp, envSmooth, impulse} from '../util';
import {Grain, Vignette, CourtBg, SpeedLines, EnergyWash, Scanline, Flash} from '../components/Fx';

/* ── 13. The pivot — dark flips to light ─────────────────────────────── */
export const Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 14);
  const wipe = interpolate(p, [0, 1], [0, 130]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="cold" />
      {/* orange wipe sweeping the frame clean */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, ${C.orangeDeep} 0%, ${C.orange} 55%, ${C.gold} 100%)`,
          clipPath: `polygon(0 0, ${wipe}% 0, ${wipe - 26}% 100%, 0 100%)`,
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            ...display(210),
            color: p > 0.55 ? C.ink : C.white,
            textAlign: 'center',
            transform: `scale(${impulse(frame, 10)}) rotate(-2deg)`,
          }}
        >
          SO I<br />DECIDED
        </div>
        <div
          style={{
            ...ui(38, 900, {letterSpacing: 7}),
            color: p > 0.55 ? 'rgba(11,10,9,0.72)' : C.mist,
            marginTop: 24,
          }}
        >
          TO STOP GUESSING
        </div>
      </AbsoluteFill>
      <Vignette strength={0.55} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 14. Research: scanning everything ───────────────────────────────── */
const SOURCES = ['NBA SKILL COACHES', 'BIOMECHANICS PAPERS', 'D1 STRENGTH PROGRAMS', 'FILM: 400+ HOURS', 'PRO GUARD ROUTINES'];

export const ResearchScan: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#08110E'}}>
      <CourtBg tone="dark" />
      <AbsoluteFill style={{opacity: 0.5}}>
        <svg width={W} height={H}>
          <g stroke={C.gold} strokeWidth={1.5} opacity={0.35}>
            {new Array(14).fill(0).map((_, i) => (
              <line key={i} x1={0} y1={i * 140} x2={W} y2={i * 140} />
            ))}
            {new Array(8).fill(0).map((_, i) => (
              <line key={i} x1={i * 140} y1={0} x2={i * 140} y2={H} />
            ))}
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 90px'}}>
        <div style={{...ui(32, 900, {letterSpacing: 8}), color: C.gold, marginBottom: 26}}>ANALYZING ▸</div>
        {SOURCES.map((s, i) => {
          const t = frame - i * 4;
          if (t < 0) return null;
          const done = t > 8;
          return (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16, opacity: clamp(t / 4, 0, 1)}}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: `4px solid ${done ? C.orange : C.slate}`,
                  background: done ? C.orange : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...ui(26, 900),
                  color: C.ink,
                }}
              >
                {done ? '✓' : ''}
              </div>
              <span style={{...ui(46, 800, {letterSpacing: 1}), color: done ? C.white : C.mist}}>{s}</span>
            </div>
          );
        })}
      </AbsoluteFill>
      <Scanline />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 15. The drills that survived the cut ────────────────────────────── */
const DRILLS = [
  ['01', 'GUIDED SHOT REP'],
  ['02', 'DECEL & RE-ACCEL'],
  ['03', 'CLOSEOUT SLIDES'],
  ['04', 'CONTACT FINISH'],
  ['05', 'POCKET DRIBBLE'],
  ['06', 'JUMP LOADING'],
];

export const DrillGrid: React.FC<{title?: string}> = ({title = 'THE BEST EXERCISES'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.1} />
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center'}}>
        <span
          style={{
            ...display(96),
            color: C.ink,
            background: C.gold,
            padding: '6px 28px 16px',
            borderRadius: 12,
            display: 'inline-block',
            transform: 'rotate(-1.4deg)',
          }}
        >
          {title}
        </span>
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 70px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, width: '100%', marginTop: 60}}>
          {DRILLS.map(([n, name], i) => {
            const t = frame - i * 3;
            if (t < 0) return null;
            const p = easeOut(t, 8);
            return (
              <div
                key={n}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `3px solid rgba(255,91,46,0.5)`,
                  borderRadius: 20,
                  padding: '22px 20px',
                  transform: `scale(${0.8 + p * 0.2}) rotate(${(i % 2 ? 1 : -1) * 0.8}deg)`,
                  opacity: p,
                }}
              >
                <div style={{...display(58), color: C.orange}}>{n}</div>
                <div style={{...ui(30, 800, {letterSpacing: 1}), color: C.bone, marginTop: 6}}>{name}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 16. What each drill actually fixes ──────────────────────────────── */
const FIXES = ['+ RELEASE SPEED', '+ LATERAL QUICKNESS', '+ FINISHING TOUCH', '+ VERTICAL POP'];

export const FixList: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.gold} base={0.12} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{...ui(34, 900, {letterSpacing: 8}), color: C.gold, marginBottom: 28}}>BUILT TO FIX</div>
        {FIXES.map((f, i) => {
          const t = frame - i * 5;
          if (t < 0) return null;
          const p = easeOut(t, 8);
          return (
            <div
              key={f}
              style={{
                ...display(92),
                color: C.white,
                marginBottom: 10,
                transform: `translateX(${(1 - p) * (i % 2 ? 120 : -120)}px)`,
                opacity: p,
              }}
            >
              <span style={{color: C.orange}}>{f.slice(0, 1)}</span>
              {f.slice(1)}
            </div>
          );
        })}
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 17/18. Months of grinding ───────────────────────────────────────── */
export const MonthsGrind: React.FC<{months?: number; showCalendar?: boolean}> = ({months = 7, showCalendar = true}) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [0, 22], [1, months], {extrapolateRight: 'clamp'}));
  const e = envSmooth(frame);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <SpeedLines color={C.gold} opacity={0.2} count={12} angle={-30} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {showCalendar ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 9, width: 700, marginBottom: 46}}>
            {new Array(28).fill(0).map((_, i) => {
              const on = frame * 1.6 > i;
              return (
                <div
                  key={i}
                  style={{
                    height: 58,
                    borderRadius: 10,
                    background: on ? C.orange : 'rgba(255,255,255,0.07)',
                    opacity: on ? 0.35 + random(`d${i}`) * 0.65 : 1,
                  }}
                />
              );
            })}
          </div>
        ) : null}
        <div style={{...ui(36, 900, {letterSpacing: 9}), color: C.mist}}>NO SHORTCUTS</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20, transform: `scale(${1 + e * 0.04})`}}>
          <span style={{...display(320), color: C.white}}>{n}</span>
          <span style={{...display(120), color: C.orange}}>MONTHS</span>
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 20. Level meter filling ─────────────────────────────────────────── */
export const LevelMeter: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [0, 28], [18, 92], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.14} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 80px'}}>
        <div style={{...ui(36, 900, {letterSpacing: 9}), color: C.gold, marginBottom: 24}}>MY LEVEL</div>
        <div
          style={{
            width: '100%',
            height: 132,
            borderRadius: 66,
            background: 'rgba(255,255,255,0.08)',
            border: `6px solid rgba(255,255,255,0.16)`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${C.ember}, ${C.orange} 55%, ${C.gold})`,
              boxShadow: `0 0 60px ${C.orange}`,
            }}
          />
        </div>
        <div style={{...display(230), color: C.white, marginTop: 22}}>{Math.round(pct)}%</div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 21. Skyrocket — the graph goes vertical ─────────────────────────── */
export const Skyrocket: React.FC = () => {
  const frame = useCurrentFrame();
  const p = clamp(frame / 24, 0, 1);
  const pts: string[] = [];
  const N = 40;
  for (let i = 0; i <= N * p; i++) {
    const t = i / N;
    const x = 90 + t * (W - 180);
    // flat, then near-vertical.
    const y = H * 0.78 - Math.pow(t, 3.4) * H * 0.52;
    pts.push(`${x},${y}`);
  }
  const last = pts[pts.length - 1]?.split(',').map(Number) ?? [90, H * 0.78];
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.2} />
      <SpeedLines color={C.gold} opacity={0.45} count={24} angle={-58} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <polyline points={pts.join(' ')} fill="none" stroke={C.orange} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
        <circle cx={last[0]} cy={last[1]} r={30 + Math.sin(frame / 2) * 5} fill={C.white} />
      </svg>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center'}}>
        <div
          style={{
            ...display(150),
            color: C.white,
            transform: `scale(${impulse(frame - 6, 12)}) rotate(-2deg)`,
            textShadow: `0 0 60px ${C.orange}`,
          }}
        >
          SKYROCKETED
        </div>
      </div>
      <Flash at={6} life={5} max={0.5} color={C.gold} />
      <Vignette strength={0.6} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 17. Reps piling up in an empty gym ──────────────────────────────── */
export const RepsGrind: React.FC = () => {
  const frame = useCurrentFrame();
  const reps = Math.round(interpolate(frame, [0, 32], [0, 12480], {extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <EnergyWash color={C.gold} base={0.06} />
      {/* tally marks stacking */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <svg width={880} height={420} style={{marginBottom: 30, opacity: 0.9}}>
          {new Array(60).fill(0).map((_, i) => {
            if (frame * 2.2 < i) return null;
            const col = i % 12;
            const row = Math.floor(i / 12);
            const x = 40 + col * 70;
            const y = 40 + row * 76;
            const fifth = i % 5 === 4;
            return fifth ? (
              <line key={i} x1={x - 58} y1={y + 58} x2={x + 8} y2={y} stroke={C.orange} strokeWidth={8} strokeLinecap="round" />
            ) : (
              <line key={i} x1={x} y1={y} x2={x} y2={y + 58} stroke={C.bone} strokeWidth={8} strokeLinecap="round" />
            );
          })}
        </svg>
        <div style={{...ui(34, 900, {letterSpacing: 9}), color: C.mist}}>REPS LOGGED</div>
        <div style={{...display(240), color: C.white}}>{reps.toLocaleString('en-US')}</div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
