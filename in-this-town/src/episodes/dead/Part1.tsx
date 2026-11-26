import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import { Cam, clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Brightwater } from "../smiling/Brightwater";
import { Bedroom, Bike, pedal } from "../smiling/Props";
import { ZOMBIES } from "../../lib/cast";
import { DAWSON, HockeyStick, IVY, JONAH, Kitchen } from "./Sets";
import cues from "../../../public/dead1/cues.json";

const L = cues.lines;
export const DEAD1_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? DEAD1_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const Town: React.FC<{ T: number }> = ({ T }) => <Brightwater t={T} theme="dead" tint="eerie" />;
const HOUSE_DOOR_X = -14.4; // Jonah's front door (house at x -18, z 20)

/* Ivy pedalling with Jonah sitting behind her */
const TwoOnBike: React.FC<{ x: number; z: number; rot: number; T: number; jonahLook?: number }> = ({ x, z, rot, T, jonahLook = 0 }) => (
  <>
    <Bike p={[x, 0, z]} rot={rot} t={T} speed={3} />
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Character look={IVY} face="smug" pose={pedal(T)} position={[0, 0.55, -0.1]} rotY={Math.PI} />
      <Character look={JONAH} face="scared" pose={{ sit: true, armL: -1.2, armR: -1.2, headY: jonahLook }} position={[0, 2.5, 1.6]} rotY={Math.PI} />
    </group>
  </>
);

