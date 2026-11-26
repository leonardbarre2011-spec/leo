import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import { Cam, clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Bike, TextSign } from "../smiling/Props";
import { B } from "../../lib/Sets";
import { Fort, IVY, JONAH, MAYOR, SURVIVORS, WALL_R } from "./Sets";
import cues from "../../../public/dead2/cues.json";

const L = cues.lines;
export const DEAD2_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? DEAD2_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const STAGE_Y = 1;
const Mayor: React.FC<{ face?: "smile" | "grin" | "neutral"; pose?: object }> = ({ face = "smile", pose = {} }) => (
  <Character look={MAYOR} face={face} pose={pose} position={[0, STAGE_Y, -8.6]} />
);
const Crowd: React.FC<{ t: number }> = ({ t }) => (
  <>
    {Array.from({ length: 14 }).map((_, i) => (
      <Character
        key={i}
        look={SURVIVORS[i % SURVIVORS.length]}
        face="smile"
        pose={breathe(t + i)}
        position={[-8 + (i % 7) * 2.7, 0, -1 + Math.floor(i / 7) * 3]}
        rotY={Math.PI}
        scale={i % 3 === 2 ? 0.8 : 1}
      />
    ))}
  </>
);

export const DEAD2_SHOTS: Shot[] = [
  /* "The girl's name was Ivy." */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={IVY} face="smug" pose={{ ...breathe(t), headY: 0.3 }} position={[2, 0, 70]} rotY={Math.PI + 0.3} />
        <Cam from={[1.0, 5.0, 65.8]} to={[1.2, 4.95, 66.6]} look={[2, 4.4, 70]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "She took Jonah to the only safe place left. A town behind a wall." */
  {
    start: L[1],
    render: ({ t, p, T }) => {
      const z = 84 - t * 6;
      return (
        <>
          <Fort t={T} />
          <Bike p={[2, 0, z]} rot={Math.PI} t={T} speed={3} />
          <Character look={IVY} face="smug" pose={{ armL: -1.25, armR: -1.25, legL: -1.1 + Math.sin(T * 9) * 0.5, legR: -1.1 - Math.sin(T * 9) * 0.5, lean: 0.25 }} position={[2, 0.55, z - 0.55]} rotY={Math.PI} />
          <Character look={JONAH} face="worried" pose={{ sit: true, armL: -1.2, armR: -1.2 }} position={[2, 2.5, z + 1.6]} rotY={Math.PI} />
          <Cam from={[8, 4, z + 12]} to={[6, 4.6, z + 10]} look={[0, 4, WALL_R]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  {
    start: mid(1, 0.55),
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Cam from={[70, 60, 110]} to={[50, 50, 90]} look={[0, 0, 0]} p={p} fov={48} t={t} linear />
      </>
    ),
  },
  /* "A wall made of school buses, shipping containers…" */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Cam from={[-26, 3.2, 44]} to={[-6, 3.2, 52]} look={[-10, 3.4, 40]} lookTo={[6, 3.6, 42]} p={p} fov={50} t={t} linear />
      </>
    ),
  },
  /* "Inside, it looked almost normal. Kids played." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        {[0, 1, 2].map((i) => (
          <Character key={i} look={SURVIVORS[i + 2]} face="laugh" pose={{ armL: -2.6, armR: -2.6 }} position={[-6 + i * 3, Math.abs(Math.sin(T * 5 + i)) * 1.2, 12]} rotY={Math.PI + i * 0.6} scale={0.8} />
        ))}
        <Cam from={[2, 4.2, 22]} to={[1, 4.2, 20]} look={[-3, 2.5, 12]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "People smiled. There was even music." */
  {
    start: mid(3, 0.45),
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Crowd t={T} />
        <Cam from={[10, 6, 10]} to={[8, 5.6, 9]} look={[0, 3, -4]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "And there was the Mayor." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Mayor face="grin" pose={{ armL: -2.2 * ease(seg(t, 0.1, 0.8)), armR: -2.2 * ease(seg(t, 0.1, 0.8)), armLz: 0.6, armRz: -0.6 }} />
        <Cam from={[1.2, 2.6, -2]} to={[1.0, 2.4, -2.6]} look={[0, 5.6, -8.6]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "He shook Jonah's hand and said," */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={MAYOR} face="grin" pose={{ armR: -1.3 + Math.sin(t * 9) * 0.12 }} position={[0.9, 0, -4]} rotY={-Math.PI / 2 + 0.2} />
        <Character look={JONAH} face="worried" pose={{ armR: -1.3 + Math.sin(t * 9) * 0.12 }} position={[-2.1, 0, -4]} rotY={Math.PI / 2 - 0.2} scale={0.85} />
        <Cam from={[-0.6, 4.6, 3.4]} to={[-0.6, 4.4, 2.4]} look={[-0.6, 3.4, -4]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "'Here, everyone eats. Everyone sleeps. Everyone follows the rules.'" */
  {
    start: mid(5, 0.4),
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={MAYOR} face={Math.floor(t * 4) % 2 ? "grin" : "smile"} pose={breathe(t)} position={[0.9, 0, -4]} rotY={-Math.PI / 2 + 0.2} />
        <Cam from={[-2.6, 5.0, -2.2]} to={[-2.2, 4.95, -2.6]} look={[0.9, 4.6, -4]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "There was only one strange rule." */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={JONAH} face="worried" pose={breathe(t)} position={[-2.1, 0, -4]} rotY={Math.PI / 2 - 0.2} scale={0.85} />
        <Character look={IVY} face="neutral" pose={breathe(t + 1)} position={[-4.4, 0, -1.6]} rotY={2.2} />
        <Cam from={[1.2, 4.4, -1.8]} to={[1.0, 4.35, -2.2]} look={[-2.4, 3.8, -3.4]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Every Sunday, one name was drawn from a jar." */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Cam from={[0.6, 4.8, -6.2]} to={[0.2, 4.2, -7.8]} look={[0, 3.8, -9.4]} p={p} fov={40} t={t} linear />
      </>
    ),
  },
  /* "And that person went outside the wall. Alone. To find supplies." */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={SURVIVORS[1]} face="neutral" pose={walk(t, 5, 0.45)} position={[0, 0, 52 + t * 1.8]} rotY={0} />
        <Cam from={[0, 9, 40]} to={[0, 9.6, 39]} look={[0, 1, 60]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Nobody ever came back." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <B s={[1.2, 1.4, 0.7]} p={[1.5, 0.7, 72]} r={[0, 0.5, 0.3]} c="#5a6a3a" />
        <Cam from={[4, 1.6, 78]} to={[3.4, 1.4, 76.6]} look={[1.5, 0.8, 72]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "'It's an honor,' the Mayor smiled." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Mayor face="grin" pose={{ headZ: 0.1 }} />
        <Cam from={[0.5, 6.0, -5.0]} to={[0.4, 5.95, -5.6]} look={[0, 5.6, -8.6]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "Jonah's first Sunday came." */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Crowd t={T} />
        <Character look={JONAH} face="worried" pose={breathe(t)} position={[1.5, 0, 5]} rotY={Math.PI} scale={0.85} />
        <Character look={IVY} face="neutral" pose={breathe(t)} position={[3.6, 0, 5.4]} rotY={Math.PI} />
        <Mayor />
        <Cam from={[5, 5, 14]} to={[4, 5, 12]} look={[0, 3.5, -6]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "The jar was shaken. A paper unfolded." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <group position={[Math.sin(t * 30) * 0.08 * (1 - seg(t, 0.8, 1)), 0, 0]}>
          <Mayor pose={{ armR: -1.6, armL: -1.0 }} />
        </group>
        <Cam from={[0.6, 5.2, -6.4]} to={[0.4, 5.0, -7.0]} look={[0, 4.4, -9.0]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "The Mayor read the name… and looked straight at Jonah." */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Mayor face="neutral" pose={{ armR: -1.6, headX: lerp(0.35, -0.05, ease(seg(t, 0.8, 1.4))) }} />
        <Cam from={[0.3, 6.1, -5.4]} to={[0.2, 6.0, -5.9]} look={[0, 5.6, -8.6]} p={p} fov={36} t={t} />
      </>
    ),
  },
  {
    start: mid(13, 0.72),
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={JONAH} face="scared" pose={{}} position={[1.5, 0, 5]} rotY={Math.PI} scale={0.85} />
        <Cam from={[1.6, 4.1, 1.4]} to={[1.55, 4.05, 1.9]} look={[1.5, 3.9, 5]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "But the name wasn't his." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <TextSign text="IVY" p={[0, 4.2, -7.6]} w={1.6} h={1.0} bg="#fff8e0" fg="#2a2a2a" />
        <Cam from={[0, 4.2, -5.4]} to={[0, 4.2, -6.2]} look={[0, 4.2, -7.6]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "It was Ivy's." */
  {
    start: L[15],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={IVY} face="scared" pose={{}} position={[3.6, 0, 5.4]} rotY={Math.PI} />
        <Cam from={[3.5, 4.9, 1.6]} to={[3.55, 4.85, 2.2]} look={[3.6, 4.6, 5.4]} p={p} fov={38} t={t} />
      </>
    ),
  },
];

export const DEAD2_SFX: Sfx[] = [
  { src: "smiling1/bell.wav", at: L[11] + 0.1, vol: 0.4 },
  { src: "smiling1/freeze.wav", at: L[14] + 0.1, vol: 0.3 },
  { src: "boom", at: L[15] + 0.1, vol: 0.4 },
  { src: "whoosh", at: DEAD2_END + 0.1, vol: 0.35 },
  { src: "pop", at: DEAD2_END + 66 / 30, vol: 0.3 },
];

export const DEAD2_BEDS: Bed[] = [
  { src: "sfx/drone.wav", from: 0, to: L[3], vol: 0.18, fadeIn: 0.8, fadeOut: 0.6 },
  { src: "smiling1/bells.wav", from: L[3], to: L[6], vol: 0.35, fadeIn: 0.4, fadeOut: 0.8 },
  { src: "smiling1/pad.wav", from: L[3], to: L[6], vol: 0.3, fadeIn: 0.4, fadeOut: 0.8 },
  { src: "sfx/drone.wav", from: L[6], to: DEAD2_END + 3, vol: 0.2, fadeIn: 1.0, fadeOut: 2.5 },
];
