import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Clip } from "../components/Media";
import { CaptionScrim, Grain, Vignette } from "../components/Effects";
import { Strike } from "../components/Graphics";
import { CalmLine, Label } from "../crossover/CalmType";
import { Chapter, DrillCard, DrillList, Progress, ShotCounter } from "./Cards";
import { C, uiStyle } from "../theme";
import { F, s, TOTAL, VO, WIDTH } from "./timing";

/* ================================================================== *
 *  IMPROVE YOUR JUMPER — 30s, list format.
 *
 *  The previous four were problem → fix. This is a workout, and the
 *  script itself says "save this workout", so the edit is built for
 *  that: every drill is a numbered card, a 1/5 bar runs the whole way
 *  so nobody bails at three, and the last four seconds are one clean
 *  recap frame designed to be screenshotted.
 *
 *  Pace is a step up from the last three — drills land every ~3.3s
 *  instead of every 2.3s of shot — but the rules that made those
 *  readable still hold: whole-line captions, one motion per beat, no
 *  shake, no flashes.
 * ================================================================== */

const LAP = 9;

const Cross: React.FC<{ len?: number; children: React.ReactNode }> = ({
  len = LAP,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** One drill: footage, the number landing, then the card. */
const Drill: React.FC<{
  from: number;
  to: number;
  index: number;
  numAt: number;
  nameAt: number;
  whyAt: number;
  src: "c3" | "c4";
  trimBefore: number;
  playbackRate: number;
  zoom: [number, number];
  fx: [number, number] | number;
  fy: [number, number] | number;
  nameSize?: number;
}> = ({
  from,
  to,
  index,
  numAt,
  nameAt,
  whyAt,
  src,
  trimBefore,
  playbackRate,
  zoom,
  fx,
  fy,
  nameSize,
}) => {
  const d = ["1", "2", "3", "4", "5"][index];
  const names = [
    "FORM SHOTS",
    "ONE-HAND SHOTS",
    "WALL SHOOTING",
    "CATCH-AND-SHOOT",
    "GAME-SPEED PULL-UPS",
  ];
  const whys = [
    "BUILD PERFECT MECHANICS",
    "FIX YOUR RELEASE",
    "SHARPEN WRIST & FOLLOW-THROUGH",
    "TRAIN YOUR SHOT WHEN TIRED",
    "MAKE IT TRANSFER TO GAMES",
  ];
  return (
    <Sequence from={from} durationInFrames={to - from + LAP} name={`${d} ${names[index]}`}>
      <Cross>
        <Clip
          src={src}
          trimBefore={trimBefore}
          playbackRate={playbackRate}
          grade="neutral"
          zoom={zoom}
          fx={fx}
          fy={fy}
        />
      </Cross>
      <Vignette strength={0.52} />
      <CaptionScrim opacity={0.9} />
      <Progress active={index} at={0} />
      <Chapter n={d} at={numAt - from} settleAt={nameAt - from - 6} />
      <DrillCard
        name={names[index]}
        why={whys[index]}
        at={nameAt - from}
        whyAt={whyAt - from}
        size={nameSize}
      />
    </Sequence>
  );
};

export const Jumper: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Hook />
    <Promise />

    <Drill
      from={F.d1} to={F.d2} index={0}
      numAt={s(VO.one)} nameAt={s(VO.form)} whyAt={s(VO.build)}
      src="c4" trimBefore={28} playbackRate={0.42}
      zoom={[1.32, 1.42]} fx={[0.6, 0.62]} fy={[0.54, 0.56]}
    />
    <Drill
      from={F.d2} to={F.d3} index={1}
      numAt={s(VO.two)} nameAt={s(VO.oneHand)} whyAt={s(VO.fix)}
      src="c4" trimBefore={92} playbackRate={0.34}
      zoom={[1.72, 1.86]} fx={[0.6, 0.62]} fy={[0.44, 0.4]}
    />
    <Drill
      from={F.d3} to={F.d4} index={2}
      numAt={s(VO.three)} nameAt={s(VO.wall)} whyAt={s(VO.sharpen)}
      src="c4" trimBefore={133} playbackRate={0.46}
      zoom={[1.58, 1.7]} fx={[0.62, 0.64]} fy={[0.52, 0.48]}
      nameSize={74}
    />
    <Drill
      from={F.d4} to={F.d5} index={3}
      numAt={s(VO.four)} nameAt={s(VO.catchAnd)} whyAt={s(VO.train)}
      src="c3" trimBefore={26} playbackRate={0.62}
      zoom={[1.5, 1.62]} fx={[0.5, 0.6]} fy={[0.47, 0.46]}
      nameSize={70}
    />
    <Drill
      from={F.d5} to={F.why} index={4}
      numAt={s(VO.five2)} nameAt={s(VO.gameSpeed)} whyAt={s(VO.pullUps) + 8}
      src="c3" trimBefore={86} playbackRate={0.28}
      zoom={[1.6, 1.72]} fx={[0.62, 0.68]} fy={[0.46, 0.47]}
      nameSize={66}
    />

    <Why />
    <Recap />

    <Grain opacity={0.038} />
    <Mix />
  </AbsoluteFill>
);

/* ── 0.00 – 3.10  the hook ───────────────────────────────────────── *
 *  A counter climbing on its own is the whole argument: reps without
 *  a plan is just a bigger number.                                   */
const Hook: React.FC = () => (
  <Sequence from={F.hook} durationInFrames={F.promise - F.hook + LAP} name="hook">
    <Clip
      src="c4"
      trimBefore={150}
      playbackRate={0.34}
      grade="dark"
      zoom={[1.3, 1.4]}
      fx={[0.56, 0.58]}
      fy={[0.34, 0.3]}
    />
    <AbsoluteFill style={{ background: "rgba(6,8,12,0.42)" }} />
    <Vignette strength={0.62} />
    <ShotCounter at={2} to={500} />
    <Strike
      at={s(VO.stop) + 2}
      x={128}
      y={962}
      w={824}
      angle={-6}
      thickness={22}
    />
    <CaptionScrim opacity={0.92} />
    <CalmLine
      segs={[{ t: "WANT A BETTER JUMPER?" }]}
      at={0}
      out={s(VO.stop) - 8}
      y={1300}
      size={72}
    />
    <CalmLine
      segs={[{ t: "STOP JUST TAKING" }, { t: "MORE SHOTS", red: true }]}
      at={s(VO.stop)}
      y={1272}
      size={72}
    />
  </Sequence>
);

/* ── 3.10 – 4.93  all five, before any of them ───────────────────── */
const Promise: React.FC = () => (
  <Sequence from={F.promise} durationInFrames={F.d1 - F.promise + LAP} name="the five">
    <Cross>
      <AbsoluteFill style={{ background: "#0A0C11" }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 46% at 50% 44%, rgba(216,255,62,0.09) 0%, rgba(0,0,0,0) 72%)",
        }}
      />
    </Cross>
    <DrillList at={s(VO.dow) - F.promise} title="DO THESE 5 INSTEAD" stagger={6} y={620} />
  </Sequence>
);

