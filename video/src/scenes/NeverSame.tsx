import React from 'react';
import {AbsoluteFill, useCurrentFrame, Sequence} from 'remotion';
import {C, F} from '../theme';
import {Broll, GRADE_HOT, GRADE_COLD} from '../components/Broll';
import {Slam, Chip, TextLayer} from '../components/KineticText';
import {PunchIn, Shake, SmearCut} from '../components/Camera';
import {Texture, Flash} from '../components/Overlays';
import {at, CUE} from '../data/vo';
import {ease} from '../components/anim';

export const NEVER_START = at(CUE.because);
export const NEVER_END = at(CUE.twice) + 10;

const L = (f: number) => f - NEVER_START;

const CUT_A = 0;
const CUT_B = L(at(CUE.never));
const CUT_C = L(at(CUE.shot));
const FREEZE = L(at(CUE.twice));
const TOTAL = NEVER_END - NEVER_START;

/** Top-right tally. Three different shots in three seconds is the argument,
 *  so the edit itself makes the point and the label only keeps score. */
const ShotTag: React.FC<{n: string; kind: string}> = ({n, kind}) => (
  <AbsoluteFill style={{alignItems: 'flex-end', paddingTop: 150, paddingRight: 58}}>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8}}>
      <Chip at={0} label={`SHOT ${n}`} color={C.white} fg={C.black} size={40} />
      <Chip at={2} label={kind} color={C.red} fg={C.white} size={40} />
    </div>
  </AbsoluteFill>
);

export const NeverSame: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = frame + NEVER_START;

  return (
    <AbsoluteFill style={{background: C.black}}>
      {/* --- three genuinely different looks, cut hard against each other --- */}
      <Sequence from={CUT_A} durationInFrames={CUT_B - CUT_A} layout="none">
        <SmearCut length={4} angle={10}>
          <Shake hits={[0]} amount={14} decay={6}>
            <PunchIn duration={CUT_B - CUT_A} from={1.02} to={1.14} originY={46}>
              <Broll clip={1} startAt={0.3} zoom={1.5} focusY={38} grade={GRADE_HOT} />
            </PunchIn>
          </Shake>
        </SmearCut>
        <ShotTag n="01" kind="ISO · SHOT CLOCK" />
      </Sequence>

      <Sequence from={CUT_B} durationInFrames={CUT_C - CUT_B} layout="none">
        <SmearCut length={4} angle={-165}>
          <Shake hits={[0]} amount={16} decay={6}>
            <PunchIn duration={CUT_C - CUT_B} from={1.04} to={1.16} originY={44}>
              <Broll clip={4} startAt={0.8} zoom={1.4} panY={-140} focusY={58} grade={GRADE_HOT} />
            </PunchIn>
          </Shake>
        </SmearCut>
        <ShotTag n="02" kind="DRIVING · 2 DEFENDERS" />
        <Flash at={0} len={3} color={C.white} max={0.35} />
      </Sequence>

      <Sequence from={CUT_C} durationInFrames={FREEZE - CUT_C} layout="none">
        <SmearCut length={4} angle={8}>
          <Shake hits={[0]} amount={16} decay={6}>
            <PunchIn duration={FREEZE - CUT_C} from={1.02} to={1.12} originY={38}>
              <Broll clip={2} startAt={0.95} zoom={1.12} focusY={34} grade={GRADE_HOT} />
            </PunchIn>
          </Shake>
        </SmearCut>
        <ShotTag n="03" kind="RISING · CONTESTED" />
        <Flash at={0} len={3} color={C.white} max={0.35} />
      </Sequence>

      {/* --- the freeze that lets the word land --- */}
      <Sequence from={FREEZE} durationInFrames={TOTAL - FREEZE} layout="none">
        <Shake hits={[0]} amount={28} decay={5}>
          <AbsoluteFill style={{transform: 'scale(1.1)', transformOrigin: '50% 40%'}}>
            <Broll clip={2} startAt={0.95 + (FREEZE - CUT_C) / 30} freeze zoom={1.15} focusY={34} grade={GRADE_COLD} />
          </AbsoluteFill>
        </Shake>
        <Flash at={0} len={3} color={C.red} max={0.5} />
      </Sequence>

      <Texture grain={0.1} vignette={0.7} />

      <AbsoluteFill style={{alignItems: 'flex-start', paddingTop: 150, paddingLeft: 58}}>
        <Chip at={L(at(CUE.games)) - 3} out={FREEZE - 2} label="IN A REAL GAME" color={C.red} fg={C.white} size={48} />
      </AbsoluteFill>

      <TextLayer justify="center" padding={56} style={{marginTop: 60}}>
        <Slam at={CUT_B} out={FREEZE - 2} size={248} from="squash" color={C.white} skew={7} rotate={-2}>
          NEVER
        </Slam>
        <Slam at={CUT_C} out={FREEZE - 2} size={118} from="up" color={C.white} skew={7}>
          THE SAME SHOT
        </Slam>
      </TextLayer>

      <Sequence from={FREEZE} layout="none">
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <Slam at={0} size={330} from="squash" color={C.red} skew={7} rotate={-3}>
            TWICE.
          </Slam>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(abs, NEVER_END - 4, NEVER_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
