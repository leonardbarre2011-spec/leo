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
import { Clip, Freeze } from "../components/Media";
import { CaptionScrim, Grain, Vignette } from "../components/Effects";
import { Strike } from "../components/Graphics";
import { CalmLine, Label } from "../crossover/CalmType";
import { AimBoard, ForkBoard } from "./Diagrams";
import { C, displayStyle, legible, uiStyle } from "../theme";
import { F, s, TOTAL, VO, WIDTH } from "./timing";

/* ================================================================== *
 *  BEAT THE DEFENDER — 24s, nine shots.
 *
 *  Same tempo as the last two. The hook is the part that changed: it
 *  opens at real speed instead of in slow motion, puts the number on
 *  screen in the first tenth of a second, and spends exactly one hard
 *  beat — a freeze on the word "mistake", on the frame where the drive
 *  dies in the defender's chest. One accent, then back to calm.
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

export const Defender: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Hook />
    <Chest />
    <NeverDoThat />

    <Sequence from={F.board} durationInFrames={F.explodePast - F.board + LAP} name="⬛ where to aim">
      <Cross>
        <AimBoard />
      </Cross>
    </Sequence>

    <ExplodePast />

    <Sequence from={F.fork} durationInFrames={F.automatic - F.fork + LAP} name="⬛ two choices">
      <Cross>
        <ForkBoard />
      </Cross>
    </Sequence>

    <Automatic />
    <Cta />

    <Grain opacity={0.038} />
    <Mix />
  </AbsoluteFill>
);

/* ── 0.00 – 3.28  the hook ───────────────────────────────────────── *
 *  Real speed until the word lands, then one freeze on the frame the
 *  whole script is about.                                            */
const Hook: React.FC = () => {
  const live = F.freeze - F.hook;
  const held = F.chest - F.freeze;
  return (
    <>
      <Sequence from={F.hook} durationInFrames={live} name="hook · live">
        <Clip
          src="y1"
          trimBefore={22}
          playbackRate={1}
          grade="neutral"
          zoom={[1.48, 1.58]}
          fx={[0.5, 0.52]}
          fy={[0.56, 0.54]}
        />
        <Vignette strength={0.5} />
        <CaptionScrim opacity={0.9} />
        <StatBlock />
      </Sequence>

      {/* ⏸ the one hard beat in the film */}
      <Sequence from={F.freeze} durationInFrames={held + LAP} name="hook · freeze">
        <Freeze
          name="dz_152"
          grade="neutral"
          zoom={[1.58, 1.66]}
          fx={0.52}
          fy={[0.54, 0.535]}
        />
        <Vignette strength={0.58} />
        <CaptionScrim opacity={0.9} />
        <ChestTarget at={2} x={657} y={767} out={s(VO.p2End) - F.freeze} />
        <Sequence from={-(F.freeze - F.hook)}>
          <StatBlock />
        </Sequence>
      </Sequence>
    </>
  );
};

