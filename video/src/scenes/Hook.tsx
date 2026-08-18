import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Sequence} from 'remotion';
import {C, F} from '../theme';
import {Broll, GRADE_RED, GRADE_HOT} from '../components/Broll';
import {Slam, Chip, TextLayer} from '../components/KineticText';
import {PunchIn, Shake} from '../components/Camera';
import {Texture, Flash} from '../components/Overlays';
import {at, CUE} from '../data/vo';
import {ease} from '../components/anim';

/**
 * Frames are absolute composition frames; the scene is mounted at 0 so the
 * cue helper can be used directly. The whole point of this section is that a
 * thumb moving at speed has to be stopped before it ever reaches the video's
 * midpoint, so the thesis of the voice-over is on screen at frame 2 — before
 * the narrator has said a single word.
 */
export const HOOK_END = at(CUE.doing);

const Scanline: React.FC<{at: number}> = ({at: a}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [a, a + 9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (k <= 0 || k >= 1) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${k * 100}%`,
          height: 6,
          background: C.red,
          opacity: 1 - k,
          boxShadow: `0 0 60px 12px ${C.red}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // The stamped freeze holds until "basketball", the drive plays under the
  // build, and the frame locks again the moment the voice says "stop".
  const live = at(CUE.basketball1) + 2;
  const stopBeat = at(CUE.stop1);

  return (
    <AbsoluteFill style={{background: C.black}}>
      {/* --- 0.00s: frozen contested jumper, crushed to near-monochrome red --- */}
      <Sequence durationInFrames={live} layout="none">
        <Shake hits={[0, 3, 7, stopBeat]} amount={16} decay={5}>
          <PunchIn duration={live} from={1.0} to={1.11} originY={40}>
            <Broll clip={2} startAt={1.58} freeze focusY={35} grade={GRADE_RED} />
          </PunchIn>
        </Shake>
      </Sequence>

      {/* --- the footage releases into motion on "basketball", under time --- */}
      <Sequence from={live} durationInFrames={stopBeat - live} layout="none">
        <Shake hits={[0]} amount={18} decay={7}>
          <PunchIn duration={stopBeat - live} from={1.04} to={1.16} originY={46}>
            <Broll clip={4} startAt={0.5} speed={0.7} zoom={1.35} focusY={54} grade={GRADE_HOT} />
          </PunchIn>
        </Shake>
      </Sequence>

      {/* --- and locks on the double team as the thesis is restated --- */}
      <Sequence from={stopBeat} layout="none">
        <Shake hits={[0]} amount={26} decay={6}>
          <PunchIn duration={HOOK_END - stopBeat} from={1.06} to={1.16} originY={44}>
            <Broll clip={4} startAt={1.35} freeze zoom={1.5} focusY={50} grade={GRADE_RED} />
          </PunchIn>
        </Shake>
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.06) 22%, rgba(0,0,0,0.62) 56%, rgba(0,0,0,0.88) 100%)',
        }}
      />
      <Texture grain={0.11} vignette={0.72} />

      {/* --- the claim, three staggered slams inside the first 12 frames --- */}
      <TextLayer justify="flex-end" padding={48} style={{paddingBottom: 300}}>
        <div style={{transform: 'rotate(-2.5deg)'}}>
          <Slam at={-7} out={live - 3} size={352} from="squash" color={C.red} skew={6}>
            STOP
          </Slam>
          <Slam at={-3} out={live - 4} size={222} from="side" skew={6}>
            TRAINING
          </Slam>
          <Slam at={0} out={live - 5} size={222} from="side" skew={6}>
            LIKE THIS
          </Slam>
        </div>
      </TextLayer>

      <Flash at={1} len={3} color={C.red} max={0.22} />
      <Flash at={6} len={4} color={C.white} max={0.24} />
      <Scanline at={5} />

      {/* the mark that makes the claim unmissable without audio */}
      {/* --- once live: a small kicker keeps the promise alive under the motion --- */}
      <Sequence from={live} layout="none">
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'flex-start', padding: 58, paddingTop: 150}}>
          <Chip at={1} label="IF YOU'RE SERIOUS ABOUT HOOPS" color={C.white} fg={C.black} size={58} />
        </AbsoluteFill>
      </Sequence>

      {/* --- callback: the voice finally says "stop", the word re-slams --- */}
      <Sequence from={stopBeat} layout="none">
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 430}}>
          <Slam at={0} size={330} from="scale" color={C.red} skew={7} rotate={-3}>
            STOP
          </Slam>
        </AbsoluteFill>
        <Flash at={0} len={3} color={C.red} max={0.3} />
      </Sequence>

      {/* --- tension build into the reveal --- */}
      <Sequence from={at(CUE.training1)} layout="none">
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320}}>
          <Slam at={0} size={132} from="up" color={C.white} skew={6} tracking={0.02}>
            TRAINING LIKE THIS
          </Slam>
        </AbsoluteFill>
      </Sequence>

      {/* darkening ramp that hands over to the diagram section */}
      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(frame, HOOK_END - 6, HOOK_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
