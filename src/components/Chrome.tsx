import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CARD_BOTTOM, COLORS, FONTS, WIDTH, ZONES} from '../theme';
import {EASE_OUT, pop, wobble} from './anim';

/** Thin "how much is left" line. Cheap, and it measurably holds viewers to the CTA. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = frame / (durationInFrames - 1);
  return (
    <div
      style={{
        position: 'absolute',
        top: CARD_BOTTOM + 16,
        left: 70,
        width: WIDTH - 140,
        height: 6,
        borderRadius: 999,
        background: 'rgba(247,244,238,0.16)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.amber})`,
          boxShadow: `0 0 18px ${COLORS.orange}`,
        }}
      />
    </div>
  );
};

const Pill: React.FC<{
  children: React.ReactNode;
  bg: string;
  color: string;
  glow?: string;
  scale?: number;
  fontSize?: number;
}> = ({children, bg, color, glow, scale = 1, fontSize = 34}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '18px 38px',
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: FONTS.ui,
      fontWeight: 800,
      fontSize,
      letterSpacing: 1.4,
      transform: `scale(${scale})`,
      boxShadow: glow ?? '0 14px 34px rgba(0,0,0,0.45)',
      border: '2px solid rgba(247,244,238,0.14)',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const ArrowRight: React.FC<{color: string; size?: number}> = ({color, size = 30}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 12h15M13 6l6 6-6 6" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SoundIcon: React.FC<{color: string}> = ({color}) => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill={color} />
    <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

/**
 * The standing bar under the captions. It escalates with the pitch: a mute
 * nudge at the open, the offer once it is named, then a hard CTA the moment
 * the voice-over says "check the link in my bio".
 */
export const BottomBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  let node: React.ReactNode = null;

  if (t < 3.2) {
    const s = interpolate(pop(frame, fps, 6, 14), [0, 1], [0.8, 1]);
    const out = interpolate(t, [2.7, 3.2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    node = (
      <div style={{opacity: out}}>
        <Pill bg="rgba(11,13,18,0.78)" color={COLORS.cream} scale={s} fontSize={30}>
          <SoundIcon color={COLORS.amber} />
          SOUND ON
        </Pill>
      </div>
    );
  } else if (t >= 11.0 && t < 21.9) {
    const s = interpolate(pop(frame - 11.0 * fps, fps, 0, 12), [0, 1], [0.82, 1]);
    node = (
      <Pill bg="rgba(11,13,18,0.80)" color={COLORS.cream} scale={s} fontSize={31}>
        <span style={{color: COLORS.amber}}>12-WEEK</span> POSITION PROGRAM
      </Pill>
    );
  } else if (t >= 21.9) {
    const s = interpolate(pop(frame - 21.9 * fps, fps, 0, 11), [0, 1], [0.78, 1]);
    const pulse = 1 + wobble(frame, 22, 0.028);
    node = (
      <Pill
        bg={`linear-gradient(96deg, ${COLORS.orange}, ${COLORS.amber})`}
        color={COLORS.ink}
        scale={s * pulse}
        glow={`0 16px 44px rgba(255,90,31,0.55), 0 0 0 ${6 + wobble(frame, 22, 4, 1)}px rgba(255,90,31,0.18)`}
        fontSize={38}
      >
        LINK IN BIO
        <ArrowRight color={COLORS.ink} size={34} />
      </Pill>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: ZONES.ctaTop,
        left: 0,
        width: WIDTH,
        height: ZONES.safeBottom - ZONES.ctaTop,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {node}
    </div>
  );
};

/** Two-frame light kick on the loudest cuts - reads as energy, costs no footage. */
export const FlashOn: React.FC<{cuts: number[]}> = ({cuts}) => {
  const frame = useCurrentFrame();
  const nearest = cuts.find((c) => frame >= c && frame < c + 5);
  if (nearest === undefined) return null;
  const o = interpolate(frame - nearest, [0, 1, 5], [0.34, 0.22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(60% 40% at 50% 45%, #fff 0%, rgba(255,255,255,0) 70%)',
        opacity: o,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};
