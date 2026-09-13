import React from 'react';
import { C, F } from '../theme';
import { Ball } from '../elements/Ball';
import { CheckRow, Display, Panel, Rule, Tag, Typed } from '../elements/Ui';
import { clamp, EASE, mix, prog, pulse, ramp, track } from '../lib/anim';
import { S, W } from '../generated/timeline';

const X0 = 140;
const GW = 800;
const WEEKS = 12;

/** the shape of a real twelve-week block: fast diagnostic gains, then work */
const curve = (p: number) => Math.pow(p, 0.78);

const nodeX = (i: number) => X0 + (i / (WEEKS - 1)) * GW;

/* =====================================================================
 * 13 · THE TURN → 15 · THE PUNCHLINE
 *
 * One continuous act. The flat line from the opening is cut loose and
 * unrolled into twelve weeks; the unexplained "Wk 01/12" marker from the
 * first scene docks into week one, and the failure-point lead from the
 * stress test finally arrives somewhere — it is the diagnostic the program
 * starts from. Only then does the product itself appear.
 * ===================================================================== */
export const Progression: React.FC<{ t: number }> = ({ t }) => {
  const turn = S('turn');
  const diverge = S('diverge');
  const cardio = S('cardio');

  const boxY = track([[turn.from, 372], [42.6, 372], [43.2, 540], [cardio.to, 540]], t);
  // the map compacts to make room for the document, then opens back up
  const boxH = track(
    [[turn.from, 400], [39.4, 400], [40.0, 296], [42.6, 296], [43.2, 520], [cardio.to, 520]],
    t
  );
  const base = boxY + boxH;

  const snap = prog(t, turn.from, turn.from + 0.22, EASE.snap);
  const unroll = prog(t, turn.from + 0.12, 39.7, EASE.out);
  const panelIn = prog(t, 39.72, 40.12, EASE.out);
  const panelOut = prog(t, 42.35, 42.72, EASE.in);
  const panel = panelIn * (1 - panelOut);

  // the ball's position along the twelve weeks
  const ride = track(
    [
      [turn.from, 0],
      [39.6, 1.1],
      [diverge.from, 1.1],
      [45.3, WEEKS - 1],
      [cardio.to, WEEKS - 1],
    ],
    t
  );
  const ri = clamp(ride / (WEEKS - 1));
  const ballX = X0 + ri * GW;
  const ballY = base - curve(ri) * boxH * 0.86;

  const ghost = prog(t, diverge.from, diverge.from + 0.5, EASE.out);
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
      {/* --- the map ---------------------------------------------------- */}
      <div style={{ position: 'absolute', left: X0, top: boxY - 74, width: GW }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <Tag size={26} color={C.accent}>
            12-week block
          </Tag>
          <Tag size={26} color={C.faint}>
            · your position
          </Tag>
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: F.mono,
              fontSize: 30,
              color: C.text,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {`WK ${String(Math.min(WEEKS, Math.floor(ride) + 1)).padStart(2, '0')}`}
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <Rule p={snap} color={C.lineStrong} />
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* the old flat line, kept for comparison */}
        <line
          x1={X0}
          x2={X0 + GW}
          y1={base}
          y2={base}
          stroke={C.faint}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={mix(0.9, 0.55, snap) * (t > diverge.from ? 0.55 + 0.45 * ghost : 1)}
          strokeDasharray={t > diverge.from ? '14 16' : undefined}
        />

        {/* week grid */}
        {new Array(WEEKS).fill(0).map((_, i) => {
          const p = prog(t, turn.from + 0.35 + i * 0.105, turn.from + 0.6 + i * 0.105, EASE.snap);
          const x = nodeX(i);
          const y = base - curve(i / (WEEKS - 1)) * boxH * 0.86;
          return (
            <g key={i} opacity={p}>
              <line x1={x} x2={x} y1={base + 16} y2={y} stroke={C.line} strokeWidth={1.6} />
              <circle cx={x} cy={y} r={13} fill={C.bg} stroke={i === 0 ? C.bronze : C.accent} strokeWidth={4} />
              <text
                x={x}
                y={base + 52}
                textAnchor="middle"
                fontFamily={F.mono}
                fontSize={22}
                fill={ride >= i ? C.muted : C.faint}
                letterSpacing={1}
              >
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          );
        })}

        {/* the climb */}
        <path
          d={pathD(1)}
          fill="none"
          stroke={C.accent}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={1600}
          strokeDashoffset={1600 * (1 - unroll)}
          opacity={0.35}
        />
        <path
          d={pathD(Math.max(0.001, ri))}
          fill="none"
          stroke={C.accent}
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* payoff: the failure point finally connects to something */}
        <path
          d={`M${X0 + GW + 210} ${base - 250} C ${X0 + 420} ${base - 250} ${X0 - 90} ${base - 90} ${X0} ${base - 6}`}
          fill="none"
          stroke={C.crit}
          strokeWidth={2.4}
          strokeDasharray="8 12"
          opacity={clamp(prog(t, turn.from + 0.1, turn.from + 0.9)) * (1 - clamp(prog(t, 40.4, 41.0))) * 0.7}
        />
      </svg>

      {/* payoff: the marker nobody explained, docking into week one */}
      <div
        style={{
          position: 'absolute',
          left: nodeX(0) - 14,
          top: base - curve(0) * boxH * 0.86 - 112,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: clamp(prog(t, turn.from + 0.42, turn.from + 0.8)) * (1 - clamp(prog(t, 43.0, 43.4))),
          transform: `translateY(${mix(26, 0, prog(t, turn.from + 0.42, turn.from + 0.85, EASE.snap))}px)`,
        }}
      >
        <Tag size={24} color={C.bronze}>
          Wk 01 · diagnostic
        </Tag>
      </div>

      <div style={{ position: 'absolute', left: ballX - 41, top: ballY - 41 }}>
        <Ball size={82} spin={ride * 0.5} tumble={ride * 0.12} tilt={0.32} />
      </div>

      {/* --- the two futures ------------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          left: X0 + GW - 400,
          top: ballY + 126,
          width: 400,
          opacity: clamp(prog(t, 44.5, 44.9)) * (1 - clamp(prog(t, 48.2, 48.35))),
          textAlign: 'right',
        }}
      >
        <Display size={72} color={C.accent}>
          Different player
        </Display>
      </div>

      {t > diverge.from ? (
        <div
          style={{
            position: 'absolute',
            left: X0 + GW - 30,
            top: base - 30 - ghostBounce * (t > cardio.from ? 40 : 0),
            opacity: ghost * 0.8,
          }}
        >
          <Ball size={60} spin={t * 0.2} tilt={0.3} material={0.18} color={C.faint} />
        </div>
      ) : null}

      {/* --- the deadpan readout ---------------------------------------- */}
      <div
        style={{
          position: 'absolute',
          left: X0,
          top: base + 110,
          width: GW,
          opacity: clamp(prog(t, cardio.from + 0.25, cardio.from + 0.6)),
        }}
      >
        <Rule p={1} color={C.line} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 0' }}>
          <Tag size={22} color={C.muted}>
            Conditioning
          </Tag>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {new Array(5).fill(0).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 12,
                  borderRadius: 2,
                  background: C.good,
                  opacity: clamp(prog(t, cardio.from + 0.5 + i * 0.07, cardio.from + 0.66 + i * 0.07)),
                }}
              />
            ))}
            <div style={{ fontFamily: F.mono, fontSize: 22, color: C.good, marginLeft: 14 }}>EXCELLENT</div>
          </div>
        </div>
        <Rule p={1} color={C.line} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 0' }}>
          <Tag size={22} color={C.muted}>
            Skill
          </Tag>
          <div style={{ fontFamily: F.mono, fontSize: 30, color: C.faint, letterSpacing: '0.2em' }}>—</div>
        </div>
        <Rule p={1} color={C.line} />
      </div>

      {/* --- the program itself ------------------------------------------ */}
      {panel > 0.01 ? (
        <div style={{ position: 'absolute', left: 84, right: 84, top: 800 }}>
          <Panel p={panel} accent style={{ transform: `translateY(${(1 - panelIn) * 34}px)` }}>
            <div
              style={{
                padding: '30px 34px',
                borderBottom: `2px solid ${C.line}`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: C.surface2,
              }}
            >
              <Ball size={44} spin={t * 0.18} tilt={0.32} />
              <div>
                <Display size={46} color={C.text}>
                  12-week position program
                </Display>
                <Tag size={17} color={C.faint} style={{ marginTop: 6 }}>
                  Video evaluation → personalised plan
                </Tag>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  fontFamily: F.mono,
                  fontSize: 17,
                  color: C.accent,
                  border: `2px solid ${C.accent}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  letterSpacing: '0.14em',
                }}
              >
                PDF
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, padding: '22px 34px 8px' }}>
              {['PG', 'SG', 'SF', 'PF', 'C'].map((pos, i) => {
                const active = pos === 'PG';
                return (
                  <div
                    key={pos}
                    style={{
                      fontFamily: F.mono,
                      fontSize: 20,
                      padding: '8px 18px',
                      borderRadius: 999,
                      letterSpacing: '0.1em',
                      color: active ? C.bg : C.faint,
                      background: active ? C.accent : 'transparent',
                      border: `2px solid ${active ? C.accent : C.line}`,
                      opacity: clamp(prog(t, 40.18 + i * 0.05, 40.34 + i * 0.05)),
                    }}
                  >
                    {pos}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '8px 34px 26px' }}>
              {[
                ['Individualised in-app program', 'wk 01–12'],
                ['Regular video feedback', 'per block'],
                ['Progress tracked in numbers', 'weekly'],
                ['Monthly challenges + community', 'cohort'],
              ].map(([label, note], i) => (
                <CheckRow
                  key={label}
                  p={prog(t, 40.42 + i * 0.3, 40.86 + i * 0.3)}
                  label={label}
                  note={note}
                />
              ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 22,
                  opacity: clamp(prog(t, 41.62, 41.9)),
                }}
              >
                <Tag size={18} color={C.bronze}>
                  Quarterly reviews
                </Tag>
                <Tag size={18} color={C.faint}>
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
          background: C.accent,
          opacity: pulse(t, turn.from, 0.04, 0.34) * 0.1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/* =====================================================================
 * 16 · END CARD — a comment box, one word in it, and the ball finally
 * coming to rest. Nothing shouts.
 * ===================================================================== */
export const EndCard: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const s = S('end');
  const typed = prog(t, 48.98, 49.42);
  const settle = prog(t, 51.1, 51.42, EASE.out);
  const drop = prog(t, 50.8, 51.35, EASE.in);
  const roll = prog(t, s.from + 0.2, 51.35, EASE.inOut);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 560,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          opacity: clamp(prog(t, s.from, s.from + 0.32)),
        }}
      >
        <Tag size={21} color={C.faint}>
          Position-specific · 12 weeks
        </Tag>
        <Display size={82} color={C.text} weight={800} style={{ textAlign: 'center' }}>
          The 12-week
          <br />
          position program
        </Display>
      </div>

      {/* the ball rolls in and stops */}
      <div
        style={{
          position: 'absolute',
          left: mix(-170, 540, roll) - 60,
          top: 830 + drop * 56 - settle * 8,
        }}
      >
        <Ball size={120} spin={roll * 2.6} tilt={0.3} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 84,
          right: 84,
          top: 980,
          opacity: clamp(prog(t, 48.7, 49.0)),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '26px 30px',
            borderRadius: 18,
            background: C.surface,
            border: `2px solid ${C.lineStrong}`,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              background: C.surface2,
              border: `2px solid ${C.line}`,
              flex: 'none',
            }}
          />
          <Typed text="GAME" p={typed} size={44} frame={frame} font={F.mono} />
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: F.ui,
              fontWeight: 600,
              fontSize: 28,
              color: clamp(prog(t, 49.5, 49.8)) > 0.5 ? C.accent : C.faint,
            }}
          >
            Post
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'flex',
            justifyContent: 'space-between',
            opacity: clamp(prog(t, 49.7, 50.1)),
          }}
        >
          <Tag size={19} color={C.muted}>
            Comment “game”
          </Tag>
          <Tag size={19} color={C.faint}>
            link sent back
          </Tag>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1260,
          display: 'flex',
          justifyContent: 'center',
          opacity: clamp(prog(t, 51.4, 51.8)),
        }}
      >
        <Display size={58} color={C.text} weight={800} style={{ letterSpacing: '0.02em' }}>
          Train the job.<span style={{ color: C.accent }}> Not the drill.</span>
        </Display>
      </div>
    </div>
  );
};
