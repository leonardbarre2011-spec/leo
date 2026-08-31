import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {C, W, H, display, ui} from '../theme';
import {easeOut, clamp, envSmooth, impulse} from '../util';
import {Grain, Vignette, CourtBg, SpeedLines, EnergyWash, Ticker, Flash} from '../components/Fx';

/* ── 1. Hook: two words, maximum force ───────────────────────────────── */
export const HookOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const a = easeOut(frame, 6);
  const b = easeOut(frame - 24, 6);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <EnergyWash color={C.orangeDeep} base={0.12} />
      <SpeedLines count={30} opacity={0.5} angle={-18} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 0}}>
        <div
          style={{
            ...display(240),
            color: C.white,
            transform: `rotate(-2deg) scale(${interpolate(a, [0, 1], [1.42, 1])})`,
            textShadow: '0 10px 0 rgba(0,0,0,0.5)',
          }}
        >
          LET ME
        </div>
        <div
          style={{
            ...display(210),
            color: C.orange,
            transform: `translateX(${(1 - b) * 820}px) rotate(1.4deg)`,
            opacity: clamp((frame - 24) / 3, 0, 1),
            marginTop: -14,
          }}
        >
          SAVE YOU
        </div>
      </AbsoluteFill>
      <Ticker text="PLAYBOOK" y={H - 190} speed={4} color={C.orange} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 2. Hook payoff: the clock you are about to stop wasting ─────────── */
