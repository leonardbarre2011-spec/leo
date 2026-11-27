import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import { clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { B } from "../../lib/Sets";
import { TextSign } from "../smiling/Props";
import { Arena, ASH, Crowd, Drone, GUARD, HCam as Cam, HOST, MILA, pedestal, Square, TAM, tribute } from "./Sets";
import cues from "../../../public/harvest1/cues.json";

const L = cues.lines;
export const HARVEST1_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? HARVEST1_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const SEPIA = "sepia(0.85) saturate(1.2) contrast(1.1) brightness(0.95)";
const GLITCH = "contrast(1.4) saturate(0.6) hue-rotate(-15deg)";

/* tributes on pedestals; `run` 0..1 moves them toward the centre */
const Tributes: React.FC<{ t: number; run?: number; skip?: number[]; crouch?: boolean }> = ({ t, run = 0, skip = [], crouch }) => (
  <>
    {Array.from({ length: 24 }).map((_, i) => {
      if (skip.includes(i)) return null;
      const [x, , z] = pedestal(i);
      const k = run * 0.55;
      return (
        <Character
          key={i}
          look={i === 0 ? MILA : i === 7 ? ASH : tribute(i)}
          face={run > 0 ? "scared" : "worried"}
          pose={run > 0 ? walk(t + i, 13, 1) : { lean: crouch ? 0.35 : 0, armL: crouch ? -0.6 : 0, armR: crouch ? -0.6 : 0 }}
          position={[x * (1 - k), run > 0 ? 0 : 0.6, z * (1 - k)]}
          rotY={Math.atan2(-x, -z)}
          scale={0.85}
        />
      );
    })}
  </>
);

export const HARVEST1_SHOTS: Shot[] = [
  /* HOOK 0.0 – "Twenty-four kids enter the arena." – instant action, no intro */
  {
    start: 0,
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} />
        <Tributes t={t} crouch />
        <Cam from={[0.6, 3.0, 6.4]} to={[0.3, 3.4, 8.4]} look={[0, 3.6, PEDZ0()]} p={p} fov={52} t={t} shake={0.03} />
      </>
    ),
  },
  /* "Only one comes out alive." – top-down circle of pedestals */
  {
    start: mid(0, 0.5),
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} />
        <Tributes t={t} crouch />
        <Cam from={[0, 60, 8]} to={[0, 44, 6]} look={[0, 0, 0]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "And this year, the winner did something nobody expected." – flash-forward tease */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <Character look={MILA} face="neutral" pose={walk(t, 5, 0.4)} position={[-1.2, 0, 4 + t * 1.4]} />
        <Character look={ASH} face="neutral" pose={walk(t + 0.5, 5, 0.4)} position={[1.2, 0, 4 + t * 1.4]} />
        <Drone p={[0, 5, 14]} t={T} />
        <Cam from={[0, 5, 14]} to={[0, 5, 13]} look={[0, 3.6, 4]} p={p} fov={50} t={t} shake={0.04} />
      </>
    ),
    filter: GLITCH,
  },
  /* "Every year, the capital pulls one name from every town." */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} />
        <Crowd t={T} />
        <Character look={HOST} face="grin" pose={{ armR: -1.8 }} position={[2.2, 1.4, -13.4]} />
        <Character look={GUARD} pose={{}} position={[-6, 1.4, -14]} />
        <Character look={GUARD} pose={{}} position={[7, 1.4, -14]} />
        <Cam from={[12, 14, 20]} to={[9, 11, 15]} look={[0, 3, -10]} p={p} fov={50} t={t} />
      </>
    ),
  },
  {
    start: mid(2, 0.55),
    render: ({ t, p, T }) => (
      <>
        <Square t={T} />
        <Character look={HOST} face="grin" pose={{ armR: lerp(-1.8, -2.8, ease(seg(t, 0, 0.8))) }} position={[2.2, 1.4, -13.4]} />
        <B s={[0.5, 0.08, 0.35]} p={[3.5, lerp(3.0, 6.6, ease(seg(t, 0, 0.8))), -12.8]} c="#fff8e0" />
        <Cam from={[3.4, 6.2, -6.4]} to={[3.2, 6.0, -7.2]} look={[2.8, 5.0, -13]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "This year, the jar picked Mila's little brother." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} />
        <TextSign text="TAM" p={[3, 6, -12.2]} w={1.6} h={0.9} bg="#fff8e0" fg="#2a2a2a" />
        <Cam from={[3, 6, -7.6]} to={[3, 6, -8.6]} look={[3, 6, -12.2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "He was eight." */
  {
    start: mid(3, 0.62),
    render: ({ t, p, T }) => (
      <>
        <Square t={T} />
        <Crowd t={T} face="scared" />
        <Character look={TAM} face="scared" pose={{}} position={[0, 0, -7]} rotY={Math.PI} scale={0.7} />
        <Cam from={[0.6, 3.4, -11.6]} to={[0.5, 3.3, -11]} look={[0, 2.8, -7]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "So Mila stepped forward." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} />
        <Crowd t={T} face="scared" />
        <Character look={MILA} face="neutral" pose={walk(t, 6, 0.4)} position={[3, 0, lerp(-1, -7, ease(seg(t, 0, 1.2)))]} rotY={Math.PI} />
        <Cam from={[6, 5, -14]} to={[5, 4.6, -12.6]} look={[3, 3, -4]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "'I volunteer.'" */
  {
    start: mid(4, 0.55),
    render: ({ t, p, T }) => (
      <>
        <Square t={T} />
        <Character look={MILA} face="neutral" pose={{ armR: -2.8 * ease(seg(t, 0, 0.3)) }} position={[3, 0, -7]} rotY={Math.PI} />
        <Cam from={[3.4, 5, -12.6]} to={[3.3, 4.9, -12]} look={[3, 4.4, -7]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Day one. The horn blows." */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} />
        <Tributes t={t} crouch />
        <Cam from={[40, 22, 40]} to={[34, 18, 34]} look={[0, 2, 0]} p={p} fov={46} t={t} shake={t > 0.6 ? 0.06 : 0} />
      </>
    ),
  },
  /* "Every kid sprints for the supplies in the middle." */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} />
        <Tributes t={t} run={seg(t, 0, 2)} skip={[0]} />
        <Cam from={[6, 3, 24]} to={[4, 3.4, 18]} look={[0, 2.4, 0]} p={p} fov={52} t={t} shake={0.04} />
      </>
    ),
  },
  /* "Mila runs the other way. Into the forest." */
  {
    start: L[7],
    render: ({ t, p, T }) => {
      const z = PED_Z0 + t * 7;
      return (
        <>
          <Arena t={T} />
          <Character look={MILA} face="scared" pose={walk(t, 13, 1)} position={[0, 0, z]} />
          <Cam from={[2, 3.6, z + 9]} to={[1.6, 3.4, z + 8]} look={[0, 2.6, z]} p={p} fov={48} t={t} />
        </>
      );
    },
  },
  /* "Day three. Twelve left." */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night dome />
        <B s={[0.5, 0.4, 5]} p={[2, 7, 26]} r={[0, 0.4, 0.1]} c="#4a2f1a" />
        <B s={[0.8, 12, 0.8]} p={[0, 6, 27.5]} c="#4a2f1a" />
        <Character look={MILA} face="worried" pose={{ sit: true, headY: Math.sin(t * 2) * 0.5 }} position={[2.2, 8.6, 26]} rotY={Math.PI} scale={0.85} />
        <Cam from={[5, 8, 18]} to={[4.4, 8.4, 18.8]} look={[2, 9.6, 26]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Day five. Four left." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} />
        <B s={[60, 0.1, 6]} p={[0, 0.06, 26]} c="#3f7fbf" />
        <Character look={MILA} face="neutral" pose={walk(t, 8, 0.6)} position={[lerp(-6, 2, seg(t, 0, 2)), 0, 23]} rotY={Math.PI / 2} scale={0.85} />
        <Cam from={[-2, 4.2, 14]} to={[0, 4.4, 15]} look={[0, 2.6, 23]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "On the last night, only two are standing." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Character look={MILA} face="worried" pose={breathe(t)} position={[-3, 0, 2]} rotY={Math.PI / 2} />
        <Character look={ASH} face="worried" pose={breathe(t + 1)} position={[3, 0, 2]} rotY={-Math.PI / 2} />
        <Cam from={[0, 14, 22]} to={[0, 9, 16]} look={[0, 2.6, 2]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Mila, and a boy named Ash." */
  {
    start: mid(10, 0.55),
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Character look={ASH} face="neutral" pose={breathe(t)} position={[3, 0, 2]} rotY={-Math.PI / 2} />
        <Cam from={[-1.4, 4.9, 3.0]} to={[-1.1, 4.85, 2.9]} look={[3, 4.4, 2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "The boy who saved her life on day two." – flashback */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} supplies={false} dome={false} />
        <B s={[4, 0.1, 4]} p={[0, 0.06, 18]} c="#2a1a10" />
        <Character look={MILA} face="scared" pose={{ armR: -2.8 }} position={[0, lerp(-2.4, -0.6, ease(seg(t, 0.2, 1.4))), 18]} scale={0.85} />
        <Character look={ASH} face="worried" pose={{ lean: 0.6, armR: -1.6, armL: -1.6 }} position={[0, 0, 20.2]} rotY={Math.PI} scale={0.85} />
        <Cam from={[5, 6, 12]} to={[4, 5.4, 13]} look={[0, 1.6, 19]} p={p} fov={46} t={t} />
      </>
    ),
    filter: SEPIA,
  },
  /* "The cameras zoom in." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Drone p={[-4, 6, 6]} t={T} />
        <Drone p={[4, 7, 5]} t={T + 1} />
        <Drone p={[0, 8, -4]} t={T + 2} />
        <Character look={MILA} face="worried" pose={{}} position={[-3, 0, 2]} rotY={Math.PI / 2} />
        <Character look={ASH} face="worried" pose={{}} position={[3, 0, 2]} rotY={-Math.PI / 2} />
        <Cam from={[0, 3, 18]} to={[0, 3.6, 12]} look={[0, 5, 2]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "The whole country is watching." */
  {
    start: mid(12, 0.5),
    render: ({ t, p, T }) => (
      <>
        <Square t={T} night screenText="LIVE · FINAL 2" />
        <Crowd t={T} face="worried" />
        <Cam from={[0, 3.4, 12]} to={[0, 5, 9]} look={[0, 14, -21]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "'Finish it,' the announcer says." */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} night screenText="LIVE · FINAL 2" />
        <Character look={HOST} face="grin" pose={{ armR: -1.6, armRz: 0.3 }} position={[2.2, 1.4, -13.4]} />
        <Cam from={[2.6, 6.4, -8]} to={[2.5, 6.3, -8.6]} look={[2.2, 5.8, -13.4]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Mila looks at Ash." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Character look={MILA} face="neutral" pose={{}} position={[-3, 0, 2]} rotY={Math.PI / 2} />
        <Cam from={[1.2, 4.9, 3.2]} to={[1.0, 4.85, 3.0]} look={[-3, 4.4, 2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Ash looks at Mila." */
  {
    start: mid(14, 0.5),
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Character look={ASH} face="neutral" pose={{}} position={[3, 0, 2]} rotY={-Math.PI / 2} />
        <Cam from={[-1.2, 4.9, 3.2]} to={[-1.0, 4.85, 3.0]} look={[3, 4.4, 2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "And together, they turn around, and walk straight toward the cameras." */
  {
    start: L[15],
    render: ({ t, p, T }) => (
      <>
        <Arena t={T} night supplies={false} />
        <Character look={MILA} face="neutral" pose={t > 0.8 ? walk(t, 5, 0.4) : {}} position={[-1.2, 0, 2 + seg(t, 0.8, 4) * 6]} rotY={lerp(Math.PI / 2, 0, ease(seg(t, 0, 0.8)))} />
        <Character look={ASH} face="neutral" pose={t > 0.8 ? walk(t + 0.5, 5, 0.4) : {}} position={[1.2, 0, 2 + seg(t, 0.8, 4) * 6]} rotY={lerp(-Math.PI / 2, 0, ease(seg(t, 0, 0.8)))} />
        <Drone p={[0, 5, 14]} t={T} />
        <Cam from={[0, 5, 14]} to={[0, 5, 13]} look={[0, 3.6, 4]} p={p} fov={50} t={t} shake={0.03} />
      </>
    ),
  },
  /* "That night, for the first time in history, every screen in the country went black." */
  {
    start: L[16],
    render: ({ t, p, T }) => (
      <>
        <Square t={T} night screen={t < 1.4 ? 1 : 0} screenText="LIVE · FINAL 2" />
        <Crowd t={T} face="scared" />
        <Cam from={[0, 3.4, 12]} to={[0, 4, 10]} look={[0, 14, -21]} p={p} fov={52} t={t} shake={t > 1.4 && t < 1.7 ? 0.08 : 0} />
      </>
    ),
  },
];

/* helpers used above */
function PEDZ0() {
  return pedestal(0)[2];
}
const PED_Z0 = pedestal(0)[2];

/* retention HUD data */
export const HARVEST1_ALIVE: [number, number][] = [
  [0, 24],
  [L[8], 12],
  [L[9], 4],
  [L[10], 2],
];
export const HARVEST1_DAYS: [number, string][] = [
  [L[5], "DAY 1"],
  [L[8], "DAY 3"],
  [L[9], "DAY 5"],
  [L[10], "FINAL NIGHT"],
];

/* every cut gets a whoosh, the big beats get a hit */
export const HARVEST1_SFX: Sfx[] = [
  { src: "braam", at: 0.0, vol: 0.5 },
  { src: "harvest1/horn.wav", at: 0.05, vol: 0.35 },
  ...HARVEST1_SHOTS.slice(1).map((s) => ({ src: "whoosh", at: Math.max(0, s.start - 0.12), vol: 0.12 })),
  { src: "boom", at: L[3] + 0.1, vol: 0.4 },
  { src: "harvest1/horn.wav", at: L[5] + 0.7, vol: 0.5 },
  { src: "braam", at: L[8], vol: 0.35 },
  { src: "braam", at: L[10], vol: 0.45 },
  { src: "riser", at: L[15] - 2.2, vol: 0.3 },
  { src: "braam", at: L[16] + 1.4, vol: 0.6 },
  { src: "pop", at: HARVEST1_END + 66 / 30, vol: 0.3 },
];

export const HARVEST1_BEDS: Bed[] = [
  { src: "sfx/space_amb.wav", from: 0, to: HARVEST1_END + 3, vol: 0.14, fadeIn: 0.05, fadeOut: 2.5 },
  { src: "sfx/heartbeat.wav", from: L[10], to: L[10] + 8, vol: 0.4, fadeIn: 0.3, fadeOut: 0.1 },
  { src: "sfx/heartbeat.wav", from: L[10] + 8, to: L[16] + 1.4, vol: 0.45, fadeIn: 0.1, fadeOut: 0.1 },
];

