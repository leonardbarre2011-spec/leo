import React from "react";
import { Composition } from "remotion";
import { CTA_SECONDS, TheKnocking } from "./Video";
import { VOICE_END } from "./Shots";
import { Episode } from "./Episode";
import { Cta } from "./Cta";
import { PART1_BEDS, PART1_SFX, PART1_SHOTS, PART1_VOICE_END } from "./episodes/smiling/Part1";
import { PART2_BEDS, PART2_SFX, PART2_SHOTS, PART2_VOICE_END } from "./episodes/smiling/Part2";
import { PART3_BEDS, PART3_SFX, PART3_SHOTS, PART3_VOICE_END } from "./episodes/smiling/Part3";
import { PART4_BEDS, PART4_SFX, PART4_SHOTS, PART4_VOICE_END } from "./episodes/smiling/Part4";

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

const SmilingTownPart2: React.FC = () => (
  <Episode shots={PART2_SHOTS} voiceEnd={PART2_VOICE_END} voice="smiling2/voiceover.mp3" captions="smiling2/captions.json" sfx={PART2_SFX} beds={PART2_BEDS}
    cta={<Cta question="What is Plan B?" sub="Part 3 is coming." button="+ Follow for Part 3" motif="rec" />} />
);
const SmilingTownPart3: React.FC = () => (
  <Episode shots={PART3_SHOTS} voiceEnd={PART3_VOICE_END} voice="smiling3/voiceover.mp3" captions="smiling3/captions.json" sfx={PART3_SFX} beds={PART3_BEDS}
    cta={<Cta question="What's behind the door?" sub="The final part is coming." button="+ Follow for Part 4" motif="rec" />} />
);
const SmilingTownPart4: React.FC = () => (
  <Episode shots={PART4_SHOTS} voiceEnd={PART4_VOICE_END} voice="smiling4/voiceover.mp3" captions="smiling4/captions.json" sfx={PART4_SFX} beds={PART4_BEDS}
    cta={<Cta question="What channel are YOU on?" sub="Look up. Count the birds." button="+ Follow for more" motif="rec" />} />
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
        id="SmilingTownPart2"
        component={SmilingTownPart2}
        durationInFrames={Math.round((PART2_VOICE_END + CTA_SECONDS) * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SmilingTownPart3"
        component={SmilingTownPart3}
        durationInFrames={Math.round((PART3_VOICE_END + CTA_SECONDS) * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SmilingTownPart4"
        component={SmilingTownPart4}
        durationInFrames={Math.round((PART4_VOICE_END + CTA_SECONDS) * 30)}
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
