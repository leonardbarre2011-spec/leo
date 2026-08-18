import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {C, F} from '../theme';
import {Slam} from '../components/KineticText';
import {Texture} from '../components/Overlays';
import {at, CUE} from '../data/vo';
import {NEVER_END} from './NeverSame';
import {nrnd} from '../components/anim';

export const LOOP_START = NEVER_END;
export const LOOP_END = at(CUE.train);

/**
 * Half a second of near-black. It costs almost nothing and it is the strongest
 * retention device in the whole edit: after the problem has been proven, the
 * viewer is held on an unanswered question right before the answer arrives.
 */
export const OpenLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const len = LOOP_END - LOOP_START;
  const sweep = interpolate(frame, [0, len], [-1, 1.4], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: C.black, justifyContent: 'center', alignItems: 'center'}}>
      {/* a single moving light bar keeps the black card alive rather than dead */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${50 + sweep * 26}%`,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          opacity: 0.9,
        }}
      />
      <Slam at={1} size={140} from="squash" color={C.white} skew={7} tracking={0.0}>
        SO WHAT
      </Slam>
      <Slam at={4} size={140} from="squash" color={C.lime} skew={7}>
        SHOULD YOU DO?
      </Slam>
      <div
        style={{
          marginTop: 34,
          fontFamily: F.kicker,
          fontStyle: 'italic',
          fontWeight: 800,
          fontSize: 54,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.55)',
          transform: `translateX(${nrnd(Math.floor(frame / 2)) * 2}px)`,
          opacity: frame >= 7 ? 1 : 0,
        }}
      >
        THREE THINGS. THAT&apos;S IT.
      </div>
      <Texture grain={0.14} vignette={0.85} />
    </AbsoluteFill>
  );
};
