import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Clip, Freeze } from "../components/Media";
import {
  CaptionScrim,
  ImpactFlash,
  Shake,
  TypePool,
  Vignette,
} from "../components/Effects";
import { DefenderMark, Strike } from "../components/Graphics";
import { Caption, Slam, Tag } from "../components/Type";
import { C, legible, uiStyle } from "../theme";
import { F, HEIGHT, s, VO, WIDTH } from "../timing";

/* A flat red guide line pinned to the hip height of the bad stance. */
const GuideLine: React.FC<{ at: number; y: number; label: string }> = ({
  at,
  y,
  label,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < at) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: y,
          width: (WIDTH - 120) * p,
          height: 5,
          background: C.red,
          boxShadow: "0 0 24px rgba(255,46,46,0.55)",
        }}
      />
      <div style={{ position: "absolute", left: 60, top: y + 16, opacity: p }}>
        <span style={{ ...uiStyle(26, 900), color: C.red, ...legible(0.8) }}>
          {label}
        </span>
      </div>
    </>
  );
};

/* ================================================================== *
 *  3.40 – 6.47s   IDENTIFY THE MISTAKE
 *  Wide bad stance -> punch to the feet -> "DEAD" -> wrong/right flip.
 * ================================================================== */
export const Mistake: React.FC = () => {
  const wide = F.badFeet - F.badWide;
  const feet = F.deadHit - F.badFeet;
  const dead = F.flip - F.deadHit;
  const flip = F.step1 - F.flip;

  return (
    <AbsoluteFill>
      {/* ── "If you stand like this" ─────────────────────────── */}
      <Sequence from={F.badWide} durationInFrames={wide}>
        <Clip
          src="c1"
          trimBefore={68}
          playbackRate={1}
          grade="cold"
          zoom={[1.08, 1.16]}
          fx={[0.49, 0.47]}
          fy={[0.582, 0.575]}
        />
        <AbsoluteFill
          style={{ background: C.red, opacity: 0.08, mixBlendMode: "color" }}
        />
        <Vignette strength={0.66} />
        <GuideLine at={12} y={1062} label="HIPS TOO HIGH" />
        <Tag text="BAD" at={6} x={62} y={250} color={C.red} size={36} />
        <CaptionScrim opacity={0.9} />
        <Caption
          y={1268}
          size={78}
          words={[
            { t: "IF", at: s(VO.ifyou) - F.badWide },
            { t: "YOU", at: s(VO.ifyou) - F.badWide + 4 },
            { t: "STAND", at: s(VO.stand) - F.badWide },
            { t: "LIKE", at: s(VO.like) - F.badWide },
            { t: "THIS", at: s(VO.this) - F.badWide, hi: "red", em: 1.16 },
          ]}
        />
      </Sequence>

      {/* ── punch to the feet: "your first step" ─────────────── */}
      <Sequence from={F.badFeet} durationInFrames={feet}>
        <Clip
          src="c1"
          trimBefore={6}
          playbackRate={0.66}
          grade="bad"
          zoom={[2.16, 2.3]}
          fx={[0.52, 0.515]}
          fy={[0.808, 0.805]}
        />
        <Vignette strength={0.72} />
        <ImpactFlash at={0} len={5} strength={0.5} />
        <DefenderMark at={6} x={330} y={1512} r={112} label="NO LOAD" />
        <DefenderMark at={12} x={846} y={1546} r={112} label="" />
        <Caption
          y={236}
          size={76}
          words={[
            { t: "YOUR", at: s(VO.your2) - F.badFeet },
            { t: "FIRST", at: s(VO.first1) - F.badFeet, em: 1.14 },
            { t: "STEP", at: s(VO.step) - F.badFeet, em: 1.14 },
          ]}
        />
        <TypePool y={352} h={420} strength={0.5} />
        <Caption
          y={470}
          size={54}
          words={[
            { t: "IS", at: s(VO.isAlready) - F.badFeet, hi: "dim" },
            { t: "ALREADY", at: s(VO.already) - F.badFeet, hi: "dim" },
          ]}
        />
      </Sequence>

      {/* ── "DEAD" ──────────────────────────────────────────── */}
      <Sequence from={F.deadHit} durationInFrames={dead}>
        <Shake at={0} amount={30} len={16} seed="dead">
          <Freeze
            name="fz_dead"
            grade="mono"
            zoom={[2.3, 2.36]}
            fx={0.515}
            fy={0.805}
          />
        </Shake>
        <AbsoluteFill
          style={{ background: C.red, opacity: 0.2, mixBlendMode: "color" }}
        />
        <Vignette strength={0.78} />
        <ImpactFlash at={0} len={8} strength={0.95} color={C.red} />
        <Slam text="DEAD" at={0} y={620} size={286} color={C.red} />
        <Strike at={5} x={122} y={742} w={836} angle={-4} thickness={20} />
        <div
          style={{
            position: "absolute",
            top: 980,
            width: WIDTH,
            textAlign: "center",
          }}
        >
          <span style={{ ...uiStyle(38, 800), color: C.white, ...legible() }}>
            BEFORE YOU MOVED
          </span>
        </div>
      </Sequence>

      {/* ── wrong -> right ──────────────────────────────────── */}
      <Sequence from={F.flip} durationInFrames={flip}>
        <FlipReveal len={flip} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* Split reveal: the broken stance is wiped away by the loaded one. */
const FlipReveal: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [0, 16, len - 6], [WIDTH / 2, WIDTH / 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      {/* right: the fix, already alive */}
      <Clip
        src="c4"
        trimBefore={12}
        playbackRate={0.5}
        grade="volt"
        zoom={[1.44, 1.5]}
        fx={0.6}
        fy={[0.555, 0.56]}
      />
      {/* left: the frozen mistake */}
      <AbsoluteFill style={{ clipPath: `inset(0 ${WIDTH - split}px 0 0)` }}>
        <Freeze name="fz_badfull" grade="mono" zoom={1.45} fx={0.63} fy={0.6} />
        <AbsoluteFill
          style={{ background: C.red, opacity: 0.22, mixBlendMode: "color" }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: split - 5,
          top: 0,
          width: 10,
          height: HEIGHT,
          background: C.volt,
          opacity: split > 6 ? 1 : 0,
          boxShadow: "0 0 46px rgba(0,0,0,0.7)",
        }}
      />
      <Vignette strength={0.6} />
      {split > 60 && (
        <>
          <Tag text="✕" at={2} x={132} y={1420} color={C.red} size={48} />
          <Tag text="✓" at={5} x={742} y={1420} color={C.volt} fg={C.ink} size={48} />
        </>
      )}
      <ImpactFlash at={0} len={5} strength={0.55} />
    </AbsoluteFill>
  );
};
