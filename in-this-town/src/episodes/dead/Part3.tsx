import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import { Cam, clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { B } from "../../lib/Sets";
import { ZOMBIES } from "../../lib/cast";
import { Fort, IVY, JONAH, MAYOR, SURVIVORS } from "./Sets";
import cues from "../../../public/dead3/cues.json";

const L = cues.lines;
export const DEAD3_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? DEAD3_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const TOWER: [number, number, number] = [0, 0, 95];
const WALL_TARGET: [number, number, number] = [0, 0, 20];
const RING_FROM = L[6];
const CUT_AT = L[11];
const ringAt = (T: number) => (T >= RING_FROM && T < L[10] ? 1 : T >= CUT_AT + 0.6 ? 1 : 0);

const Night: React.FC<{ T: number; turn?: number; surge?: number; toward?: [number, number, number]; rope?: boolean }> = ({ T, turn, surge, toward, rope }) => (
  <Fort t={T} night outside ring={ringAt(T)} turn={turn} surge={surge} toward={toward} rope={rope} />
);

/* two kids sneaking, crouched */
const Sneak: React.FC<{ z: number; t: number; x?: number; rot?: number }> = ({ z, t, x = 0, rot = 0 }) => (
  <>
    <Character look={IVY} face="neutral" pose={{ ...walk(t, 5, 0.35), lean: 0.35 }} position={[x - 0.9, 0, z + 1.5]} rotY={rot} />
    <Character look={JONAH} face="scared" pose={{ ...walk(t + 0.5, 5, 0.35), lean: 0.3 }} position={[x + 0.9, 0, z]} rotY={rot} scale={0.85} />
  </>
);

export const DEAD3_SHOTS: Shot[] = [
  /* "That night, Jonah followed Ivy outside the wall." */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Sneak z={47 + t * 1.6} t={t} />
        <Cam from={[3, 9, 38]} to={[2.6, 9.4, 37]} look={[0, 1.5, 54]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "The dead were everywhere. Thousands of them." */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Cam from={[-16, 2.4, 60]} to={[-12, 2.6, 64]} look={[4, 3, 92]} p={p} fov={52} t={t} linear />
      </>
    ),
  },
  /* "Standing still in the dark. Waiting." */
  {
    start: mid(1, 0.5),
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Cam from={[2.4, 4.8, 70]} to={[2.2, 4.7, 71]} look={[3, 4.3, 78]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "And in the middle of them, there was a tower. With a bell." */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Cam from={[10, 3, 72]} to={[9, 14, 74]} look={[0, 6, 95]} lookTo={[0, 18, 95]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Ivy whispered…" */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <B s={[3.4, 1.8, 6]} p={[0.5, 0.9, 57]} r={[0, 0.3, 0.1]} c="#4a4f55" />
        <Character look={IVY} face="neutral" pose={{ sit: true, headY: 0.5 }} position={[-1.2, 1.0, 54.5]} rotY={0.4} />
        <Character look={JONAH} face="scared" pose={{ sit: true, headY: -0.4 }} position={[1.2, 1.0, 54]} rotY={-0.3} scale={0.85} />
        <pointLight position={[0, 4, 51]} intensity={10} color="#8fa8ff" distance={8} decay={1.6} />
        <Cam from={[0, 3.8, 49.5]} to={[0, 3.7, 50.3]} look={[0, 3.2, 54.5]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "…the Mayor rings it." – insert: the lit window */
  {
    start: mid(3, 0.3),
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Cam from={[3, 7, -6]} to={[2, 7.6, -10]} look={[0, 9, -22]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "…The dead come to the sound. And whoever's out here keeps them busy." */
  {
    start: mid(3, 0.6),
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Character look={IVY} face="worried" pose={{ sit: true, headY: 0.2 }} position={[-1.2, 1.0, 54.5]} rotY={0.4} />
        <Cam from={[-0.6, 4.0, 51.2]} to={[-0.7, 3.95, 51.8]} look={[-1.2, 3.8, 54.5]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "The names were never random." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <Character look={JONAH} face="worried" pose={{ sit: true, headY: -0.2 }} position={[1.2, 1.0, 54]} rotY={-0.3} scale={0.85} />
        <Cam from={[1.6, 3.6, 51.2]} to={[1.55, 3.55, 51.7]} look={[1.2, 3.3, 54]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "The Mayor only picked the people who asked questions." */
  {
    start: L[5],
    render: ({ t, p }) => (
      <>
        <color attach="background" args={["#0a0705"]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[1.5, 5.5, 3]} intensity={30} color="#ffb05a" distance={12} decay={1.6} />
        <B s={[10, 8, 0.2]} p={[0, 4, -2]} c="#3a2a20" />
        <B s={[10, 0.2, 8]} p={[0, -0.1, 1]} c="#2a1c14" />
        <B s={[0.08, 4, 0.08]} p={[1.55, 5.5, 0.6]} c="#8a7a5a" />
        <Character look={MAYOR} face="grin" pose={{ armR: -2.5, armRz: 0.2 }} position={[0, 0, 0]} />
        <Cam from={[-1.2, 5.2, 4.2]} to={[-1.0, 5.1, 3.6]} look={[0, 4.6, 0]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Then the bell started ringing." */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} />
        <pointLight position={[0, 18, 99]} intensity={20} color="#ffcf8a" distance={10} decay={1.6} />
        <Cam from={[3, 18.2, 101]} to={[2.6, 18.0, 100.4]} look={[0, 18.2, 95]} p={p} fov={42} t={t} shake={0.03} />
      </>
    ),
  },
  /* "Thousands of heads turned at once." */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} turn={ease(seg(t, 0.2, 0.8))} toward={TOWER} />
        <Cam from={[-6, 3.4, 68]} to={[-5, 3.5, 69]} look={[2, 3.4, 80]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "Jonah grabbed Ivy's hand, and they climbed the tower." */
  {
    start: L[8],
    render: ({ t, p, T }) => {
      const y = lerp(0, 13, ease(seg(t, 0.3, 2.4)));
      return (
        <>
          <Night T={T} turn={1} surge={seg(t, 0, 3) * 0.6} toward={TOWER} />
          <Character look={IVY} face="scared" pose={{ armL: -2.8, armR: -2.4 + Math.sin(t * 8) * 0.3, legL: Math.sin(t * 8) * 0.5, legR: -Math.sin(t * 8) * 0.5 }} position={[0, y + 2.5, 92.4]} rotY={Math.PI} />
          <Character look={JONAH} face="scared" pose={{ armL: -2.8, armR: -2.4 - Math.sin(t * 8) * 0.3 }} position={[0, Math.max(0, y - 3.5), 92.2]} rotY={Math.PI} scale={0.85} />
          <Cam from={[5, 6, 84]} to={[4, 14, 85]} look={[0, 6, 93]} lookTo={[0, 15, 93]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  /* "The dead piled up beneath them like a wave." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} turn={1} surge={0.6 + seg(t, 0, 2) * 0.4} toward={TOWER} />
        <Character look={JONAH} face="scared" pose={{ headX: 0.6 }} position={[1, 16.2, 95.6]} rotY={Math.PI} scale={0.85} />
        <Cam from={[1.4, 22, 98]} to={[1.6, 21, 97.4]} look={[0, 0, 86]} p={p} fov={56} t={t} />
      </>
    ),
  },
  /* "At the top, Jonah saw the rope." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} turn={1} surge={1} toward={TOWER} />
        <Character look={JONAH} face="worried" pose={{ armR: -1.2 }} position={[0.8, 16.2, 95.8]} rotY={Math.PI} scale={0.85} />
        <Cam from={[2.6, 20.5, 99]} to={[2.2, 20.2, 98.2]} look={[0, 18.2, 92]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "It ran all the way back to the Mayor's window." */
  {
    start: mid(10, 0.45),
    render: ({ t, p, T }) => (
      <>
        <Night T={T} turn={1} surge={1} toward={TOWER} />
        <Cam from={[0.6, 19.6, 90]} to={[0.5, 15, 30]} look={[0, 14, 60]} lookTo={[0, 9, -22]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "So he cut it. And rang the bell himself. Facing the wall." */
  {
    start: L[11],
    render: ({ t, p, T }) => {
      const cut = t > 0.5;
      return (
        <>
          <Night T={T} turn={1} surge={1} toward={TOWER} rope={!cut} />
          <Character look={JONAH} face="smug" pose={{ armR: cut ? -2.6 + Math.sin(t * 6) * 0.4 : lerp(-2.4, -0.6, seg(t, 0.25, 0.5)) }} position={[0.8, 16.2, 95.8]} rotY={Math.PI} scale={0.85} />
          <Character look={IVY} face="worried" pose={{ armL: -0.6 }} position={[-1.2, 16.2, 96.4]} rotY={Math.PI + 0.4} />
          <Cam from={[3.4, 19.4, 101]} to={[3.0, 19.2, 100.4]} look={[0, 18, 95]} p={p} fov={46} t={t} shake={cut ? 0.03 : 0} />
        </>
      );
    },
  },
  /* "The horde turned." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <Night T={T} turn={1} surge={lerp(1, 0.2, seg(t, 0.2, 1.6))} toward={WALL_TARGET} />
        <Cam from={[0, 26, 104]} to={[0, 24, 102]} look={[0, 0, 70]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "By morning, the Mayor was gone." */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} hallOpen />
        <Cam from={[3, 4, -12]} to={[2.4, 4, -13]} look={[0, 4, -22]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "The jar was empty." */
  {
    start: mid(13, 0.55),
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} hallOpen />
        <B s={[1.4, 1.6, 1.4]} p={[0, 3.8, -9.4]} c="#9fb4c4" />
        <Cam from={[0.6, 4.6, -6.2]} to={[0.3, 4.3, -7.0]} look={[0, 3.9, -9.4]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "And the wall had only one rule left." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        <Character look={JONAH} face="smile" pose={breathe(t)} position={[1, 5.4, 42]} rotY={0} scale={0.85} />
        <Character look={IVY} face="smile" pose={breathe(t + 1)} position={[-1.2, 5.4, 42]} rotY={0} />
        <Cam from={[3, 7.6, 34]} to={[2.6, 7.6, 35]} look={[0, 6.8, 60]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Nobody goes outside alone. Ever again." */
  {
    start: L[15],
    render: ({ t, p, T }) => (
      <>
        <Fort t={T} />
        {[JONAH, IVY, ...SURVIVORS].map((lk, i) => (
          <Character key={i} look={lk} face="smile" pose={walk(t + i, 6, 0.45)} position={[-6 + i * 1.8, 0, 50 + t * 1.6 + (i % 2) * 1.2]} rotY={0} scale={lk === JONAH ? 0.85 : 1} />
        ))}
        <Character look={ZOMBIES[0]} pose={{ armL: -1.2, armR: -1.2 }} position={[14, 0, 90]} rotY={Math.PI} />
        <Cam from={[0, 3.6, 66]} to={[0, 3.8, 70]} look={[0, 3, 50]} p={p} fov={50} t={t} />
      </>
    ),
  },
];

export const DEAD3_SFX: Sfx[] = [
  ...[0, 1, 2, 3, 4, 5].map((k) => ({ src: "smiling1/bell.wav", at: RING_FROM + k * 0.75, vol: 0.5 })),
  { src: "whip", at: CUT_AT + 0.45, vol: 0.5 },
  ...[0, 1, 2, 3].map((k) => ({ src: "smiling1/bell.wav", at: CUT_AT + 0.6 + k * 0.75, vol: 0.55 })),
  { src: "rumble", at: L[9], vol: 0.25 },
  { src: "whoosh", at: DEAD3_END + 0.1, vol: 0.35 },
  { src: "pop", at: DEAD3_END + 66 / 30, vol: 0.3 },
];

export const DEAD3_BEDS: Bed[] = [
  { src: "sfx/drone.wav", from: 0, to: L[13], vol: 0.2, fadeIn: 1.0, fadeOut: 1.0 },
  { src: "smiling1/pad.wav", from: L[13], to: DEAD3_END + 3, vol: 0.4, fadeIn: 1.0, fadeOut: 2.5 },
];