/* ── 20.20 – 23.05  the reason any of it matters ─────────────────── */
const Why: React.FC = () => (
  <Sequence from={F.why} durationInFrames={F.recap - F.why + LAP} name="it has to transfer">
    <Cross>
      <Clip
        src="c3"
        trimBefore={162}
        playbackRate={0.2}
        grade="neutral"
        zoom={[1.5, 1.62]}
        fx={[0.44, 0.36]}
        fy={[0.42, 0.54]}
      />
    </Cross>
    <Vignette strength={0.55} />
    <CaptionScrim opacity={0.9} />
    <CalmLine
      segs={[{ t: "PRACTICE ONLY MATTERS" }]}
      at={s(VO.practice) - F.why}
      out={s(VO.transfers) - F.why - 6}
      y={1268}
      size={62}
    />
    <CalmLine
      segs={[{ t: "IF IT TRANSFERS TO" }, { t: "GAMES", hi: true }]}
      at={s(VO.transfers) - F.why}
      y={1268}
      size={70}
    />
  </Sequence>
);

/* ── 23.05 – 30.00  the frame people screenshot ──────────────────── */
const Recap: React.FC = () => {
  const r = (sec: number) => s(sec) - F.recap;
  return (
    <Sequence from={F.recap} durationInFrames={TOTAL - F.recap} name="⬛ save this">
      <Cross len={12}>
        <AbsoluteFill style={{ background: "#0A0C11" }} />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(74% 48% at 50% 42%, rgba(216,255,62,0.1) 0%, rgba(0,0,0,0) 74%)",
          }}
        />
      </Cross>
      <DrillList
        at={r(VO.save)}
        title="SAVE THIS WORKOUT"
        stagger={5}
        compactWhy
        y={506}
      />
      <Label
        text="DO IT CONSISTENTLY"
        at={r(VO.doIt)}
        y={1362}
        color="rgba(255,255,255,0.72)"
        size={30}
      />
      <FollowPill at={r(VO.andFollow)} y={1436} />
      <Kicker at={r(VO.actually)} />
    </Sequence>
  );
};

