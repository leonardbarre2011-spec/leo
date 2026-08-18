import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Clip } from "../components/Media";
import {
  CaptionScrim,
  ImpactFlash,
  Shake,
  Streaks,
  Vignette,
  WhipVeil,
} from "../components/Effects";
import {
  DefenderMark,
  DirectionArrow,
  FootHighlight,
  HipLine,
  ReplayPips,
} from "../components/Graphics";
import { Caption, StepBadge, Tag } from "../components/Type";
import { C } from "../theme";
import { F, s, VO } from "../timing";

/* ================================================================== *
 *  6.47 – 11.06s   THE FIX
 *  Three instructions, revealed one at a time, each glued to the frame
 *  where the body actually does it. Slow enough to learn, then a
 *  full-speed run-it-back so the whole move is replayable.
 * ================================================================== */
export const Fix: React.FC = () => {
  const l1 = F.step2 - F.step1;
  const l2 = F.ramp - F.step2;
  const l3 = F.step3 - F.ramp;
  const l4 = F.replay - F.step3;

  return (
    <AbsoluteFill>
      {/* ── 01 DROP YOUR HIPS ────────────────────────────────── */}
      <Sequence from={F.step1} durationInFrames={l1}>
        <Clip
          src="c4"
          trimBefore={28}
          playbackRate={0.6}
          grade="volt"
          zoom={[1.42, 1.46]}
          fx={0.6}
          fy={[0.55, 0.553]}
        />
        <Vignette strength={0.6} />
        <HipLine
          at={4}
          yFrom={968}
          yTo={1092}
          travel={22}
          x0={150}
          x1={930}
          label="HIPS DROP"
        />
        <StepBadge n="01" label="SINK THE HIPS" at={0} y={286} />
        <CaptionScrim opacity={0.8} />
        <Caption
          y={1392}
          size={82}
          words={[
            { t: "DROP", at: s(VO.drop) - F.step1, hi: "volt", em: 1.12 },
            { t: "YOUR", at: s(VO.your3) - F.step1 },
            { t: "HIPS", at: s(VO.hips) - F.step1, hi: "volt", em: 1.12 },
          ]}
        />
      </Sequence>

      {/* ── 02 LOAD YOUR OUTSIDE FOOT ───────────────────────── */}
      <Sequence from={F.step2} durationInFrames={l2}>
        <Clip
          src="c4"
          trimBefore={48}
          playbackRate={0.22}
          grade="volt"
          zoom={[2.3, 2.44]}
          fx={[0.655, 0.66]}
          fy={[0.755, 0.752]}
        />
        <Vignette strength={0.66} />
        <ImpactFlash at={0} len={5} strength={0.42} />
        <FootHighlight
          at={s(VO.outside) - F.step2 - 6}
          x={742}
          y={1452}
          r={140}
          load
          label="OUTSIDE FOOT"
          labelSide="right"
          labelAbove
        />
        <StepBadge n="02" label="STORE THE SPRING" at={2} y={286} />
        <Caption
          y={560}
          size={80}
          words={[
            { t: "LOAD", at: s(VO.load) - F.step2, hi: "volt", em: 1.12 },
            { t: "YOUR", at: s(VO.your4) - F.step2 },
            { t: "OUTSIDE", at: s(VO.outside) - F.step2, hi: "volt", em: 1.12 },
            { t: "FOOT", at: s(VO.foot1) - F.step2, hi: "volt", em: 1.12 },
          ]}
        />
      </Sequence>

      {/* ── the pay-off of loading: speed ramp out of the load ─ */}
      <Sequence from={F.ramp} durationInFrames={l3}>
        <Sequence durationInFrames={12}>
          <Clip
            src="c4"
            trimBefore={77}
            playbackRate={0.35}
            grade="volt"
            zoom={[2.44, 2.1]}
            fx={[0.66, 0.64]}
            fy={[0.752, 0.7]}
          />
        </Sequence>
        <Sequence from={12} durationInFrames={10}>
          <Clip
            src="c4"
            trimBefore={81}
            playbackRate={0.9}
            grade="volt"
            zoom={[2.1, 1.66]}
            fx={[0.64, 0.62]}
            fy={[0.7, 0.6]}
          />
        </Sequence>
        <Sequence from={22} durationInFrames={l3 - 22}>
          <Clip
            src="c4"
            trimBefore={90}
            playbackRate={1.8}
            grade="volt"
            zoom={[1.66, 1.3]}
            fx={[0.62, 0.585]}
            fy={[0.6, 0.5]}
          />
          <Streaks at={0} len={16} count={16} dir={-1} color={C.volt} seed="lift" opacity={0.42} />
        </Sequence>
        <Vignette strength={0.6} />
        <ImpactFlash at={22} len={6} strength={0.45} color={C.volt} />
        <Tag
          text="LOADED  =  FREE SPEED"
          at={6}
          x={540}
          y={1448}
          color={C.volt}
          fg={C.ink}
          size={30}
          origin="center"
        />
      </Sequence>

      {/* ── 03 ATTACK THEIR TOP FOOT ────────────────────────── */}
      <Sequence from={F.step3} durationInFrames={l4}>
        <Clip
          src="c3"
          trimBefore={6}
          playbackRate={0.6}
          grade="volt"
          zoom={[1.38, 1.5]}
          fx={[0.44, 0.6]}
          fy={[0.44, 0.46]}
        />
        <Vignette strength={0.62} />
        <DefenderMark
          at={s(VO.their) - F.step3}
          x={286}
          y={1236}
          r={86}
          label="TOP FOOT"
          hold={l4 - 6}
        />
        <DirectionArrow
          at={s(VO.attack) - F.step3 + 2}
          d="M 250 1470 C 430 1400, 640 1300, 858 1078"
          len={900}
          draw={16}
          color={C.volt}
          width={14}
          head={{ x: 872, y: 1062, rot: -44 }}
          hold={l4 - 6}
        />
        <StepBadge n="03" label="BEAT THE FRONT FOOT" at={0} y={286} />
        <CaptionScrim opacity={0.78} />
        <Caption
          y={1560}
          size={74}
          words={[
            { t: "ATTACK", at: s(VO.attack) - F.step3, hi: "volt", em: 1.14 },
            { t: "THEIR", at: s(VO.their) - F.step3 },
            { t: "TOP", at: s(VO.top) - F.step3 },
            { t: "FOOT", at: s(VO.foot2) - F.step3 },
          ]}
        />
      </Sequence>

      {/* ── ⭐ RUN IT BACK — the replay hook ─────────────────── */}
      <Sequence from={F.replay} durationInFrames={F.doThis - F.replay}>
        <ReplayBeat />
      </Sequence>
    </AbsoluteFill>
  );
};

