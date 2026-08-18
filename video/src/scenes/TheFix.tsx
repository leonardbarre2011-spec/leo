import React from 'react';
import {AbsoluteFill, useCurrentFrame, Sequence, interpolate} from 'remotion';
import {C, F} from '../theme';
import {Broll, GRADE_HOT} from '../components/Broll';
import {Slam, Chip} from '../components/KineticText';
import {PunchIn, Shake} from '../components/Camera';
import {Texture, Flash} from '../components/Overlays';
import {at, CUE} from '../data/vo';
import {ease, sp, SNAP, clamp01} from '../components/anim';

export const FIX_START = at(CUE.train);
export const FIX_END = at(CUE.sprint);

const L = (f: number) => f - FIX_START;

/** The three requirements, delivered as a checklist that fills in on the word.
 *  Each row is the exact thing the previous scene showed was missing. */
const Row: React.FC<{index: number; at: number; label: string; note: string}> = ({
  index,
  at: a,
  label,
  note,
}) => {
  const frame = useCurrentFrame();
  const s = sp(frame, a, SNAP);
  if (frame < a - 1) return null;
  const x = interpolate(s, [0, 1], [-140, 0]);
  const o = interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'});
  const fill = clamp01((frame - a - 2) / 6);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        transform: `translateX(${x}px)`,
        opacity: o,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          flexShrink: 0,
          background: C.lime,
          color: C.black,
          fontFamily: F.display,
          fontSize: 62,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `skewX(-9deg) scaleX(${fill})`,
          transformOrigin: 'left center',
          boxShadow: '0 14px 40px rgba(0,0,0,0.55)',
        }}
      >
        <span style={{transform: 'skewX(9deg) translateY(4px)'}}>{`0${index}`}</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 124,
            lineHeight: 0.88,
            color: C.white,
            letterSpacing: '-0.02em',
            transform: 'skewX(-6deg)',
            textShadow: '0 12px 40px rgba(0,0,0,0.8)',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: F.kicker,
            fontStyle: 'italic',
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: '0.1em',
            color: C.lime,
            opacity: fill,
          }}
        >
          {note}
        </div>
      </div>
    </div>
  );
};

export const TheFix: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = frame + FIX_START;

  return (
    <AbsoluteFill style={{background: C.black}}>
      <Shake hits={[0, L(at(CUE.pressure)), L(at(CUE.movement)), L(at(CUE.decisions))]} amount={13} decay={6}>
        <PunchIn duration={FIX_END - FIX_START} from={1.24} to={1.05} originY={42}>
          <Broll clip={1} startAt={0.1} speed={0.82} zoom={1.3} focusY={52} grade={{...GRADE_HOT, brightness: 0.74, saturate: 0.8}} />
        </PunchIn>
      </Shake>

      {/* a scrim so the list stays legible over moving footage on a phone */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.78) 12%, rgba(0,0,0,0.30) 46%, rgba(0,0,0,0.86) 92%)',
        }}
      />
      <Texture grain={0.09} vignette={0.62} />

      <AbsoluteFill style={{alignItems: 'flex-start', paddingTop: 140, paddingLeft: 58}}>
        <Chip at={0} label="THE FIX" color={C.lime} fg={C.black} size={54} />
        <div style={{height: 18}} />
        <Slam at={2} size={128} from="up" skew={6} align="left" color={C.white}>
          TRAIN WITH
        </Slam>
      </AbsoluteFill>

      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 58, paddingRight: 40}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 44}}>
          <Row index={1} at={L(at(CUE.pressure))} label="PRESSURE" note="SOMEONE IS GUARDING YOU" />
          <Row index={2} at={L(at(CUE.movement))} label="MOVEMENT" note="YOU ARRIVE AT SPEED" />
          <Row index={3} at={L(at(CUE.decisions))} label="DECISIONS" note="YOU CHOOSE, NOT A ROUTINE" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150}}>
        <Slam
          at={L(at(CUE.decisions)) + 7}
          size={62}
          from="up"
          font={F.kicker}
          color={C.white}
          tracking={0.14}
        >
          ALL THREE. EVERY REP.
        </Slam>
      </AbsoluteFill>

      <Flash at={L(at(CUE.decisions))} len={3} color={C.lime} max={0.22} />

      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(abs, FIX_END - 4, FIX_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
