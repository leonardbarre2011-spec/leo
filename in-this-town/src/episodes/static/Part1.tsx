import React from "react";
import { Character, walk } from "../../lib/Character";
import { clamp01, lerp } from "../../lib/Cam";
import { Cam } from "./CamS";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { B } from "../../lib/Sets";
import { Bedroom, Bike, pedal } from "../smiling/Props";
import { Ash, Faceless, Flashlight, GRAY, LENA, Millbrook, SAM, THEO, TOBY, TobyRoom, Walkie, Woods } from "./Sets";
import cues from "../../../public/static1/cues.json";

const L = cues.lines;
export const STATIC1_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? STATIC1_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export const STATIC1_SHOTS: Shot[] = [
  /* "In the summer of 1985, in a town called Millbrook," */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <Millbrook t={T} dusk />
        <Cam from={[40, 40, 90]} to={[28, 28, 70]} look={[0, 2, 30]} p={p} fov={48} t={t} linear />
      </>
    ),
  },
  /* "…a boy named Toby vanished on his bike ride home." */
  {
    start: mid(0, 0.55),
    render: ({ t, p, T }) => {
      const z = 40 - t * 7;
      return (
        <>
          <Millbrook t={T} dusk />
          <Bike p={[2.5, 0, z]} rot={Math.PI} t={T} speed={3} />
          <group position={[2.5, 0, z]} rotation={[0, Math.PI, 0]}>
            <Character look={TOBY} face="smile" pose={pedal(T)} position={[0, 0.55, 0.55]} />
          </group>
          <Cam from={[-3, 4, z - 14]} to={[-2.4, 4, z - 12]} look={[2.5, 2.6, z]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* "His friends searched the woods for three days." */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <Woods t={T} />
        {[SAM, LENA, THEO].map((lk, i) => (
          <React.Fragment key={i}>
            <Character look={lk} face="worried" pose={{ ...walk(t + i, 5, 0.4), armR: -1.3 }} position={[-3 + i * 3, 0, 6 - t * 1.4 + i]} rotY={Math.PI + (i - 1) * 0.3} scale={0.85} />
            <Flashlight p={[-3 + i * 3 + 1.1, 2.6, 6 - t * 1.4 + i - 0.9]} r={[0, Math.PI + (i - 1) * 0.3, 0]} />
          </React.Fragment>
        ))}
        <Cam from={[2, 5, -8]} to={[1.6, 4.8, -6.6]} look={[0, 2.5, 6]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "They found his bike." */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <Woods t={T} day />
        <group rotation={[0, 0, Math.PI / 2 - 0.08]} position={[0, 0.2, 0]}>
          <Bike p={[0, 0, 0]} rot={0.4} t={0} />
        </group>
        <Cam from={[4.5, 3.4, 4]} to={[3.6, 2.8, 3.2]} look={[-0.4, 0.4, 0]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "His backpack." */
  {
    start: mid(2, 0.42),
    render: ({ t, p, T }) => (
      <>
        <Woods t={T} day />
        <B s={[1.3, 1.5, 0.7]} p={[2, 0.45, -2]} r={[-1.2, 0.4, 0]} c="#2f6fd6" />
        <B s={[0.8, 0.5, 0.1]} p={[2, 0.85, -1.8]} r={[-1.2, 0.4, 0]} c="#1f4fa6" />
        <Cam from={[4.4, 2.6, 0.6]} to={[3.8, 2.2, 0]} look={[2, 0.5, -2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "And one shoe." */
  {
    start: mid(2, 0.72),
    render: ({ t, p, T }) => (
      <>
        <Woods t={T} day />
        <B s={[0.5, 0.18, 1.1]} p={[-1.5, 0.1, 2]} r={[0, 0.7, 0.4]} c="#efefef" />
        <B s={[0.5, 0.35, 0.7]} p={[-1.45, 0.3, 1.9]} r={[0, 0.7, 0.4]} c="#e8e8e8" />
        <Cam from={[0.2, 1.4, 4.2]} to={[-0.2, 1.1, 3.6]} look={[-1.5, 0.2, 2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "But no Toby." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <Woods t={T} />
        <Cam from={[0, 3, 14]} to={[0, 3.4, 8]} look={[0, 3, -30]} p={p} fov={50} t={t} linear />
      </>
    ),
  },
  /* "On the fourth night, Sam's walkie-talkie crackled." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Character look={SAM} face="sleep" pose={{ lie: true }} position={[-4, 1.95, 0.2]} scale={0.9} />
        <Walkie p={[3.2, 2.55, -4.6]} r={[0, -0.4, 0]} led={Math.floor(T * 6) % 2 ? 1 : 0.2} />
        <Cam from={[3.2, 6.4, 5]} to={[2.6, 6.0, 4]} look={[-2.6, 2.2, -2.4]} p={p} fov={56} t={t} />
      </>
    ),
  },
  /* "Channel nine. The one only Toby used." */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Walkie p={[3.2, 2.55, -4.6]} r={[0, -0.4, 0]} led={Math.floor(T * 6) % 2 ? 1 : 0.2} />
        <pointLight position={[3.6, 3.6, -3.4]} intensity={6} color="#8aff8a" distance={4} decay={2} />
        <Cam from={[2.6, 4.2, 0.8]} to={[2.8, 4.0, 0.2]} look={[3.25, 3.4, -4.5]} p={p} fov={30} t={t} />
      </>
    ),
  },
  /* "'Sam… can you hear me?'" */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Character look={SAM} face={t > 0.5 ? "scared" : "sleep"} pose={{ sit: true, headY: lerp(0, -0.6, seg(t, 0.4, 1)) }} position={[-3.6, 1.4, -1.8]} rotY={Math.PI / 2} scale={0.9} />
        <Cam from={[1.4, 5, 2.2]} to={[1.0, 4.9, 1.6]} look={[-3.6, 3.6, -1.8]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "It was Toby's voice." */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Character look={SAM} face="scared" pose={{ sit: true, headY: -0.6 }} position={[-3.6, 1.4, -1.8]} rotY={Math.PI / 2} scale={0.9} />
        <Cam from={[-0.6, 4.6, -1.2]} to={[-0.9, 4.55, -1.4]} look={[-3.6, 4.0, -1.8]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "'Where are you?' Sam whispered." */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Character look={SAM} face="worried" pose={{ sit: true, armR: -2.4, armRz: 0.5 }} position={[-3.6, 1.4, -1.8]} rotY={Math.PI / 2} scale={0.9} />
        <Walkie p={[-2.5, 4.0, -1.5]} r={[0, Math.PI / 2, 0]} s={0.7} led={1} />
        <Cam from={[-0.4, 4.6, -0.6]} to={[-0.7, 4.55, -0.9]} look={[-3.2, 4.0, -1.8]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "'I'm home. In my room. But everything is gray…'" */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Character look={TOBY} face="scared" pose={{ sit: true, armR: -2.4, armRz: 0.5 }} position={[-4.2, 1.4, 3.6]} rotY={2.4} scale={0.9} />
        <Walkie p={[-3.4, 3.9, 3.2]} r={[0, 2.4, 0]} s={0.7} led={1} />
        <Cam from={[0.6, 5.0, 0.4]} to={[0.2, 4.9, 0.9]} look={[-4.2, 3.4, 3.6]} p={p} fov={46} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "…and it's snowing ash." */
  {
    start: mid(9, 0.62),
    render: ({ t, p, T }) => (
      <>
        <Millbrook t={T} bright />
        <Ash t={T} dir={-1} center={[0, 2, 18]} spread={14} count={140} />
        <Cam from={[2, 4, 8]} to={[2, 4.5, 9]} look={[0, 4, 30]} p={p} fov={50} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "Sam ran to Toby's house." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <Millbrook t={T} />
        <Character look={SAM} face="worried" pose={walk(t, 13, 1)} position={[6, 0, 34 - t * 6]} rotY={Math.PI} scale={0.9} />
        <Cam from={[3, 4, 18]} to={[3.4, 4, 19.5]} look={[6, 3, 32]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "The room was empty. The bed was made." */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} flash />
        <Cam from={[3, 5.4, 5]} to={[2.2, 5.0, 4]} look={[-3, 2, -2.6]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "But the walkie-talkie was still talking." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} flash walkieLed={1} />
        <Cam from={[-1.8, 4.0, 1.4]} to={[-2.2, 3.6, 0.6]} look={[-3.2, 1.9, -1.2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "'Sam… I can see you.'" – Sam alone in the real room */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} flash walkieLed={1} />
        <Character look={SAM} face="scared" pose={{ headY: Math.sin(t * 1.6) * 0.7, armR: -1.2 }} position={[0.5, 0, 0]} rotY={Math.PI} scale={0.9} />
        <Cam from={[1.6, 5.2, 4.8]} to={[1.4, 5.0, 4.2]} look={[0.5, 3.6, 0]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "'You're standing right next to me.'" – same framing, the gray side: Toby beside an empty spot */
  {
    start: mid(13, 0.5),
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Character look={TOBY} face="worried" pose={{ headY: -0.5, armR: -1.2 }} position={[-1.6, 0, 0.2]} rotY={Math.PI - 0.6} scale={0.9} />
        <Cam from={[1.6, 5.2, 4.8]} to={[1.4, 5.0, 4.2]} look={[0.5, 3.6, 0]} p={p} fov={44} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "Then the static changed." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} flash walkieLed={1} walkieRed />
        <Cam from={[-2.4, 3.2, 0.2]} to={[-2.7, 2.8, -0.4]} look={[-3.2, 1.9, -1.2]} p={p} fov={38} t={t} shake={0.02} />
      </>
    ),
  },
  /* "Something else was breathing on channel nine." */
  {
    start: L[15],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Faceless p={[4.6, 0, -4.6]} rotY={-0.8} t={T} lean={0.15 + Math.sin(T * 1.2) * 0.05} />
        <Cam from={[0, 4.4, 4]} to={[0.6, 4.6, 3]} look={[4.6, 5, -4.6]} p={p} fov={48} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "'Toby,' Sam said slowly. 'Who's with you?'" */
  {
    start: L[16],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} flash walkieLed={1} walkieRed />
        <Character look={SAM} face="scared" pose={{ armR: -2.2, armRz: 0.4 }} position={[0.5, 0, 0]} rotY={Math.PI} scale={0.9} />
        <Cam from={[0.9, 4.7, 3.6]} to={[0.8, 4.6, 3.0]} look={[0.5, 3.9, 0]} p={p} fov={40} t={t} />
      </>
    ),
  },
];

export const STATIC1_SFX: Sfx[] = [
  { src: "static", at: L[4] + 0.2, vol: 0.25 },
  { src: "static", at: L[6] - 0.2, vol: 0.15 },
  { src: "static", at: L[12], vol: 0.2 },
  { src: "static", at: L[14], vol: 0.35 },
  { src: "breath", at: L[15] - 0.1, vol: 0.45 },
  { src: "whoosh", at: STATIC1_END + 0.1, vol: 0.35 },
  { src: "pop", at: STATIC1_END + 66 / 30, vol: 0.3 },
];

export const STATIC1_BEDS: Bed[] = [
  { src: "sfx/synth.wav", from: 0, to: L[4], vol: 0.3, fadeIn: 0.5, fadeOut: 1.0 },
  { src: "sfx/drone.wav", from: L[4] - 0.5, to: STATIC1_END + 3, vol: 0.18, fadeIn: 1.0, fadeOut: 2.5 },
  { src: "sfx/bass.wav", from: L[9], to: STATIC1_END + 3, vol: 0.25, fadeIn: 1.0, fadeOut: 2.5 },
];