export const HookClock: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 12);
  const e = envSmooth(frame);
  const sweep = interpolate(frame, [0, 41], [0, 300]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.16} />
      {/* stopwatch dial */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', marginTop: -240}}>
        <svg width={620} height={620} style={{transform: `scale(${0.8 + p * 0.2 + e * 0.03})`}}>
          <circle cx={310} cy={310} r={250} stroke={C.orange} strokeWidth={16} fill="rgba(11,10,9,0.6)" opacity={0.9} />
          <circle
            cx={310}
            cy={310}
            r={250}
            stroke={C.gold}
            strokeWidth={16}
            fill="none"
            strokeDasharray={`${(sweep / 360) * 1571} 1571`}
            strokeLinecap="round"
            transform="rotate(-90 310 310)"
          />
          {new Array(12).fill(0).map((_, i) => (
            <rect key={i} x={306} y={70} width={8} height={34} fill={C.bone} opacity={0.6} transform={`rotate(${i * 30} 310 310)`} />
          ))}
          <line
            x1={310}
            y1={310}
            x2={310}
            y2={110}
            stroke={C.white}
            strokeWidth={12}
            strokeLinecap="round"
            transform={`rotate(${sweep} 310 310)`}
          />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', marginTop: 300}}>
        <div style={{...display(180), color: C.white, transform: `scale(${impulse(frame - 4, 10)})`}}>SOME TIME</div>
        <div style={{...ui(34, 800, {letterSpacing: 6}), color: C.gold, marginTop: 22}}>DON'T LEARN IT THE SLOW WAY</div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 3. Rewind to last year ──────────────────────────────────────────── */
export const Rewind: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 14);
  const year = Math.round(interpolate(p, [0, 1], [2026, 2025]));
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="cold" />
      {/* rewind chevrons */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {new Array(5).fill(0).map((_, i) => {
          const x = ((frame * 22 + i * 260) % (W + 500)) - 250;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: W - x,
                ...display(200),
                color: C.slate,
                opacity: 0.16,
              }}
            >
              ◀
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{...ui(38, 900, {letterSpacing: 12}), color: C.mist}}>REWIND</div>
        <div
          style={{
            ...display(300),
            color: C.white,
            marginTop: 10,
            transform: `scale(${0.86 + p * 0.14})`,
            textShadow: '0 12px 0 rgba(0,0,0,0.55)',
          }}
        >
          {year}
        </div>
        <div
          style={{
            ...ui(40, 900, {letterSpacing: 5}),
            color: C.ink,
            background: C.mist,
            padding: '10px 24px',
            borderRadius: 8,
            marginTop: 18,
            transform: 'rotate(-1.5deg)',
          }}
        >
          ROCK BOTTOM
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 5. Shot chart filling with misses ───────────────────────────────── */
const MISSES = [
  [0.26, 0.3],
  [0.7, 0.26],
  [0.42, 0.44],
  [0.78, 0.5],
  [0.2, 0.55],
  [0.58, 0.62],
  [0.34, 0.72],
  [0.74, 0.74],
];

export const MissChart: React.FC<{count?: number; per?: number}> = ({count = 8, per = 4}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="cold" />
      <AbsoluteFill style={{opacity: 0.9}}>
        <svg width={W} height={H}>
          {/* hoop */}
          <ellipse cx={W / 2} cy={352} rx={92} ry={26} stroke={C.orange} strokeWidth={10} fill="none" />
          <rect x={W / 2 - 190} y={196} width={380} height={140} stroke={C.slate} strokeWidth={8} fill="rgba(255,255,255,0.05)" opacity={0.85} />
        </svg>
      </AbsoluteFill>
      {MISSES.slice(0, count).map(([fx, fy], i) => {
        const t = frame - i * per;
        if (t < 0) return null;
        const s = impulse(t, 7);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: fx * W - 74,
              top: fy * H - 74,
              width: 148,
              height: 148,
              transform: `scale(${s}) rotate(${i % 2 ? 8 : -8}deg)`,
            }}
          >
            <svg width={148} height={148}>
              <line x1={22} y1={22} x2={126} y2={126} stroke={C.red} strokeWidth={22} strokeLinecap="round" />
              <line x1={126} y1={22} x2={22} y2={126} stroke={C.red} strokeWidth={22} strokeLinecap="round" />
            </svg>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{...ui(36, 900, {letterSpacing: 8}), color: C.red}}>SHOT CHART</span>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 6. Tally of misses, counting up fast ────────────────────────────── */
export const MissTally: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [0, 26], [0, 47], {extrapolateRight: 'clamp'}));
  const e = envSmooth(frame);
  return (
    <AbsoluteFill style={{background: '#0A0E12'}}>
      <CourtBg tone="cold" />
      <SpeedLines color={C.red} opacity={0.22} count={14} angle={12} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{...ui(38, 900, {letterSpacing: 8}), color: C.mist}}>SHOTS MISSED</div>
        <div
          style={{
            ...display(400),
            color: C.red,
            lineHeight: 0.85,
            transform: `scale(${1 + e * 0.05})`,
            textShadow: '0 14px 0 rgba(0,0,0,0.5)',
          }}
        >
          {n}
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 26}}>
          {new Array(9).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                width: 66,
                height: 14,
                borderRadius: 7,
                background: frame > i * 3 ? C.red : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 7. Blown by on defense ──────────────────────────────────────────── */
export const DefenseBurn: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 33], [-300, W + 140]);
  const lean = interpolate(frame, [0, 33], [-3, -11]);
  return (
    <AbsoluteFill style={{background: '#0A0E12'}}>
      <CourtBg tone="cold" />
      <SpeedLines color={C.red} opacity={0.4} count={22} angle={4} />

      {/* the defender, rooted and beaten */}
      <div style={{position: 'absolute', left: 150, top: H * 0.36, opacity: 0.75}}>
        <svg width={260} height={620}>
          <circle cx={130} cy={82} r={74} fill={C.slate} />
          <rect x={62} y={172} width={136} height={250} rx={44} fill={C.slate} />
          <rect x={62} y={422} width={48} height={196} rx={24} fill={C.slate} />
          <rect x={150} y={422} width={48} height={196} rx={24} fill={C.slate} />
          {/* flat-footed marker */}
          <line x1={30} y1={624} x2={230} y2={624} stroke={C.red} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
        </svg>
      </div>

      {/* the attacker, already past him */}
      <div style={{position: 'absolute', left: x, top: H * 0.33, transform: `skewX(${lean}deg)`}}>
        <svg width={280} height={660}>
          <circle cx={140} cy={80} r={72} fill={C.orange} />
          <rect x={72} y={168} width={136} height={250} rx={44} fill={C.orange} />
          <rect x={48} y={418} width={50} height={200} rx={25} fill={C.orange} />
          <rect x={176} y={418} width={50} height={200} rx={25} fill={C.orange} />
          <circle cx={244} cy={250} r={40} fill={C.gold} />
        </svg>
      </div>

      {/* motion trail behind him */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - i * 120,
            top: H * 0.33,
            width: 280,
            height: 660,
            background: C.orange,
            opacity: 0.16 / i,
            filter: 'blur(14px)',
            borderRadius: 120,
            transform: `skewX(${lean}deg)`,
          }}
        />
      ))}

      <div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center'}}>
        <span
          style={{
            ...display(150),
            color: C.red,
            transform: 'rotate(-2deg)',
            display: 'inline-block',
            textShadow: '0 8px 0 rgba(0,0,0,0.5)',
          }}
        >
          BLOWN BY
        </span>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 8. Strobing list of everything else that was broken ─────────────── */
const FAULTS = ['NO HANDLE', 'SLOW FIRST STEP', 'BAD FOOTWORK', 'NO VERTICAL', 'WEAK FINISH', 'GASSED BY Q2'];

export const FaultStrobe: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.floor(frame / 4) % FAULTS.length;
  const jitter = (random(`fs${idx}`) - 0.5) * 40;
  return (
    <AbsoluteFill style={{background: idx % 2 ? '#0A0E12' : C.ink}}>
      <CourtBg tone="cold" />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {FAULTS.map((f, i) => (
          <div
            key={i}
            style={{
              ...display(i === idx ? 118 : 70),
              color: i === idx ? C.white : 'rgba(154,162,174,0.28)',
              transform: `translateX(${i === idx ? jitter : 0}px) rotate(${i === idx ? -1.5 : 0}deg)`,
              marginBottom: 8,
            }}
          >
            {f}
          </div>
        ))}
        <div
          style={{
            ...display(150),
            color: C.red,
            marginTop: 16,
            transform: `scale(${impulse(frame - 10, 10)})`,
          }}
        >
          ETC.
        </div>
      </AbsoluteFill>
      <Flash at={0} life={3} max={0.4} />
      <Vignette />
      <Grain opacity={0.22} />
    </AbsoluteFill>
  );
};

