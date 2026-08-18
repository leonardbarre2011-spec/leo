import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Sequence, random} from 'remotion';
import {C, F} from '../theme';
import {Broll, GRADE_HOT} from '../components/Broll';
import {Slam, Chip} from '../components/KineticText';
import {PunchIn, Shake} from '../components/Camera';
import {Texture, Flash} from '../components/Overlays';
import {XStamp, CheckMark} from '../components/Annotate';
import {CourtStage, CourtMarkings, ShotArc, HOOP} from '../components/Court';
import {at, CUE} from '../data/vo';
import {ease, clamp01} from '../components/anim';

export const TRANS_START = at(CUE.stop2);
export const TRANS_END = at(CUE.follow);

const L = (f: number) => f - TRANS_START;

const START = L(at(CUE.start));
const IMPOSSIBLE = L(at(CUE.impossible));
const GUARD = L(at(CUE.guard));

/**
 * Before and after are delivered as a hard cut rather than a side-by-side
 * panel: on a phone, two half-height panels halve the legibility of both,
 * while a cut between two full-frame images makes the contrast the point.
 */
const LookGoodCard: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, START], [1.0, 1.13], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{background: 'radial-gradient(75% 42% at 50% 44%, #1C2534 0%, #0A0D14 72%)'}}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${drift})`,
          transformOrigin: '50% 42%',
        }}
      >
        <CourtStage k={2.4} ox={-60} oy={330}>
          <rect x={0} y={0} width={500} height={470} fill="#1B2230" />
          <CourtMarkings at={-999} color="rgba(255,255,255,0.72)" />
          {new Array(22).fill(0).map((_, i) => {
            const theta = Math.PI * (0.1 + (i / 22) * 0.8);
            const r = 175 + random(`p${i}`) * 90;
            const x = HOOP.x - Math.cos(theta) * r;
            const y = HOOP.y + Math.sin(theta) * r;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={13} fill="rgba(255,255,255,0.85)" />
                <ShotArc fromX={x} fromY={y} at={-999} color="rgba(255,255,255,0.62)" width={5} />
              </g>
            );
          })}
        </CourtStage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Transformation: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = frame + TRANS_START;
  const total = TRANS_END - TRANS_START;

  /** diagonal wipe that throws the "wrong" card off screen on "Start" */
  const wipe = interpolate(frame, [START - 1, START + 7], [0, 118], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <AbsoluteFill style={{background: C.black}}>
      {/* --- after: always underneath, uncovered by the wipe --- */}
      <Sequence from={START - 8} layout="none">
        <Shake hits={[8, IMPOSSIBLE - START + 8, GUARD - START + 8]} amount={20} decay={7}>
          <PunchIn duration={total - START} from={1.3} to={1.05} originY={38}>
            <Broll clip={1} startAt={0.15} speed={0.75} zoom={1.45} focusY={40} grade={GRADE_HOT} />
          </PunchIn>
        </Shake>
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.66) 6%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.82) 88%)',
          }}
        />
      </Sequence>

      {/* --- before --- */}
      {wipe < 118 ? (
        <AbsoluteFill style={{clipPath: `polygon(0 0, 100% 0, 100% ${100 - wipe}%, 0 ${118 - wipe}%)`}}>
          <LookGoodCard />
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', marginTop: -60}}>
            <Slam at={1} out={START - 5} size={126} from="up" skew={7} color={C.white}>
              TRAINING TO
            </Slam>
            <Slam at={L(at(CUE.look))} out={START - 5} size={232} from="squash" skew={7} color={C.red}>
              LOOK GOOD
            </Slam>
          </AbsoluteFill>
          <XStamp at={L(at(CUE.good))} out={START - 5} cx={540} cy={1180} size={520} />
          <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 210}}>
            <Slam
              at={L(at(CUE.training2)) + 3}
              out={START - 5}
              size={54}
              from="up"
              font={F.kicker}
              color={C.smoke}
              tracking={0.12}
            >
              PERFECT FORM. NOBODY GUARDING YOU.
            </Slam>
          </AbsoluteFill>
          <AbsoluteFill style={{alignItems: 'flex-start', paddingTop: 140, paddingLeft: 58}}>
            <Chip at={0} label="STOP" color={C.red} fg={C.white} size={58} />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Texture grain={0.09} vignette={0.66} />

      {/* --- the turn --- */}
      <Sequence from={START} layout="none">
        <Flash at={0} len={4} color={C.white} max={0.5} />
        <AbsoluteFill style={{alignItems: 'flex-start', paddingTop: 140, paddingLeft: 58}}>
          <Chip at={0} label="START" color={C.lime} fg={C.black} size={58} />
        </AbsoluteFill>
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 320}}>
          <Slam at={2} out={IMPOSSIBLE - START - 3} size={116} from="up" skew={7} color={C.white}>
            TRAIN TO BECOME
          </Slam>
        </AbsoluteFill>
      </Sequence>

      {/* --- the peak --- */}
      <Sequence from={IMPOSSIBLE} layout="none">
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{transform: 'rotate(-2deg)'}}>
            <Slam at={0} size={236} from="squash" skew={8} color={C.lime}>
              IMPOSSIBLE
            </Slam>
            <Slam at={GUARD - IMPOSSIBLE} size={236} from="squash" skew={8} color={C.white}>
              TO GUARD
            </Slam>
          </div>
        </AbsoluteFill>
        <Flash at={0} len={3} color={C.lime} max={0.3} />
      </Sequence>

      <CheckMark at={GUARD + 4} cx={540} cy={1480} size={260} />

      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(abs, TRANS_END - 4, TRANS_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
