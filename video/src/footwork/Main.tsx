import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Clip } from "../components/Media";
import { CaptionScrim, Grain, Vignette } from "../components/Effects";
import { CalmLine, Label } from "../crossover/CalmType";
import { DrillToGame, FloorDrill, HandsVsFeet } from "./Diagrams";
import { C, uiStyle } from "../theme";
import { F, s, TOTAL, VO, WIDTH } from "./timing";

/* ================================================================== *
 *  FOOTWORK FOR SEPARATION — 25s, nine shots.
 *
 *  Same unhurried tempo as CROSSOVER. What changed is where the
 *  pictures come from: the supplied clips are the same four files the
 *  earlier films used, so this edit takes only the parts of them that
 *  have never been on screen — the seconds before the shot goes up,
 *  the walk-off after it drops, the arena still celebrating — plus one
 *  framing of the warm-up clip nobody has used (hands on the ball).
 *  The hooded portrait that closed both earlier films is retired, and
 *  the teaching is carried by a floor-level board built from scratch.
 * ================================================================== */

const LAP = 10;

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

export const Footwork: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Hook />
    <Hands />

    <Sequence from={F.feet} durationInFrames={F.watch - F.feet + LAP} name="⬛ hands vs feet">
      <Cross>
        <HandsVsFeet />
      </Cross>
    </Sequence>

    <Sequence from={F.watch} durationInFrames={F.payoff - F.watch + LAP} name="⬛ the floor">
      <Cross>
        <FloorDrill />
      </Cross>
    </Sequence>

    <Payoff />

    <Sequence from={F.train} durationInFrames={F.useIt - F.train + LAP} name="⬛ drill → game">
      <Cross>
        <DrillToGame />
      </Cross>
    </Sequence>

    <UseIt />
    <Cta />

    <Grain opacity={0.038} />
    <Mix />
  </AbsoluteFill>
);

/* ── 0.00 – 3.27  guarded, and going nowhere ─────────────────────── *
 *  x2 frames 0–62: the seconds before the shot, which no earlier cut
 *  has touched.                                                      */
const Hook: React.FC = () => (
  <Sequence from={F.hook} durationInFrames={F.hands - F.hook + LAP} name="hook">
    <Clip
      src="x2"
      trimBefore={2}
      playbackRate={0.31}
      grade="neutral"
      zoom={[1.66, 1.78]}
      fx={[0.5, 0.52]}
      fy={[0.63, 0.62]}
    />
    <Vignette strength={0.58} />
    <CaptionScrim opacity={0.92} />
    <CalmLine
      segs={[{ t: "IF YOU CAN'T CREATE" }, { t: "SEPARATION", hi: true }]}
      at={0}
      out={s(VO.this1) - 8}
      y={1300}
      size={72}
    />
    <CalmLine
      segs={[{ t: "THIS IS PROBABLY WHY." }]}
      at={s(VO.this1)}
      y={1330}
      size={76}
    />
  </Sequence>
);

/* ── 3.27 – 5.32  hands on the ball ──────────────────────────────── *
 *  The warm-up clip, framed on the hands — the one part of it no cut
 *  has used, and the only thing this line is about.                  */
const Hands: React.FC = () => (
  <Sequence from={F.hands} durationInFrames={F.feet - F.hands + LAP} name="hands on the ball">
    <Cross>
      <Clip
        src="c1"
        trimBefore={18}
        playbackRate={0.42}
        grade="cold"
        zoom={[2.32, 2.5]}
        fx={[0.46, 0.47]}
        fy={[0.556, 0.548]}
      />
    </Cross>
    <Vignette strength={0.62} />
    <CaptionScrim opacity={0.9} />
    <CalmLine
      segs={[{ t: "YOU'RE TRYING TO BEAT" }, { t: "DEFENDERS" }]}
      at={s(VO.youre) - F.hands}
      out={s(VO.with) - F.hands - 6}
      y={1330}
      size={64}
    />
    <CalmLine
      segs={[{ t: "WITH YOUR" }, { t: "HANDS", red: true }]}
      at={s(VO.with) - F.hands}
      y={1330}
      size={80}
    />
  </Sequence>
);

/* ── 12.40 – 14.78  what the move actually bought ────────────────── *
 *  x1 frames 236–330: the walk-off, never cut before.                */
const Payoff: React.FC = () => (
  <Sequence from={F.payoff} durationInFrames={F.train - F.payoff + LAP} name="one move, one advantage">
    <Cross>
      <Clip
        src="x1"
        trimBefore={236}
        playbackRate={0.64}
        grade="neutral"
        zoom={[1.06, 1.13]}
        fx={[0.48, 0.5]}
        fy={[0.5, 0.48]}
      />
    </Cross>
    <Vignette strength={0.52} />
    <CaptionScrim opacity={0.88} />
    <CalmLine
      segs={[{ t: "ONE MOVE," }]}
      at={s(VO.one1) - F.payoff}
      out={s(VO.one2) - F.payoff - 8}
      y={1340}
      size={82}
    />
    <CalmLine
      segs={[{ t: "ONE" }, { t: "ADVANTAGE.", hi: true }]}
      at={s(VO.one2) - F.payoff}
      y={1340}
      size={82}
    />
  </Sequence>
);

/* ── 17.52 – 19.73  against someone who is trying ────────────────── *
 *  Deliberately the plainest shot in the film: full frame, full speed,
 *  no graphics. Nothing here is being explained any more.            */
