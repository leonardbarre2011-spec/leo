import { Character, walk } from "../../lib/Character";
import type { Look } from "../../lib/Character";
import { Cam, clamp01, ease, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Bird, Brightwater } from "./Brightwater";
import { Bedroom, Bike, FeaturedScreen, Lake, ScreenRoom, SKY_WALL_Z, Stairs } from "./Props";
import { ScreenOverlay } from "./ScreenOverlay";
import { MILO } from "./cast";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const MILO_BAG = { ...MILO, backpack: "#2f6fd6" };
const OTHER_KIDS: Look[] = [
  { skin: "#c68b59", shirt: "#e0475f", pants: "#2b2b33", hair: "#1a1410", hairStyle: "short" },
  { skin: "#f3cfa8", shirt: "#5ac0a0", pants: "#4a3a8a", hair: "#e8c85a", hairStyle: "long" },
  { skin: "#8d5a3b", shirt: "#ffd34a", pants: "#3a3f52", hair: "#141010", hairStyle: "spiky" },
];
const GIRL: Look = { skin: "#f2c8a0", shirt: "#9a7ae0", pants: "#2f3a5e", shoes: "#ffffff", hair: "#c0662e", hairStyle: "long" };

export const PART4_SHOTS: Shot[] = [
  /* "The door in the sky had no handle," */
  {
    start: 0,
    render: ({ t, p }) => (
      <>
        <Lake t={41} still={1} townFar={false} seams />
        <Cam from={[1.2, 2.8, SKY_WALL_Z + 10]} to={[0.8, 2.7, SKY_WALL_Z + 8.6]} look={[0, 2.4, SKY_WALL_Z]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "just a sign. Staff only." */
  {
    start: 2.37,
    render: ({ t, p }) => (
      <>
        <Lake t={41} still={1} townFar={false} seams />
        <Cam from={[0.3, 3.4, SKY_WALL_Z + 5.2]} to={[0.1, 3.5, SKY_WALL_Z + 4.2]} look={[0, 3.4, SKY_WALL_Z]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Milo pushed it open." */
  {
    start: 4.4,
    render: ({ t, p }) => (
      <>
        <Lake t={41} still={1} townFar={false} seams door={ease(seg(t, 0.4, 1.6))} />
        <Character look={MILO_BAG} face="worried" pose={{ armR: -1.5, armL: -1.4, lean: 0.15 }} position={[0.4, 0, SKY_WALL_Z + 2.4]} rotY={Math.PI} />
        <Cam from={[4.6, 5.6, SKY_WALL_Z + 13]} to={[4.0, 5.4, SKY_WALL_Z + 12]} look={[0, 2.6, SKY_WALL_Z]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "Behind it, there was a staircase. Going up. Into the dark." */
  {
    start: 6.48,
    render: ({ t, p, T }) => (
      <>
        <Stairs t={T} />
        <Cam from={[0, 1.6, 6]} to={[0, 1.9, 4.4]} look={[0, 10, -20]} p={p} fov={56} t={t} />
      </>
    ),
  },
  {
    start: 8.61,
    render: ({ t, p, T }) => {
      const i = t * 2.2;
      return (
        <>
          <Stairs t={T} />
          <Character look={MILO_BAG} face="neutral" pose={walk(t, 6, 0.5)} position={[0, 0.5 + i * 0.5, -i]} rotY={Math.PI} />
          <Cam from={[0.8, 5.6, 8]} to={[0.8, 6.4, 6]} look={[0, 2.6 + i * 0.5, -i - 2]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  /* "He climbed for a long time." */
  {
    start: 10.28,
    render: ({ t, p, T }) => {
      const i = 20 + t * 4;
      return (
        <>
          <Stairs t={T} />
          <Character look={MILO_BAG} face="neutral" pose={walk(t, 6, 0.5)} position={[0, 0.5 + i * 0.5, -i]} rotY={Math.PI} />
          <Cam from={[6, 26, -8]} to={[6, 28, -10]} look={[0, i * 0.5, -i]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  /* "At the top, there was a room so big…" */
  {
    start: 12.6,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <Character look={MILO_BAG} face="scared" pose={{ headX: -0.3, headY: Math.sin(t * 1.2) * 0.4 }} position={[0, 0, 40]} rotY={Math.PI} />
        <Cam from={[1.4, 5.4, 33.4]} to={[1.2, 5.3, 34.4]} look={[0, 4.4, 40]} p={p} fov={42} t={t} />
      </>
    ),
  },
  {
    start: 14.08,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <Character look={MILO_BAG} face="scared" pose={{ headX: -0.3 }} position={[0, 0, 40]} rotY={Math.PI} />
        <Cam from={[0, 3, 52]} to={[0, 6, 50]} look={[0, 10, -40]} p={p} fov={60} t={t} />
      </>
    ),
  },
  /* "And it was full of screens. Thousands of them." */
  {
    start: 16.2,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <Character look={MILO_BAG} face="scared" pose={{ headX: -0.4 }} position={[0, 0, 40]} rotY={Math.PI} />
        <Cam from={[0, 4, 46]} to={[0, 30, 30]} look={[0, 6, -20]} lookTo={[0, 20, -60]} p={p} fov={62} t={t} />
      </>
    ),
  },
  /* "On one screen, he saw Brightwater." */
  {
    start: 19.52,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Cam from={[40, 44, 70]} to={[32, 36, 56]} look={[0, 4, 0]} p={p} fov={50} t={t} linear />
      </>
    ),
    overlay: ({ t }) => <ScreenOverlay label="CH 4,812 · LIVE" t={t} />,
  },
  /* "His house. His bike." */
  {
    start: 21.57,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Bike p={[11, 0, 13.5]} rot={-0.4} t={0} />
        <Cam from={[2, 5, 4]} to={[2.6, 5, 5]} look={[14, 3, 9]} p={p} fov={50} t={t} />
      </>
    ),
    overlay: ({ t }) => <ScreenOverlay label="CH 4,812 · LIVE" t={t} />,
  },
  /* "His empty bed." */
  {
    start: 22.94,
    render: ({ t, p, T }) => (
      <>
        <Bedroom t={T} night bird={false} />
        <Cam from={[2.6, 6, 4]} to={[2.2, 5.8, 3.2]} look={[-4, 1.6, -2.6]} p={p} fov={50} t={t} />
      </>
    ),
    overlay: ({ t }) => <ScreenOverlay label="CH 4,812 · LIVE" t={t} />,
  },
  /* "Under it, a label. Channel 4,812." */
  {
    start: 24.2,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <FeaturedScreen p={[0, 4.2, 30]} />
        <pointLight position={[0, 4, 33]} intensity={25} color="#cfe6ff" distance={8} decay={1.6} />
        <Cam from={[0.4, 4.2, 38]} to={[0.1, 2.6, 34.2]} look={[0, 3.4, 30]} lookTo={[0, 2.4, 30]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "Milo looked at the next screen." */
  {
    start: 28.6,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <pointLight position={[2, 5, 36]} intensity={30} color="#8fb8ff" distance={10} decay={1.5} />
        <Character look={MILO_BAG} face="worried" pose={{ headY: lerp(0, 0.7, ease(seg(t, 0.3, 1.4))) }} position={[0, 0, 36]} rotY={Math.PI} />
        <Cam from={[0.6, 5.0, 31.0]} to={[0.5, 4.95, 31.8]} look={[0, 4.3, 36]} p={p} fov={42} t={t} />
      </>
    ),
  },
  /* "Another kid. Another perfect town. And the next one. And the next one." */
  ...(
    [
      [30.48, "snow", 0, "CH 4,813 · LIVE"],
      [31.99, "desert", 1, "CH 4,814 · LIVE"],
      [33.28, "candy", 2, "CH 4,815 · LIVE"],
    ] as [number, string, number, string][]
  ).map(
    ([start, theme, kid, label]): Shot => ({
      start,
      render: ({ t, p, T }) => (
        <>
          <Brightwater t={T} theme={theme} />
          <Character look={OTHER_KIDS[kid]} face="smile" pose={walk(t, 7, 0.5)} position={[6, 0, 24 - t * 2]} rotY={Math.PI} />
          <Cam from={[3, 5, 15]} to={[3.4, 5, 16]} look={[6, 3.4, 23]} p={p} fov={48} t={t} />
        </>
      ),
      overlay: ({ t }) => <ScreenOverlay label={label} t={t} />,
    }),
  ),
  {
    start: 34.48,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <Cam from={[0, 8, -40]} to={[0, 16, 10]} look={[0, 10, -70]} p={p} fov={56} t={t} />
      </>
    ),
  },
  /* "Milo wasn't the show." */
  {
    start: 35.56,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} />
        <pointLight position={[0, 6, 30]} intensity={40} color="#8fb8ff" distance={20} decay={1.5} />
        <Character look={MILO_BAG} face="neutral" pose={{ headX: -0.2 }} position={[0, 0, 36]} rotY={Math.PI} />
        <Cam from={[0, 7, 54]} to={[0, 7.4, 52]} look={[0, 6, -20]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "He was just one channel." – endless pull back */
  {
    start: 37.6,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} rows={26} fogFar={320} />
        <Character look={MILO_BAG} face="neutral" pose={{}} position={[0, 0, 36]} rotY={Math.PI} />
        <Cam from={[0, 10, 50]} to={[0, 90, 140]} look={[0, 2, 30]} lookTo={[0, 20, -20]} p={p} fov={56} t={t} />
      </>
    ),
  },
  /* "Then, on a screen far away…" */
  {
    start: 39.76,
    render: ({ t, p, T }) => (
      <>
        <ScreenRoom t={T} rows={26} />
        <Cam from={[0, 20, 20]} to={[-28, 22, -48]} look={[-40, 23, -60]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "a girl in a different town stopped walking," */
  {
    start: 41.66,
    render: ({ t, p, T }) => {
      const stop = seg(t, 1.2, 1.5);
      return (
        <>
          <Brightwater t={T} theme="snow" />
          <Character look={GIRL} face="smile" pose={stop < 1 ? walk(t, 7, 0.5) : {}} position={[6, 0, 26 - Math.min(t, 1.3) * 2]} rotY={Math.PI} />
          <Cam from={[4.4, 5.2, 16.6]} to={[4.7, 5.1, 17.6]} look={[6, 3.8, 23.6]} p={p} fov={44} t={t} />
        </>
      );
    },
    overlay: ({ t }) => <ScreenOverlay label="CH 9,377 · LIVE" t={t} />,
  },
  /* "and slowly… looked up at a bird." */
  {
    start: 43.49,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} theme="snow" />
        <Character look={GIRL} face="worried" pose={{ headX: -0.6 * ease(seg(t, 0.1, 1.2)) }} position={[6, 0, 23.4]} rotY={Math.PI} />
        <Cam from={[5.0, 4.4, 18.4]} to={[5.2, 4.2, 19.2]} look={[6, 4.8, 23.4]} p={p} fov={42} t={t} />
      </>
    ),
    overlay: ({ t }) => <ScreenOverlay label="CH 9,377 · LIVE" t={t} />,
  },
  {
    start: 45.0,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} theme="snow" />
        <Bird p={[6 + Math.sin(T * 1.2) * 3, 11, 17 + Math.cos(T * 1.2) * 3]} heading={T * 1.2 + Math.PI / 2} flap={Math.sin(T * 22) * 0.7} s={2.6} />
        <Cam from={[6, 2.6, 26]} to={[6, 2.4, 26.4]} look={[6, 12, 14]} p={p} fov={52} t={t} />
      </>
    ),
    overlay: ({ t }) => <ScreenOverlay label="CH 9,377 · LIVE" t={t} />,
  },
];

export const PART4_VOICE_END = 46.6;

export const PART4_SFX: Sfx[] = [
  { src: "creak", at: 4.9, vol: 0.5 },
  { src: "boom", at: 14.1, vol: 0.25 },
  { src: "smiling1/beep.wav", at: 24.4, vol: 0.2 },
  { src: "whoosh", at: PART4_VOICE_END + 0.1, vol: 0.35 },
  { src: "pop", at: PART4_VOICE_END + 66 / 30, vol: 0.3 },
];

export const PART4_BEDS: Bed[] = [
  { src: "sfx/drone.wav", from: 0, to: 12.6, vol: 0.16, fadeIn: 0.5, fadeOut: 0.5 },
  { src: "smiling1/hum.wav", from: 12.6, to: 16.5, vol: 0.25, fadeIn: 0.5, fadeOut: 0.5 },
  { src: "sfx/drone.wav", from: 12.6, to: 39.7, vol: 0.2, fadeIn: 1.0, fadeOut: 0.5 },
  { src: "smiling1/bells.wav", from: 39.7, to: PART4_VOICE_END + 3, vol: 0.3, fadeIn: 1.0, fadeOut: 2.5 },
];
