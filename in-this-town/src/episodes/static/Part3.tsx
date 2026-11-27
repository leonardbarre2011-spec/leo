import React from "react";
import { Character, walk } from "../../lib/Character";
import { clamp01, ease, lerp } from "../../lib/Cam";
import { Cam } from "./CamS";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Bedroom } from "../smiling/Props";
import { Ash, Faceless, Flashlight, GRAY, LENA, Millbrook, SAM, THEO, TOBY, TOBY_MOM, TobyRoom, Walkie } from "./Sets";
import cues from "../../../public/static3/cues.json";

const L = cues.lines;
export const STATIC3_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? STATIC3_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const Kids: React.FC<{ t: number; face?: "scared" | "worried" }> = ({ t, face = "scared" }) => (
  <>
    <Character look={SAM} face={face} pose={{ headY: Math.sin(t) * 0.2 }} position={[0.8, 0, 1.2]} rotY={-2.2} scale={0.85} />
    <Character look={LENA} face={face} pose={{}} position={[2.0, 0, 2.4]} rotY={-2.4} scale={0.85} />
    <Character look={THEO} face={face} pose={{}} position={[2.8, 0, 0.6]} rotY={-2.0} scale={0.85} />
    <Character look={TOBY} face={face} pose={{}} position={[4.2, 0, 3.6]} rotY={-2.4} scale={0.9} />
  </>
);

