import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HEIGHT, WIDTH } from "../timing";

/* ------------------------------------------------------------------ *
 *  VIRTUAL CAMERA
 *  Source proxies are 1080x2336 (taller than frame) or 1080x1920.
 *  We position them by a focal point so punch-ins always land on the
 *  body part the voiceover is talking about.
 * ------------------------------------------------------------------ */
export type Num2 = number | [number, number];

const pick = (v: Num2, p: number, ease: boolean) =>
  typeof v === "number"
    ? v
    : interpolate(p, [0, 1], v, {
        easing: ease ? Easing.bezier(0.22, 0.61, 0.25, 1) : Easing.linear,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

export type CamProps = {
  /** zoom, 1 = source width fills the frame width */
  zoom?: Num2;
  /** focal point in the source, 0..1 */
  fx?: Num2;
  fy?: Num2;
  /** rotation in degrees */
  rot?: Num2;
  ease?: boolean;
};

export const camStyle = (
  srcH: number,
  p: number,
  { zoom = 1, fx = 0.5, fy = 0.5, rot = 0, ease = true }: CamProps,
): React.CSSProperties => {
  const z = pick(zoom, p, ease);
  const dw = WIDTH * z;
  const dh = srcH * z;
  return {
    position: "absolute",
    width: dw,
    height: dh,
    left: WIDTH / 2 - pick(fx, p, ease) * dw,
    top: HEIGHT / 2 - pick(fy, p, ease) * dh,
    transform: `rotate(${pick(rot, p, ease)}deg)`,
    transformOrigin: "center center",
  };
};

/* ------------------------------------------------------------------ *
 *  GRADES — footage stays the hero, colour stays restrained.
 * ------------------------------------------------------------------ */
export type Grade = "neutral" | "cold" | "bad" | "volt" | "dark" | "mono";

const FILTERS: Record<Grade, string> = {
  neutral: "contrast(1.07) saturate(1.06) brightness(1.0)",
  cold: "contrast(1.14) saturate(0.62) brightness(0.9)",
  bad: "contrast(1.3) saturate(0.08) brightness(0.6)",
  volt: "contrast(1.14) saturate(1.16) brightness(1.03)",
  dark: "contrast(1.22) saturate(0.92) brightness(0.74)",
  mono: "contrast(1.3) saturate(0) brightness(0.86)",
};

const WASH: Partial<Record<Grade, React.CSSProperties>> = {
  cold: { background: "#0C1622", opacity: 0.2, mixBlendMode: "color" },
  bad: { background: "#FF2E2E", opacity: 0.06, mixBlendMode: "color" },
  volt: { background: "#D8FF3E", opacity: 0.07, mixBlendMode: "soft-light" },
  dark: { background: "#070A12", opacity: 0.24, mixBlendMode: "multiply" },
  mono: { background: "#0B1018", opacity: 0.22, mixBlendMode: "color" },
};

export const GradeWash: React.FC<{ grade: Grade; opacity?: number }> = ({
  grade,
  opacity = 1,
}) => {
  const w = WASH[grade];
  if (!w) return null;
  return (
    <AbsoluteFill
      style={{ ...w, opacity: (w.opacity as number) * opacity }}
    />
  );
};

/* ------------------------------------------------------------------ *
 *  CLIP — a B-roll shot with a virtual camera + grade.
 * ------------------------------------------------------------------ */
export const Clip: React.FC<
  CamProps & {
    src: "c1" | "c2" | "c3" | "c4" | "x1" | "x2";
    /** source frame to start from (60fps proxies) */
    trimBefore?: number;
    playbackRate?: number;
    grade?: Grade;
    blur?: Num2;
    /** extra css filter appended */
    filter?: string;
    style?: React.CSSProperties;
  }
> = ({
  src,
  trimBefore = 0,
  playbackRate = 1,
  grade = "neutral",
  blur = 0,
  filter = "",
  style,
  ...cam
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = durationInFrames <= 1 ? 0 : frame / (durationInFrames - 1);
  const srcH = src === "c4" || src === "x1" || src === "x2" ? 1920 : 2336;
  const b = pick(blur, p, cam.ease ?? true);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <OffthreadVideo
        src={staticFile(`video/${src}.mp4`)}
        trimBefore={trimBefore}
        playbackRate={playbackRate}
        muted
        pauseWhenBuffering
        style={{
          ...camStyle(srcH, p, cam),
          objectFit: "cover",
          filter: `${FILTERS[grade]} ${b ? `blur(${b}px)` : ""} ${filter}`,
        }}
      />
      <GradeWash grade={grade} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 *  FREEZE — a real extracted still, so a freeze is truly frozen.
 * ------------------------------------------------------------------ */
export type StillName =
  | "fz_hook"
  | "fz_dead"
  | "fz_badfull"
  | "fz_load"
  | "fz_release"
  | "fz_make"
  | "fz_cta"
  | "xz_freeze"
  | "xz_cta";

const STILL_H: Record<StillName, number> = {
  fz_hook: 2336,
  fz_dead: 2336,
  fz_badfull: 2336,
  fz_load: 1920,
  fz_release: 2336,
  fz_make: 2336,
  fz_cta: 2336,
  xz_freeze: 1920,
  xz_cta: 2336,
};

export const Freeze: React.FC<
  CamProps & {
    name: StillName;
    grade?: Grade;
    blur?: Num2;
    filter?: string;
    style?: React.CSSProperties;
  }
> = ({ name, grade = "neutral", blur = 0, filter = "", style, ...cam }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = durationInFrames <= 1 ? 0 : frame / (durationInFrames - 1);
  const b = pick(blur, p, cam.ease ?? true);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img
        src={staticFile(`still/${name}.jpg`)}
        style={{
          ...camStyle(STILL_H[name], p, cam),
          objectFit: "cover",
          filter: `${FILTERS[grade]} ${b ? `blur(${b}px)` : ""} ${filter}`,
        }}
      />
      <GradeWash grade={grade} />
    </AbsoluteFill>
  );
};
