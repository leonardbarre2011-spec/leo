import React from "react";
import { Character, breathe } from "../../lib/Character";
import { clamp01, ease, lerp } from "../../lib/Cam";
import { Cam } from "./CamS";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Bedroom } from "../smiling/Props";
import { Faceless, Flashlight, GRAY, LENA, SAM, THEO, TOBY, TobyRoom, Walkie } from "./Sets";
import cues from "../../../public/static2/cues.json";

const L = cues.lines;
export const STATIC2_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? STATIC2_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/* the three friends in Toby's room, flashlights in hand */
const Friends: React.FC<{ t: number; face?: "worried" | "scared" | "neutral"; flash?: number }> = ({ t, face = "worried", flash = 1 }) => (
  <>
    {(
      [
        [SAM, 0.8, 1.2, Math.PI - 0.2],
        [LENA, -1.2, 1.6, Math.PI + 0.4],
        [THEO, 2.6, 0.2, Math.PI - 0.7],
      ] as const
    ).map(([lk, x, z, r], i) => (
      <React.Fragment key={i}>
        <Character look={lk} face={face} pose={{ ...breathe(t + i), armR: -1.3 }} position={[x, 0, z]} rotY={r} scale={0.85} />
        {flash ? <Flashlight p={[x + Math.sin(r) * 1.0 - Math.cos(r) * 1.1, 2.7, z + Math.cos(r) * 1.0 + Math.sin(r) * 1.1]} r={[0, r, 0]} on={flash} /> : null}
      </React.Fragment>
    ))}
  </>
);

