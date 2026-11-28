import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import { clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { B } from "../../lib/Sets";
import { Arena, ASH, Crowd, GUARD, HCam as Cam, HOST, MILA, pedestal, Square, tribute } from "./Sets";
import { Booth, Campfire, Countryside, PRESIDENT, Village, WhiteRoom } from "./Sets2";
import cues from "../../../public/harvest2/cues.json";

const L = cues.lines;
export const HARVEST2_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? HARVEST2_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const SEPIA = "sepia(0.85) saturate(1.2) contrast(1.1) brightness(0.95)";

/* the 22 "dead" tributes walking out of the forest toward the centre */
const Returning: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <>
    {Array.from({ length: 22 }).map((_, i) => {
      const [px, , pz] = pedestal(i + 1);
      const a = Math.atan2(px, pz);
      const r = lerp(31, 17, ease(k));
      return (
        <Character
          key={i}
          look={tribute(i + 1)}
          face="smile"
          pose={k < 1 ? walk(t + i, 6, 0.45) : breathe(t + i)}
          position={[Math.sin(a) * r, 0, Math.cos(a) * r]}
          rotY={a + Math.PI}
          scale={0.85}
        />
      );
    })}
  </>
);

const OnPedestals: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Character look={MILA} face="worried" pose={breathe(t)} position={[pedestal(0)[0], 0.6, pedestal(0)[2]]} rotY={Math.PI} scale={0.85} />
    <Character look={ASH} face="worried" pose={breathe(t + 1)} position={[pedestal(12)[0], 0.6, pedestal(12)[2]]} rotY={0} scale={0.85} />
  </>
);

