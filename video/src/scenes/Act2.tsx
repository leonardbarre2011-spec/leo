import React from 'react';
import { C, F } from '../theme';
import { BallGlyph } from '../elements/Ball';
import { Display, Pin, Rule, Tag } from '../elements/Ui';
import { BREAK_X, Gauge, Trace, TRACE_H, TRACE_W } from '../elements/Trace';
import { clamp, EASE, prog, pulse, ramp } from '../lib/anim';
import { S, W } from '../generated/timeline';

const PANEL_X = (1080 - TRACE_W) / 2 - 60;

/* =====================================================================
 * 04 · STRESS TEST — the handle held under load until it lets go, and the
 * exact point of failure pinned. The pin's dotted lead runs off the right
 * edge of frame and is not explained for another twenty-five seconds.
 * ===================================================================== */
export const Stress: React.FC<{ t: number }> = ({ t }) => {
  const s = S('stress');
  const tBreak = W('D', 3); // "breaks"
  const tPin = W('D', 6); // "pressure"
  const pressure = ramp(t, s.from + 0.1, tBreak, 0.08, 1);
  const broken = prog(t, tBreak, tBreak + 0.22, EASE.out);
  const shake = pulse(t, tBreak, 0.03, 0.26);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${Math.sin(t * 120) * shake * 9}px, ${Math.cos(t * 97) * shake * 6}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: PANEL_X, top: 430, width: TRACE_W + 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <Tag size={22} color={C.muted}>
            Handle
          </Tag>
          <Tag size={22} color={C.faint}>
            · stress test
          </Tag>
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: F.mono,
              fontSize: 22,
              color: broken > 0.3 ? C.crit : C.muted,
              letterSpacing: '0.16em',
            }}
          >
            {broken > 0.3 ? 'FAIL' : 'HOLDING'}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Rule p={prog(t, s.from, s.from + 0.4)} color={C.lineStrong} />
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${PANEL_X} 620)`}>
          <Trace
            roughness={0.35 + pressure * 0.7}
            pressure={pressure}
            broken={broken}
            phase={(t - s.from) * 5.4}
            reveal={prog(t, s.from + 0.05, s.from + 0.65)}
          />
        </g>
      </svg>

      <div style={{ position: 'absolute', left: PANEL_X + TRACE_W + 58, top: 620 }}>
        <Gauge value={pressure} height={TRACE_H} label="Pressure" />
      </div>

      <div style={{ position: 'absolute', left: PANEL_X + TRACE_W * BREAK_X - 21, top: 620 + TRACE_H / 2 - 21 }}>
        <Pin p={prog(t, tPin, tPin + 0.45)} label="Failure point" />
      </div>

      {/* the lead that goes somewhere we cannot see yet */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path
          d={`M${PANEL_X + TRACE_W * BREAK_X} ${620 + TRACE_H / 2} C 760 ${620 + TRACE_H / 2} 880 1090 1180 1090`}
          fill="none"
          stroke={C.crit}
          strokeWidth={2}
          strokeDasharray="8 12"
          opacity={clamp(prog(t, tPin + 0.25, tPin + 0.8)) * 0.55}
        />
      </svg>

      <div style={{ position: 'absolute', left: PANEL_X, top: 1010, opacity: clamp(prog(t, tPin + 0.3, tPin + 0.7)) }}>
        <Tag size={20} color={C.crit}>
          Breaks at 0.42 s · under pressure
        </Tag>
      </div>
    </div>
  );
};

/* =====================================================================
 * 05 · TWO HUNDRED — the prescription, drawn at actual scale. Two hundred
 * of the same object, arriving on a metronome that gets harder to like.
 * ===================================================================== */
const GCOLS = 20;
const GROWS = 10;

export const TwoHundred: React.FC<{ t: number }> = ({ t }) => {
  const s = S('twohundred');
  const fillEnd = s.from + 1.45;
  const n = Math.floor(ramp(t, s.from + 0.04, fillEnd, 0, 200, EASE.inOut));
  const cell = 46;
  const gw = GCOLS * cell;
  const gh = GROWS * cell;
  const gx = (1080 - gw) / 2;
  const gy = 640;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 420,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: 26,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 120,
            color: C.text,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {String(n).padStart(3, '0')}
        </div>
        <Tag size={24} color={C.faint}>
          dribbles · today
        </Tag>
      </div>

      <div style={{ position: 'absolute', left: gx, top: gy, width: gw, height: gh }}>
        {new Array(200).fill(0).map((_, i) => {
          const col = i % GCOLS;
          const row = Math.floor(i / GCOLS);
          const on = i < n;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: col * cell,
                top: row * cell,
                opacity: on ? 1 : 0.07,
                transform: `scale(${on ? 1 : 0.7})`,
              }}
            >
              <BallGlyph size={cell - 8} color={on ? C.accent : C.faint} opacity={on ? 0.85 : 1} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: gx,
          top: gy + gh + 34,
          width: gw,
          display: 'flex',
          justifyContent: 'space-between',
          opacity: clamp(prog(t, fillEnd, fillEnd + 0.3)),
        }}
      >
        <Tag size={20} color={C.faint}>
          Same input
        </Tag>
        <Tag size={20} color={C.faint}>
          Same output
        </Tag>
      </div>
    </div>
  );
};

/* =====================================================================
 * 06 · SMOOTHING — three passes of polish, applied to the wrong thing.
 * The trace gets beautiful and then breaks at the identical coordinate.
 * ===================================================================== */
const PASSES = [16.4, 17.34, 18.1];

export const Smooth: React.FC<{ t: number }> = ({ t }) => {
  const s = S('smooth');
  const tBreak = W('F', 10); // "breaks"
  const pass = PASSES.filter((p) => t >= p).length;
  const roughness = ramp(t, s.from, tBreak - 0.6, 1.05, 0.06) * (1 - pass * 0.22 + 0.66);
  const pressure = ramp(t, tBreak - 1.35, tBreak - 0.05, 0.05, 1);
  const broken = prog(t, tBreak, tBreak + 0.2, EASE.out);
  const shake = pulse(t, tBreak, 0.03, 0.3);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${Math.sin(t * 128) * shake * 11}px, ${Math.cos(t * 91) * shake * 7}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: PANEL_X, top: 430, width: TRACE_W + 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <Tag size={22} color={C.muted}>
            Smoothing
          </Tag>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            {PASSES.map((p, i) => (
              <div
                key={i}
                style={{
                  fontFamily: F.mono,
                  fontSize: 20,
                  padding: '5px 12px',
                  borderRadius: 6,
                  color: t >= p ? C.bg : C.faint,
                  background: t >= p ? C.good : 'transparent',
                  border: `2px solid ${t >= p ? C.good : C.line}`,
                  letterSpacing: '0.1em',
                }}
              >
                {`PASS 0${i + 1}`}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Rule p={1} color={C.lineStrong} />
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${PANEL_X} 620)`}>
          <Trace
            roughness={Math.max(0.05, roughness)}
            pressure={pressure}
            broken={broken}
            phase={(t - s.from) * 4.6 + 2.1}
          />
        </g>
      </svg>

      <div style={{ position: 'absolute', left: PANEL_X + TRACE_W + 58, top: 620 }}>
        <Gauge value={pressure} height={TRACE_H} label="Pressure" />
      </div>

      <div style={{ position: 'absolute', left: PANEL_X + TRACE_W * BREAK_X - 21, top: 620 + TRACE_H / 2 - 21 }}>
        <Pin p={clamp(prog(t, tBreak - 0.1, tBreak + 0.25))} label="Same point" />
      </div>

      <div
        style={{
          position: 'absolute',
          left: PANEL_X,
          top: 1006,
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          opacity: clamp(prog(t, tBreak + 0.12, tBreak + 0.45)),
        }}
      >
        <Display size={64} color={C.crit} weight={800}>
          Same break
        </Display>
        <Tag size={20} color={C.faint}>
          x = 0.42 s
        </Tag>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.crit,
          opacity: pulse(t, tBreak, 0.03, 0.22) * 0.1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