/** 99% first, because a number stops a thumb faster than a sentence. */
const StatBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [2, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const outP = interpolate(frame, [s(VO.when) - 4, s(VO.when) + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const o = inP * outP;
  if (o <= 0.002) return null;
  const swap = interpolate(frame, [s(VO.makew) - 6, s(VO.makew)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div
        style={{
          position: "absolute",
          top: 928,
          width: WIDTH,
          textAlign: "center",
          transform: `translateY(${(1 - inP) * 26}px)`,
        }}
      >
        <span style={{ ...displayStyle(224), color: C.volt, ...legible(1.2) }}>
          99%
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1218,
          width: WIDTH,
          textAlign: "center",
          opacity: swap,
        }}
      >
        <span style={{ ...uiStyle(42, 800), color: C.white, ...legible() }}>
          OF PLAYERS
        </span>
      </div>
      <CalmLine
        segs={[{ t: "MAKE THE SAME" }, { t: "MISTAKE", red: true }]}
        at={s(VO.makew)}
        y={1206}
        size={64}
      />
    </AbsoluteFill>
  );
};

/** The single mark in the hook: where the drive went, and shouldn't. */
const ChestTarget: React.FC<{
  at: number;
  x: number;
  y: number;
  out: number;
}> = ({ at, x, y, out }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leave = interpolate(frame, [out, out + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const o = p * leave;
  if (o <= 0.002) return null;
  return (
    <svg
      width={WIDTH}
      height={1920}
      viewBox={`0 0 ${WIDTH} 1920`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g opacity={o} transform={`translate(${x} ${y}) scale(${interpolate(p, [0, 1], [1.35, 1])})`}>
        <circle r={106} fill={C.red} fillOpacity={0.15} stroke={C.red} strokeWidth={9} />
        <line x1={-48} y1={0} x2={48} y2={0} stroke={C.red} strokeWidth={8} />
        <line x1={0} y1={-48} x2={0} y2={48} stroke={C.red} strokeWidth={8} />
      </g>
    </svg>
  );
};

/* ── 3.28 – 6.07  the mistake, named and slowed ─────────────────── */
const Chest: React.FC = () => (
  <Sequence from={F.chest} durationInFrames={F.never - F.chest + LAP} name="the chest">
    <Cross len={8}>
      <Clip
        src="y1"
        trimBefore={152}
        playbackRate={0.24}
        grade="neutral"
        zoom={[1.66, 1.78]}
        fx={[0.52, 0.55]}
        fy={[0.535, 0.52]}
      />
    </Cross>
    <Vignette strength={0.56} />
    <CaptionScrim opacity={0.9} />
    <CalmLine
      segs={[{ t: "THEY ATTACK THE" }]}
      at={s(VO.they) - F.chest}
      out={s(VO.defenders) - F.chest - 6}
      y={1252}
      size={58}
    />
    <CalmLine
      segs={[{ t: "DEFENDER'S" }, { t: "CHEST", red: true }]}
      at={s(VO.defenders) - F.chest}
      y={1290}
      size={82}
    />
  </Sequence>
);

/* ── 6.07 – 7.68  one red line, and nothing else ────────────────── */
const NeverDoThat: React.FC = () => (
  <Sequence from={F.never} durationInFrames={F.board - F.never + LAP} name="never do that">
    <Cross len={8}>
      <Freeze name="dz_192" grade="mono" zoom={[1.5, 1.56]} fx={0.5} fy={0.5} />
    </Cross>
    <AbsoluteFill style={{ background: C.red, opacity: 0.1, mixBlendMode: "color" }} />
    <Vignette strength={0.68} />
    <CaptionScrim opacity={0.9} />
    <Strike at={s(VO.never) - F.never + 4} x={116} y={1006} w={856} angle={-5} thickness={20} />
    <CalmLine
      segs={[{ t: "NEVER DO THAT." }]}
      at={s(VO.never) - F.never}
      y={1226}
      size={88}
    />
  </Sequence>
);

/* ── 11.17 – 12.88  past it ─────────────────────────────────────── */
const ExplodePast: React.FC = () => (
  <Sequence from={F.explodePast} durationInFrames={F.fork - F.explodePast + LAP} name="past it">
    <Cross>
      <Clip
        src="y1"
        trimBefore={192}
        playbackRate={0.39}
        grade="neutral"
        zoom={[1.34, 1.2]}
        fx={[0.5, 0.46]}
        fy={[0.5, 0.48]}
      />
    </Cross>
    <Vignette strength={0.5} />
    <CaptionScrim opacity={0.86} />
    <CalmLine
      segs={[{ t: "THEN EXPLODE" }, { t: "PAST IT", hi: true }]}
      at={s(VO.then1) - F.explodePast}
      y={1330}
      size={76}
    />
  </Sequence>
);

/* ── 16.22 – 18.28  until you stop thinking about it ────────────── */
const Automatic: React.FC = () => (
  <Sequence from={F.automatic} durationInFrames={F.cta - F.automatic + LAP} name="automatic">
    <Cross>
      <Clip
        src="y1"
        trimBefore={232}
        playbackRate={0.24}
        grade="neutral"
        zoom={[1.14, 1.24]}
        fx={[0.56, 0.6]}
        fy={[0.42, 0.38]}
      />
    </Cross>
    <Vignette strength={0.5} />
    <CaptionScrim opacity={0.86} />
    <CalmLine
      segs={[{ t: "DO THIS UNTIL IT'S" }, { t: "AUTOMATIC", hi: true }]}
      at={s(VO.do2) - F.automatic}
      y={1330}
      size={70}
    />
  </Sequence>
);

/* ── 18.28 – 24.00  the CTA ─────────────────────────────────────── */
const Cta: React.FC = () => {
  const r = (sec: number) => s(sec) - F.cta;
  return (
    <Sequence from={F.cta} durationInFrames={TOTAL - F.cta} name="cta">
      <Cross len={12}>
        <Clip
          src="x1"
          trimBefore={163}
          playbackRate={0.36}
          grade="dark"
          zoom={[1.1, 1.18]}
          fx={[0.5, 0.52]}
          fy={[0.48, 0.46]}
        />
      </Cross>
      {/* hold on the player, not on a second look at the rim */}
      <Dissolve at={F.ctaHold - F.cta} len={16}>
        <Freeze name="dz_walk" grade="dark" zoom={[1.16, 1.09]} fx={[0.52, 0.5]} fy={[0.46, 0.47]} />
      </Dissolve>
      <Vignette strength={0.74} />
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
 *  SOUND — ten cues. The freeze gets one of them; nothing else in the
 *  hook makes a noise.
 * ------------------------------------------------------------------ */
const SPEECH: [number, number][] = [
  [0, VO.p1End],
  [VO.they, VO.p2End],
  [VO.never, VO.p3End],
  [VO.attack2, VO.p4End],
  [VO.one, VO.p5End],
  [VO.drop, VO.p6End],
  [VO.then1, VO.p7End],
  [VO.now, VO.p8End],
  [VO.open, VO.p9End],
  [VO.orw, VO.p10End],
  [VO.do2, VO.p11End],
  [VO.follow, VO.p12End],
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
  { at: F.freeze, src: "sfx_freeze", vol: 0.22 },
  { at: F.never, src: "sfx_impact", vol: 0.18 },
  { at: F.board, src: "sfx_whoosh_dn", vol: 0.12 },
  { at: s(VO.jab), src: "sfx_step", vol: 0.24 },
  { at: s(VO.then1) + 2, src: "sfx_whoosh", vol: 0.16 },
  { at: F.fork, src: "sfx_whoosh_dn", vol: 0.12 },
  { at: s(VO.orw), src: "sfx_tick", vol: 0.16 },
  { at: F.automatic + 26, src: "sfx_swish", vol: 0.2 },
  { at: F.cta, src: "sfx_whoosh", vol: 0.13 },
  { at: s(VO.harder), src: "sfx_impact", vol: 0.13 },
];

const Mix: React.FC = () => (
  <>
    <Audio src={staticFile("audio/vo4.mp3")} volume={1} />
    <Audio src={staticFile("audio/music4.wav")} volume={musicVolume} />
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} name={`sfx:${c.src}`}>
        {/* eslint-disable-next-line @remotion/volume-callback */}
        <Audio src={staticFile(`audio/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