const UseIt: React.FC = () => (
  <Sequence from={F.useIt} durationInFrames={F.cta - F.useIt + LAP} name="against a defender">
    <Cross>
      <Clip
        src="x1"
        trimBefore={30}
        playbackRate={1}
        grade="neutral"
        zoom={1.0}
        fx={0.5}
        fy={0.5}
      />
    </Cross>
    <Vignette strength={0.48} />
    <CaptionScrim opacity={0.86} />
    <CalmLine
      segs={[{ t: "USE IT AGAINST A" }, { t: "DEFENDER", hi: true }]}
      at={s(VO.use) - F.useIt}
      y={1350}
      size={70}
    />
  </Sequence>
);

/* ── 19.73 – 25.00  the arena, then the walk-off ─────────────────── *
 *  Both halves are unused footage, and the film closes on a player in
 *  uniform rather than the warm-up portrait that ended the last two.  */
const Cta: React.FC = () => {
  const r = (sec: number) => s(sec) - F.cta;
  return (
    <Sequence from={F.cta} durationInFrames={TOTAL - F.cta} name="cta">
      <Cross len={12}>
        <Clip
          src="x2"
          trimBefore={205}
          playbackRate={1}
          grade="dark"
          zoom={[1.08, 1.16]}
          fx={0.5}
          fy={0.5}
        />
      </Cross>
      <Dissolve at={F.ctaClose - F.cta} len={16}>
        <Clip
          src="x1"
          trimBefore={296}
          playbackRate={0.31}
          grade="dark"
          zoom={[1.1, 1.03]}
          fx={[0.52, 0.5]}
          fy={[0.44, 0.46]}
        />
      </Dissolve>
      <Vignette strength={0.72} />
      <CaptionScrim opacity={1} />

      <FollowPill at={r(VO.follow)} y={1046} />
      <Label
        text="EVERY VIDEO HERE IS DESIGNED TO MAKE YOU"
        at={r(VO.every)}
        y={1214}
        color="rgba(255,255,255,0.74)"
        size={30}
      />
      <CalmLine
        segs={[{ t: "HARDER TO GUARD", hi: true }]}
        at={r(VO.harder)}
        y={1290}
        size={96}
      />
      <Underline at={r(VO.guard) + 16} y={1442} />
    </Sequence>
  );
};

const Dissolve: React.FC<{ at: number; len: number; children: React.ReactNode }> = ({
  at,
  len,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.002) return null;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
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
        transform: `translateY(${(1 - o) * 14}px)`,
      }}
    >
      <div
        style={{
          background: C.volt,
          padding: "17px 38px 14px",
          display: "flex",
          alignItems: "center",
          gap: 15,
          boxShadow: "0 16px 44px rgba(0,0,0,0.5)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 30 30">
          <path d="M15 4 V26 M4 15 H26" stroke={C.ink} strokeWidth="5.5" strokeLinecap="square" />
        </svg>
        <span style={{ ...uiStyle(36, 900), color: C.ink, lineHeight: 1 }}>
          FOLLOW NOW
        </span>
      </div>
    </div>
  );
};

const Underline: React.FC<{ at: number; y: number }> = ({ at, y }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - at, [0, 22], [0, 720], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (w <= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: WIDTH / 2 - w / 2,
        width: w,
        height: 6,
        background: C.volt,
      }}
    />
  );
};

/* ------------------------------------------------------------------ *
 *  SOUND — same restraint as CROSSOVER: ten cues, all marking
 *  something the eye is already doing.
 * ------------------------------------------------------------------ */
const SPEECH: [number, number][] = [
  [0, VO.p1End],
  [VO.youre, VO.p2End],
  [VO.watch, VO.p3End],
  [VO.attack, VO.p4End],
  [VO.plant, VO.p5End],
  [VO.freeze, VO.p6End],
  [VO.then1, VO.p7End],
  [VO.one1, VO.p8End],
  [VO.one2, VO.p9End],
  [VO.when, VO.p10End],
  [VO.dont, VO.p11End],
  [VO.use, VO.p12End],
  [VO.follow, VO.p13End],
  [VO.because, VO.p14End],
];

const MUSIC_BASE = 0.115;
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
  { at: F.hands, src: "sfx_whoosh_dn", vol: 0.12 },
  { at: F.feet, src: "sfx_tick", vol: 0.16 },
  { at: F.watch, src: "sfx_whoosh_dn", vol: 0.12 },
  { at: s(VO.plant), src: "sfx_step", vol: 0.26 },
  { at: s(VO.freeze), src: "sfx_freeze", vol: 0.17 },
  { at: s(VO.then1) + 4, src: "sfx_whoosh", vol: 0.17 },
  { at: F.payoff, src: "sfx_swish", vol: 0.18 },
  { at: s(VO.dont) + 6, src: "sfx_tick", vol: 0.18 },
  { at: F.useIt, src: "sfx_whoosh", vol: 0.14 },
  { at: F.cta + 6, src: "sfx_impact", vol: 0.14 },
];

const Mix: React.FC = () => (
  <>
    <Audio src={staticFile("audio/vo3.mp3")} volume={1} />
    <Audio src={staticFile("audio/music3.wav")} volume={musicVolume} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} name={`sfx:${c.src}`}>
        {/* eslint-disable-next-line @remotion/volume-callback */}
        <Audio src={staticFile(`audio/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