const Kicker: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (p <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1596,
        width: WIDTH,
        textAlign: "center",
        opacity: p,
      }}
    >
      <span style={{ ...uiStyle(28, 800), color: C.volt }}>
        DRILLS THAT MAKE YOU A BETTER SCORER
      </span>
    </div>
  );
};

const FollowPill: React.FC<{ at: number; y: number }> = ({ at, y }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        opacity: o,
        transform: `translateY(${(1 - o) * 12}px)`,
      }}
    >
      <div
        style={{
          background: C.volt,
          padding: "16px 36px 13px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 16px 44px rgba(0,0,0,0.5)",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 30 30">
          <path d="M15 4 V26 M4 15 H26" stroke={C.ink} strokeWidth="5.5" strokeLinecap="square" />
        </svg>
        <span style={{ ...uiStyle(34, 900), color: C.ink, lineHeight: 1 }}>
          FOLLOW
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 *  SOUND — one soft mark per drill number, and nothing else fighting
 *  the narration.
 * ------------------------------------------------------------------ */
const SPEECH: [number, number][] = [
  [0, VO.p1End],
  [VO.stop, VO.p2End],
  [VO.dow, VO.p3End],
  [VO.one, VO.p4End],
  [VO.two, VO.p5End],
  [VO.three, VO.p6End],
  [VO.four, VO.p7End],
  [VO.five2, VO.p8End],
  [VO.because, VO.p9End],
  [VO.save, VO.p10End],
  [VO.andFollow, VO.p11End],
];

const MUSIC_BASE = 0.12;
const DUCK = 0.55;

const musicVolume = (frame: number) => {
  const t = frame / 60;
  const ramp = 0.18;
  let d = 1;
  for (const [a, b] of SPEECH) {
    if (t > a - ramp && t < b + ramp) {
      const inA = Math.min(1, Math.max(0, (t - (a - ramp)) / ramp));
      const outA = Math.min(1, Math.max(0, (b + ramp - t) / ramp));
      d = Math.min(d, 1 - (1 - DUCK) * Math.min(inA, outA));
    }
  }
  return MUSIC_BASE * d;
};

const CUES: { at: number; src: string; vol: number }[] = [
  { at: s(VO.stop), src: "sfx_impact", vol: 0.16 },
  { at: F.promise, src: "sfx_whoosh_dn", vol: 0.12 },
  { at: s(VO.one), src: "sfx_tick", vol: 0.2 },
  { at: s(VO.two), src: "sfx_tick", vol: 0.2 },
  { at: s(VO.three), src: "sfx_tick", vol: 0.2 },
  { at: s(VO.four), src: "sfx_tick", vol: 0.2 },
  { at: s(VO.five2), src: "sfx_tick", vol: 0.2 },
  { at: F.why + 40, src: "sfx_swish", vol: 0.2 },
  { at: F.recap, src: "sfx_whoosh_dn", vol: 0.13 },
  { at: s(VO.andFollow), src: "sfx_impact", vol: 0.12 },
];

const Mix: React.FC = () => (
  <>
    <Audio src={staticFile("audio/vo5.mp3")} volume={1} />
    <Audio src={staticFile("audio/music5.wav")} volume={musicVolume} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} name={`sfx:${c.src}`}>
        {/* eslint-disable-next-line @remotion/volume-callback */}
        <Audio src={staticFile(`audio/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
