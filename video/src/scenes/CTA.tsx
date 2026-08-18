import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Sequence} from 'remotion';
import {C, F} from '../theme';
import {Broll, GRADE_HOT, GRADE_RED} from '../components/Broll';
import {Slam, Chip} from '../components/KineticText';
import {Shake} from '../components/Camera';
import {Texture, Flash} from '../components/Overlays';
import {at, CUE, VO_END} from '../data/vo';
import {clamp01} from '../components/anim';

export const CTA_START = at(CUE.follow);
/** A short tail past the last word so the loop point is a deliberate cut,
 *  not the audio simply running out. */
export const CTA_END = VO_END + 26;

const L = (f: number) => f - CTA_START;

/** The three words from the fix, restated small. The follow decision is made
 *  right here, so the last thing on screen before the ask is proof that the
 *  video actually taught something. */
const Recap: React.FC<{at: number}> = ({at: a}) => {
  const frame = useCurrentFrame();
  const items = ['PRESSURE', 'MOVEMENT', 'DECISIONS'];
  return (
    <div style={{display: 'flex', gap: 14, justifyContent: 'center'}}>
      {items.map((it, i) => {
        const k = clamp01((frame - a - i * 3) / 5);
        return (
          <div
            key={it}
            style={{
              fontFamily: F.kicker,
              fontStyle: 'italic',
              fontWeight: 800,
              fontSize: 44,
              letterSpacing: '0.1em',
              color: C.lime,
              border: `3px solid ${C.lime}`,
              padding: '8px 20px 5px',
              opacity: k,
              transform: `translateY(${(1 - k) * 22}px) skewX(-8deg)`,
            }}
          >
            {it}
          </div>
        );
      })}
    </div>
  );
};

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const total = CTA_END - CTA_START;
  const loopAt = total - 12;

  const actually = L(at(CUE.actually));
  const better = L(at(CUE.better2));

  /**
   * Same frame as the very first shot of the video, graded warm instead of
   * red and pushing in to land on exactly the scale the opening starts from —
   * so the last frame and the first frame are the same image.
   */
  const push = interpolate(frame, [0, loopAt], [1.14, 1.0], {
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 2.4),
  });

  return (
    <AbsoluteFill style={{background: C.black}}>
      <Sequence durationInFrames={loopAt} layout="none">
        <Shake hits={[0, better]} amount={15} decay={8}>
          <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 40%'}}>
            <Broll clip={2} startAt={1.58} freeze focusY={35} grade={GRADE_HOT} />
          </AbsoluteFill>
        </Shake>
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 4%, rgba(0,0,0,0.12) 34%, rgba(0,0,0,0.92) 82%)',
        }}
      />
      <Texture grain={0.11} vignette={0.74} />

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 200}}>
        <Slam at={4} size={74} from="up" font={F.kicker} color={C.white} tracking={0.1}>
          IF YOU ACTUALLY WANT TO
        </Slam>
        <Slam at={actually} size={74} from="up" font={F.kicker} color={C.white} tracking={0.1}>
          GET BETTER AT BASKETBALL
        </Slam>
        <div style={{height: 26}} />
        <Slam at={better} size={296} from="squash" skew={8} rotate={-2} color={C.lime}>
          FOLLOW
        </Slam>
        <div style={{height: 30}} />
        <Recap at={better + 4} />
      </AbsoluteFill>

      <Flash at={better} len={4} color={C.lime} max={0.26} />

      {/* --- loop: re-grade to the opening's red and re-stamp the claim --- */}
      <Sequence from={loopAt} layout="none">
        <AbsoluteFill style={{transform: 'scale(1)', transformOrigin: '50% 40%'}}>
          <Broll clip={2} startAt={1.58} freeze focusY={35} grade={GRADE_RED} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.06) 22%, rgba(0,0,0,0.62) 56%, rgba(0,0,0,0.88) 100%)',
          }}
        />
        <Texture grain={0.12} vignette={0.75} />
        <AbsoluteFill
          style={{justifyContent: 'flex-end', alignItems: 'center', padding: 48, paddingBottom: 300}}
        >
          <div style={{transform: 'rotate(-2.5deg)'}}>
            <Slam at={0} size={352} from="stamp" color={C.red} skew={6}>
              STOP
            </Slam>
            <Slam at={1} size={222} from="stamp" skew={6}>
              TRAINING
            </Slam>
            <Slam at={2} size={222} from="stamp" skew={6}>
              LIKE THIS
            </Slam>
          </div>
        </AbsoluteFill>
        <Flash at={0} len={3} color={C.white} max={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
