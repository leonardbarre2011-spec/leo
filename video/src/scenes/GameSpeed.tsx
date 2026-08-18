import React from 'react';
import {AbsoluteFill, useCurrentFrame, Sequence} from 'remotion';
import {C, F} from '../theme';
import {Broll, GRADE_HOT} from '../components/Broll';
import {Slam, Chip} from '../components/KineticText';
import {PunchIn, Shake, SmearCut} from '../components/Camera';
import {Texture, Flash} from '../components/Overlays';
import {at, CUE} from '../data/vo';
import {ease} from '../components/anim';

export const GAME_START = at(CUE.make);
export const GAME_END = at(CUE.stop2);

const L = (f: number) => f - GAME_START;

/**
 * After two diagram-heavy sections the video needs to breathe on real footage
 * again. This is the one shot that runs slow and then snaps back to speed —
 * the release is the payoff for the drill that was just taught.
 */
export const GameSpeed: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = frame + GAME_START;
  const total = GAME_END - GAME_START;
  const gameWord = L(at(CUE.game));

  return (
    <AbsoluteFill style={{background: C.black}}>
      {/* rise into the shot, deliberately under real time */}
      <Sequence durationInFrames={gameWord} layout="none">
        <SmearCut length={5} angle={6}>
          <Shake hits={[0]} amount={15} decay={7}>
            <PunchIn duration={gameWord} from={1.1} to={1.3} originY={36}>
              <Broll clip={2} startAt={0.72} speed={0.55} zoom={1.12} focusY={34} grade={GRADE_HOT} />
            </PunchIn>
          </Shake>
        </SmearCut>
      </Sequence>

      {/* release at full speed the moment the word "game" lands */}
      <Sequence from={gameWord} durationInFrames={total - gameWord} layout="none">
        <Shake hits={[0]} amount={26} decay={6}>
          <PunchIn duration={total - gameWord} from={1.02} to={1.16} originY={40}>
            <Broll clip={2} startAt={0.72 + (gameWord * 0.55) / 30} zoom={1.12} focusY={34} grade={GRADE_HOT} />
          </PunchIn>
        </Shake>
        <Flash at={0} len={3} color={C.white} max={0.5} />
      </Sequence>

      <Texture grain={0.09} vignette={0.66} />

      <AbsoluteFill style={{alignItems: 'flex-start', paddingTop: 145, paddingLeft: 58}}>
        <Chip at={0} label="THE WHOLE POINT" color={C.white} fg={C.black} size={46} />
      </AbsoluteFill>

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 180}}>
        <Slam at={L(at(CUE.make))} out={gameWord - 1} size={118} from="up" skew={7} color={C.white}>
          MAKE EVERY REP
        </Slam>
        <Slam at={L(at(CUE.feel))} out={gameWord - 1} size={118} from="up" skew={7} color={C.white}>
          FEEL LIKE THE
        </Slam>
      </AbsoluteFill>

      <Sequence from={gameWord} layout="none">
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <Slam at={0} size={340} from="squash" skew={8} rotate={-2} color={C.lime}>
            GAME
          </Slam>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(abs, GAME_END - 4, GAME_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
