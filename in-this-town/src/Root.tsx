import React from "react";
import { Composition } from "remotion";
import { CTA_SECONDS, TheKnocking } from "./Video";
import { VOICE_END } from "./Shots";
import { Episode } from "./Episode";
import { Cta } from "./Cta";
import { PART1_BEDS, PART1_SFX, PART1_SHOTS, PART1_VOICE_END } from "./episodes/smiling/Part1";

const SmilingTownPart1: React.FC = () => (
  <Episode
    shots={PART1_SHOTS}
    voiceEnd={PART1_VOICE_END}
    voice="smiling1/voiceover.mp3"
    captions="smiling1/captions.json"
    sfx={PART1_SFX}
    beds={PART1_BEDS}
    cta={<Cta question="Who's watching Milo?" sub="Part 2 is coming." button="+ Follow for Part 2" motif="rec" />}
  />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TheKnocking"
        component={TheKnocking}
        durationInFrames={Math.round((VOICE_END + CTA_SECONDS) * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SmilingTownPart1"
        component={SmilingTownPart1}
        durationInFrames={Math.round((PART1_VOICE_END + CTA_SECONDS) * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
