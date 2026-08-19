import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Clip, Freeze } from "../components/Media";
import { Grain, Vignette, CaptionScrim, TopScrim } from "../components/Effects";
import { CalmLine, HalfSecondBar, Label, StepList } from "./CalmType";
import { ProblemBoard, SolutionBoard } from "./Diagrams";
import { C, uiStyle } from "../theme";
import { F, s, TOTAL, VO, WIDTH } from "./timing";

/* ================================================================== *
 *  CROSSOVER — 23s, ten shots.
 *
 *  Deliberately calmer than a typical short: every shot holds one
 *  idea, captions arrive as whole lines and stay, and the two moments
 *  that carry the teaching are drawn from scratch on a tactics board
 *  rather than cut around. The only speed change in the video is the
 *  one that means something.
 * ================================================================== */

/** A short cross-fade in. Every section overlaps the one before it by
 *  the same few frames, so nothing in this edit ever hard-cuts between
 *  two different worlds. */
const Cross: React.FC<{ len?: number; children: React.ReactNode }> = ({
  len = 10,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** how long each section stays alive underneath the next one */
const LAP = 10;

export const Crossover: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Hook />
    <Sequence
      from={F.problem}
      durationInFrames={F.tryThis - F.problem + LAP}
      name="⬛ board: why it fails"
    >
      <Cross>
        <ProblemBoard />
      </Cross>
    </Sequence>
    <TryThis />
    <Steps />
    <Sequence
      from={F.why}
      durationInFrames={F.payoff - F.why + LAP}
      name="⬛ board: why it works"
    >
      <Cross>
        <SolutionBoard />
      </Cross>
    </Sequence>
    <Payoff />
    <Cta />

    <Grain opacity={0.038} />
    <Mix />
  </AbsoluteFill>
);

/* ── 0.00 – 2.67  the move itself, slowed down ───────────────────── */
const Hook: React.FC = () => (
  <Sequence from={F.hook} durationInFrames={F.problem - F.hook + LAP} name="hook">
    <Clip
      src="x1"
      trimBefore={0}
      playbackRate={0.5}
      grade="neutral"
      zoom={[1.02, 1.09]}
      fx={[0.5, 0.48]}
      fy={[0.52, 0.5]}
    />
    <Vignette strength={0.5} />
    <CaptionScrim opacity={0.9} />
    <CalmLine
      segs={[{ t: "YOUR CROSSOVER" }, { t: "ISN'T SLOW." }]}
      at={0}
      out={s(VO.its) - 8}
      y={1330}
      size={78}
    />
    <CalmLine
      segs={[{ t: "IT'S" }, { t: "PREDICTABLE.", red: true }]}
      at={s(VO.its)}
      y={1330}
      size={82}
    />
  </Sequence>
);

/* ── 7.22 – 8.38  the roadmap, before any of it happens ──────────── */
const TryThis: React.FC = () => {
  const len = F.step1 - F.tryThis;
  const r = (sec: number) => s(sec) - F.tryThis;
  return (
    <Sequence from={F.tryThis} durationInFrames={len + LAP} name="try this">
      <Cross>
      <Clip
        src="x1"
        trimBefore={84}
        playbackRate={0.42}
        grade="dark"
        zoom={[1.12, 1.16]}
        fx={0.5}
        fy={0.5}
        blur={[3, 5]}
      />
      <AbsoluteFill style={{ background: "rgba(6,8,12,0.5)" }} />
      </Cross>
      <Label text="TRY THIS" at={r(VO.tryw)} y={560} color={C.volt} size={34} />
      <StepList at={r(VO.tryw) + 6} y={700} active={-1} />
    </Sequence>
  );
};

/* ── 8.38 – 13.03  three steps, one shot each ────────────────────── */
const Steps: React.FC = () => (
  <>
    {/* 1 — attack hard */}
    <Sequence from={F.step1} durationInFrames={F.step2 - F.step1 + LAP} name="1 attack hard">
      <Cross len={8}>
      <Clip
        src="x1"
        trimBefore={25}
        playbackRate={0.45}
        grade="neutral"
        zoom={[1.1, 1.16]}
        fx={[0.46, 0.44]}
        fy={0.52}
      />
      </Cross>
      <Vignette strength={0.5} />
      <CaptionScrim opacity={0.85} />
      <TopScrim opacity={0.9} />
      <StepList at={-20} y={236} active={0} compact />
      <CalmLine
        segs={[{ t: "ATTACK", hi: true }, { t: "HARD" }]}
        at={s(VO.attack) - F.step1}
        y={1380}
        size={80}
      />
    </Sequence>

    {/* 2 — freeze. a real freeze frame, held for exactly as long as
        the instruction asks for. */}
    <Sequence from={F.step2} durationInFrames={F.step3 - F.step2 + LAP} name="2 freeze">
      <Cross len={8}>
      <Freeze
        name="xz_freeze"
        grade="neutral"
        zoom={[1.16, 1.19]}
        fx={0.44}
        fy={0.52}
      />
      </Cross>
      <Vignette strength={0.56} />
      <CaptionScrim opacity={0.85} />
      <TopScrim opacity={0.9} />
      <StepList at={-20} y={236} active={1} compact />
      <CalmLine
        segs={[{ t: "FREEZE", hi: true }]}
        at={s(VO.freeze) - F.step2}
        y={1180}
        size={92}
      />
      <HalfSecondBar
        at={s(VO.half) - F.step2}
        fillFrames={s(0.5)}
        y={1380}
      />
    </Sequence>

    {/* 3 — snap across, then the one speed change in the video */}
    <Sequence from={F.step3} durationInFrames={F.why - F.step3 + LAP} name="3 snap + explode">
      <Cross len={8}>
      <Sequence durationInFrames={F.step3Fast - F.step3}>
        <Clip
          src="x1"
          trimBefore={53}
          playbackRate={0.35}
          grade="neutral"
          zoom={[1.19, 1.24]}
          fx={[0.44, 0.47]}
          fy={0.52}
        />
      </Sequence>
      <Sequence from={F.step3Fast - F.step3} durationInFrames={F.why - F.step3Fast}>
        <Clip
          src="x1"
          trimBefore={78}
          playbackRate={0.9}
          grade="neutral"
          zoom={[1.24, 1.1]}
          fx={[0.47, 0.5]}
          fy={[0.52, 0.5]}
        />
      </Sequence>
      </Cross>
      <Vignette strength={0.5} />
      <CaptionScrim opacity={0.85} />
      <TopScrim opacity={0.9} />
      <StepList at={-20} y={236} active={2} compact />
      <CalmLine
        segs={[{ t: "SNAP IT" }, { t: "ACROSS", hi: true }, { t: "YOUR BODY" }]}
        at={s(VO.snap) - F.step3}
        out={s(VO.and1) - F.step3 - 6}
        y={1380}
        size={68}
      />
      <CalmLine
        segs={[{ t: "AND", }, { t: "EXPLODE", hi: true }]}
        at={s(VO.explode) - F.step3}
        y={1380}
        size={88}
      />
    </Sequence>
  </>
);

/* ── 16.30 – 18.45  what one honest move buys you ────────────────── */
const Payoff: React.FC = () => (
  <Sequence from={F.payoff} durationInFrames={F.proof - F.payoff + LAP} name="one move, one advantage">
    <Cross>
    <Clip
      src="x1"
      trimBefore={133}
      playbackRate={0.8}
      grade="neutral"
      zoom={[1.08, 1.14]}
      fx={[0.5, 0.52]}
      fy={[0.48, 0.5]}
    />
    </Cross>
    <Vignette strength={0.5} />
    <CaptionScrim opacity={0.88} />
    <CalmLine
      segs={[{ t: "ONE MOVE." }]}
      at={s(VO.one1) - F.payoff}
      out={s(VO.one2) - F.payoff - 8}
      y={1340}
      size={86}
    />
    <CalmLine
      segs={[{ t: "ONE" }, { t: "ADVANTAGE.", hi: true }]}
      at={s(VO.one2) - F.payoff}
      y={1340}
      size={86}
    />
  </Sequence>
);

/* ── 18.45 – 23.00  proof, then the identity ─────────────────────── */
const Cta: React.FC = () => {
  const r = (sec: number) => s(sec) - F.proof;
  return (
    <Sequence from={F.proof} durationInFrames={TOTAL - F.proof} name="cta">
      <Cross len={12}>
      {/* a real crowd, a real game */}
      <Clip
        src="x2"
        trimBefore={62}
        playbackRate={1}
        grade="dark"
        zoom={[1.06, 1.12]}
        fx={0.5}
        fy={0.5}
      />
      {/* dissolve to the portrait for the hold */}
      <Dissolve at={F.portrait - F.proof} len={14}>
        <Clip
          src="c2"
          trimBefore={0}
          playbackRate={0.68}
          grade="dark"
          zoom={[1.24, 1.16]}
          fx={0.5}
          fy={[0.47, 0.455]}
        />
      </Dissolve>
      </Cross>
      <Vignette strength={0.72} />
      <CaptionScrim opacity={1} />

      <FollowPill at={r(VO.follow)} y={1042} />
      <Label
        text="IF YOU WANT"
        at={r(VO.ifw)}
        y={1206}
        color="rgba(255,255,255,0.72)"
        size={32}
      />
      <CalmLine
        segs={[{ t: "SKILLS THAT ACTUALLY" }]}
        at={r(VO.skills)}
        y={1266}
        size={76}
      />
      <CalmLine
        segs={[{ t: "WORK IN GAMES", hi: true }]}
        at={r(VO.work)}
        y={1372}
        size={94}
      />
      <Underline at={r(VO.games) + 14} y={1516} />
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
        <span style={{ ...uiStyle(36, 900), color: C.ink, lineHeight: 1 }}>FOLLOW</span>
      </div>
    </div>
  );
};

const Underline: React.FC<{ at: number; y: number }> = ({ at, y }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - at, [0, 22], [0, 700], {
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
 *  SOUND — VOICE > MUSIC > SFX, with far fewer effects than a normal
 *  short. Nine cues in 23 seconds, each marking something the eye is
 *  already doing.
 * ------------------------------------------------------------------ */
const SPEECH: [number, number][] = [
  [0, VO.p1End],
  [VO.its, VO.p2End],
  [VO.the1, VO.p3End],
  [VO.youre, VO.p4End],
  [VO.tryw, VO.p5End],
  [VO.attack, VO.p6End],
  [VO.freeze, VO.p7End],
  [VO.then1, VO.p8End],
  [VO.make, VO.p9End],
  [VO.then2, VO.p10End],
  [VO.one1, VO.p11End],
  [VO.one2, VO.p12End],
  [VO.follow, VO.p13End],
];

const MUSIC_BASE = 0.125;
const DUCK = 0.58;

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
  { at: s(VO.its) - 2, src: "sfx_tick", vol: 0.16 },
  { at: F.problem, src: "sfx_whoosh_dn", vol: 0.13 },
  { at: s(VO.first1) - 6, src: "sfx_tick", vol: 0.18 },
  { at: F.tryThis, src: "sfx_whoosh_dn", vol: 0.12 },
  { at: F.step2, src: "sfx_freeze", vol: 0.2 },
  { at: F.step3Fast, src: "sfx_whoosh", vol: 0.16 },
  { at: F.why, src: "sfx_whoosh_dn", vol: 0.13 },
  { at: s(VO.take) - 10, src: "sfx_tick", vol: 0.16 },
  { at: F.payoff + 34, src: "sfx_swish", vol: 0.2 },
  { at: F.proof + 76, src: "sfx_impact", vol: 0.14 },
];

const Mix: React.FC = () => (
  <>
    <Audio src={staticFile("audio/vo2.mp3")} volume={1} />
    <Audio src={staticFile("audio/music2.wav")} volume={musicVolume} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} name={`sfx:${c.src}`}>
        {/* eslint-disable-next-line @remotion/volume-callback */}
        <Audio src={staticFile(`audio/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