export const STATIC3_SHOTS: Shot[] = [
  /* "The faceless thing moved toward the sound of their voices." */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} closet={0.9} />
        <Faceless p={[lerp(-5, -2.6, seg(t, 0, 2.4)), 0, lerp(3.4, 2.4, seg(t, 0, 2.4))]} rotY={Math.PI / 2 - 0.3} t={T} walkT={T} reach={0.6} />
        <Kids t={t} />
        <Cam from={[5.6, 4.6, 6.6]} to={[5.2, 4.4, 6.0]} look={[-2, 4, 2]} p={p} fov={52} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "'It can't see,' Toby whispered. 'It hunts what it hears.'" */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} closet={0.9} />
        <Character look={TOBY} face="scared" pose={{ armR: -2.0, armRz: 0.6 }} position={[4.2, 0, 3.6]} rotY={-2.4} scale={0.9} />
        <Cam from={[1.6, 4.8, 1.2]} to={[1.9, 4.75, 1.5]} look={[4.2, 4.0, 3.6]} p={p} fov={40} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "So Lena did something brave." */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} closet={0.9} />
        <Character look={LENA} face="smug" pose={{ armR: -1.4 }} position={[2.0, 0, 2.4]} rotY={-2.4} scale={0.85} />
        <Cam from={[-0.4, 4.6, 0.2]} to={[-0.1, 4.55, 0.5]} look={[2.0, 3.8, 2.4]} p={p} fov={40} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "She turned her walkie-talkie to full volume," */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Walkie p={[0, 3, 0]} r={[0.2, 0, 0]} s={1.2} led={1} red />
        <Cam from={[0.8, 4.6, 2.4]} to={[0.6, 4.4, 2.0]} look={[0, 3.9, 0]} p={p} fov={38} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "…and threw it out the window." */
  {
    start: mid(3, 0.55),
    render: ({ t, p, T }) => {
      const k = seg(t, 0.1, 0.9);
      return (
        <>
          <TobyRoom t={T} lights={false} ash={1} />
          <Character look={LENA} face="smug" pose={{ armR: lerp(-2.8, -0.8, ease(seg(t, 0, 0.3))) }} position={[3.6, 0, -1.6]} rotY={Math.PI / 2} scale={0.85} />
          <Walkie p={[lerp(4.6, 9, k), 4.4 + Math.sin(k * Math.PI) * 1.5, -1.6]} r={[t * 8, t * 6, 0]} s={0.7} led={1} red />
          <Cam from={[-1, 4.6, 2.4]} to={[-0.6, 4.6, 1.8]} look={[5.6, 4.4, -1.6]} p={p} fov={46} t={t} />
        </>
      );
    },
    filter: GRAY,
  },
  /* "Static exploded across the street." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <Millbrook t={T} bright />
        <Ash t={T} dir={1} center={[0, 0, 22]} spread={16} count={120} />
        <Walkie p={[0, 0.2, 22]} r={[-Math.PI / 2, 0, 0.5]} s={1} led={1} red />
        <Cam from={[2, 2.4, 28]} to={[1.6, 2.0, 27]} look={[0, 0.4, 22]} p={p} fov={46} t={t} shake={0.06} />
      </>
    ),
    filter: GRAY,
  },
  /* "The creature turned… and followed the noise into the gray." */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <Millbrook t={T} bright />
        <Ash t={T} dir={1} center={[0, 0, 22]} spread={16} count={120} />
        <Faceless p={[lerp(-12, -3, seg(t, 0, 3)), 0, lerp(16, 21, seg(t, 0, 3))]} rotY={1.1} t={T} walkT={T} reach={0.5} />
        <Walkie p={[0, 0.2, 22]} r={[-Math.PI / 2, 0, 0.5]} s={1} led={1} red />
        <Cam from={[8, 4, 34]} to={[7, 4.4, 33]} look={[-5, 4, 20]} p={p} fov={50} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "'The crack closes at sunrise,' Toby said. 'We have to run.'" */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} crack={0.8} />
        <Character look={TOBY} face="worried" pose={{ armR: -1.2 }} position={[1.6, 0, 1]} rotY={-2.6} scale={0.9} />
        <Cam from={[-1.0, 4.8, -2.0]} to={[-0.8, 4.75, -1.6]} look={[1.6, 4.0, 1]} p={p} fov={40} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "Four kids. One flashlight. Through a town made of ash." */
  {
    start: L[7],
    render: ({ t, p, T }) => {
      const z = 40 - t * 7;
      return (
        <>
          <Millbrook t={T} bright />
          <Ash t={T} dir={1} center={[0, 0, z]} spread={20} count={140} />
          {[SAM, TOBY, LENA, THEO].map((lk, i) => (
            <Character key={i} look={lk} face="scared" pose={walk(t + i * 0.3, 13, 1)} position={[-2 + i * 1.6, 0, z + (i % 2) * 1.4]} rotY={Math.PI} scale={0.85} />
          ))}
          <Flashlight p={[-1.6, 2.6, z - 1]} r={[0.2, Math.PI, 0]} />
          <Cam from={[1, 4.2, z - 11]} to={[1, 4.0, z - 10]} look={[0, 2.6, z]} p={p} fov={48} t={t} />
        </>
      );
    },
    filter: GRAY,
  },
  /* "The crack was shrinking. Theo dove through. Then Lena." */
  {
    start: L[8],
    render: ({ t, p, T }) => {
      const theo = seg(t, 0.5, 1.0);
      const lena = seg(t, 1.4, 1.9);
      return (
        <>
          <TobyRoom t={T} lights={false} ash={1} crack={lerp(1, 0.5, seg(t, 0, 3))} />
          {theo < 1 ? <Character look={THEO} face="scared" pose={{ lean: 1.4 * theo, armL: -2.8, armR: -2.8 }} position={[lerp(0, -3.2, theo), 0, -2.6]} rotY={-Math.PI / 2} scale={0.85 * (1 - theo * 0.9)} /> : null}
          {lena < 1 ? <Character look={LENA} face="scared" pose={{ lean: 1.4 * lena, armL: -2.8, armR: -2.8 }} position={[lerp(1.2, -3.2, lena), 0, -2.2]} rotY={-Math.PI / 2} scale={0.85 * (1 - lena * 0.9)} /> : null}
          <Cam from={[2.4, 5, 3]} to={[2.0, 4.6, 2.4]} look={[-2.6, 0.6, -2.4]} p={p} fov={50} t={t} />
        </>
      );
    },
    filter: GRAY,
  },
  /* "Sam grabbed Toby's hand, and jumped." */
  {
    start: L[9],
    render: ({ t, p, T }) => {
      const k = seg(t, 0.6, 1.3);
      return (
        <>
          <TobyRoom t={T} lights={false} ash={1} crack={0.4} />
          {k < 1 ? (
            <>
              <Character look={SAM} face="scared" pose={{ lean: 1.2 * k, armR: -1.2, armL: -2.6 }} position={[lerp(0.6, -3.2, k), Math.sin(k * Math.PI) * 1.2, -2.0]} rotY={-Math.PI / 2} scale={0.85 * (1 - k * 0.9)} />
              <Character look={TOBY} face="scared" pose={{ lean: 1.2 * k, armL: -1.2, armR: -2.6 }} position={[lerp(1.2, -3.2, k), Math.sin(k * Math.PI) * 1.2, -3.2]} rotY={-Math.PI / 2} scale={0.9 * (1 - k * 0.9)} />
            </>
          ) : null}
          <Cam from={[3.4, 4.4, 2.4]} to={[3.0, 4.0, 1.8]} look={[-2.4, 1.2, -2.6]} p={p} fov={50} t={t} shake={k > 0.9 ? 0.08 : 0} />
        </>
      );
    },
    filter: GRAY,
  },
  /* "They landed on Toby's bedroom floor. Real colors. Real air." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights />
        <Character look={SAM} face="scared" pose={{ lie: true }} position={[0, 0.6, 0.6]} rotY={0.4} scale={0.85} />
        <Character look={TOBY} face="smile" pose={{ sit: true }} position={[-1.6, 1.2, -2]} rotY={0.6} scale={0.9} />
        <Character look={LENA} face="smile" pose={{ sit: true }} position={[2.4, 1.2, -1.4]} rotY={-0.5} scale={0.85} />
        <Character look={THEO} face="laugh" pose={{ sit: true }} position={[1.4, 1.2, 1.6]} rotY={-2.2} scale={0.85} />
        <Cam from={[0.4, 7.6, 4.6]} to={[0.3, 7.4, 4.0]} look={[0, 0.5, -0.6]} p={p} fov={58} t={t} />
      </>
    ),
  },
  /* "Toby's mom screamed his name, and held him for a very long time." */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights />
        <Character look={TOBY_MOM} face="laugh" pose={{ armL: -1.5, armR: -1.5, armLz: -0.4, armRz: 0.4, lean: 0.2 }} position={[0.3, 0, 0.6]} rotY={Math.PI} />
        <Character look={TOBY} face="smile" pose={{ armL: -1.4, armR: -1.4, armLz: -0.5, armRz: 0.5 }} position={[0.3, 0, -0.9]} rotY={0} scale={0.85} />
        <Cam from={[3.4, 4.8, 2]} to={[3.0, 4.6, 1.4]} look={[0.3, 3.6, -0.2]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "That night, the friends finally slept." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Character look={SAM} face="sleep" pose={{ lie: true }} position={[-4, 1.95, 0.2]} scale={0.9} />
        <Walkie p={[3.2, 2.55, -4.6]} r={[0, -0.4, 0]} led={0} />
        <Cam from={[3, 6.4, 4]} to={[2.4, 6, 3]} look={[-1, 2.2, -3]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "But at three in the morning, on every walkie-talkie in Millbrook…" */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Walkie p={[3.2, 2.55, -4.6]} r={[0, -0.4, 0]} led={Math.floor(T * 6) % 2 ? 1 : 0.2} red />
        <Cam from={[4.6, 3.9, -2.2]} to={[4.1, 3.7, -2.9]} look={[3.25, 3.4, -4.5]} p={p} fov={38} t={t} />
      </>
    ),
  },
  {
    start: mid(13, 0.5),
    render: ({ t, p, T }) => (
      <>
        <Millbrook t={T} redWindows={1} />
        <Cam from={[30, 36, 80]} to={[24, 30, 66]} look={[0, 2, 30]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "…the static came back." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Walkie p={[3.2, 2.55, -4.6]} r={[0, -0.4, 0]} led={1} red />
        <pointLight position={[3.4, 3.4, -3.6]} intensity={8} color="#ff3020" distance={4} decay={2} />
        <Cam from={[3.8, 3.5, -3.4]} to={[3.6, 3.45, -3.7]} look={[3.25, 3.35, -4.5]} p={p} fov={36} t={t} shake={0.05} />
      </>
    ),
  },
];

