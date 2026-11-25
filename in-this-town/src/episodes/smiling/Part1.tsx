import React from "react";
import { Character, breathe, walk, wave } from "../../lib/Character";
import { Cam, clamp01, ease, easeOut, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Bird, birdOnLoop, Brightwater, Bus, ControlRoom, Dog } from "./Brightwater";
import { MILO, NEIGHBOR, TOWNSFOLK, WATCHER } from "./cast";

type V3 = [number, number, number];
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// where the bird is on its loop (two identical passes, then a fast "counting" loop)
const birdU = (T: number) => (T < 22.08 ? (T - 16.76) / 4.16 : (T - 22.08) / 4.2);
const LoopBird: React.FC<{ T: number; u?: number; s?: number }> = ({ T, u, s = 1.4 }) => {
  const b = birdOnLoop(u ?? birdU(T));
  return <Bird p={b.p} heading={b.heading} flap={Math.sin(T * 22) * 0.7} s={s} />;
};

/* the three "bird" angles, reused identically for the second pass */
const bakeryShot = (start: number): Shot => ({
  start,
  render: ({ t, p, T }) => (
    <>
      <Brightwater t={T} />
      <LoopBird T={T} />
      <Cam from={[-3, 3.2, 12]} to={[-3.6, 3.4, 11]} look={mix3([-13, 9, -4], birdOnLoop(birdU(T)).p, 0.6)} p={p} fov={50} t={t} />
    </>
  ),
});
const towerShot = (start: number): Shot => ({
  start,
  render: ({ t, p, T }) => (
    <>
      <Brightwater t={T} />
      <LoopBird T={T} />
      <Cam from={[5, 4, 0]} to={[5.5, 4.2, -1]} look={mix3([0, 13, -18], birdOnLoop(birdU(T)).p, 0.5)} p={p} fov={50} t={t} />
    </>
  ),
});
const treesShot = (start: number): Shot => ({
  start,
  render: ({ t, p, T }) => (
    <>
      <Brightwater t={T} />
      <LoopBird T={T} />
      <Cam from={[4, 3.5, -8]} to={[4.6, 3.5, -9]} look={mix3([18, 7, -30], birdOnLoop(Math.min(birdU(T), 0.9)).p, 0.5)} p={p} fov={46} t={t} />
    </>
  ),
});

const MILO_SPOT: V3 = [4, 0, -2];

