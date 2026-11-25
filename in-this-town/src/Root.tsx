import React from "react";
import { Composition } from "remotion";
import { CTA_SECONDS, TheKnocking } from "./Video";
import { VOICE_END } from "./Shots";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TheKnocking"
      component={TheKnocking}
      durationInFrames={Math.round((VOICE_END + CTA_SECONDS) * 30)}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