export const STATIC3_SFX: Sfx[] = [
  { src: "breath", at: L[0], vol: 0.35 },
  { src: "static", at: L[4], vol: 0.6 },
  { src: "static", at: L[4] + 1.2, vol: 0.4 },
  { src: "whoosh", at: L[8] + 0.5, vol: 0.3 },
  { src: "whoosh", at: L[8] + 1.4, vol: 0.3 },
  { src: "whoosh", at: L[9] + 0.6, vol: 0.4 },
  { src: "thud", at: L[10], vol: 0.4 },
  { src: "static", at: L[14], vol: 0.6 },
  { src: "whoosh", at: STATIC3_END + 0.1, vol: 0.35 },
  { src: "pop", at: STATIC3_END + 66 / 30, vol: 0.3 },
];

export const STATIC3_BEDS: Bed[] = [
  { src: "sfx/drone.wav", from: 0, to: L[10], vol: 0.2, fadeIn: 0.5, fadeOut: 0.3 },
  { src: "sfx/bass.wav", from: 0, to: L[10], vol: 0.25, fadeIn: 0.5, fadeOut: 0.3 },
  { src: "sfx/synth.wav", from: L[10], to: L[13], vol: 0.3, fadeIn: 0.3, fadeOut: 0.6 },
  { src: "sfx/drone.wav", from: L[13], to: STATIC3_END + 3, vol: 0.22, fadeIn: 0.3, fadeOut: 2.5 },
];
