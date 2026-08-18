import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile} from 'remotion';
import {FPS} from '../theme';

export type Grade = {
  contrast?: number;
  saturate?: number;
  brightness?: number;
  /** colour cast laid over the footage in multiply/screen pairs */
  tint?: string;
  tintOpacity?: number;
  blur?: number;
};

const gradeCss = (g: Grade) =>
  `contrast(${g.contrast ?? 1.14}) saturate(${g.saturate ?? 0.9}) brightness(${
    g.brightness ?? 0.94
  })${g.blur ? ` blur(${g.blur}px)` : ''}`;

export type BrollProps = {
  clip: 1 | 2 | 3 | 4;
  /** seconds into the source file */
  startAt: number;
  speed?: number;
  /** object-position Y, 0 = top of frame, 100 = bottom */
  focusY?: number;
  focusX?: number;
  /** static reframe applied on top of objectPosition: zoom, then shift in
   *  canvas pixels. Used to actually find the subject in wide arena footage. */
  zoom?: number;
  panX?: number;
  panY?: number;
  scale?: number;
  grade?: Grade;
  /** render a single frozen frame instead of moving footage */
  freeze?: boolean;
  style?: React.CSSProperties;
};

/**
 * All four source clips are 1080x2334, i.e. taller than the 1080x1920 canvas.
 * That extra 400px is deliberate headroom: re-framing the same clip is a free
 * pattern interrupt, so `focusY` is used as an editing tool, not a fallback.
 */
export const Broll: React.FC<BrollProps> = ({
  clip,
  startAt,
  speed = 1,
  focusY = 50,
  focusX = 50,
  zoom = 1,
  panX = 0,
  panY = 0,
  scale = 1,
  grade = {},
  freeze = false,
  style,
}) => {
  const video = (
    <OffthreadVideo
      src={staticFile(`broll/clip${clip}.mp4`)}
      trimBefore={Math.round(startAt * FPS)}
      playbackRate={speed}
      muted
      pauseWhenBuffering
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: `${focusX}% ${focusY}%`,
        transform: `translate3d(${panX}px, ${panY}px, 0) scale(${zoom * scale})`,
        transformOrigin: '50% 50%',
      }}
    />
  );

  return (
    <AbsoluteFill style={{filter: gradeCss(grade), ...style}}>
      {freeze ? <Freeze frame={0}>{video}</Freeze> : video}
      {grade.tint ? (
        <AbsoluteFill
          style={{
            background: grade.tint,
            mixBlendMode: 'overlay',
            opacity: grade.tintOpacity ?? 0.35,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** The two grades the video alternates between: "wrong" and "right". */
export const GRADE_COLD: Grade = {
  contrast: 1.3,
  saturate: 0.22,
  brightness: 0.78,
  tint: '#2A3550',
  tintOpacity: 0.5,
};

export const GRADE_HOT: Grade = {
  contrast: 1.16,
  saturate: 1.18,
  brightness: 1.02,
  tint: '#FF7A18',
  tintOpacity: 0.13,
};

export const GRADE_RED: Grade = {
  contrast: 1.42,
  saturate: 0.35,
  brightness: 0.8,
  tint: '#FF2318',
  tintOpacity: 0.42,
};