export const STATIC2_SHOTS: Shot[] = [
  /* "The friends made a plan." */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} bird={false} />
        <Character look={SAM} face="smug" pose={{ sit: true }} position={[-3.6, 1.4, -2]} rotY={Math.PI / 2} scale={0.85} />
        <Character look={LENA} face="neutral" pose={breathe(t)} position={[0, 0, -1]} rotY={-Math.PI / 2 - 0.3} scale={0.85} />
        <Character look={THEO} face="neutral" pose={breathe(t + 1)} position={[0.4, 0, 1.6]} rotY={-2.3} scale={0.85} />
        <Cam from={[3.4, 6, 5]} to={[2.8, 5.6, 4.2]} look={[-1.4, 2.4, -1]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Sam, Lena and Theo met in Toby's room at midnight…" */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} />
        <Friends t={t} />
        <Cam from={[3.4, 6.4, 7.6]} to={[2.8, 6.0, 6.6]} look={[0.2, 2.4, -1]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "'If he's right next to us,' Lena said, 'there has to be a door.'" */
  {
    start: L[2],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} />
        <Friends t={t} face="neutral" />
        <Cam from={[-1.6, 4.6, -2.4]} to={[-1.5, 4.55, -1.9]} look={[-1.2, 3.8, 1.6]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "They turned off the lights." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} />
        <Friends t={t} flash={t < 0.6 ? 1 : 0} />
        <Cam from={[3, 6, 6.6]} to={[2.8, 6, 6.2]} look={[0, 2.4, -1]} p={p} fov={52} t={t} />
      </>
    ),
  },
  /* "And under Toby's bed, the floor was glowing." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} crack={ease(seg(t, 0.2, 1.2))} />
        <Cam from={[0.6, 0.7, 0.4]} to={[0.0, 0.6, -0.2]} look={[-3.6, 0.2, -2.6]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "A crack. Thin as a hair. Breathing cold air." */
  {
    start: L[5],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} crack={0.8 + 0.3 * Math.sin(T * 2.4)} />
        <Cam from={[-2.4, 0.9, -1.0]} to={[-2.6, 0.7, -1.5]} look={[-3.4, 0.05, -2.6]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Sam put his hand on it…" */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} crack={1} />
        <Character look={SAM} face="worried" pose={{ sit: true, lean: 0.6, armR: -1.2 - 0.4 * ease(seg(t, 0, 1)) }} position={[-1.2, 0.9, -2.4]} rotY={-Math.PI / 2} scale={0.85} />
        <Cam from={[1.6, 3.6, 1.6]} to={[1.2, 3.2, 1.0]} look={[-2.6, 0.6, -2.5]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "…and the room flipped." */
  {
    start: mid(6, 0.62),
    render: ({ t, p, T }) => {
      const k = ease(seg(t, 0, 0.7));
      return (
        <>
          <group rotation={[0, 0, k * Math.PI * 2]} position={[0, 4, 0]}>
            <group position={[0, -4, 0]}>
              <TobyRoom t={T} lights={false} ash={k > 0.5 ? 1 : 0} />
            </group>
          </group>
          <Cam from={[2, 5, 5]} to={[1.4, 4.6, 4]} look={[-1, 3, -2]} p={p} fov={52} t={t} shake={0.05 * (1 - k)} />
        </>
      );
    },
    filter: GRAY,
  },
  /* "Same bed." / "Same posters." / "Same window." */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Cam from={[0, 4, 2]} to={[-0.6, 3.8, 1.6]} look={[-4, 1.6, -2.6]} p={p} fov={46} t={t} />
      </>
    ),
    filter: GRAY,
  },
  {
    start: mid(7, 0.33),
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Cam from={[-0.4, 5.2, 0]} to={[-0.6, 5.2, -1]} look={[-1.4, 5.2, -6]} p={p} fov={46} t={t} />
      </>
    ),
    filter: GRAY,
  },
  {
    start: mid(7, 0.66),
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Cam from={[0.6, 4.6, 0.6]} to={[1.4, 4.6, 0]} look={[6, 4.6, -1.6]} p={p} fov={46} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "But everything was gray. And the ash floated up, instead of down." */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Friends t={t} face="scared" flash={0} />
        <Cam from={[3.6, 1.6, 6]} to={[3.2, 2.6, 5]} look={[0, 4.5, -1]} p={p} fov={54} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "And there was Toby. Sitting in the corner. Holding his walkie-talkie." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Character look={TOBY} face="worried" pose={{ sit: true, armR: -1.4, armL: -1.3, headX: 0.25 }} position={[4.4, 0, 4.4]} rotY={-2.4} scale={0.9} />
        <Walkie p={[3.6, 1.9, 3.6]} r={[0, -2.4, 0]} s={0.6} led={1} />
        <Cam from={[0.2, 4.6, 0.6]} to={[0.7, 4.3, 1.1]} look={[4.4, 1.8, 4.4]} p={p} fov={44} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "'You came,' he whispered. 'But you shouldn't have.'" */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} />
        <Character look={TOBY} face="scared" pose={{ sit: true, armR: -1.4, armL: -1.3, headX: -0.05 }} position={[4.4, 0, 4.4]} rotY={-2.4} scale={0.9} />
        <Cam from={[1.6, 3.2, 1.6]} to={[1.9, 3.1, 1.9]} look={[4.4, 2.6, 4.4]} p={p} fov={40} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "Behind him, the closet door slowly opened." */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} closet={ease(seg(t, 0.2, 2.0)) * 0.9} />
        <Cam from={[1.4, 4.4, 1.6]} to={[0.8, 4.2, 1.8]} look={[-5.8, 3, 3.4]} p={p} fov={44} t={t} />
      </>
    ),
    filter: GRAY,
  },
  /* "And something tall, with no face at all, leaned out of the dark." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} closet={0.9} />
        <Faceless p={[-6.6, 0, 3.4]} rotY={Math.PI / 2} t={T} lean={lerp(0, 0.55, ease(seg(t, 0.2, 1.6)))} />
        <Cam from={[0.8, 3.6, 3.2]} to={[0.2, 3.8, 3.3]} look={[-5, 6.6, 3.4]} p={p} fov={48} t={t} />
      </>
    ),
    filter: GRAY,
  },
  {
    start: mid(12, 0.6),
    render: ({ t, p, T }) => (
      <>
        <TobyRoom t={T} lights={false} ash={1} closet={0.9} />
        <Faceless p={[-6.6, 0, 3.4]} rotY={Math.PI / 2} t={T} lean={0.55} />
        <Cam from={[-1.4, 6.4, 3.6]} to={[-1.8, 6.5, 3.5]} look={[-4.4, 7.2, 3.4]} p={p} fov={44} t={t} />
      </>
    ),
    filter: GRAY,
  },
];

export const STATIC2_SFX: Sfx[] = [
  { src: "switch", at: mid(3, 0.3), vol: 0.0 },
  { src: "whoosh", at: mid(6, 0.62), vol: 0.5 },
  { src: "boom", at: mid(6, 0.62) + 0.4, vol: 0.3 },
  { src: "creak", at: L[11] + 0.2, vol: 0.5 },
  { src: "breath", at: L[12], vol: 0.5 },
  { src: "whoosh", at: STATIC2_END + 0.1, vol: 0.35 },
  { src: "pop", at: STATIC2_END + 66 / 30, vol: 0.3 },
].filter((s) => s.vol > 0);

export const STATIC2_BEDS: Bed[] = [
  { src: "sfx/synth.wav", from: 0, to: L[3], vol: 0.25, fadeIn: 0.5, fadeOut: 0.8 },
  { src: "sfx/drone.wav", from: L[3], to: STATIC2_END + 3, vol: 0.2, fadeIn: 1.0, fadeOut: 2.5 },
  { src: "sfx/bass.wav", from: mid(6, 0.62), to: STATIC2_END + 3, vol: 0.3, fadeIn: 0.5, fadeOut: 2.5 },
];
