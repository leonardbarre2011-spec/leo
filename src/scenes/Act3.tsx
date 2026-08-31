import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {C, W, H, display, ui} from '../theme';
import {easeOut, clamp, envSmooth, impulse} from '../util';
import {Grain, Vignette, CourtBg, SpeedLines, EnergyWash, Flash} from '../components/Fx';

/* ── 22/23. Does it work on anyone else? ─────────────────────────────── */
export const TheQuestion: React.FC<{stage?: 1 | 2}> = ({stage = 1}) => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 12);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <EnergyWash color={C.gold} base={0.1} />
      {stage === 1 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div
            style={{
              ...display(560),
              color: 'rgba(255,91,46,0.28)',
              position: 'absolute',
              transform: `scale(${0.9 + p * 0.16})`,
            }}
          >
            ?
          </div>
          <div style={{...display(140), color: C.white, textAlign: 'center', transform: `translateY(${(1 - p) * 30}px)`}}>
            BUT WOULD IT
            <br />
            WORK
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{...ui(34, 900, {letterSpacing: 8}), color: C.gold, marginBottom: 30}}>ON SOMEONE WHO ISN'T ME</div>
          <div style={{display: 'flex', gap: 24, marginBottom: 200}}>
            {new Array(3).fill(0).map((_, i) => {
              const t = frame - i * 5;
              if (t < 0) return null;
              const q = easeOut(t, 8);
              return (
                <div
                  key={i}
                  style={{
                    width: 272,
                    height: 328,
                    borderRadius: 24,
                    background: 'rgba(255,255,255,0.07)',
                    border: `4px solid ${C.orange}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `translateY(${(1 - q) * 60}px) rotate(${(i - 1) * 3}deg)`,
                    opacity: q,
                  }}
                >
                  <svg width={140} height={140}>
                    <circle cx={70} cy={48} r={36} fill={C.mist} />
                    <path d="M 10 140 Q 70 74 130 140 Z" fill={C.mist} />
                  </svg>
                  <div style={{...ui(30, 900, {letterSpacing: 3}), color: C.bone, marginTop: 14}}>TESTER {i + 1}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 24. Sending it out ──────────────────────────────────────────────── */
export const SendOut: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <SpeedLines color={C.orange} opacity={0.3} count={18} angle={-14} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {/* packets flying out */}
        {new Array(9).fill(0).map((_, i) => {
          const t = frame - i * 2.4;
          if (t < 0) return null;
          const q = clamp(t / 22, 0, 1);
          const ang = (i / 9) * Math.PI * 2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: W / 2 - 46 + Math.cos(ang) * q * 420,
                top: H / 2 - 46 + Math.sin(ang) * q * 460,
                width: 92,
                height: 92,
                borderRadius: 16,
                background: C.orange,
                opacity: 1 - q * 0.5,
                transform: `rotate(${q * 220}deg) scale(${1 - q * 0.3})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...ui(40, 900),
                color: C.ink,
              }}
            >
              ▶
            </div>
          );
        })}
        <div
          style={{
            ...display(130),
            color: C.white,
            textAlign: 'center',
            textShadow: '0 0 50px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.9)',
            position: 'relative',
            zIndex: 5,
            background: 'radial-gradient(60% 60% at 50% 50%, rgba(11,10,9,0.86), transparent 72%)',
            padding: '30px 50px',
          }}
        >
          STRAIGHT
          <br />
          TO THEM
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 25. The tester wall lighting up ─────────────────────────────────── */
export const TesterWall: React.FC = () => {
  const frame = useCurrentFrame();
  const cells = 16;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.1} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{...ui(34, 900, {letterSpacing: 8}), color: C.gold, marginBottom: 26}}>REAL PLAYERS. REAL GYMS.</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: 820, marginBottom: 260}}>
          {new Array(cells).fill(0).map((_, i) => {
            const on = frame * 1.5 > i;
            return (
              <div
                key={i}
                style={{
                  height: 150,
                  borderRadius: 18,
                  background: on ? `rgba(255,91,46,${0.35 + random(`tw${i}`) * 0.5})` : 'rgba(255,255,255,0.06)',
                  border: `3px solid ${on ? C.orange : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${on ? 1 : 0.9})`,
                }}
              >
                <svg width={58} height={58}>
                  <circle cx={29} cy={20} r={15} fill={on ? C.ink : C.slate} />
                  <path d="M 5 58 Q 29 30 53 58 Z" fill={on ? C.ink : C.slate} />
                </svg>
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

/* ── 26. Their reactions ─────────────────────────────────────────────── */
const MSGS = [
  ['bro what did you give me 😭', true],
  ['my jumper feels different', false],
  ['coach asked what I changed', true],
  ['3 weeks. THREE.', false],
];

export const Reactions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 60px 300px', gap: 16}}>
        {MSGS.map(([m, right], i) => {
          const t = frame - i * 5;
          if (t < 0) return null;
          const p = easeOut(t, 8);
          return (
            <div key={i} style={{display: 'flex', justifyContent: right ? 'flex-end' : 'flex-start'}}>
              <div
                style={{
                  maxWidth: 720,
                  background: right ? C.orange : 'rgba(255,255,255,0.1)',
                  color: right ? C.ink : C.white,
                  padding: '20px 28px',
                  borderRadius: 30,
                  borderBottomRightRadius: right ? 8 : 30,
                  borderBottomLeftRadius: right ? 30 : 8,
                  ...ui(40, 700),
                  transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + p * 0.1})`,
                  opacity: p,
                }}
              >
                {m as string}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{...display(110), color: C.white, textShadow: '0 6px 0 rgba(0,0,0,0.5)'}}>THE REPLIES</span>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 28. Thinking it over ────────────────────────────────────────────── */
export const ThoughtBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 12);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="dark" />
      <EnergyWash color={C.gold} base={0.08} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            width: 800,
            padding: '54px 46px',
            borderRadius: 60,
            background: 'rgba(255,255,255,0.08)',
            border: `5px dashed rgba(224,166,78,0.6)`,
            transform: `scale(${0.88 + p * 0.12})`,
          }}
        >
          <div style={{...display(120), color: C.white, textAlign: 'center'}}>
            KEEP IT
            <br />
            TO MYSELF?
          </div>
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 26}}>
          {[36, 24, 14].map((s, i) => (
            <div key={i} style={{width: s, height: s, borderRadius: s, background: 'rgba(224,166,78,0.6)', opacity: frame > 14 + i * 4 ? 1 : 0}} />
          ))}
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 29. Why not ─────────────────────────────────────────────────────── */
export const WhyNot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.orangeDeep}}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 30px, transparent 30px, transparent 60px)`,
          transform: `translateX(${(frame * 2) % 60}px)`,
        }}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            ...display(260),
            color: C.ink,
            transform: `rotate(-3deg) scale(${impulse(frame, 10)})`,
            textAlign: 'center',
          }}
        >
          WHY NOT
        </div>
        <div
          style={{
            ...display(120),
            color: C.white,
            background: C.ink,
            padding: '8px 34px 20px',
            borderRadius: 14,
            marginTop: 14,
            transform: `rotate(1.6deg) translateY(${(1 - easeOut(frame - 8, 9)) * 40}px)`,
            opacity: clamp((frame - 8) / 4, 0, 1),
          }}
        >
          RELEASE IT
        </div>
      </AbsoluteFill>
      <Flash at={0} life={4} max={0.55} />
      <Vignette strength={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 30. To everyone ─────────────────────────────────────────────────── */
export const ToEveryone: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.14} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        {/* expanding rings of people */}
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          {[0, 1, 2].map((r) => {
            const q = ((frame + r * 14) % 42) / 42;
            return <circle key={r} cx={W / 2} cy={H / 2} r={120 + q * 520} stroke={C.orange} strokeWidth={5} fill="none" opacity={(1 - q) * 0.5} />;
          })}
        </svg>
        {new Array(26).fill(0).map((_, i) => {
          const t = frame - i * 2;
          if (t < 0) return null;
          const ang = (i / 26) * Math.PI * 2 + 0.3;
          const rad = 260 + random(`e${i}`) * 280;
          const q = easeOut(t, 10);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: W / 2 + Math.cos(ang) * rad * q - 37,
                top: H / 2 + Math.sin(ang) * rad * q * 1.15 - 37,
                width: 74,
                height: 74,
                borderRadius: 37,
                background: C.gold,
                opacity: q * 0.9,
              }}
            />
          );
        })}
        <div style={{...display(190), color: C.white, textShadow: '0 0 70px rgba(0,0,0,0.9)', zIndex: 2}}>EVERYONE</div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 31/32. It's live, it's in the bio ───────────────────────────────── */
export const BioCard: React.FC<{stage?: 1 | 2}> = ({stage = 1}) => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 12);
  const bob = Math.sin(frame / 4) * 10;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.16} />
      {stage === 1 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{...ui(38, 900, {letterSpacing: 10}), color: C.gold}}>AS OF RIGHT</div>
          <div style={{...display(300), color: C.white, transform: `scale(${impulse(frame, 11)})`}}>NOW</div>
          <div style={{...ui(36, 800, {letterSpacing: 4}), color: C.bone, marginTop: 10}}>IT'S LIVE</div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          {/* profile card mock */}
          <div
            style={{
              width: 840,
              borderRadius: 34,
              background: 'rgba(11,10,9,0.9)',
              border: `5px solid ${C.orange}`,
              padding: 34,
              transform: `scale(${0.86 + p * 0.14}) translateY(${bob * 0.3}px)`,
              boxShadow: `0 40px 120px rgba(255,91,46,0.28)`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 110, height: 110, borderRadius: 55, background: `linear-gradient(135deg, ${C.orange}, ${C.gold})`}} />
              <div>
                <div style={{...ui(46, 900), color: C.white}}>@playbook</div>
                <div style={{...ui(30, 700), color: C.mist}}>basketball · training</div>
              </div>
            </div>
            <div
              style={{
                marginTop: 26,
                background: C.orange,
                borderRadius: 18,
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{...ui(40, 900, {letterSpacing: 1}), color: C.ink}}>🔗 THE EXERCISES</span>
              <span style={{...ui(40, 900), color: C.ink}}>→</span>
            </div>
          </div>
          <div style={{...display(120), color: C.white, marginTop: 30, transform: `translateY(${bob}px)`}}>LINK IN BIO</div>
          <div style={{...display(90), color: C.orange, marginTop: -6, transform: `translateY(${bob}px)`}}>▲</div>
        </AbsoluteFill>
      )}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 33. Everything that's inside ────────────────────────────────────── */