export const PART1_SHOTS: Shot[] = [
  /* "In this town," – aerial over the perfect town */
  {
    start: 0,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={7} clockMin={50} />
        <Cam from={[46, 48, 78]} to={[30, 34, 56]} look={[0, 4, 4]} lookTo={[0, 6, -6]} p={p} fov={48} t={t} linear />
      </>
    ),
  },
  /* "everyone knows your name, even people you've never met." – everybody waves at Milo */
  {
    start: 1.91,
    render: ({ t, p, T }) => {
      const z = 31 - t * 2.4;
      return (
        <>
          <Brightwater t={T} clockHour={7} clockMin={51} />
          <Character look={MILO} face="smile" pose={walk(t, 7, 0.5)} position={[6, 0, z]} rotY={Math.PI} />
          <Character look={TOWNSFOLK[0]} face="smile" pose={wave(t)} position={[-6, 0, 24]} rotY={Math.PI / 2 + 0.3} />
          <Character look={TOWNSFOLK[1]} face="smile" pose={wave(t + 0.4, "L")} position={[11, 0, 22]} rotY={-Math.PI / 2 - 0.4} />
          <Character look={TOWNSFOLK[2]} face="smile" pose={wave(t + 0.8)} position={[-3, 0, 20]} rotY={0.6} />
          <Character look={TOWNSFOLK[3]} face="smile" pose={wave(t + 1.2, "L")} position={[11, 0, 34]} rotY={-Math.PI / 2 - 0.6} />
          <Cam from={[3.5, 5, 17]} to={[3.8, 5, 18.5]} look={[5, 3.6, 27]} p={p} fov={52} t={t} />
        </>
      );
    },
  },
  /* "Milo was 12." */
  {
    start: 3.4,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={7} clockMin={52} />
        <Character look={MILO} face="smile" pose={{ ...breathe(t), ...wave(t, "L"), headZ: 0.08 }} position={[6, 0, 24]} rotY={Math.PI} />
        <Cam from={[4.6, 5.0, 16.4]} to={[4.9, 4.9, 17.6]} look={[6, 3.8, 24]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Every morning, the same neighbor waved." */
  {
    start: 4.56,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={7} clockMin={54} />
        <Character look={NEIGHBOR} face="smile" pose={wave(t)} position={[11.5, 0, 20]} rotY={-Math.PI / 2} />
        <Character look={MILO} face="smile" pose={walk(t, 7, 0.5)} position={[6, 0, 23 - t * 2]} rotY={Math.PI} />
        <Cam from={[-1.5, 4.2, 12]} to={[-0.8, 4.2, 13.2]} look={[9, 3, 20]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Morning, Milo!" */
  {
    start: 6.24,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={7} clockMin={55} />
        <Character look={NEIGHBOR} face="smile" pose={{ ...wave(t, "L"), headZ: 0.1 }} position={[11.5, 0, 20]} rotY={-Math.PI / 2} />
        <Cam from={[7.2, 5.0, 18.4]} to={[7.7, 4.95, 18.8]} look={[11.5, 4.5, 20]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "Every morning, the same dog" */
  {
    start: 7.32,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={7} clockMin={56} />
        <Dog p={[11, 0, 32]} rot={-Math.PI / 2} t={T} />
        <Character look={MILO} face="smile" pose={walk(t, 7, 0.5)} position={[6, 0, 37 - t * 2]} rotY={Math.PI} />
        <Cam from={[1.5, 3.2, 27]} to={[2.2, 3.1, 28]} look={[9.5, 2, 32.5]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "barked. Twice." */
  {
    start: 8.4,
    render: ({ t, p, T }) => {
      const bark = Math.max(0, 1 - Math.abs(t - 0.1) * 7) + Math.max(0, 1 - Math.abs(t - 0.55) * 7);
      return (
        <>
          <Brightwater t={T} clockHour={7} clockMin={57} />
          <Dog p={[11, 0, 32]} rot={-Math.PI / 2} t={T} bark={Math.min(1, bark)} />
          <Cam from={[5.4, 3.0, 30.4]} to={[5.9, 2.9, 30.8]} look={[10.5, 2.2, 32.2]} p={p} fov={40} t={t} shake={bark > 0.5 ? 0.04 : 0} />
        </>
      );
    },
  },
  /* "Every morning, the same bus arrived" */
  {
    start: 9.68,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={7} clockMin={59} />
        <Bus p={[2, 0, lerp(80, 27, easeOut(seg(t, 0, 1.5)))]} />
        <Character look={MILO} face="smile" pose={breathe(t)} position={[6.6, 0, 30]} rotY={-Math.PI / 2 + 0.5} />
        <Cam from={[8.5, 3.4, 16]} to={[8.2, 3.4, 16.8]} look={[3, 2.8, 30]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "at exactly eight o'clock." – the clock snaps to 8:00 */
  {
    start: 11.3,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} clockHour={t < 0.52 ? 7 : 8} clockMin={t < 0.52 ? 59 : 0} />
        <Cam from={[0, 12, -8.8]} to={[0, 12, -10.6]} look={[0, 12, -15.4]} p={p} fov={40} t={t} shake={t > 0.52 && t < 0.7 ? 0.05 : 0} />
      </>
    ),
  },
  /* "Milo thought it was the happiest town in the world." */
  {
    start: 12.68,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Character look={MILO} face="smile" pose={walk(t, 6, 0.5)} position={[4, 0, lerp(7, 0, t / 2.1)]} rotY={Math.PI} />
        <Character look={TOWNSFOLK[4]} face="smile" pose={wave(t)} position={[-4, 0, -4]} rotY={0.8} />
        <Character look={TOWNSFOLK[0]} face="smile" pose={breathe(t)} position={[-7, 0, -1]} rotY={1.2} />
        <Character look={TOWNSFOLK[1]} face="smile" pose={wave(t + 1, "L")} position={[9, 0, -6]} rotY={-0.9} />
        <Cam from={[16, 9, 16]} to={[13, 7.5, 12]} look={[2, 3, -6]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Until one day…" – Milo stops */
  {
    start: 14.76,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} tint="eerie" />
        <Character look={MILO} face="neutral" pose={breathe(t)} position={MILO_SPOT} rotY={Math.PI} />
        <Cam from={[3.4, 5.0, -6.8]} to={[3.6, 4.9, -6.0]} look={[4, 4.5, -2]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "he looked up." */
  {
    start: 15.9,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} tint="eerie" />
        <Character look={MILO} face="neutral" pose={{ headX: -0.6 * ease(seg(t, 0, 0.5)) }} position={MILO_SPOT} rotY={Math.PI} />
        <Cam from={[3.0, 2.4, -8.6]} to={[3.1, 2.3, -8.2]} look={[4, 5.6, -2]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "A bird flew over the bakery," */
  bakeryShot(16.76),
  /* "turned left at the clock tower," */
  towerShot(18.04),
  /* "then disappeared behind the trees." */
  treesShot(19.32),
  /* "Twelve seconds later…" – Milo, puzzled */
  {
    start: 20.92,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} tint="eerie" />
        <Character look={MILO} face="worried" pose={{ headX: -0.35, headY: -0.3 + t * 0.2 }} position={MILO_SPOT} rotY={Math.PI} />
        <Cam from={[3.6, 4.6, -5.6]} to={[3.7, 4.6, -5.0]} look={[4, 4.8, -2]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* the exact same three angles, again */
  bakeryShot(22.08),
  towerShot(23.48),
  treesShot(24.68),
  /* "Milo counted. Again. And again." */
  {
    start: 26.28,
    render: ({ t, p, T }) => {
      const u = ((T - 26.28) / 1.9) % 1;
      return (
        <>
          <Brightwater t={T} tint="eerie" />
          <LoopBird T={T} u={u} s={1.8} />
          <Character
            look={MILO}
            face="worried"
            pose={{ headX: -0.5, headY: Math.sin(u * Math.PI * 2) * 0.4, armR: -2.4 + Math.sin(t * 5) * 0.1, armL: 0 }}
            position={MILO_SPOT}
            rotY={Math.PI}
          />
          <Cam from={[7.6, 3.2, 7.5]} to={[7.3, 3.3, 6.5]} look={[-2, 13, -18]} p={p} fov={58} t={t} />
        </>
      );
    },
  },
  /* "Same bird. Same path." – the loop from above */
  {
    start: 28.3,
    render: ({ t, p, T }) => {
      const u = ((T - 28.3) / 1.45) % 1;
      return (
        <>
          <Brightwater t={T} tint="eerie" />
          <LoopBird T={T} u={u} s={3.5} />
          <Cam from={[-2, 80, 22]} to={[-2, 70, 16]} look={[0, 0, -12]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* "Every twelve seconds." */
  {
    start: 29.76,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} tint="eerie" />
        <Character look={MILO} face="scared" pose={{ headX: -0.25 }} position={MILO_SPOT} rotY={Math.PI} />
        <Cam from={[3.7, 4.9, -6.6]} to={[3.8, 4.85, -5.8]} look={[4, 4.6, -2]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* "Then the bird stopped in the air… and fell." */
  {
    start: 31.0,
    render: ({ t, p, T }) => {
      const frozen = t > 0.55;
      const fall = seg(t, 1.45, 1.96);
      return (
        <>
          <Brightwater t={T} tint="eerie" />
          <Bird
            p={[4 + (frozen ? 0 : Math.sin(t * 3) * 0.6), lerp(11, -2, fall * fall), -7]}
            heading={Math.PI * 0.1}
            flap={frozen ? 0.35 : Math.sin(T * 22) * 0.7}
            pitch={fall * 2.5}
            s={1.6}
          />
          <Cam from={[5.2, 2.6, 0.5]} to={[5.0, 2.5, 0.2]} look={[4, 9.5, -7]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  /* "It landed right at his feet." */
  {
    start: 32.96,
    render: ({ t, p, T }) => {
      const k = seg(t, 0, 0.35);
      return (
        <>
          <Brightwater t={T} tint="eerie" />
          <Character look={MILO} face="scared" pose={{ headX: 0.5 }} position={MILO_SPOT} rotY={Math.PI} />
          <group position={[4, lerp(6, 0.5, k * k), -3.8]} rotation={[0, 0.6, k >= 1 ? Math.PI / 2 : k * 3]}>
            <Bird p={[0, 0, 0]} flap={0.35} s={1} />
          </group>
          <Cam from={[0.6, 1.5, -9.6]} to={[0.9, 1.4, -9.1]} look={[4, 1.6, -3]} p={p} fov={50} t={t} shake={t > 0.35 && t < 0.5 ? 0.05 : 0} />
        </>
      );
    },
  },
  /* "Milo picked it up, and inside its eye," */
  {
    start: 34.36,
    render: ({ t, p, T }) => {
      const k = ease(seg(t, 0.3, 1.2));
      return (
        <>
          <Brightwater t={T} tint="eerie" />
          <Character look={MILO} face="worried" pose={{ armL: -1.3 * k, armR: -1.3 * k, headX: lerp(0.6, 0.35, k), lean: 0.3 * (1 - k) }} position={[4, 0, -2]} rotY={Math.PI} />
          <group position={mix3([4, 0.5, -3.8], [4, 3.0, -3.7], k)} rotation={[0, Math.PI, lerp(Math.PI / 2, 0, k)]}>
            <Bird p={[0, 0, 0]} flap={0.35} s={0.9} />
          </group>
          <Cam from={[5.4, 4.6, -10]} to={[5.0, 4.4, -9]} look={[4, 3.2, -2.6]} p={p} fov={44} t={t} />
        </>
      );
    },
  },
  /* "a tiny red light was blinking." – extreme close-up on the eye */
  {
    start: 36.42,
    render: ({ t, p, T }) => {
      const on = t > 0.6 ? (Math.floor((t - 0.6) / 0.35) % 2 === 0 ? 1 : 0.05) : 0;
      return (
        <>
          <Brightwater t={T} tint="eerie" />
          <Bird p={[4, 3.0, -3.7]} heading={0} flap={0.35} red={on} s={1} />
          <Cam from={[7.6, 3.9, -1.4]} to={[6.3, 3.6, -2.3]} look={[4.38, 3.42, -2.8]} p={p} fov={28} t={t} />
        </>
      );
    },
  },
  /* "Somewhere far away… someone whispered:" */
  {
    start: 38.2,
    render: ({ t, p }) => (
      <>
        <ControlRoom t={t} />
        <Character look={WATCHER} pose={{ sit: true, armL: -1.2, armR: -1.2 }} position={[0, 1.4, 0.2]} rotY={Math.PI} />
        <Cam from={[2.6, 5.2, 7]} to={[1.6, 4.8, 4.8]} look={[0, 4, -6]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "He found one." */
  {
    start: 40.38,
    render: ({ t, p }) => (
      <>
        <ControlRoom t={t + 3} />
        <Character look={WATCHER} pose={{ sit: true, armL: -1.2, armR: -1.2, headY: -0.25 * ease(seg(t, 0.1, 0.7)) }} position={[0, 1.4, 0.2]} rotY={Math.PI} />
        <Cam from={[1.8, 5.4, 2.6]} to={[1.5, 5.3, 2.0]} look={[0, 4.6, -3]} p={p} fov={44} t={t} />
      </>
    ),
  },
];

export const PART1_VOICE_END = 41.4;

export const PART1_SFX: Sfx[] = [
  { src: "smiling1/bark.wav", at: 8.45, vol: 0.5 },
  { src: "smiling1/bark.wav", at: 8.92, vol: 0.5 },
  { src: "smiling1/bus.wav", at: 9.7, vol: 0.45 },
  { src: "smiling1/bell.wav", at: 11.84, vol: 0.7 },
  { src: "whoosh", at: 17.2, vol: 0.12 },
  { src: "whoosh", at: 22.5, vol: 0.12 },
  { src: "smiling1/freeze.wav", at: 31.55, vol: 0.35 },
  { src: "whoosh", at: 32.4, vol: 0.2 },
  { src: "thud", at: 33.28, vol: 0.45 },
  { src: "smiling1/beep.wav", at: 37.02, vol: 0.25 },
  { src: "whoosh", at: PART1_VOICE_END + 0.1, vol: 0.35 },
  { src: "pop", at: PART1_VOICE_END + 66 / 30, vol: 0.3 },
];

export const PART1_BEDS: Bed[] = [
  { src: "smiling1/pad.wav", from: 0, to: 14.9, vol: 0.55, fadeIn: 0.3, fadeOut: 0.6 },
  { src: "smiling1/bells.wav", from: 0, to: 14.9, vol: 0.45, fadeIn: 0.3, fadeOut: 0.6 },
  { src: "smiling1/chirps.wav", from: 0, to: 15.5, vol: 0.35 },
  { src: "sfx/drone.wav", from: 14.76, to: PART1_VOICE_END + 3, vol: 0.18, fadeIn: 1.5, fadeOut: 2.5 },
  { src: "smiling1/hum.wav", from: 38.2, to: PART1_VOICE_END, vol: 0.3, fadeIn: 0.3, fadeOut: 0.3 },
];
