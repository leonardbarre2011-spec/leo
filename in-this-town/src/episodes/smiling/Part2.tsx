import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import type { Look } from "../../lib/Character";
import { Cam, clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Brightwater, ControlRoom } from "./Brightwater";
import { BakeryInside, Bedroom } from "./Props";
import { MILO, NEIGHBOR, TOWNSFOLK, WATCHER } from "./cast";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const BAKER: Look = { skin: "#f0c8a0", shirt: "#ffffff", pants: "#e88aa0", shoes: "#ffffff", hair: "#e8c85a", hairStyle: "bun" };
const NEIGHBOR_EAR: Look = { ...NEIGHBOR, earpiece: true };

/* street walkers that can freeze in place (frozen = time stops for them) */
const Walkers: React.FC<{ T: number; frozenAt?: [number, number]; smile?: boolean }> = ({ T, frozenAt, smile }) => {
  const isFrozen = frozenAt ? T >= frozenAt[0] && T < frozenAt[1] : false;
  const tt = isFrozen && frozenAt ? frozenAt[0] : T;
  const ppl: [Look, number, number, number][] = [
    [TOWNSFOLK[0], -6, 40, -1],
    [TOWNSFOLK[1], -6, 22, 1],
    [TOWNSFOLK[2], 6, 30, -1],
    [TOWNSFOLK[3], 6, 46, 1],
    [TOWNSFOLK[4], -6, 52, -1],
  ];
  return (
    <>
      {ppl.map(([lk, x, z0, dir], i) => (
        <Character
          key={i}
          look={lk}
          face={smile && T > frozenAt![1] ? "grin" : "smile"}
          pose={walk(tt + i, 7, 0.55)}
          position={[x, 0, z0 + dir * (tt - 5) * 1.6]}
          rotY={dir > 0 ? 0 : Math.PI}
        />
      ))}
    </>
  );
};