const INSIDE = ['ALL THE DRILLS', 'WEEK-BY-WEEK PLAN', 'FORM CHECKPOINTS', 'PROGRESS TRACKER'];

export const InsideGrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.gold} base={0.12} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 70px'}}>
        <div style={{...display(104), color: C.white, marginBottom: 26, textAlign: 'center'}}>EVERY DRILL.<br />ONE PLACE.</div>
        {INSIDE.map((s, i) => {
          const t = frame - i * 4;
          if (t < 0) return null;
          const p = easeOut(t, 7);
          return (
            <div
              key={s}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 18,
                padding: '18px 26px',
                marginBottom: 12,
                transform: `translateX(${(1 - p) * -70}px)`,
                opacity: p,
              }}
            >
              <span style={{...ui(42, 900), color: C.orange}}>✓</span>
              <span style={{...ui(42, 800, {letterSpacing: 1}), color: C.bone}}>{s}</span>
            </div>
          );
        })}
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── 35. Final CTA ───────────────────────────────────────────────────── */
export const FinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const p = easeOut(frame, 10);
  const e = envSmooth(frame);
  const bob = Math.sin(frame / 3.5) * 12;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <CourtBg tone="warm" />
      <EnergyWash color={C.orange} base={0.24} />
      <SpeedLines color={C.gold} opacity={0.32} count={20} angle={-40} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            ...display(200),
            color: C.white,
            textAlign: 'center',
            transform: `scale(${(0.9 + p * 0.1) * (1 + e * 0.03)})`,
            textShadow: `0 0 90px ${C.orangeDeep}`,
          }}
        >
          YOU'LL BE
        </div>
        <div
          style={{
            ...display(230),
            color: C.ink,
            background: C.orange,
            padding: '10px 40px 28px',
            borderRadius: 22,
            transform: `rotate(-2deg) scale(${impulse(frame - 6, 12)})`,
            marginTop: 6,
          }}
        >
          STUNNED
        </div>
        <div style={{...ui(40, 900, {letterSpacing: 6}), color: C.gold, marginTop: 40, transform: `translateY(${bob}px)`}}>
          LINK IN BIO ↓
        </div>
      </AbsoluteFill>
      <Flash at={2} life={5} max={0.5} color={C.gold} />
      <Vignette strength={0.6} />
      <Grain />
    </AbsoluteFill>
  );
};
