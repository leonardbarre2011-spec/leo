import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Clip, Freeze } from "../components/Media";
import {
  CaptionScrim,
  ImpactFlash,
  Shake,
  Streaks,
  Vignette,
  WhipVeil,
} from "../components/Effects";
import { Gate } from "../components/Graphics";
import { Caption, ChipRow, Slam } from "../components/Type";
import { C, legible, uiStyle } from "../theme";
import { F, s, VO, WIDTH } from "../timing";

/* ================================================================== *
 *  11.06 – 15.43s   THE DRILL
 *  Three beats, three speeds: set -> burst -> finish. The speed ramp
 *  does the shouting, so the graphics stay quiet.
 * ================================================================== */
export const Drill: React.FC = () => {
  const intro = F.jab - F.doThis;
  const jab = F.explodeIn - F.jab;
  const exp = F.finish - F.explodeIn;
  const fin = F.drillOut - F.finish;
  const outro = F.notMoves - F.drillOut;

  return (
    <AbsoluteFill>
      {/* ── "Do this:" — set the three beats up front ────────── */}
      <Sequence from={F.doThis} durationInFrames={intro}>
        <Clip
          src="c3"
          trimBefore={0}
          playbackRate={0.55}
          grade="dark"
          zoom={[1.78, 1.86]}
          fx={[0.68, 0.62]}
          fy={[0.5, 0.56]}
        />
        <Vignette strength={0.7} />
        <Slam text="DO THIS" at={s(VO.do1) - F.doThis} y={742} size={172} color={C.white} />
        <ChipRow items={["JAB", "EXPLODE", "FINISH"]} at={s(VO.this2) - F.doThis} y={984} active={-1} />
      </Sequence>

      {/* ── JAB ─────────────────────────────────────────────── */}
      <Sequence from={F.jab} durationInFrames={jab}>
        <Shake at={s(VO.jab) - F.jab} amount={14} len={10} seed="jab1">
          <Clip
            src="c3"
            trimBefore={27}
            playbackRate={0.62}
            grade="volt"
            zoom={[1.72, 1.6]}
            fx={[0.66, 0.55]}
            fy={[0.5, 0.49]}
          />
        </Shake>
        <Vignette strength={0.62} />
        <Slam text="JAB" at={s(VO.jab) - F.jab} y={640} size={196} color={C.volt} />
        <Slam text="HARD" at={s(VO.hard) - F.jab} y={840} size={196} color={C.white} />
        <ChipRow items={["JAB", "EXPLODE", "FINISH"]} at={-30} y={1490} active={0} />
      </Sequence>

      {/* ── EXPLODE — the biggest movement in the video ──────── */}
      <Sequence from={F.explodeIn} durationInFrames={exp}>
        {/* tension: almost stopped */}
        <Sequence durationInFrames={F.explodeHit - F.explodeIn}>
          <Clip
            src="c3"
            trimBefore={49}
            playbackRate={0.3}
            grade="dark"
            zoom={[1.62, 1.72]}
            fx={[0.5, 0.52]}
            fy={0.475}
          />
          <Gate at={2} x={470} y={1180} w={300} h={250} color={C.volt} />
        </Sequence>
        {/* burst */}
        <Sequence from={F.explodeHit - F.explodeIn} durationInFrames={30}>
          <Clip
            src="c3"
            trimBefore={56}
            playbackRate={1.35}
            grade="volt"
            zoom={[1.72, 1.44]}
            fx={[0.52, 0.62]}
            fy={[0.475, 0.46]}
          />
          <Streaks at={0} len={22} count={18} dir={1} color={C.white} seed="ex" opacity={0.55} />
          <Gate at={-20} x={470} y={1180} w={300} h={250} color={C.volt} broken={0} />
        </Sequence>
        {/* settle into the rise */}
        <Sequence from={F.explodeHit - F.explodeIn + 30} durationInFrames={exp - (F.explodeHit - F.explodeIn) - 30}>
          <Clip
            src="c3"
            trimBefore={96}
            playbackRate={0.28}
            grade="volt"
            zoom={[1.44, 1.56]}
            fx={[0.62, 0.66]}
            fy={[0.46, 0.475]}
          />
        </Sequence>

        <Vignette strength={0.6} />
        <Shake at={F.explodeHit - F.explodeIn} amount={30} len={16} seed="exp">
          <AbsoluteFill />
        </Shake>
        <ImpactFlash at={F.explodeHit - F.explodeIn} len={7} strength={0.75} />
        <Slam text="EXPLODE" at={F.explodeHit - F.explodeIn} y={556} size={214} color={C.volt} />
        <CaptionScrim opacity={0.7} />
        <Caption
          y={1290}
          size={70}
          words={[
            { t: "PAST", at: s(VO.past) - F.explodeIn },
            { t: "THE", at: s(VO.past) - F.explodeIn + 8, hi: "dim" },
            { t: "CONE", at: s(VO.cone) - F.explodeIn },
          ]}
        />
        <ChipRow items={["JAB", "EXPLODE", "FINISH"]} at={-30} y={1490} active={1} />
      </Sequence>

      {/* ── FINISH ──────────────────────────────────────────── */}
      <Sequence from={F.finish} durationInFrames={fin}>
        {/* the rise and the release, slow enough to read */}
        <Sequence durationInFrames={48}>
          <Clip
            src="c3"
            trimBefore={100}
            playbackRate={0.46}
            grade="volt"
            zoom={[1.56, 1.72]}
            fx={[0.64, 0.7]}
            fy={[0.47, 0.44]}
          />
        </Sequence>
        {/* straight to the result — the drill ends in the net */}
        <Sequence from={48} durationInFrames={fin - 48}>
          <Clip
            src="c3"
            trimBefore={172}
            playbackRate={0.62}
            grade="volt"
            zoom={[1.86, 1.72]}
            fx={0.335}
            fy={[0.515, 0.555]}
          />
          <ImpactFlash at={0} len={5} strength={0.55} />
        </Sequence>
        <Vignette strength={0.6} />
        <Slam text="FINISH" at={s(VO.finish) - F.finish} y={560} size={206} color={C.volt} />
        <div
          style={{
            position: "absolute",
            top: 806,
            width: WIDTH,
            textAlign: "center",
          }}
        >
          <span style={{ ...uiStyle(42, 800), color: C.white, ...legible() }}>
            IMMEDIATELY
          </span>
        </div>
        <ChipRow items={["JAB", "EXPLODE", "FINISH"]} at={-30} y={1490} active={2} />
      </Sequence>

      {/* ── drill closes ────────────────────────────────────── */}
      <Sequence from={F.drillOut} durationInFrames={outro}>
        <Freeze name="fz_make" grade="volt" zoom={[1.72, 1.8]} fx={0.335} fy={[0.555, 0.548]} />
        <Vignette strength={0.62} />
        <ImpactFlash at={0} len={8} strength={0.34} />
        <ChipRow items={["JAB", "EXPLODE", "FINISH"]} at={-30} y={1490} active={3} out={9} />
        <WhipVeil at={outro - 10} len={10} dir={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
