import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Clip, Freeze } from "../components/Media";
import { CaptionScrim, Grain, ImpactFlash, Vignette } from "../components/Effects";
import { C, displayStyle, legible, uiStyle } from "../theme";
import { F, s, VO, WIDTH } from "../timing";

/* One display line that lands on a spoken word. */
const Line: React.FC<{
  text: string;
  at: number;
  y: number;
  size: number;
  color: string;
}> = ({ text, at, y, size, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 190 },
    durationInFrames: 18,
  });
  const o = interpolate(t, [-1, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: WIDTH,
        textAlign: "center",
        opacity: o,
        transform: `translateY(${(1 - sp) * 34}px) scale(${interpolate(sp, [0, 1], [1.1, 1])})`,
      }}
    >
      <span style={{ ...displayStyle(size), color, ...legible(1.15) }}>
        {text}
      </span>
    </div>
  );
};

const FollowPill: React.FC<{ at: number; y: number }> = ({ at, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sp = spring({
    frame: t,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 210 },
    durationInFrames: 20,
  });
  if (t < -1) return null;
  /* two calm pulses once the identity line has landed */
  const pulse =
    1 +
    0.05 *
      Math.max(
        0,
        Math.sin((frame - (s(VO.guarding) - F.cta + 18)) / 6) *
          interpolate(frame, [s(VO.guarding) - F.cta + 18, s(VO.guarding) - F.cta + 60], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
      );
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        opacity: sp,
        transform: `scale(${interpolate(sp, [0, 1], [0.7, 1]) * pulse})`,
      }}
    >
      <div
        style={{
          background: C.volt,
          padding: "18px 40px 15px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path d="M15 4 V26 M4 15 H26" stroke={C.ink} strokeWidth="5.5" strokeLinecap="square" />
        </svg>
        <span style={{ ...uiStyle(38, 900), color: C.ink, lineHeight: 1 }}>
          FOLLOW
        </span>
      </div>
    </div>
  );
};

/* ================================================================== *
 *  20.35 – 25.00s   FOLLOW CONVERSION
 *  Not "follow for more" — an identity. The promise the whole video
 *  already proved: this is where you learn to be unguardable.
 * ================================================================== */
export const Cta: React.FC = () => {
  const live = F.ctaFreeze - F.cta;
  const hold = F.end - F.ctaFreeze;

  return (
    <AbsoluteFill>
      <Sequence from={F.cta} durationInFrames={live}>
        <Clip
          src="c2"
          trimBefore={0}
          playbackRate={0.465}
          grade="dark"
          zoom={[1.3, 1.17]}
          fx={[0.5, 0.505]}
          fy={[0.47, 0.452]}
        />
        <Vignette strength={0.8} />
        <CaptionScrim opacity={1} />
        <ImpactFlash at={0} len={7} strength={0.35} />
        <CtaType />
      </Sequence>

      <Sequence from={F.ctaFreeze} durationInFrames={hold}>
        <Freeze name="fz_cta" grade="dark" zoom={[1.17, 1.22]} fx={0.505} fy={[0.452, 0.448]} />
        <Vignette strength={0.82} />
        <CaptionScrim opacity={1} />
        <Sequence from={-(F.ctaFreeze - F.cta)}>
          <CtaType />
        </Sequence>
      </Sequence>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

/* A last, quiet recap of the three fixes — the reason to save the video. */
const Recap: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at - 1) return null;
  const items = ["01  HIPS", "02  LOAD", "03  ATTACK"];
  return (
    <div
      style={{
        position: "absolute",
        top: 852,
        left: 0,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {items.map((it, i) => {
        const sp = spring({
          frame: frame - (at + i * 5),
          fps,
          config: { damping: 16, mass: 0.4, stiffness: 200 },
          durationInFrames: 14,
        });
        return (
          <div
            key={it}
            style={{
              opacity: sp * 0.92,
              transform: `translateY(${(1 - sp) * 16}px)`,
              border: `2px solid rgba(216,255,62,0.75)`,
              padding: "8px 14px 6px",
            }}
          >
            <span style={{ ...uiStyle(22, 800), color: C.volt, lineHeight: 1 }}>
              {it}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CtaType: React.FC = () => {
  const frame = useCurrentFrame();
  const rel = (t: number) => s(t) - F.cta;
  const uw = interpolate(frame, [rel(VO.guarding) + 8, rel(VO.guarding) + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Recap at={rel(VO.guarding) + 42} />
      <FollowPill at={rel(VO.follow)} y={968} />
      <div
        style={{
          position: "absolute",
          top: 1136,
          width: WIDTH,
          textAlign: "center",
          opacity: interpolate(frame, [rel(VO.ifyou2) - 2, rel(VO.ifyou2) + 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ ...uiStyle(34, 700), color: "rgba(255,255,255,0.72)", ...legible(0.9) }}>
          IF YOU WANT TO
        </span>
      </div>
      <Line text="BECOME THE PLAYER" at={rel(VO.become)} y={1192} size={92} color={C.white} />
      <Line text="DEFENDERS HATE" at={rel(VO.defenders)} y={1300} size={116} color={C.volt} />
      <Line text="GUARDING" at={rel(VO.guarding)} y={1424} size={116} color={C.volt} />
      <div
        style={{
          position: "absolute",
          top: 1566,
          left: WIDTH / 2 - (760 * uw) / 2,
          width: 760 * uw,
          height: 7,
          background: C.volt,
        }}
      />
    </AbsoluteFill>
  );
};