export const HARVEST2_SHOTS: Shot[] = [
  /* HOOK – "The capital told everyone only two kids survived the games." */
  {
    start: 0,
    render: ({ t, p, T }) => (
      <>
        <Square t={T} night screenText="2 SURVIVORS" />
        <Crowd t={T} face="worried" />
        <Cam from={[0, 6, 6]} to={[0, 12, -2]} look={[0, 18, -21]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "They lied." */
  {
    start: mid(0, 0.78),
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} />
        <Returning t={t} k={1} />
        <Cam from={[0, 40, 26]} to={[0, 34, 20]} look={[0, 0, 0]} p={p} fov={50} t={t} shake={0.04} />
      </>
    ),
    filter: "contrast(1.3) saturate(0.7)",
  },
  /* "When the screens came back on, Mila and Ash were gone." */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} night screenText="SIGNAL RESTORED" />
        <Crowd t={T} face="worried" />
        <Cam from={[6, 4, 10]} to={[5, 4.6, 8]} look={[0, 16, -21]} p={p} fov={50} t={t} />
      </>
    ),
  },
  {
    start: mid(1, 0.55),
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Cam from={[0, 5, 10]} to={[0, 4.6, 6]} look={[0, 2, -6]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "'Taken for questioning,' the capital said." */
  {
    start: L[2],
    render: ({ t, p }) => (
      <>
        <WhiteRoom />
        <Character look={MILA} face="worried" pose={{ sit: true }} position={[-2, 1.6, -2]} scale={0.85} />
        <Character look={ASH} face="worried" pose={{ sit: true }} position={[2, 1.6, -2]} scale={0.85} />
        <Character look={GUARD} pose={{}} position={[-5, 0, -4.5]} />
        <Character look={GUARD} pose={{}} position={[5, 0, -4.5]} />
        <Cam from={[0, 6.4, 10]} to={[0, 6.0, 8.6]} look={[0, 3, -2]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "So in Mila's town, people did something strange." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <Countryside t={T}>
          <Village t={T} />
        </Countryside>
        <Cam from={[3, 4, 34]} to={[2, 4.4, 30]} look={[0, 3, 0]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "They turned off their lights. Every house. Every street." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Countryside t={T}>
          <Village t={t} offAt={(i) => 0.3 + ((i * 0.37) % 1) * 2.2} />
        </Countryside>
        <Cam from={[0, 9, 36]} to={[0, 8, 30]} look={[0, 2, 0]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Then the next town did the same. And the next." */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <Countryside t={T}>
          <Village t={t} x={-60} offAt={() => -1} />
          <Village t={t} x={0} offAt={(i) => 0.2 + ((i * 0.37) % 1) * 1.2} />
          <Village t={t} x={60} offAt={(i) => 1.2 + ((i * 0.53) % 1) * 1.2} />
        </Countryside>
        <Cam from={[0, 60, 70]} to={[0, 56, 62]} look={[0, 0, 0]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "In three nights, the whole country was dark." */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <Countryside t={T}>
          <Village t={t} x={-60} offAt={() => -1} />
          <Village t={t} x={0} offAt={() => -1} />
          <Village t={t} x={60} offAt={() => -1} />
        </Countryside>
        <Cam from={[0, 90, 90]} to={[0, 140, 120]} look={[0, 0, 0]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "The capital panicked. 'Special broadcast. Tomorrow at noon.'" */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} screenText={"SPECIAL BROADCAST\nTOMORROW · NOON"} />
        <Character look={HOST} face="worried" pose={{ armR: -1.8 }} position={[2.2, 1.4, -13.4]} />
        <Cam from={[10, 8, 6]} to={[8, 7.4, 3]} look={[0, 10, -16]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "'The traitors will face the arena. Alone.'" */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} screenText={"TRAITORS:\nMILA & ASH"} />
        <Character look={HOST} face="grin" pose={{ armR: -2.6, armRz: 0.3 }} position={[2.2, 1.4, -13.4]} />
        <Cam from={[2.6, 6.4, -7.6]} to={[2.5, 6.3, -8.4]} look={[2.2, 5.8, -13.4]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "At noon, Mila and Ash were pushed onto the pedestals." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <OnPedestals t={t} />
        <Character look={GUARD} pose={{ armL: -1.4, armR: -1.4 }} position={[pedestal(0)[0] - 2, 0, pedestal(0)[2] + 2.4]} rotY={Math.PI} />
        <Cam from={[6, 5, 24]} to={[5, 4.6, 21]} look={[0, 3, 10]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "The horn blew. And then… the forest moved." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <OnPedestals t={t} />
        <Cam from={[0, 4, 6]} to={[0, 4.4, 2]} look={[0, 6, 34]} p={p} fov={50} t={t} shake={t > 1.2 ? 0.08 : 0.02} />
      </>
    ),
  },
  /* "Twenty-two kids walked out of the trees." */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <OnPedestals t={t} />
        <Returning t={t} k={seg(t, 0, 2.4)} />
        <Cam from={[0, 26, 36]} to={[0, 20, 28]} look={[0, 0, 0]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "Every tribute the capital had counted as dead, was alive." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <Returning t={t} k={1} />
        <Cam from={[0, 4.4, 2]} look={[Math.sin(lerp(0.5, 1.6, p)) * 17, 4.2, Math.cos(lerp(0.5, 1.6, p)) * 17]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "They had never fought. For five days, they had been hiding. Together." */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} dome={false} />
        <Campfire p={[0, 0, 26]} t={T} />
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return <Character key={i} look={tribute(i + 1)} face="smile" pose={{ sit: true }} position={[Math.sin(a) * 3.4, 1.0, 26 + Math.cos(a) * 3.4]} rotY={a + Math.PI} scale={0.8} />;
        })}
        <Cam from={[6, 6, 36]} to={[4.6, 5.4, 34]} look={[0, 1.6, 26]} p={p} fov={46} t={t} />
      </>
    ),
    filter: SEPIA,
  },
  /* "The announcer dropped his microphone." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} screenText="LIVE" />
        <Character look={HOST} face="scared" pose={{ armR: -1.0 * (1 - seg(t, 0.2, 0.4)) }} position={[2.2, 1.4, -13.4]} />
        <B s={[0.25, 0.25, 0.7]} p={[3.2, lerp(4.4, 1.6, seg(t, 0.25, 0.8) ** 2), -12.6]} r={[t * 4, 0, 0]} c="#222" />
        <Cam from={[3.4, 5.4, -7.4]} to={[3.3, 5.2, -8.2]} look={[2.6, 4.4, -13]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "For the first time in history, nobody died in the games." */
  {
    start: L[15],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <Returning t={t + 10} k={1} />
        <OnPedestals t={t} />
        <Cam from={[0, 60, 10]} to={[0, 44, 8]} look={[0, 0, 0]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "But high above the arena, the president was smiling." */
  {
    start: L[16],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <Booth p={[0, 60, -30]} />
        <Character look={PRESIDENT} face="grin" pose={{}} position={[0, 60.3, -29]} />
        <Cam from={[14, 50, -6]} to={[8, 58, -18]} look={[0, 62, -30]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Because he had planned this too." */
  {
    start: L[17],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} night={t > 1.0} />
        <Booth p={[0, 60, -30]} alarm={1} />
        <Character look={PRESIDENT} face="smug" pose={{ armR: -1.2 }} position={[0, 60.3, -29]} />
        <Cam from={[0.8, 65.2, -24.4]} to={[0.7, 65.1, -24.9]} look={[0, 64.9, -29]} p={p} fov={40} t={t} />
      </>
    ),
  },
];

export const HARVEST2_ALIVE: [number, number][] = [
  [0, 2],
  [L[11] + 1.2, 24],
];
export const HARVEST2_DAYS: [number, string][] = [
  [L[6], "NIGHT 3"],
  [L[9], "NOON"],
];

export const HARVEST2_SFX: Sfx[] = [
  { src: "braam", at: 0.0, vol: 0.5 },
  { src: "boom", at: mid(0, 0.78), vol: 0.5 },
  ...HARVEST2_SHOTS.slice(2).map((s) => ({ src: "whoosh", at: Math.max(0, s.start - 0.12), vol: 0.12 })),
  { src: "switch", at: L[4] + 0.4, vol: 0 },
  { src: "harvest1/horn.wav", at: L[10] + 0.1, vol: 0.5 },
  { src: "rumble", at: L[10] + 1.0, vol: 0.35 },
  { src: "braam", at: L[11] + 1.2, vol: 0.55 },
  { src: "thud", at: L[14] + 0.75, vol: 0.5 },
  { src: "riser", at: L[17] - 2.2, vol: 0.3 },
  { src: "braam", at: L[17] + 1.0, vol: 0.6 },
  { src: "pop", at: HARVEST2_END + 66 / 30, vol: 0.3 },
].filter((x) => x.vol > 0);

export const HARVEST2_BEDS: Bed[] = [
  { src: "sfx/space_amb.wav", from: 0, to: HARVEST2_END + 3, vol: 0.14, fadeIn: 0.05, fadeOut: 2.5 },
  { src: "sfx/heartbeat.wav", from: L[9], to: L[11] + 1.2, vol: 0.45, fadeIn: 0.3, fadeOut: 0.1 },
];

