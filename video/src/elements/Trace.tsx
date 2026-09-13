import React from 'react';
import { C } from '../theme';
import { clamp, rand } from '../lib/anim';

/**
 * The handle, as an instrument reads it. The same trace is used twice: once
 * when it fractures under pressure, and again after three smoothing passes —
 * where it fractures at exactly the same x. That repeat is the whole joke.
 */
export const TRACE_W = 820;
export const TRACE_H = 300;
export const BREAK_X = 0.615;

const SAMPLES = 260;

export const tracePath = ({
  roughness,
  pressure,
  broken,
  phase,
}: {
  roughness: number;
  pressure: number;
  broken: number;
  phase: number;
}) => {
  const mid = TRACE_H / 2;
  const intact: string[] = [];
  const failed: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = i / SAMPLES;
    const x = p * TRACE_W;
    const base = Math.sin(phase + p * 13.4) * 52;
    const ripple = Math.sin(phase * 2.3 + p * 41) * 13 * roughness;
    const strain = Math.sin(phase * 1.7 + p * 78) * 9 * roughness * pressure;
    let y = mid + base + ripple + strain;
    if (p > BREAK_X && broken > 0) {
      const k = clamp((p - BREAK_X) / 0.22) * broken;
      y += (rand(i * 4.7) - 0.5) * 190 * k + k * 60;
    }
    const pt = `${x.toFixed(1)} ${y.toFixed(1)}`;
    if (p <= BREAK_X || broken <= 0) intact.push(pt);
    if (p >= BREAK_X && broken > 0) failed.push(pt);
  }
  return {
    intact: `M${intact.join(' L')}`,
    failed: failed.length > 1 ? `M${failed.join(' L')}` : '',
  };
};

export const Trace: React.FC<{
  roughness: number;
  pressure: number;
  broken: number;
  phase: number;
  reveal?: number;
}> = ({ roughness, pressure, broken, phase, reveal = 1 }) => {
  const { intact, failed } = tracePath({ roughness, pressure, broken, phase });
  return (
    <g>
      <g stroke={C.line} strokeWidth={1.5}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={0} x2={TRACE_W} y1={i * (TRACE_H / 4)} y2={i * (TRACE_H / 4)} strokeDasharray="4 12" />
        ))}
      </g>
      <path
        d={intact}
        fill="none"
        stroke={C.accent}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={2400}
        strokeDashoffset={2400 * (1 - clamp(reveal))}
      />
      {failed ? (
        <path
          d={failed}
          fill="none"
          stroke={C.crit}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={clamp(broken * 1.6)}
        />
      ) : null}
      <line
        x1={TRACE_W * BREAK_X}
        x2={TRACE_W * BREAK_X}
        y1={-16}
        y2={TRACE_H + 16}
        stroke={C.crit}
        strokeWidth={2}
        strokeDasharray="7 9"
        opacity={clamp(broken) * 0.6}
      />
    </g>
  );
};

/** Vertical load gauge. */
export const Gauge: React.FC<{ value: number; height?: number; label: string }> = ({
  value,
  height = 300,
  label,
}) => {
  const steps = 14;
  const on = Math.round(clamp(value) * steps);
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6, alignItems: 'center' }}>
      {new Array(steps).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            width: 34,
            height: height / steps - 6,
            borderRadius: 2,
            background: i < on ? (i > steps - 4 ? C.crit : C.accent) : C.surface2,
            opacity: i < on ? 1 : 0.7,
          }}
        />
      ))}
      <div
        style={{
          writingMode: 'vertical-rl',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 17,
          letterSpacing: '0.22em',
          color: C.faint,
          textTransform: 'uppercase',
          marginTop: 10,
        }}
      >
        {label}
      </div>
    </div>
  );
};
