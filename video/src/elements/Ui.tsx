import React from 'react';
import { C, F } from '../theme';
import { clamp, prog, rand } from '../lib/anim';

/** Monospace micro-label. The film's connective tissue. */
export const Tag: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  dim?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.muted, size = 21, dim = 1, style }) => (
  <div
    style={{
      fontFamily: F.mono,
      fontSize: size,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color,
      opacity: dim,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Condensed display type. */
export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 120, color = C.text, weight = 700, style }) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 0.92,
      letterSpacing: '0.005em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A hairline that draws itself. */
export const Rule: React.FC<{
  p: number;
  width?: number | string;
  color?: string;
  thickness?: number;
  vertical?: boolean;
  style?: React.CSSProperties;
}> = ({ p, width = '100%', color = C.line, thickness = 2, vertical, style }) => (
  <div
    style={{
      background: color,
      [vertical ? 'height' : 'width']: typeof width === 'number' ? width * clamp(p) : width,
      [vertical ? 'width' : 'height']: thickness,
      transformOrigin: 'left top',
      transform: typeof width === 'string' ? `scaleX(${clamp(p)})` : undefined,
      ...style,
    }}
  />
);

/** Surface card in the product's own interface language. */
export const Panel: React.FC<{
  p?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  accent?: boolean;
}> = ({ p = 1, children, style, accent }) => (
  <div
    style={{
      background: C.surface,
      border: `2px solid ${accent ? C.accent : C.line}`,
      borderRadius: 22,
      boxShadow: '0 40px 90px -40px rgba(0,0,0,0.85)',
      opacity: clamp(p * 1.4),
      transform: `translateY(${(1 - clamp(p)) * 26}px)`,
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Mechanical counter. Digits roll; the film opens and closes on one. */
export const Odometer: React.FC<{
  value: number;
  digits?: number;
  size?: number;
  color?: string;
  group?: boolean;
}> = ({ value, digits = 5, size = 150, color = C.text }) => {
  const v = Math.max(0, Math.floor(value));
  const s = String(v).padStart(digits, '0');
  return (
    <div style={{ display: 'flex', gap: size * 0.03 }}>
      {s.split('').map((ch, i) => {
        const lead = i < s.length - String(v).length;
        return (
          <span
            key={i}
            style={{
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1,
              color: lead ? C.faint : color,
              opacity: lead ? 0.32 : 1,
              fontVariantNumeric: 'tabular-nums',
              width: size * 0.62,
              textAlign: 'center',
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Checkable line item, used only where the program really has the feature. */
export const CheckRow: React.FC<{ p: number; label: string; note?: string; delayed?: boolean }> = ({
  p,
  label,
  note,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '15px 0',
      borderBottom: `2px solid ${C.line}`,
      opacity: clamp(p * 1.6),
      transform: `translateX(${(1 - clamp(p)) * 22}px)`,
    }}
  >
    <svg width="30" height="30" viewBox="0 0 24 24" style={{ flex: 'none' }}>
      <circle cx="12" cy="12" r="11" fill="none" stroke={C.good} strokeWidth="1.6" opacity={0.5} />
      <path
        d="M6.5 12.4 L10.2 16 L17.5 8.4"
        fill="none"
        stroke={C.good}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20"
        strokeDashoffset={20 * (1 - clamp((p - 0.25) / 0.6))}
      />
    </svg>
    <div style={{ fontFamily: F.ui, fontSize: 30, color: C.text, fontWeight: 500 }}>{label}</div>
    {note ? (
      <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 21, color: C.faint }}>{note}</div>
    ) : null}
  </div>
);

/** Film grain + vignette. Static noise field, so it costs one render. */
export const Grain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.05 }) => {
  const dots = React.useMemo(
    () =>
      new Array(260).fill(0).map((_, i) => ({
        x: rand(i * 3.1) * 1080,
        y: rand(i * 7.7 + 1) * 1920,
        r: 1 + rand(i * 2.3) * 2.4,
      })),
    []
  );
  const j = (frame % 4) * 7;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={(d.x + j) % 1080} cy={(d.y + j * 1.7) % 1920} r={d.r} fill="#fff" />
      ))}
    </svg>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(122% 74% at 50% 44%, rgba(0,0,0,0) 46%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** One-frame-ish exposure flash for hard cuts. */
export const Flash: React.FC<{ p: number; color?: string }> = ({ p, color = '#ECE7DF' }) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color,
        opacity: p * 0.85,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );

/** Typed text with a blinking caret. */
export const Typed: React.FC<{
  text: string;
  p: number;
  size?: number;
  color?: string;
  frame?: number;
  font?: string;
}> = ({ text, p, size = 44, color = C.text, frame = 0, font = F.ui }) => {
  const n = Math.floor(clamp(p) * text.length + 0.0001);
  return (
    <span style={{ fontFamily: font, fontSize: size, color, fontWeight: 600, letterSpacing: '0.01em' }}>
      {text.slice(0, n)}
      <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0.15 : 1, color: C.accent }}>▌</span>
    </span>
  );
};

/** Crosshair pin — marks the failure point, and later the diagnostic input. */
export const Pin: React.FC<{ p: number; label: string; color?: string; size?: number }> = ({
  p,
  label,
  color = C.crit,
  size = 42,
}) => (
  <div style={{ position: 'relative', opacity: clamp(p * 1.5) }}>
    <svg width={size} height={size} viewBox="-24 -24 48 48" style={{ display: 'block', overflow: 'visible' }}>
      <circle
        cx="0"
        cy="0"
        r={18}
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeDasharray="113"
        strokeDashoffset={113 * (1 - clamp(p))}
        transform={`rotate(${-90 + 40 * (1 - clamp(p))})`}
      />
      <path d="M-26 0 H-9 M9 0 H26 M0 -26 V-9 M0 9 V26" stroke={color} strokeWidth="2" opacity={clamp(p)} />
      <circle cx="0" cy="0" r="3.4" fill={color} />
    </svg>
    <div
      style={{
        position: 'absolute',
        left: size * 0.8,
        top: -6,
        fontFamily: F.mono,
        fontSize: 19,
        letterSpacing: '0.2em',
        color,
        whiteSpace: 'nowrap',
        opacity: clamp((p - 0.4) / 0.4),
      }}
    >
      {label}
    </div>
  </div>
);

/** Progress meter used for the deliberately-stuck "improvement" bar. */
export const Meter: React.FC<{
  value: number;
  width: number;
  label?: string;
  color?: string;
  sheen?: number;
}> = ({ value, width, label, color = C.accent, sheen = -1 }) => (
  <div style={{ width }}>
    {label ? <Tag size={19} style={{ marginBottom: 14 }}>{label}</Tag> : null}
    <div
      style={{
        position: 'relative',
        height: 14,
        borderRadius: 8,
        background: C.surface2,
        border: `2px solid ${C.line}`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, width: `${clamp(value) * 100}%`, background: color }} />
      {sheen >= 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sheen * 118 - 18}%`,
            width: '18%',
            background: 'linear-gradient(90deg, rgba(236,231,223,0), rgba(236,231,223,0.20), rgba(236,231,223,0))',
          }}
        />
      ) : null}
    </div>
  </div>
);

/** Animated dashed connector between two points, in any SVG space. */
export const Wire: React.FC<{
  d: string;
  p: number;
  color?: string;
  width?: number;
  dash?: string;
  length?: number;
  opacity?: number;
}> = ({ d, p, color = C.line, width = 2.4, dash, length = 1600, opacity = 1 }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeDasharray={dash ?? String(length)}
    strokeDashoffset={dash ? undefined : length * (1 - clamp(p))}
    opacity={opacity * clamp(p * 3)}
  />
);

export const fadeInOut = (t: number, from: number, to: number, lead = 0.22, tail = 0.22) =>
  clamp(prog(t, from, from + lead)) * (1 - clamp(prog(t, to - tail, to)));
