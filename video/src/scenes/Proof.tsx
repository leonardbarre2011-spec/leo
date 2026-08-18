import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Clip, Freeze } from "../components/Media";
import {
  CaptionScrim,
  ImpactFlash,
  Shake,
  Streaks,
  Vignette,
  WhipVeil,
} from "../components/Effects";
import { Strike } from "../components/Graphics";
import { Caption, Slam, Tag } from "../components/Type";
import { C, legible, uiStyle } from "../theme";
import { F, HEIGHT, s, VO, WIDTH } from "../timing";

/* Faint criss-crossing paths = "more moves", clutter that solves nothing. */
const MoveClutter: React.FC<{ at: number; hold: number }> = ({ at, hold }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const fade = interpolate(t, [0, 10, hold - 6, hold], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (t < 0 || fade <= 0.001) return null;
  const paths = [
    "M 220 1180 C 380 1020, 700 1180, 860 980",
    "M 860 1240 C 640 1120, 420 1300, 214 1120",
    "M 300 980 C 520 1180, 560 900, 820 1120",
    "M 780 900 C 600 1080, 460 860, 260 1040",
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fade * 0.85 }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {paths.map((d, i) => {
          const p = interpolate(t, [i * 6, i * 6 + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth={7}
              strokeDasharray={`${1000 * p} 1000`}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ================================================================== *
 *  15.43 – 20.35s   GAME APPLICATION
 *  Predictable vs decisive, side by side, then the proof at full speed
 *  with "TO STOP" landing on the frame where the ball drops through.
 * ================================================================== */
export const Proof: React.FC = () => {
  const notMoves = F.splitAB - F.notMoves;
  const split = F.after - F.splitAB;
  const after = F.firstMove - F.after;
  const first = F.impossible - F.firstMove;
  const imp = F.release - F.impossible;
  const rel = F.stopHit - F.release;
  const stop = F.bucket - F.stopHit;
  const bucket = F.whip - F.bucket;
  const whip = F.cta - F.whip;

  return (
    <AbsoluteFill>
      {/* ── "The goal isn't more moves." ─────────────────────── */}
      <Sequence from={F.notMoves} durationInFrames={notMoves}>
        {/* wide: a player doing a lot and threatening nothing */}
        <Sequence durationInFrames={62}>
          <Clip
            src="c1"
            trimBefore={0}
            playbackRate={0.55}
            grade="mono"
            zoom={[1.06, 1.2]}
            fx={[0.5, 0.47]}
            fy={[0.58, 0.565]}
          />
        </Sequence>
        {/* cut in tighter as the line lands */}
        <Sequence from={62} durationInFrames={notMoves - 62}>
          <Clip
            src="c1"
            trimBefore={34}
            playbackRate={0.55}
            grade="mono"
            zoom={[1.5, 1.62]}
            fx={[0.44, 0.47]}
            fy={[0.55, 0.545]}
          />
        </Sequence>
        <Vignette strength={0.74} />
        <Tag text="PREDICTABLE" at={10} x={62} y={250} color="rgba(255,255,255,0.16)" size={30} />
        <MoveClutter at={s(VO.the1) - F.notMoves} hold={64} />
        <CaptionScrim opacity={0.92} />
        <Caption
          y={1140}
          size={62}
          words={[
            { t: "THE", at: s(VO.the1) - F.notMoves },
            { t: "GOAL", at: s(VO.goal) - F.notMoves },
            { t: "ISN'T", at: s(VO.isnt) - F.notMoves },
          ]}
        />
        <Caption
          y={1250}
          size={104}
          words={[
            { t: "MORE", at: s(VO.more) - F.notMoves },
            { t: "MOVES", at: s(VO.moves) - F.notMoves },
          ]}
        />
        <Strike at={s(VO.moves) - F.notMoves + 4} x={168} y={1322} w={756} angle={-4} thickness={18} />
      </Sequence>

      {/* ── before | after ─────────────────────────────────── */}
      <Sequence from={F.splitAB} durationInFrames={split}>
        <SplitProof len={split} />
      </Sequence>

      {/* ── the proof, full speed ──────────────────────────── */}
      <Sequence from={F.after} durationInFrames={after}>
        <Clip
          src="c3"
          trimBefore={20}
          playbackRate={1}
          grade="volt"
          zoom={[1.6, 1.7]}
          fx={[0.46, 0.58]}
          fy={[0.45, 0.455]}
        />
        <Vignette strength={0.58} />
        <CaptionScrim opacity={0.72} />
        <Caption
          y={1330}
          size={62}
          words={[
            { t: "IT'S", at: s(VO.its) - F.after, hi: "dim" },
            { t: "MAKING", at: s(VO.making) - F.after, hi: "dim" },
            { t: "YOUR", at: s(VO.your5) - F.after, hi: "dim" },
          ]}
        />
      </Sequence>

      {/* ── FIRST MOVE ─────────────────────────────────────── */}
      <Sequence from={F.firstMove} durationInFrames={first}>
        <Shake at={0} amount={20} len={12} seed="fm">
          <Clip
            src="c3"
            trimBefore={64}
            playbackRate={0.88}
            grade="volt"
            zoom={[1.7, 1.8]}
            fx={[0.58, 0.66]}
            fy={[0.455, 0.46]}
          />
        </Shake>
        <Vignette strength={0.6} />
        <ImpactFlash at={0} len={5} strength={0.5} />
        <Slam text="FIRST" at={0} y={548} size={252} color={C.volt} />
        <Slam text="MOVE" at={s(VO.move) - F.firstMove} y={790} size={252} color={C.white} />
      </Sequence>

      {/* ── IMPOSSIBLE ─────────────────────────────────────── */}
      <Sequence from={F.impossible} durationInFrames={imp}>
        <Clip
          src="c3"
          trimBefore={96}
          playbackRate={0.52}
          grade="volt"
          zoom={[1.8, 1.66]}
          fx={[0.66, 0.62]}
          fy={[0.46, 0.5]}
        />
        <Vignette strength={0.62} />
        <Slam text="IMPOSSIBLE" at={0} y={1042} size={172} color={C.volt} />
      </Sequence>

      {/* ── freeze on the release: the defender is already beaten ─ */}
      <Sequence from={F.release} durationInFrames={rel}>
        <Shake at={0} amount={16} len={10} seed="rel">
          <Freeze name="fz_release" grade="volt" zoom={[1.66, 1.71]} fx={0.62} fy={[0.5, 0.494]} />
        </Shake>
        <Vignette strength={0.64} />
        <ImpactFlash at={0} len={6} strength={0.6} />
        <Streaks at={0} len={14} count={12} dir={1} color={C.volt} seed="rl" opacity={0.35} />
        <Slam text="IMPOSSIBLE" at={-(rel + 2)} y={1042} size={172} color={C.volt} />
      </Sequence>

      {/* ── "TO STOP" lands on the frozen contest ──────────── */}
      <Sequence from={F.stopHit} durationInFrames={stop}>
        <Shake at={0} amount={38} len={20} seed="stop">
          <Freeze name="fz_release" grade="volt" zoom={[1.71, 1.76]} fx={0.62} fy={[0.494, 0.49]} />
        </Shake>
        <Vignette strength={0.66} />
        <ImpactFlash at={0} len={9} strength={0.8} />
        <Slam text="IMPOSSIBLE" at={-(rel + stop + 2)} y={1042} size={172} color={C.volt} />
        <Slam text="TO STOP" at={0} y={1214} size={236} color={C.white} />
      </Sequence>

      {/* ── the held breath: the ball, alone, in the dark ───── */}
      <Sequence from={F.bucket} durationInFrames={bucket}>
        <Clip
          src="c3"
          trimBefore={152}
          playbackRate={0.9}
          grade="dark"
          zoom={[1.54, 1.44]}
          fx={0.5}
          fy={[0.35, 0.33]}
        />
        <Vignette strength={0.7} />
        <FadeOutLockup len={bucket + 6} />
      </Sequence>

      {/* ── whip out on the camera's own motion blur ───────── */}
      <Sequence from={F.whip} durationInFrames={whip}>
        <Clip
          src="c3"
          trimBefore={187}
          playbackRate={0.5}
          grade="dark"
          zoom={[1.62, 1.9]}
          fx={0.5}
          fy={[0.4, 0.5]}
          blur={[1, 8]}
        />
        <Vignette strength={0.7} />
        <WhipVeil at={whip - 12} len={12} dir={-1} />
      </Sequence>
    </AbsoluteFill>
  );
};

const FadeOutLockup: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4, len - 6, len], [1, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, len], [0, -40]);
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ position: "absolute", top: 1042, width: WIDTH, textAlign: "center" }}>
        <span style={{ fontFamily: "'Anton'", fontSize: 172, color: C.volt, ...legible(1.1) }}>
          IMPOSSIBLE
        </span>
      </div>
      <div style={{ position: "absolute", top: 1214, width: WIDTH, textAlign: "center" }}>
        <span style={{ fontFamily: "'Anton'", fontSize: 236, color: C.white, ...legible(1.1) }}>
          TO STOP
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SplitProof: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [0, len - 8, len - 1], [WIDTH / 2, WIDTH / 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <Clip src="c3" trimBefore={26} playbackRate={1} grade="volt" zoom={1.62} fx={0.56} fy={0.48} />
      <AbsoluteFill style={{ clipPath: `inset(0 ${WIDTH - split}px 0 0)` }}>
        <Freeze name="fz_badfull" grade="mono" zoom={1.42} fx={0.62} fy={0.585} />
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
        }}
      />
      <Vignette strength={0.6} />
      {split > 60 && (
        <>
          <div style={{ position: "absolute", left: 60, top: 1560 }}>
            <span style={{ ...uiStyle(28, 900), color: "rgba(255,255,255,0.7)", ...legible() }}>
              BEFORE
            </span>
          </div>
          <Tag text="AFTER" at={0} x={620} y={1548} color={C.volt} fg={C.ink} size={28} />
        </>
      )}
      <ImpactFlash at={0} len={4} strength={0.5} />
    </AbsoluteFill>
  );
};