export const DEAD1_SHOTS: Shot[] = [
  /* "On the morning of his twelfth birthday, Jonah woke up…" */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} bird={false} />
        <Character look={JONAH} face={t > 1.6 ? "neutral" : "sleep"} pose={{ lie: true }} position={[-4, 1.95, 0.2]} />
        <Cam from={[-1.4, 5.4, 1.8]} to={[-2.2, 5.0, 0.4]} look={[-4, 2.4, -3.8]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "…and the town was silent." */
  {
    start: mid(0, 0.62),
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} bird={false} />
        <Character look={JONAH} face="worried" pose={{ sit: true, headY: -0.5 + t * 0.2 }} position={[-3.4, 1.4, -2.6]} rotY={Math.PI / 2} />
        <Cam from={[1.6, 4.6, -1]} to={[1.2, 4.5, -1.4]} look={[-3.4, 4.2, -2.6]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "No cars. No birds. No mom calling him for breakfast." */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Cam from={[30, 30, 70]} to={[22, 24, 54]} look={[0, 2, 20]} p={p} fov={48} t={t} linear />
      </>
    ),
  },
  /* "Just a cake on the kitchen table. With one candle. Still burning." */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <Kitchen t={T} />
        <Cam from={[2.4, 5.2, 4]} to={[0.9, 4.2, 1.4]} look={[0, 3.3, -1.6]} p={p} fov={44} t={t} linear />
      </>
    ),
  },
  /* "He stepped outside." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={JONAH} face="worried" pose={walk(t, 6, 0.4)} position={[lerp(HOUSE_DOOR_X - 0.6, HOUSE_DOOR_X + 3, seg(t, 0, 1.4)), 0, 20]} rotY={Math.PI / 2} />
        <Cam from={[-4, 4.6, 25]} to={[-4.6, 4.5, 24]} look={[-12, 3.4, 20]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Every door on the street was wide open." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={JONAH} face="worried" pose={{ headY: Math.sin(t * 1.3) * 0.6 }} position={[-10, 0, 20]} rotY={Math.PI / 2} />
        <Cam from={[3, 3.2, 6]} to={[3, 3.6, 10]} look={[14, 2, 40]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Then he saw Mister Dawson, his neighbor, standing in the middle of the road." */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={JONAH} face="worried" pose={breathe(t)} position={[-8, 0, 20]} rotY={0.6} />
        <Character look={DAWSON} pose={{ armL: -0.2, armR: -0.1, headZ: Math.sin(T * 1.4) * 0.15 }} position={[0.5 + Math.sin(T * 1.4) * 0.15, 0, 36]} rotY={0} />
        <Cam from={[-10.5, 5.6, 14.5]} to={[-10.2, 5.5, 15.5]} look={[0, 3.2, 36]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Back turned. Swaying." */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={DAWSON} pose={{ armL: -0.2, armR: -0.1, headZ: Math.sin(T * 1.4) * 0.2 }} position={[0.5 + Math.sin(T * 1.4) * 0.2, 0, 36]} rotY={Math.sin(T * 1.4) * 0.08} />
        <Cam from={[-1.2, 4.4, 30.5]} to={[-1.0, 4.4, 31.6]} look={[0.5, 4.0, 36]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "'Mister Dawson?' Jonah called." */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={JONAH} face="worried" pose={{ ...breathe(t), armR: -0.4 }} position={[-8, 0, 20]} rotY={0.6} />
        <Cam from={[-5.6, 4.9, 24.2]} to={[-5.8, 4.85, 23.6]} look={[-8, 4.5, 20]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Mister Dawson turned around." */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={DAWSON} pose={{ armL: -0.2, armR: -0.1, headZ: 0.15 }} position={[0.5, 0, 36]} rotY={lerp(0, Math.PI + 0.3, ease(seg(t, 0.1, 1.2)))} />
        <Cam from={[-3, 4.2, 26]} to={[-2.6, 4.2, 27.4]} look={[0.5, 3.8, 36]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Half of his face… was gone." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={DAWSON} pose={{ armL: -0.4, armR: -0.3, headZ: 0.2, headX: 0.1 }} position={[0.5, 0, 36]} rotY={Math.PI + 0.3} />
        <Cam from={[-0.9, 4.8, 31.6]} to={[-0.6, 4.75, 32.4]} look={[0.5, 4.6, 36]} p={p} fov={36} t={t} shake={t < 0.3 ? 0.06 : 0} />
      </>
    ),
  },
  /* "Jonah ran." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Character look={JONAH} face="scared" pose={walk(t, 13, 1)} position={[-3, 0, 22 - t * 7]} rotY={Math.PI} />
        <Character look={DAWSON} pose={{ ...walk(t, 5, 0.4), armL: -1.5, armR: -1.4 }} position={[0, 0, 33 - t * 2.5]} rotY={Math.PI} />
        <Cam from={[-3, 4.6, 6]} to={[-3, 4.4, 4]} look={[-3, 3, 22]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Behind him, more doors creaked. More shapes stumbled out." */
  {
    start: mid(10, 0.32),
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        {[
          [14.4, 32, -Math.PI / 2],
          [-14.4, 44, Math.PI / 2],
          [14.4, 8, -Math.PI / 2],
        ].map(([x, z, r], i) => (
          <Character key={i} look={ZOMBIES[i + 1]} pose={{ ...walk(t + i, 4.5, 0.4), armL: -1.4, armR: -1.3 }} position={[x + Math.sign(-x) * t * 1.5, 0, z]} rotY={r} />
        ))}
        <Cam from={[4, 3.8, 22]} to={[3, 3.8, 24]} look={[12, 3, 32]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "He tripped. They were right behind him." */
  {
    start: L[11],
    render: ({ t, p, T }) => {
      const f = ease(seg(t, 0, 0.4));
      return (
        <>
          <Town T={T} />
          <Character look={JONAH} face="scared" pose={{ lean: 1.35 * f, armL: -2.6 * f, armR: -2.4 * f }} position={[-3, 0.4 * f, 6 - f * 1.2]} rotY={Math.PI} />
          {[0, 1, 2].map((i) => (
            <Character key={i} look={ZOMBIES[i]} pose={{ ...walk(t + i, 4.5, 0.4), armL: -1.5, armR: -1.4 }} position={[-5 + i * 2.5, 0, 13 - t * 1.6]} rotY={Math.PI} />
          ))}
          <Cam from={[-1.2, 0.9, -2]} to={[-1.4, 0.9, -1.4]} look={[-3, 2.5, 9]} p={p} fov={52} t={t} shake={t < 0.5 ? 0.05 : 0} />
        </>
      );
    },
  },
  /* "Then a hockey stick swung right past his head." */
  {
    start: L[12],
    render: ({ t, p, T }) => {
      const sw = ease(seg(t, 0.25, 0.6));
      const hit = t > 0.55;
      return (
        <>
          <Town T={T} />
          <Bike p={[lerp(-12, -4.8, seg(t, 0, 0.5)), 0, 8]} rot={Math.PI / 2} t={T} speed={3} />
          <group position={[lerp(-12, -4.8, seg(t, 0, 0.5)), 0, 8]} rotation={[0, Math.PI / 2, 0]}>
            <Character look={IVY} face="smug" pose={{ ...pedal(T), armR: lerp(-2.6, -0.6, sw), armRz: lerp(0, -1.2, sw) }} position={[0, 0.55, -0.1]} rotY={Math.PI} />
          </group>
          <Character look={ZOMBIES[0]} pose={hit ? { lean: -1.2 * seg(t, 0.55, 0.9) } : { armL: -1.5, armR: -1.4 }} position={[-3, 0, 10.5]} rotY={Math.PI} />
          <group position={[lerp(-12, -4.8, seg(t, 0, 0.5)) + 1.4, 3.6, 8]} rotation={[0, 0, lerp(1.3, -1.0, sw)]}>
            <HockeyStick r={[Math.PI / 2, 0, 0]} />
          </group>
          <Cam from={[2.5, 2.2, 3]} to={[2.2, 2.2, 3.4]} look={[-4, 3, 9]} p={p} fov={50} t={t} shake={hit && t < 0.8 ? 0.08 : 0} />
        </>
      );
    },
  },
  /* "A girl on a bike. Mud on her face. Fire in her eyes." */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Bike p={[-4.8, 0, 8]} rot={Math.PI / 2} t={0} />
        <group position={[-4.8, 0, 8]} rotation={[0, Math.PI / 2, 0]}>
          <Character look={IVY} face="smug" pose={{ ...pedal(0), armR: -0.3, headY: 0.8 }} position={[0, 0.55, -0.1]} rotY={Math.PI} />
        </group>
        <Cam from={[-4.0, 2.4, 3.2]} to={[-4.2, 2.6, 3.8]} look={[-4.8, 5.8, 8]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "'Get on,' she said. 'And don't scream. They follow sound.'" */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Town T={T} />
        <Bike p={[-4.8, 0, 8]} rot={Math.PI / 2} t={0} />
        <group position={[-4.8, 0, 8]} rotation={[0, Math.PI / 2, 0]}>
          <Character look={IVY} face="neutral" pose={{ ...pedal(0), armL: -1.6, headY: 0.9 }} position={[0, 0.55, -0.1]} rotY={Math.PI} />
        </group>
        <Character look={JONAH} face="scared" pose={{ armR: -1.4 }} position={[-3.2, 0, 5.6]} rotY={-0.6} />
        <Cam from={[-0.6, 5.2, 2.2]} to={[-0.9, 5.0, 2.8]} look={[-4.6, 4.0, 7.4]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "As they rode away, Jonah looked back at his house." */
  {
    start: L[15],
    render: ({ t, p, T }) => {
      const z = 2 - t * 7;
      return (
        <>
          <Town T={T} />
          <TwoOnBike x={-3} z={z} rot={Math.PI} T={T} jonahLook={lerp(0, 2.2, ease(seg(t, 0.4, 1.4)))} />
          <Cam from={[-1.5, 5.4, z - 8]} to={[-1.8, 5.2, z - 7]} look={[-3, 3.8, z]} p={p} fov={44} t={t} />
        </>
      );
    },
  },
  /* "In the kitchen window…" */
  {
    start: L[16],
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} theme="dead" tint="eerie" />
        <pointLight position={[-14, 3.6, 22.4]} intensity={6} color="#ffb04a" distance={4} decay={2} />
        <Cam from={[-2, 4.2, 26]} to={[-6.5, 3.9, 23.6]} look={[-14.4, 3.4, 22.4]} p={p} fov={40} t={t} linear />
      </>
    ),
  },
  /* "…someone was blowing out his candle." */
  {
    start: mid(16, 0.45),
    render: ({ t, p, T }) => {
      const out = seg(t, 1.0, 1.25);
      return (
        <>
          <Kitchen t={T} dark flame={1 - out} />
          <Character look={{ ...ZOMBIES[3], skin: "#1a1d22", shirt: "#101114", pants: "#0d0e10" }} pose={{ lean: 0.35, armL: -0.4 }} position={[0, 0, 1.4]} rotY={Math.PI} />
          <Cam from={[1.8, 4.6, 4.6]} to={[1.5, 4.5, 4.0]} look={[0, 3.6, -1.6]} p={p} fov={44} t={t} />
        </>
      );
    },
  },
];

export const DEAD1_SFX: Sfx[] = [
  { src: "boom", at: L[9] + 0.05, vol: 0.45 },
  { src: "creak", at: mid(10, 0.35), vol: 0.35 },
  { src: "thud", at: L[11] + 0.3, vol: 0.5 },
  { src: "whip", at: L[12] + 0.3, vol: 0.4 },
  { src: "thud", at: L[12] + 0.6, vol: 0.5 },
  { src: "whoosh", at: DEAD1_END + 0.1, vol: 0.35 },
  { src: "pop", at: DEAD1_END + 66 / 30, vol: 0.3 },
];

export const DEAD1_BEDS: Bed[] = [
  { src: "sfx/drone.wav", from: 0, to: DEAD1_END + 3, vol: 0.2, fadeIn: 1.5, fadeOut: 2.5 },
];