const ReplayBeat: React.FC = () => {
  const a = F.replayA - F.replay;
  const b = F.replayB - F.replay;
  const c = F.replayC - F.replay;
  const end = F.doThis - F.replay;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Sequence durationInFrames={a}>
        <Clip src="c4" trimBefore={26} playbackRate={0.4} grade="dark" zoom={1.52} fx={0.6} fy={0.56} blur={[8, 0]} />
      </Sequence>
      <Sequence from={a} durationInFrames={b - a}>
        <Clip src="c4" trimBefore={30} playbackRate={1} grade="volt" zoom={[1.5, 1.56]} fx={0.6} fy={0.56} />
        <Tag text="01  HIPS" at={0} x={540} y={352} color={C.volt} fg={C.ink} size={32} origin="center" />
        <ImpactFlash at={0} len={4} strength={0.6} />
      </Sequence>
      <Sequence from={b} durationInFrames={c - b}>
        <Clip src="c4" trimBefore={52} playbackRate={1} grade="volt" zoom={[2.3, 2.4]} fx={0.655} fy={0.755} />
        <Tag text="02  LOAD" at={0} x={540} y={352} color={C.volt} fg={C.ink} size={32} origin="center" />
        <ImpactFlash at={0} len={4} strength={0.6} />
      </Sequence>
      <Sequence from={c} durationInFrames={end - c}>
        <Clip src="c3" trimBefore={24} playbackRate={1} grade="volt" zoom={[1.44, 1.52]} fx={[0.46, 0.6]} fy={[0.47, 0.46]} />
        <Tag text="03  ATTACK" at={0} x={540} y={352} color={C.volt} fg={C.ink} size={32} origin="center" />
        <ImpactFlash at={0} len={4} strength={0.6} />
        <WhipVeil at={end - c - 8} len={8} dir={-1} />
      </Sequence>
      <Vignette strength={0.66} />
      <Shake at={0} amount={10} len={8} seed="rb">
        <AbsoluteFill />
      </Shake>
      <Tag text="RUN IT BACK" at={0} x={540} y={252} color={C.white} fg={C.ink} size={30} origin="center" />
      <ReplayPips at={a} active={0} y={1618} />
      <Sequence from={b}>
        <ReplayPips at={0} active={1} y={1618} />
      </Sequence>
      <Sequence from={c}>
        <ReplayPips at={0} active={2} y={1618} />
      </Sequence>
    </AbsoluteFill>
  );
};
