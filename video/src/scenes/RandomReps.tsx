import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random, Sequence} from 'remotion';
import {C, F} from '../theme';
import {Slam, Chip, TextLayer} from '../components/KineticText';
import {Texture, Flash} from '../components/Overlays';
import {XStamp} from '../components/Annotate';
import {CourtStage, CourtMarkings, OffenseDot, ShotArc, Swish, HOOP} from '../components/Court';
import {at, CUE} from '../data/vo';
import {ease, clamp01} from '../components/anim';

export const REPS_START = at(CUE.doing);
export const REPS_END = at(CUE.because);

/** 24 stand-still jump shots scattered around the arc — no defender, no cut,
 *  no decision. The absence is the argument, so the diagram is deliberately
 *  bare: dots appear, fire, and vanish. */
const SHOTS = new Array(24).fill(0).map((_, i) => {
  const a = 0.12 + random(`ang${i}`) * 0.76; // 0..1 across the arc
  const theta = Math.PI * (0.08 + a * 0.84);
  const r = 170 + random(`rad${i}`) * 95;
  return {
    x: HOOP.x - Math.cos(theta) * r,
    y: HOOP.y + Math.sin(theta) * r,
    seed: i,
  };
});

const Counter: React.FC<{from: number; to: number; startFrame: number; endFrame: number}> = ({
  from,
  to,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const v = Math.round(
    interpolate(frame, [startFrame, endFrame], [from, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 2),
    })
  );
  const pop = 1 + Math.max(0, 1 - (frame - startFrame) / 3) * 0.25;
  return (
    <div
      style={{
        fontFamily: F.display,
        fontSize: 300,
        lineHeight: 0.8,
        color: C.white,
        transform: `scale(${pop}) skewX(-6deg)`,
        textShadow: '0 18px 60px rgba(0,0,0,0.8)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {v}
    </div>
  );
};

const Missing: React.FC<{at: number; out: number}> = ({at: a, out}) => {
  const frame = useCurrentFrame();
  const items = ['NO PRESSURE', 'NO MOVEMENT', 'NO DECISIONS'];
  const gone = clamp01((frame - out) / 4);
  if (frame < a || gone >= 1) return null;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14, opacity: 1 - gone}}>
      {items.map((it, i) => {
        const k = clamp01((frame - a - i * 5) / 6);
        if (k <= 0) return null;
        return (
          <div
            key={it}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              transform: `translateX(${(1 - k) * -70}px)`,
              opacity: k,
            }}
          >
            <span style={{fontFamily: F.display, fontSize: 76, color: C.red, lineHeight: 0.9}}>&#10005;</span>
            <span
              style={{
                fontFamily: F.display,
                fontSize: 88,
                color: C.white,
                letterSpacing: '-0.02em',
                transform: 'skewX(-6deg)',
                textShadow: '0 10px 34px rgba(0,0,0,0.8)',
              }}
            >
              {it}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const RandomReps: React.FC = () => {
  const frame = useCurrentFrame(); // scene-local
  const abs = frame + REPS_START;

  const fireStart = at(CUE.doing) - REPS_START + 4;
  const fireEnd = at(CUE.shots) - REPS_START;
  const wont = at(CUE.wont) - REPS_START;
  const scorer = at(CUE.scorer) - REPS_START;

  // once "won't" lands the whole diagram is condemned: it desaturates and tilts
  const kill = clamp01((frame - wont) / 8);

  return (
    <AbsoluteFill style={{background: C.ink}}>
      {/* faint court glow so the diagram does not read as a flat wireframe */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 45% at 50% 62%, rgba(255,122,24,0.16) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      <AbsoluteFill
        style={{
          filter: `saturate(${1 - kill * 0.85}) brightness(${1 - kill * 0.28})`,
          transform: `rotate(${kill * -1.6}deg) scale(${1 + kill * 0.04})`,
        }}
      >
        <CourtStage k={2.02} ox={35} oy={520}>
          <CourtMarkings at={0} />
          {SHOTS.map((s, i) => {
            const t = fireStart + (i / SHOTS.length) * (fireEnd - fireStart);
            return (
              <g key={i}>
                <OffenseDot x={s.x} y={s.y} at={t} r={13} color={C.smoke} />
                <ShotArc
                  fromX={s.x}
                  fromY={s.y}
                  at={t + 1}
                  dur={6}
                  color={'rgba(255,255,255,0.42)'}
                  width={4}
                />
              </g>
            );
          })}
          <Swish at={fireEnd - 2} color={'rgba(255,255,255,0.5)'} />
        </CourtStage>
      </AbsoluteFill>

      <Texture grain={0.09} vignette={0.68} />

      {/* headline: the count is the spectacle, the verdict arrives right after */}
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 118}}>
        <Chip at={2} label="WHAT MOST PLAYERS DO" color={C.white} fg={C.black} size={44} />
        <div style={{height: 24}} />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <Counter from={0} to={100} startFrame={fireStart} endFrame={fireEnd} />
          <Slam at={fireStart} size={104} from="up" color={C.orange} skew={6}>
            REPS
          </Slam>
        </div>
      </AbsoluteFill>

      {/* what those reps are missing, named one by one — the exact three things
          the fix will hand back a few seconds later */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120}}>
        <Missing at={fireStart + 6} out={wont - 2} />
      </AbsoluteFill>

      <XStamp at={wont + 1} cx={540} cy={1010} size={600} />

      {/* the verdict */}
      <Sequence from={wont} layout="none">
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 200}}>
          <Slam at={0} size={150} from="squash" color={C.white} skew={6}>
            WON&apos;T MAKE YOU
          </Slam>
          <Slam at={scorer - wont} size={214} from="squash" color={C.red} skew={6} rotate={-2}>
            A SCORER
          </Slam>
        </AbsoluteFill>
        <Flash at={0} len={3} color={C.red} max={0.4} />
      </Sequence>

      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(abs, REPS_END - 5, REPS_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