/* ── 9. The hard truth, typed out ────────────────────────────────────── */
export const HardTruth: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 16);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <EnergyWash color={C.ember} base={0.08} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70}}>
        <div style={{...ui(34, 900, {letterSpacing: 9}), color: C.gold, marginBottom: 26}}>THE PART NOBODY POSTS</div>
        <div
          style={{
            ...display(150),
            color: C.white,
            textAlign: 'center',
            transform: `translateY(${(1 - p) * 40}px)`,
          }}
        >
          HARD
          <br />
          TO ACCEPT
        </div>
        <div style={{width: interpolate(p, [0, 1], [0, 520]), height: 12, background: C.orange, marginTop: 34, borderRadius: 6}} />
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 10/11. Brutal stat sheet ────────────────────────────────────────── */
export const BadStats: React.FC<{highlight?: boolean}> = ({highlight = false}) => {
  const frame = useCurrentFrame();
  const rows = [
    ['FG%', '27%'],
    ['3PT%', '11%'],
    ['TURNOVERS', '6.4'],
    ['+/-', '-18'],
  ];
  return (
    <AbsoluteFill style={{background: '#0A0E12'}}>
      <CourtBg tone="cold" />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
        <div style={{...ui(32, 900, {letterSpacing: 8}), color: C.mist, marginBottom: 30}}>MY SEASON AVERAGES</div>
        {rows.map(([k, v], i) => {
          const t = frame - i * 5;
          if (t < 0) return null;
          const p = easeOut(t, 8);
          return (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                width: 800,
                padding: '14px 26px',
                marginBottom: 12,
                background: 'rgba(255,255,255,0.05)',
                borderLeft: `10px solid ${C.red}`,
                borderRadius: 12,
                transform: `translateX(${(1 - p) * -60}px)`,
                opacity: p,
              }}
            >
              <span style={{...ui(42, 800, {letterSpacing: 3}), color: C.bone}}>{k}</span>
              <span style={{...display(92), color: C.red}}>{v}</span>
            </div>
          );
        })}
        {highlight ? (
          <div
            style={{
              ...display(180),
              color: C.ink,
              background: C.red,
              padding: '10px 44px 24px',
              borderRadius: 18,
              marginTop: 26,
              transform: `rotate(-6deg) scale(${impulse(frame - 8, 10)})`,
              border: `8px solid ${C.white}`,
            }}
          >
            VERY BAD
          </div>
        ) : null}
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 10. Full-bleed admission card ───────────────────────────────────── */
export const TruthCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 10);
  return (
    <AbsoluteFill style={{background: C.cream}}>
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(11,10,9,0.05) 0px, rgba(11,10,9,0.05) 2px, transparent 2px, transparent 26px)`,
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
        <div style={{...ui(32, 900, {letterSpacing: 9}), color: C.ember, marginBottom: 24}}>SAID OUT LOUD</div>
        <div
          style={{
            ...display(160),
            color: C.ink,
            textAlign: 'center',
            transform: `scale(${0.9 + p * 0.1})`,
          }}
        >
          I WAS
          <br />
          THE PROBLEM
        </div>
        <div
          style={{
            marginTop: 34,
            width: interpolate(p, [0, 1], [0, 620]),
            height: 16,
            background: C.ember,
            transform: 'rotate(-1deg)',
          }}
        />
      </AbsoluteFill>
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

/* ── 12. The stamp lands ─────────────────────────────────────────────── */
export const StampBad: React.FC = () => {
  const frame = useCurrentFrame();
  const p = clamp(frame / 9, 0, 1);
  const scale = interpolate(p, [0, 1], [3.4, 1]);
  const rot = interpolate(p, [0, 1], [-24, -7]);
  const settled = frame > 9;
  return (
    <AbsoluteFill style={{background: '#0A0E12'}}>
      <CourtBg tone="cold" />
      <SpeedLines color={C.red} opacity={settled ? 0.16 : 0.4} count={16} angle={-8} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{...ui(34, 900, {letterSpacing: 8}), color: C.mist, marginBottom: 200, opacity: 0.8}}>
          HONEST ASSESSMENT
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            border: `12px solid ${C.red}`,
            borderRadius: 24,
            padding: '18px 48px 34px',
            transform: `scale(${scale}) rotate(${rot}deg)`,
            opacity: clamp(frame / 2, 0, 1),
            boxShadow: settled ? `0 0 90px rgba(229,105,95,0.5)` : 'none',
          }}
        >
          <div style={{...display(170), color: C.red, textAlign: 'center', lineHeight: 0.86}}>
            VERY BAD
            <br />
            <span style={{fontSize: 92}}>AT BASKETBALL</span>
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={9} life={4} max={0.45} color={C.red} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
