import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import type { Shot } from "./Shots";
import { Captions } from "./Captions";

export const CTA_SECONDS = 4;
export type Sfx = { src: string; at: number; vol?: number };
export type Bed = { src: string; from: number; to: number; vol: number; fadeIn?: number; fadeOut?: number };

const ShotCanvas: React.FC<{ shot: Shot; dur: number }> = ({ shot, dur }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const ctx = { t, p: Math.min(1, frame / Math.max(1, dur - 1)), T: shot.start + t };
  return (
    <AbsoluteFill style={{ filter: shot.filter }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 40, position: [0, 5, 10] }} gl={{ antialias: true }}>
        {shot.render(ctx)}
      </ThreeCanvas>
      {shot.overlay ? shot.overlay(ctx) : null}
    </AbsoluteFill>
  );
};

// Generic episode: 3D shots + voiceover + word-by-word captions + sfx/beds + end card.
export const Episode: React.FC<{
  shots: Shot[];
  voiceEnd: number;
  voice: string;
  captions: string;
  sfx: Sfx[];
  beds: Bed[];
  cta: React.ReactNode;
}> = ({ shots, voiceEnd, voice, captions, sfx, beds, cta }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const voiceEndF = Math.round(voiceEnd * fps);
  const fadeBlack = interpolate(frame, [voiceEndF - 9, voiceEndF], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {shots.map((s, i) => {
        const from = Math.round(s.start * fps);
        const end = Math.round((shots[i + 1]?.start ?? voiceEnd) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Shot ${i + 1}`}>
            <ShotCanvas shot={s} dur={end - from} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeBlack }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      <Captions src={captions} endMs={voiceEnd * 1000} />
      <Sequence from={voiceEndF} name="CTA">
        {cta}
      </Sequence>
      <Audio src={staticFile(voice)} />
      {beds.map((b, i) => (
        <Sequence key={`bed${i}`} from={Math.round(b.from * fps)} durationInFrames={Math.round((b.to - b.from) * fps)} name={`bed ${b.src}`} layout="none">
          <Audio
            src={staticFile(b.src)}
            volume={(f) => {
              const s = f / fps;
              const len = b.to - b.from;
              const fi = b.fadeIn ?? 0.8;
              const fo = b.fadeOut ?? 0.8;
              return b.vol * Math.min(1, s / fi, (len - s) / fo);
            }}
          />
        </Sequence>
      ))}
      {sfx.map((x, i) => (
        <Sequence key={i} from={Math.round(x.at * fps)} name={`sfx ${x.src}`} layout="none">
          <Audio src={staticFile(x.src.includes("/") ? x.src : `sfx/${x.src}.wav`)} volume={x.vol ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
