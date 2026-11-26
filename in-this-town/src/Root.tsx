import React from "react";
import { Composition } from "remotion";
import { CTA_SECONDS, TheKnocking } from "./Video";
import { VOICE_END } from "./Shots";
import { Episode } from "./Episode";
import { Cta } from "./Cta";
import { PART1_BEDS, PART1_SFX, PART1_SHOTS, PART1_VOICE_END } from "./episodes/smiling/Part1";
import { PART2_BEDS, PART2_SFX, PART2_SHOTS, PART2_VOICE_END } from "./episodes/smiling/Part2";
import { PART3_BEDS, PART3_SFX, PART3_SHOTS, PART3_VOICE_END } from "./episodes/smiling/Part3";
import { DEAD1_BEDS, DEAD1_END, DEAD1_SFX, DEAD1_SHOTS } from "./episodes/dead/Part1";
import { DEAD2_BEDS, DEAD2_END, DEAD2_SFX, DEAD2_SHOTS } from "./episodes/dead/Part2";
import { DEAD3_BEDS, DEAD3_END, DEAD3_SFX, DEAD3_SHOTS } from "./episodes/dead/Part3";
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

const DeadPart1: React.FC = () => (
  <Episode shots={DEAD1_SHOTS} voiceEnd={DEAD1_END} voice="dead1/voiceover.mp3" captions="dead1/captions.json" sfx={DEAD1_SFX} beds={DEAD1_BEDS}
    cta={<Cta question="Who blew out the candle?" sub="Part 2 is coming." button="+ Follow for Part 2" motif="eyes" />} />
);
const DeadPart2: React.FC = () => (
  <Episode shots={DEAD2_SHOTS} voiceEnd={DEAD2_END} voice="dead2/voiceover.mp3" captions="dead2/captions.json" sfx={DEAD2_SFX} beds={DEAD2_BEDS}
    cta={<Cta question="Can Jonah save Ivy?" sub="The final part is coming." button="+ Follow for Part 3" motif="eyes" />} />
);
const DeadPart3: React.FC = () => (
  <Episode shots={DEAD3_SHOTS} voiceEnd={DEAD3_END} voice="dead3/voiceover.mp3" captions="dead3/captions.json" sfx={DEAD3_SFX} beds={DEAD3_BEDS}
    cta={<Cta question="Would YOU go outside?" sub="Tell me in the comments." button="+ Follow for more" motif="eyes" />} />
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
        id="DeadPart1"
        component={DeadPart1}
        durationInFrames={Math.round((DEAD1_END + CTA_SECONDS) * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DeadPart2"
        component={DeadPart2}
        durationInFrames={Math.round((DEAD2_END + CTA_SECONDS) * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DeadPart3"
        component={DeadPart3}
        durationInFrames={Math.round((DEAD3_END + CTA_SECONDS) * 30)}
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
