import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, DURATION, fontCss, H, W} from './theme';
import {Captions} from './components/Captions';
import {ClipShot, StatChip} from './components/ClipShot';
import {Flash, Grain, Handheld, Vignette} from './components/Fx';
import {
  BadStats,
  DefenseBurn,
  FaultStrobe,
  HardTruth,
  HookClock,
  HookOpen,
  MissChart,
  MissTally,
  Rewind,
  StampBad,
  TruthCard,
} from './scenes/Act1';
import {DrillGrid, FixList, LevelMeter, MonthsGrind, Pivot, RepsGrind, ResearchScan, Skyrocket} from './scenes/Act2';
import {
  BioCard,
  FinalCTA,
  InsideGrid,
  Reactions,
  SendOut,
  TesterWall,
  TheQuestion,
  ThoughtBeat,
  ToEveryone,
  WhyNot,
} from './scenes/Act3';

type Shot = {
  /** first frame of the shot */
  at: number;
  /** length in frames — every shot sits in the 30–45 frame (1–1.5s) band */
  len: number;
  el: React.ReactNode;
  /** hidden where the scene's own typography already carries the line */
  captions?: boolean;
  /** white frame on the cut */
  flash?: boolean;
  /** handheld intensity */
  cam?: number;
  /** cream-background shots need ink captions */
  light?: boolean;
};

/**
 * The edit. Cuts land on word boundaries in the voiceover, and no shot is
 * longer than 1.5s or shorter than 1s. The two pieces of real footage are
 * spent on five beats only — the try, the payoff, and the close.
 */
export const SHOTS: Shot[] = [
  {at: 0, len: 33, el: <HookOpen />, captions: false, cam: 12},
  {at: 33, len: 41, el: <HookClock />, captions: false, flash: true, cam: 8},
  {at: 74, len: 34, el: <Rewind />, cam: 14},
  {
    at: 108,
    len: 41,
    el: <ClipShot src="clip1.mp4" trimBefore={0} grade="cold" move="in" zoom={1.2} label="LAST SEASON" labelColor={C.mist} tint="#2A4A7A" />,
    cam: 6,
  },
  {at: 149, len: 33, el: <MissChart count={5} per={5} />, cam: 10},
  {at: 182, len: 34, el: <MissTally />, flash: true, cam: 12},
  {at: 216, len: 33, el: <DefenseBurn />, cam: 14},
  {at: 249, len: 30, el: <FaultStrobe />, captions: false, cam: 16},
  {at: 279, len: 35, el: <HardTruth />, cam: 7},
  {at: 314, len: 34, el: <TruthCard />, flash: true, cam: 5, light: true},
  {at: 348, len: 39, el: <BadStats />, cam: 8},
  {at: 387, len: 42, el: <StampBad />, captions: false, cam: 13},

  {at: 429, len: 42, el: <Pivot />, captions: false, flash: true, cam: 9},
  {at: 471, len: 30, el: <ResearchScan />, cam: 6},
  {at: 501, len: 30, el: <DrillGrid />, cam: 8},
  {at: 531, len: 32, el: <FixList />, cam: 8},
  {at: 563, len: 37, el: <RepsGrind />, cam: 10},
  {at: 600, len: 33, el: <MonthsGrind months={7} />, cam: 10},
  {
    at: 633,
    len: 30,
    el: <ClipShot src="clip1.mp4" trimBefore={33} grade="warm" move="in" zoom={1.24} label="SO I TRIED IT" streaks />,
    flash: true,
    cam: 9,
  },
  {at: 663, len: 30, el: <LevelMeter />, cam: 8},
  {at: 693, len: 30, el: <Skyrocket />, captions: false, flash: true, cam: 14},

  {at: 723, len: 38, el: <TheQuestion stage={1} />, cam: 7},
  {at: 761, len: 37, el: <TheQuestion stage={2} />, cam: 7},
  {at: 798, len: 33, el: <SendOut />, cam: 11},
  {at: 831, len: 36, el: <TesterWall />, cam: 8},
  {at: 867, len: 36, el: <Reactions />, cam: 6},
  {
    at: 903,
    len: 36,
    el: (
      <>
        <ClipShot src="clip2.mp4" trimBefore={27} grade="hot" move="in" zoom={1.22} streaks />
        <StatChip value="+41%" label="FG FROM 3" delay={4} x={80} y={330} />
        <StatChip value="4.5cm" label="VERTICAL" delay={11} x={620} y={520} color={C.gold} />
      </>
    ),
    flash: true,
    cam: 9,
  },
  {at: 939, len: 36, el: <ThoughtBeat />, cam: 6},
  {at: 975, len: 33, el: <WhyNot />, captions: false, flash: true, cam: 12},
  {at: 1008, len: 42, el: <ToEveryone />, captions: false, cam: 9},

  {at: 1050, len: 36, el: <BioCard stage={1} />, cam: 8},
  {at: 1086, len: 38, el: <BioCard stage={2} />, captions: false, cam: 6},
  {at: 1124, len: 31, el: <InsideGrid />, cam: 7},
  {
    at: 1155,
    len: 30,
    el: <ClipShot src="clip2.mp4" trimBefore={50} grade="hot" move="out" zoom={1.3} label="GO LOOK" streaks />,
    cam: 10,
  },
  {at: 1185, len: 30, el: <FinalCTA />, captions: false, flash: true, cam: 12},
];

/** Frames on which a shot begins — used for the flash-cut layer. */
const FLASHES = SHOTS.filter((s) => s.flash).map((s) => s.at);

export const Viral: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.at && frame < s.at + s.len);
  const showCaptions = shot ? shot.captions !== false : false;

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <style>{fontCss}</style>
      <Audio src={staticFile('vo.mp3')} />

      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={s.len} layout="none">
          <Handheld amount={s.cam ?? 8} seed={`s${i}`}>
            {s.el}
          </Handheld>
        </Sequence>
      ))}

      {/* Captions ride above every shot so the read never breaks on a cut. */}
      {showCaptions ? <Captions tone={shot?.light ? 'onLight' : 'onDark'} /> : null}

      {/* One-frame blooms on the hardest cuts. */}
      {FLASHES.map((f) => (
        <Flash key={f} at={f} life={4} max={0.42} />
      ))}

      <Vignette strength={0.4} />
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};
