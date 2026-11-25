import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { SHOTS, VOICE_END } from "./Shots";
import { Captions } from "./Captions";
import { Cta } from "./Cta";

export const CTA_SECONDS = 4;

const ShotCanvas: React.FC<{ index: number; dur: number }> = ({ index, dur }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const shot = SHOTS[index];
  const t = frame / fps;
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 40, position: [0, 5, 10] }} gl={{ antialias: true }}>
      {shot.render({ t, p: Math.min(1, frame / Math.max(1, dur - 1)), T: shot.start + t })}
    </ThreeCanvas>
  );
};

type Sfx = { src: string; at: number; vol?: number };
const SFX: Sfx[] = [
  { src: "siren", at: 0.55, vol: 0.55 },
  { src: "clang", at: 4.62, vol: 0.7 },
  { src: "knock", at: 8.42, vol: 1 },
  { src: "knock", at: 20.43, vol: 1 },
  { src: "knock", at: 20.89, vol: 1 },
  { src: "knock", at: 21.3, vol: 1 },
  { src: "creak", at: 22.05, vol: 0.6 },
  { src: "boom", at: 22.68, vol: 0.9 },
  { src: "thud", at: 24.92, vol: 0.9 },
  { src: "whoosh", at: 28.18, vol: 0.45 },
  { src: "boom", at: 29.42, vol: 0.5 },
  { src: "rumble", at: 32.7, vol: 0.9 },
  { src: "sniff", at: 33.3, vol: 0.55 },
  { src: "whoosh", at: VOICE_END + 0.1, vol: 0.4 },
  { src: "pop", at: VOICE_END + 66 / 30, vol: 0.35 },
];

export const TheKnocking: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const voiceEndF = Math.round(VOICE_END * fps);
  const fadeBlack = interpolate(frame, [voiceEndF - 9, voiceEndF], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((s, i) => {
        const from = Math.round(s.start * fps);
        const end = Math.round((SHOTS[i + 1]?.start ?? VOICE_END) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Shot ${i + 1}`}>
            <ShotCanvas index={i} dur={end - from} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeBlack }} />
      {/* soft vignette, keeps the eye centered */}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }}
      />
      <Captions src="captions.json" endMs={VOICE_END * 1000} />
      <Sequence from={voiceEndF} name="CTA">
        <Cta />
      </Sequence>

      {/* audio */}
      <Audio src={staticFile("voiceover.mp3")} />
      <Audio
        src={staticFile("sfx/drone.wav")}
        volume={(f) => {
          const s = f / fps;
          if (s > 22.3 && s < 22.66) return 0.05; // silence before the reveal
          if (s > VOICE_END) return interpolate(s, [VOICE_END, VOICE_END + 3.5], [0.35, 0], { extrapolateRight: "clamp" });
          return interpolate(s, [0, 18, 22.3, 35], [0.28, 0.3, 0.45, 0.55], { extrapolateRight: "clamp" });
        }}
      />
      {SFX.map((x, i) => (
        <Sequence key={i} from={Math.round(x.at * fps)} name={`sfx ${x.src}`} layout="none">
          <Audio src={staticFile(`sfx/${x.src}.wav`)} volume={x.vol ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