export const PART2_SHOTS: Shot[] = [
  /* "Milo didn't tell anyone about the bird." – his room, bird hidden in a shoebox */
  {
    start: 0,
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} />
        <Character look={MILO} face="worried" pose={{ sit: true, headY: 0.5, headX: 0.2 }} position={[-3.4, 1.25, -1.2]} rotY={Math.PI / 2} />
        <Cam from={[2.4, 5.4, 5.4]} to={[1.8, 5.2, 4.6]} look={[-2.8, 2.6, -1.6]} p={p} fov={56} t={t} />
      </>
    ),
  },
  {
    start: 1.4,
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} />
        <Cam from={[4.4, 5.6, -0.6]} to={[4.0, 5.3, -1.4]} look={[2.2, 3.2, -4.8]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Instead, he started testing the town." */
  {
    start: 2.48,
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} />
        <Character look={MILO} face="smug" pose={{ ...breathe(t), headY: -0.2 }} position={[1, 0, -0.5]} rotY={0.3} />
        <Cam from={[2.6, 5.2, 5.6]} to={[2.4, 5.1, 4.8]} look={[1, 4.2, -0.5]} p={p} fov={42} t={t} />
      </>
    ),
  },
  {
    start: 3.96,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Cam from={[-40, 40, 70]} to={[-28, 30, 52]} look={[0, 2, 0]} p={p} fov={48} t={t} linear />
      </>
    ),
  },
  /* "On Monday, he walked to school backwards." */
  {
    start: 5.4,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Character look={{ ...MILO, backpack: "#2f6fd6" }} face="smug" pose={walk(-t, 7, 0.5)} position={[6, 0, 36 - t * 1.8]} rotY={0} />
        <Walkers T={T} />
        <Cam from={[-1, 5.6, 19]} to={[-0.6, 5.6, 21]} look={[5.5, 3.2, 34]} p={p} fov={46} t={t} />
      </>
    ),
  },
  {
    start: 6.6,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Character look={{ ...MILO, backpack: "#2f6fd6" }} face="smug" pose={walk(-t, 7, 0.5)} position={[6, 0, 33.8 - t * 1.8]} rotY={0} />
        <Cam from={[8, 5.6, 41]} to={[7.6, 5.5, 39.8]} look={[6, 3.8, 33]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Every single person on the street… stopped. For one second." */
  {
    start: 7.88,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Walkers T={T} frozenAt={[9.81, 10.9]} />
        <Character look={{ ...MILO, backpack: "#2f6fd6" }} face="smug" pose={walk(-T, 7, 0.5)} position={[6, 0, 31.5 - t * 1.8]} rotY={0} />
        <Cam from={[-14, 14, 14]} to={[-13, 13.5, 15]} look={[0, 2.5, 36]} p={p} fov={46} t={t} />
      </>
    ),
  },
  {
    start: 9.81,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Walkers T={T} frozenAt={[9.81, 10.9]} />
        <Cam from={[-1.5, 4.8, 33]} to={[-1.6, 4.8, 32.4]} look={[-6, 3.6, 39]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Then they smiled. And kept walking." */
  {
    start: 11.56,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Character look={TOWNSFOLK[0]} face="grin" pose={{ ...breathe(t), headY: -0.6 }} position={[-6, 0, 30]} rotY={Math.PI} />
        <Cam from={[-5.0, 5.0, 24.6]} to={[-5.1, 4.95, 25.4]} look={[-6, 4.2, 30]} p={p} fov={40} t={t} />
      </>
    ),
  },
  {
    start: 13.12,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Walkers T={T} frozenAt={[0, 0]} />
        <Character look={{ ...MILO, backpack: "#2f6fd6" }} face="worried" pose={{ headY: 0.5 }} position={[6, 0, 25]} rotY={0} />
        <Cam from={[9, 5.6, 16]} to={[8.6, 5.4, 17]} look={[3, 3, 30]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "On Tuesday, he asked the baker for something weird." */
  {
    start: 14.44,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={9} />
        <Character look={MILO} face="smug" pose={walk(t, 7, 0.5)} position={[lerp(-3, -8.2, seg(t, 0, 1.4)), 0, -8.6]} rotY={-Math.PI / 2} />
        <Cam from={[4, 4.5, 2]} to={[2.5, 4.4, 0]} look={[-11, 3.5, -7]} p={p} fov={46} t={t} />
      </>
    ),
  },
  {
    start: 15.86,
    render: ({ t, p }) => (
      <>
        <BakeryInside />
        <Character look={BAKER} face="smile" pose={breathe(t)} position={[0.5, 0, -4.6]} />
        <Character look={MILO} face="smug" pose={breathe(t)} position={[-0.5, 0, 0.6]} rotY={Math.PI} />
        <Cam from={[5.4, 6, 6]} to={[4.8, 5.6, 5]} look={[0, 3.5, -2.5]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "One blue croissant, please." */
  {
    start: 17.6,
    render: ({ t, p }) => (
      <>
        <BakeryInside />
        <Character look={BAKER} face="smile" pose={breathe(t)} position={[0.5, 0, -4.6]} />
        <Character look={MILO} face="smug" pose={{ ...breathe(t), armR: -1.2 }} position={[-0.5, 0, 0.6]} rotY={Math.PI} />
        <Cam from={[1.2, 5.6, 4.6]} to={[1.0, 5.5, 4.0]} look={[0.3, 4.4, -4.6]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "The baker froze." */
  {
    start: 20.08,
    render: ({ t, p }) => (
      <>
        <BakeryInside />
        <Character look={BAKER} face="smile" pose={{}} position={[0.5, 0, -4.6]} />
        <Cam from={[0.5, 4.9, 1.2]} to={[0.5, 4.85, 0.2]} look={[0.5, 4.4, -4.6]} p={p} fov={38} t={0} linear />
      </>
    ),
  },
  /* "'One blue croissant, please,' Milo said again." */
  {
    start: 21.76,
    render: ({ t, p }) => (
      <>
        <BakeryInside />
        <Character look={MILO} face="smug" pose={{ ...breathe(t), lean: 0.12, armR: -1.2 }} position={[-0.5, 0, 0.6]} rotY={Math.PI} />
        <Cam from={[-1.4, 5.2, -4.0]} to={[-1.2, 5.1, -3.4]} look={[-0.5, 4.2, 0.6]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "And she answered twice, in the exact same voice:" */
  {
    start: 25.14,
    render: ({ t, p }) => (
      <>
        <BakeryInside />
        <Character look={BAKER} face="smile" pose={{}} position={[0.5, 0, -4.6]} />
        <Cam from={[0.5, 4.9, 0.6]} to={[0.5, 4.85, -0.2]} look={[0.5, 4.4, -4.6]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "Coming right up, Milo!" ×2 – identical motion, identical framing */
  ...[28.41, 30.02].map(
    (start): Shot => ({
      start,
      render: ({ t }) => (
        <>
          <BakeryInside />
          <Character look={BAKER} face={Math.floor(t * 6) % 2 ? "laugh" : "grin"} pose={{ armR: -2.6, armRz: -0.3, headZ: 0.12 }} position={[0.5, 0, -4.6]} />
          <Cam from={[1.6, 5.2, 1.0]} look={[0.5, 4.2, -4.6]} p={0} fov={40} t={0} />
        </>
      ),
    }),
  ),
  /* "On Wednesday, he did nothing at all." */
  {
    start: 31.8,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={10} />
        <Character look={MILO} face="neutral" pose={{ sit: true }} position={[0, 1.4, -6]} rotY={Math.PI} />
        <Cam from={[10, 12, 12]} to={[8, 10, 9]} look={[0, 2, -8]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "He just sat in the middle of the square. For three hours." – time-lapse */
  {
    start: 34.12,
    render: ({ t, p, T }) => {
      const mins = 600 + t * 80;
      return (
        <>
          <Brightwater t={T} clockHour={Math.floor(mins / 60)} clockMin={mins % 60} />
          <Cam from={[0, 12, -8.8]} to={[0, 12, -10.4]} look={[0, 12, -15.4]} p={p} fov={40} t={t} />
        </>
      );
    },
  },
  {
    start: 35.6,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={12} sun={t * 1.6} />
        <Character look={MILO} face="neutral" pose={{ sit: true, headY: Math.sin(t * 0.8) * 0.3 }} position={[0, 1.4, -6]} rotY={Math.PI} />
        <Cam from={[0, 34, 6]} to={[0, 30, 4]} look={[0, 0, -7]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "And for three hours… nobody walked past him." – the crowd waits at the edge */
  {
    start: 37.4,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={MILO} face="worried" pose={{ sit: true, headY: Math.sin(t * 1.2) * 0.5 }} position={[0, 1.4, -6]} rotY={Math.PI} />
        {TOWNSFOLK.concat(TOWNSFOLK).map((lk, i) => (
          <Character key={i} look={lk} face="smile" pose={{}} position={[-12 + i * 2.6, 0, 6]} rotY={Math.PI} />
        ))}
        <Cam from={[0, 5, -14]} to={[0, 5.2, -12.5]} look={[0, 2.5, 6]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "Not one person." */
  {
    start: 40.48,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={MILO} face="worried" pose={{ sit: true }} position={[0, 1.4, -6]} rotY={Math.PI} />
        {TOWNSFOLK.concat(TOWNSFOLK).map((lk, i) => (
          <Character key={i} look={lk} face="smile" pose={{}} position={[-12 + i * 2.6, 0, 6]} rotY={Math.PI} />
        ))}
        <Cam from={[2.2, 9.5, 12]} to={[1.8, 9.0, 11]} look={[0, 1.5, -6]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Then the neighbor came out. Smiling. Too wide." */
  {
    start: 42.52,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={MILO} face="worried" pose={{ sit: true, headY: 0.4 }} position={[0, 1.4, -6]} rotY={Math.PI} />
        <Character look={NEIGHBOR_EAR} face="grin" pose={walk(t, 6, 0.5)} position={[lerp(9, 3, seg(t, 0, 1.3)), 0, lerp(2, -3.5, seg(t, 0, 1.3))]} rotY={-2.3} />
        <Cam from={[9, 5, -12]} to={[8.4, 4.8, -11.4]} look={[2.5, 2.8, -3]} p={p} fov={50} t={t} />
      </>
    ),
  },
  {
    start: 43.84,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={NEIGHBOR_EAR} face="grin" pose={breathe(t)} position={[2.2, 0, -4.2]} rotY={-2.3} />
        <Cam from={[-0.6, 5.0, -7.4]} to={[-0.2, 4.95, -6.9]} look={[2.2, 4.6, -4.2]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "He leaned in to say good morning…" */
  {
    start: 45.56,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={MILO} face="worried" pose={{ sit: true, headY: 0.6 }} position={[0, 1.4, -6]} rotY={Math.PI} />
        <Character look={NEIGHBOR_EAR} face="grin" pose={{ lean: 0.55 * ease(seg(t, 0, 1.2)) }} position={[1.6, 0, -4.6]} rotY={-2.3} />
        <Cam from={[5.4, 4.6, -10]} to={[5.0, 4.5, -9.4]} look={[0.8, 3.0, -5.0]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "and Milo heard a tiny voice. Coming from inside his ear." */
  {
    start: 47.76,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={MILO} face="scared" pose={{ sit: true, headY: 0.35 }} position={[0, 1.4, -6]} rotY={Math.PI} />
        <Cam from={[-0.5, 4.2, -10.8]} to={[-0.4, 4.1, -10.0]} look={[0, 3.4, -6]} p={p} fov={40} t={t} />
      </>
    ),
  },
  {
    start: 49.86,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={NEIGHBOR_EAR} face="grin" pose={{}} position={[1.6, 0, -4.6]} rotY={-2.3} />
        <Cam from={[-0.4, 4.9, -2.5]} to={[0.1, 4.75, -2.95]} look={[1.13, 4.57, -4.08]} p={p} fov={34} t={t} />
      </>
    ),
  },
  /* "He's getting suspicious." */
  {
    start: 52.04,
    render: ({ t, p }) => (
      <>
        <ControlRoom t={t} />
        <Character look={WATCHER} pose={{ sit: true, armL: -1.2, armR: -1.6, headX: 0.1 }} position={[0, 1.4, 0.2]} rotY={Math.PI} />
        <Cam from={[1.8, 5.4, 2.6]} to={[1.5, 5.3, 2.0]} look={[0, 4.6, -3]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "Switch to plan B." – the smile drops */
  {
    start: 53.44,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={13} />
        <Character look={NEIGHBOR_EAR} face={t > 0.35 ? "neutral" : "grin"} pose={{ headY: t > 0.6 ? 0.3 : 0 }} position={[1.6, 0, -4.6]} rotY={-2.3} />
        <Cam from={[-2.2, 5.0, -8.2]} to={[-1.8, 4.9, -7.8]} look={[1.6, 4.4, -4.6]} p={p} fov={38} t={t} />
      </>
    ),
  },
];

export const PART2_VOICE_END = 55.0;

export const PART2_SFX: Sfx[] = [
  { src: "smiling1/freeze.wav", at: 9.8, vol: 0.35 },
  { src: "smiling1/bell.wav", at: 15.9, vol: 0.25 },
  { src: "smiling1/freeze.wav", at: 20.1, vol: 0.3 },
  { src: "smiling1/beep.wav", at: 49.9, vol: 0.2 },
  { src: "whoosh", at: PART2_VOICE_END + 0.1, vol: 0.35 },
  { src: "pop", at: PART2_VOICE_END + 66 / 30, vol: 0.3 },
];

export const PART2_BEDS: Bed[] = [
  { src: "sfx/drone.wav", from: 0, to: 14.4, vol: 0.14, fadeIn: 0.8, fadeOut: 0.6 },
  { src: "smiling1/bells.wav", from: 14.4, to: 20.0, vol: 0.3, fadeIn: 0.3, fadeOut: 0.3 },
  { src: "sfx/drone.wav", from: 20.0, to: PART2_VOICE_END + 3, vol: 0.18, fadeIn: 0.5, fadeOut: 2.5 },
  { src: "smiling1/chirps.wav", from: 3.9, to: 14.4, vol: 0.25 },
  { src: "smiling1/hum.wav", from: 52.0, to: 53.44, vol: 0.3, fadeIn: 0.2, fadeOut: 0.2 },
];
