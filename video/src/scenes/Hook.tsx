import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Clip, Freeze } from "../components/Media";
import {
  CaptionScrim,
  ImpactFlash,
  ScanLine,
  Shake,
  TypePool,
  Vignette,
  WhipVeil,
} from "../components/Effects";
import { Bracket, DefenderMark } from "../components/Graphics";
import { Caption, Slam, Tag } from "../components/Type";
import { C, legible, uiStyle } from "../theme";
import { F, s, VO, WIDTH } from "../timing";

/* ================================================================== *
 *  0.00 – 3.40s   SCROLL STOP
 *  Action first. No logo, no intro. The stance is the story and the
 *  freeze lands exactly on the word "BEFORE".
 * ================================================================== */
export const Hook: React.FC = () => {
  const A = F.hookFreeze - F.hookLive; // live
  const B = F.hookDiag - F.hookFreeze; // freeze + punch
  const D = F.badWide - F.hookDiag; // diagnostic pull-back

  return (
    <AbsoluteFill>
      {/* ── live: already mid-action, slow push ─────────────── */}
      <Sequence from={F.hookLive} durationInFrames={A}>
        <Clip
          src="c1"
          trimBefore={12}
          playbackRate={0.42}
          grade="cold"
          zoom={[1.06, 1.13]}
          fx={[0.5, 0.47]}
          fy={[0.58, 0.575]}
        />
        <Vignette strength={0.62} />
        <CaptionScrim opacity={0.85} />
        {/* lock-on: the viewer is looking at a problem before they know it */}
        <Bracket
          at={2}
          x={206}
          y={286}
          w={664}
          h={1338}
          color={C.red}
          arm={58}
          sw={6}
          hold={s(VO.before) - 2}
        />
        <Caption
          y={1118}
          size={78}
          words={[
            { t: "YOU'RE", at: 0 },
            { t: "LOSING", at: s(VO.losing), hi: "red", em: 1.1 },
          ]}
        />
        <Caption
          y={1252}
          size={78}
          words={[
            { t: "YOUR", at: s(VO.your1) },
            { t: "DEFENDER", at: s(VO.defender) },
          ]}
        />
      </Sequence>

      {/* ── freeze the exact moment + punch into the stance ── */}
      <Sequence from={F.hookFreeze} durationInFrames={B}>
        <Shake at={0} amount={26} len={15} seed="hook">
          <Freeze
            name="fz_hook"
            grade="cold"
            zoom={[1.52, 1.6]}
            fx={0.47}
            fy={[0.755, 0.75]}
          />
        </Shake>
        <Vignette strength={0.86} />
        <TypePool y={1050} h={760} strength={0.68} />
        {/* the two things that decide the first step */}
        <Bracket at={4} x={238} y={318} w={716} h={214} color={C.red} arm={50} />
        <DefenderMark at={16} x={378} y={1492} r={98} label="FLAT" />
        <DefenderMark at={22} x={772} y={1520} r={98} label="" />
        <ImpactFlash at={0} len={7} strength={0.9} />
        <Slam text="BEFORE" at={0} y={868} size={214} color={C.volt} />
        <div
          style={{
            position: "absolute",
            top: 1128,
            width: WIDTH,
            textAlign: "center",
          }}
        >
          <span style={{ ...uiStyle(44, 800), color: C.white, ...legible() }}>
            {"YOU EVEN"}
          </span>
        </div>
        <ImpactFlash at={s(VO.dribble) - F.hookFreeze} len={6} strength={0.7} />
        <Slam
          text="DRIBBLE"
          at={s(VO.dribble) - F.hookFreeze}
          y={1208}
          size={214}
          color={C.volt}
        />
      </Sequence>

      {/* ── diagnostic: pull back, name the problem, whip out ── */}
      <Sequence from={F.hookDiag} durationInFrames={D}>
        <Freeze
          name="fz_hook"
          grade="bad"
          zoom={[1.6, 1.1]}
          fx={[0.47, 0.49]}
          fy={[0.75, 0.6]}
          blur={[0, 0]}
        />
        <Vignette strength={0.72} />
        <ScanLine at={3} len={38} />
        <Bracket
          at={30}
          x={214}
          y={430}
          w={640}
          h={1240}
          color={C.red}
          arm={64}
          sw={5}
        />
        <Tag text="STANCE" at={34} x={62} y={452} color={C.red} size={30} />
        <Tag
          text="NO LOAD  ·  NO ANGLE"
          at={44}
          x={62}
          y={1740}
          color={C.red}
          size={30}
        />
        <WhipVeil at={D - 10} len={10} dir={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
