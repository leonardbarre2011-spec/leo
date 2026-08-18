import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Hook } from "./scenes/Hook";
import { Mistake } from "./scenes/Mistake";
import { Fix } from "./scenes/Fix";
import { Drill } from "./scenes/Drill";
import { Proof } from "./scenes/Proof";
import { Cta } from "./scenes/Cta";
import { Grain } from "./components/Effects";
import { C } from "./theme";
import { F, s, VO } from "./timing";

/* ================================================================== *
 *  SOUND
 *  Priority is absolute: VOICE > MUSIC > SFX. The bed is ducked under
 *  every spoken phrase and effects only mark real visual events.
 * ================================================================== */

/** Spoken phrase windows, used to duck the bed. */
const SPEECH: [number, number][] = [
  [0, VO.p1End],
  [VO.ifyou, VO.p2End],
  [VO.drop, VO.p3End],
  [VO.load, VO.p4End],
  [VO.then1, VO.p5End],
  [VO.do1, VO.p6End],
  [VO.jab, VO.p7End],
  [VO.explode, VO.p8End],
  [VO.the1, VO.p9End],
  [VO.its, VO.p10End],
  [VO.follow, VO.p11End],
];

const MUSIC_BASE = 0.135;
const DUCK = 0.6;

const musicVolume = (frame: number) => {
  const t = frame / 60;
  const ramp = 0.16; // seconds of duck fade
  let d = 1;
  for (const [a, b] of SPEECH) {
    if (t > a - ramp && t < b + ramp) {
      const inA = Math.min(1, Math.max(0, (t - (a - ramp)) / ramp));
      const outA = Math.min(1, Math.max(0, (b + ramp - t) / ramp));
      d = Math.min(d, 1 - (1 - DUCK) * Math.min(inA, outA));
    }
  }
  /* let the bed breathe in the two big gaps */
  return MUSIC_BASE * d;
};

type Cue = { at: number; src: string; vol: number };

const CUES: Cue[] = [
  // HOOK
  { at: s(VO.before), src: "sfx_freeze", vol: 0.3 },
  { at: s(VO.before), src: "sfx_impact", vol: 0.26 },
  { at: s(VO.dribble), src: "sfx_tick", vol: 0.24 },
  { at: F.hookDiag + 2, src: "sfx_whoosh_dn", vol: 0.14 },
  { at: F.badWide - 12, src: "sfx_whoosh", vol: 0.2 },
  // MISTAKE
  { at: F.badFeet, src: "sfx_tick", vol: 0.2 },
  { at: F.deadHit, src: "sfx_impact_deep", vol: 0.3 },
  { at: F.deadHit, src: "sfx_freeze", vol: 0.2 },
  { at: F.flip, src: "sfx_whoosh", vol: 0.22 },
  // FIX
  { at: F.step2, src: "sfx_tick", vol: 0.2 },
  { at: s(VO.foot1), src: "sfx_step", vol: 0.26 },
  { at: F.ramp + 20, src: "sfx_whoosh", vol: 0.18 },
  { at: s(VO.attack) + 2, src: "sfx_bounce", vol: 0.2 },
  // REPLAY
  { at: F.replay, src: "sfx_whoosh_dn", vol: 0.16 },
  { at: F.replayA, src: "sfx_tick", vol: 0.22 },
  { at: F.replayB, src: "sfx_tick", vol: 0.22 },
  { at: F.replayC, src: "sfx_tick", vol: 0.22 },
  { at: F.doThis - 8, src: "sfx_whoosh", vol: 0.18 },
  // DRILL
  { at: s(VO.jab), src: "sfx_step", vol: 0.24 },
  { at: F.explodeHit, src: "sfx_impact", vol: 0.3 },
  { at: F.explodeHit, src: "sfx_whoosh", vol: 0.22 },
  { at: F.finish + 48, src: "sfx_whoosh_dn", vol: 0.14 },
  { at: F.finish + 58, src: "sfx_swish", vol: 0.3 },
  { at: F.drillOut, src: "sfx_tick", vol: 0.2 },
  { at: F.notMoves - 10, src: "sfx_whoosh_dn", vol: 0.16 },
  // PROOF
  { at: F.splitAB, src: "sfx_tick", vol: 0.2 },
  { at: F.firstMove, src: "sfx_impact", vol: 0.24 },
  { at: F.release, src: "sfx_freeze", vol: 0.26 },
  { at: F.stopHit, src: "sfx_impact_deep", vol: 0.34 },
  { at: F.stopHit, src: "sfx_freeze", vol: 0.2 },
  { at: F.bucket + 8, src: "sfx_swish", vol: 0.32 },
  { at: F.whip + 2, src: "sfx_whoosh", vol: 0.2 },
  // CTA
  { at: s(VO.follow) - 2, src: "sfx_tick", vol: 0.18 },
  { at: s(VO.guarding), src: "sfx_impact", vol: 0.18 },
];

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Hook />
      <Mistake />
      <Fix />
      <Drill />
      <Proof />
      <Cta />

      {/* finishing pass over everything — footage stays the hero */}
      <Grain opacity={0.045} />

      {/* ---- audio ------------------------------------------------ */}
      <Audio src={staticFile("audio/vo.mp3")} volume={1} />
      <Audio src={staticFile("audio/music.wav")} volume={musicVolume} />
      {CUES.map((c, i) => (
        <Sequence key={i} from={c.at} name={`sfx:${c.src}`}>
          {/* eslint-disable-next-line @remotion/volume-callback */}
          <Audio src={staticFile(`audio/${c.src}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
