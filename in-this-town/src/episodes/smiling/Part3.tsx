import React from "react";
import { Character, breathe, wave } from "../../lib/Character";
import { Cam, clamp01, ease, easeOut, lerp } from "../../lib/Cam";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { Brightwater, Bus } from "./Brightwater";
import { Bike, Boat, BridgeSet, Lake, pedal, SKY_WALL_Z, TextSign } from "./Props";
import { MILO, NEIGHBOR } from "./cast";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const MILO_BAG = { ...MILO, backpack: "#2f6fd6" };

/* Milo riding a bike along -z (or any heading) */
const Rider: React.FC<{ x: number; z: number; rot?: number; t: number; face?: "smug" | "worried" | "neutral" | "scared" }> = ({ x, z, rot = Math.PI, t, face = "smug" }) => (
  <>
    <Bike p={[x, 0, z]} rot={rot} t={t} speed={3} />
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Character look={MILO_BAG} face={face} pose={pedal(t)} position={[0, 0.55, 0.55]} />
    </group>
  </>
);

/* bus with the eternal sign */
const DeadBus: React.FC = () => (
  <>
    <Bus p={[2, 0, 27]} />
    <TextSign text="OUT OF SERVICE" p={[2, 4.3, 21.78]} r={[0, Math.PI, 0]} w={2.6} h={0.45} bg="#111" fg="#ff9a2a" glow />
    {/* 12 years: flat tyres and flowers grown around the wheels */}
    {[
      [0.2, 23.4],
      [3.8, 23.4],
      [0.2, 30.4],
      [3.8, 30.4],
    ].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        {[0, 1, 2, 3].map((k) => (
          <React.Fragment key={k}>
            <mesh position={[(k - 1.5) * 0.35, 0.25, 0.6]}>
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <meshStandardMaterial color="#3fae4a" />
            </mesh>
            <mesh position={[(k - 1.5) * 0.35, 0.55, 0.6]}>
              <boxGeometry args={[0.25, 0.25, 0.25]} />
              <meshStandardMaterial color={["#e07ab0", "#ffd34a", "#ffffff", "#c05ab0"][k]} />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    ))}
  </>
);

export const PART3_SHOTS: Shot[] = [
  /* "Milo decided to leave Brightwater." */
  {
    start: 0,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Character look={MILO_BAG} face="smug" pose={{ ...breathe(t), armL: -0.2 }} position={[6, 0, 22]} rotY={Math.PI} />
        <Cam from={[4.8, 5.2, 15.6]} to={[5.1, 5.1, 16.8]} look={[6, 3.8, 22]} p={p} fov={42} t={t} />
      </>
    ),
  },
  {
    start: 1.3,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <group position={[8, 0, 92]}>
          <mesh position={[-1.8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 0.3]} />
            <meshStandardMaterial color="#6d6d6d" />
          </mesh>
          <mesh position={[1.8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 0.3]} />
            <meshStandardMaterial color="#6d6d6d" />
          </mesh>
          <TextSign text={"WELCOME TO\nBRIGHTWATER\nyou'll never want to leave"} p={[0, 3.8, 0.2]} w={5.4} h={2.6} bg="#ffffff" fg="#2f6fd6" border="#2f6fd6" />
        </group>
        <Cam from={[3, 3.6, 101]} to={[4, 3.6, 99]} look={[8, 3.6, 92]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "He packed a bag, grabbed his bike," */
  {
    start: 2.56,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <Bike p={[7.5, 0, 22]} rot={Math.PI} t={0} />
        <Character look={MILO_BAG} face="smug" pose={{ armR: -1.0 * ease(seg(t, 0.2, 0.9)), armL: -0.2 }} position={[6.2, 0, 22.6]} rotY={Math.PI / 2 + 0.4} />
        <Cam from={[1.6, 5.2, 13.4]} to={[2.0, 5.0, 14.4]} look={[6.8, 2.6, 22.4]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "and rode down Main Street," */
  {
    start: 4.24,
    render: ({ t, p, T }) => {
      const z = 22 - t * 7;
      return (
        <>
          <Brightwater t={T} />
          <Rider x={3} z={z} t={T} />
          <Cam from={[-0.5, 5.2, z - 11]} to={[0, 5.0, z - 10.4]} look={[3, 2.8, z]} p={p} fov={48} t={t} />
        </>
      );
    },
  },
  /* "past the bakery," */
  {
    start: 5.78,
    render: ({ t, p, T }) => {
      const z = 2 - t * 7;
      return (
        <>
          <Brightwater t={T} />
          <Rider x={-4} z={z} t={T} />
          <Cam from={[5, 4, -12]} to={[5, 4, -12]} look={[-6, 3, z]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  /* "past the clock tower," */
  {
    start: 7.02,
    render: ({ t, p, T }) => {
      const x = 10 - t * 9;
      return (
        <>
          <Brightwater t={T} />
          <Rider x={x} z={-10} rot={-Math.PI / 2} t={T} />
          <Cam from={[2, 2.4, -3]} to={[1, 2.4, -3]} look={[0, 9, -18]} lookTo={[-2, 7, -16]} p={p} fov={56} t={t} />
        </>
      );
    },
  },
  /* "past the same smiling neighbor." */
  {
    start: 8.12,
    render: ({ t, p, T }) => {
      const z = 14 + t * 6;
      return (
        <>
          <Brightwater t={T} />
          <Character look={NEIGHBOR} face="smile" pose={wave(t, "L")} position={[11.5, 0, 20]} rotY={-Math.PI / 2} />
          <Rider x={3} z={z} rot={0} t={T} />
          <Cam from={[-2, 4.2, 10]} to={[-2, 4.2, 14]} look={[8, 3.4, 20]} p={p} fov={48} t={t} />
        </>
      );
    },
  },
  /* "He rode for an hour." – out into the empty fields, golden light */
  {
    start: 10.18,
    render: ({ t, p, T }) => {
      const z = 110 + t * 9;
      return (
        <>
          <Brightwater t={T} sun={2.2} />
          <Rider x={2.5} z={z} rot={0} t={T} face="neutral" />
          <Cam from={[30, 26, z + 30]} to={[26, 22, z + 26]} look={[2, 1, z]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* "And then… he saw the clock tower. Again." */
  {
    start: 12.26,
    render: ({ t, p, T }) => {
      const z = 14 - easeOut(seg(t, 0, 1.0)) * 6;
      return (
        <>
          <Brightwater t={T} sun={2.2} />
          <Rider x={2.5} z={z} t={t < 1.0 ? T : 0} face="worried" />
          <Cam from={[1.0, 5.2, 0]} to={[1.4, 5.1, 1.2]} look={[2.5, 3.2, 9]} p={p} fov={44} t={t} />
        </>
      );
    },
  },
  {
    start: 13.3,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} sun={2.2} tint="eerie" />
        <Rider x={2.5} z={8} t={0} face="scared" />
        <Cam from={[3.2, 6.2, 16]} to={[3.0, 6.6, 14]} look={[0, 11, -18]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "Every road… led back to the square." */
  {
    start: 15.2,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} tint="eerie" />
        <Rider x={2.5} z={8} t={0} face="scared" />
        <Cam from={[0, 90, 40]} to={[18, 70, 30]} look={[0, 0, -6]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "So he tried the bus." */
  {
    start: 17.96,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <DeadBus />
        <Character look={MILO_BAG} face="smug" pose={{ armL: -0.4 + Math.sin(t * 9) * 0.4, armR: -0.4 - Math.sin(t * 9) * 0.4, legL: Math.sin(t * 9) * 0.7, legR: -Math.sin(t * 9) * 0.7 }} position={[6, 0, lerp(14, 20, seg(t, 0, 1.4))]} rotY={0} />
        <Cam from={[9, 4, 8]} to={[8.6, 4, 9]} look={[3, 3, 24]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "The sign said: Out of service." */
  {
    start: 19.46,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <DeadBus />
        <Cam from={[2.4, 4.0, 15.5]} to={[2.2, 4.2, 17.8]} look={[2, 4.3, 21.9]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "It had said that for twelve years." – flowers grown around the flat tyres */
  {
    start: 21.44,
    render: ({ t, p, T }) => (
      <>
        <Brightwater t={T} />
        <DeadBus />
        <Cam from={[-5.6, 2.0, 17.4]} to={[-5.0, 1.8, 18.2]} look={[0.2, 0.8, 23.6]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* "So he tried the bridge." */
  {
    start: 23.72,
    render: ({ t, p, T }) => (
      <>
        <BridgeSet t={T} />
        <Rider x={1} z={lerp(30, 8, easeOut(seg(t, 0, 1.5)))} t={t < 1.5 ? T : 0} />
        <Cam from={[-9, 5, 22]} to={[-8, 5, 18]} look={[1, 2, 2]} p={p} fov={48} t={t} />
      </>
    ),
  },
  /* "Closed for repairs." */
  {
    start: 25.32,
    render: ({ t, p, T }) => (
      <>
        <BridgeSet t={T} />
        <Cam from={[0.8, 3.4, 7.5]} to={[0.4, 3.5, 5.6]} look={[0, 3.4, 0.4]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Nobody had ever seen anyone repair it." */
  {
    start: 26.84,
    render: ({ t, p, T }) => (
      <>
        <BridgeSet t={T} />
        <Rider x={1} z={8} t={0} face="worried" />
        <Cam from={[14, 12, 18]} to={[11, 10, 15]} look={[0, 1, -10]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* "So Milo did the only thing left." – the lake */
  {
    start: 29.64,
    render: ({ t, p, T }) => (
      <>
        <Lake t={T} />
        <Boat p={[3, 0.1, 13]} t={T} />
        <Character look={MILO_BAG} face="smug" pose={breathe(t)} position={[0, 0.75, 16]} rotY={Math.PI} />
        <Cam from={[3, 5.2, 27]} to={[2.6, 5.0, 25]} look={[0, 2, -40]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "He took a little boat… and rowed toward the horizon." */
  {
    start: 31.92,
    render: ({ t, p, T }) => {
      const z = 10 - t * 2.4;
      return (
        <>
          <Lake t={T} />
          <Boat p={[0, 0.1, z]} row={1} t={T} />
          <Character look={MILO_BAG} face="smug" pose={{ sit: true, armL: -1.2 + Math.sin(T * 4) * 0.5, armR: -1.2 + Math.sin(T * 4) * 0.5 }} position={[0, 0.9, z + 0.6]} rotY={0} />
          <Cam from={[6, 5, z - 12]} to={[5, 4.6, z - 11]} look={[0, 1.6, z]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  {
    start: 33.3,
    render: ({ t, p, T }) => {
      const z = -6 - t * 6;
      return (
        <>
          <Lake t={T} />
          <Boat p={[0, 0.1, z]} row={1} t={T} />
          <Character look={MILO_BAG} face="smug" pose={{ sit: true, armL: -1.2 + Math.sin(T * 4) * 0.5, armR: -1.2 + Math.sin(T * 4) * 0.5 }} position={[0, 0.9, z + 0.6]} rotY={0} />
          <Cam from={[0, 6, 22]} to={[0, 6.4, 18]} look={[0, 3, z - 30]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* "The town got smaller." */
  {
    start: 35.0,
    render: ({ t, p, T }) => (
      <>
        <Lake t={T} />
        <Boat p={[0, 0.1, -60]} row={1} t={T} rot={Math.PI} />
        <Cam from={[0, 4, -62]} to={[0, 4.2, -66]} look={[0, 4, 40]} p={p} fov={44} t={t} linear />
      </>
    ),
  },
  /* "The sky got bigger." */
  {
    start: 36.52,
    render: ({ t, p, T }) => (
      <>
        <Lake t={T} townFar={false} />
        <Boat p={[0, 0.1, -100]} row={1} t={T} />
        <Character look={MILO_BAG} face="neutral" pose={{ sit: true, armL: -1.2 + Math.sin(T * 4) * 0.5, armR: -1.2 + Math.sin(T * 4) * 0.5 }} position={[0, 0.9, -99.4]} rotY={0} />
        <Cam from={[3, 1.6, -82]} to={[2, 1.4, -86]} look={[0, 18, -150]} p={p} fov={58} t={t} />
      </>
    ),
  },
  /* "Suddenly, the wind stopped." */
  {
    start: 38.38,
    render: ({ t, p, T }) => {
      const still = seg(t, 0.4, 1.2);
      return (
        <>
          <Lake t={T} still={still} townFar={false} />
          <Boat p={[0, 0.1, -128]} t={T} />
          <Character look={MILO_BAG} face="worried" pose={{ sit: true, headY: Math.sin(t * 1.5) * 0.4, armL: -1.2, armR: -1.2 }} position={[0, 0.9, -127.4]} rotY={0} />
          <Cam from={[5.4, 4.6, -120]} to={[5.0, 4.4, -120.8]} look={[0, 2.4, -127.4]} p={p} fov={44} t={t} />
        </>
      );
    },
  },
  /* "The waves stopped." */
  {
    start: 39.96,
    render: ({ t, p, T }) => (
      <>
        <Lake t={39.96 + 1.2} still={1} townFar={false} />
        <Boat p={[0, 0.1, -128]} t={0} />
        <Cam from={[-12, 1.0, -116]} to={[-11, 1.0, -117]} look={[0, 0.6, -132]} p={p} fov={46} t={0} />
      </>
    ),
  },
  /* "Then the boat hit something." */
  {
    start: 41.44,
    render: ({ t, p, T }) => {
      const z = lerp(-136, SKY_WALL_Z + 3.4, seg(t, 0, 1.6));
      return (
        <>
          <Lake t={41} still={1} townFar={false} seams />
          <Boat p={[0, 0.1, z]} t={T} row={1} />
          <Character look={MILO_BAG} face="neutral" pose={{ sit: true, armL: -1.2 + Math.sin(T * 4) * 0.5, armR: -1.2 + Math.sin(T * 4) * 0.5 }} position={[0, 0.9, z + 0.6]} rotY={0} />
          <Cam from={[13, 4, -134]} to={[13, 4, -138]} look={[0, 1.8, z]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* "With a hollow thud." */
  {
    start: 43.29,
    render: ({ t, p }) => {
      const z = SKY_WALL_Z + 3.4 + Math.sin(Math.min(t, 0.4) * 20) * 0.15 * (1 - seg(t, 0, 0.4));
      return (
        <>
          <Lake t={41} still={1} townFar={false} seams />
          <Boat p={[0, 0.1, z]} t={0} />
          <Character look={MILO_BAG} face="scared" pose={{ sit: true, armL: -0.6, armR: -0.6, lean: -0.15 }} position={[0, 0.9, z + 0.6]} rotY={0} />
          <Cam from={[6, 4, SKY_WALL_Z + 10]} to={[5.6, 3.9, SKY_WALL_Z + 9.4]} look={[0, 2, SKY_WALL_Z + 1]} p={p} fov={50} t={t} shake={t < 0.4 ? 0.15 : 0} />
        </>
      );
    },
  },
  /* "Milo reached out… and touched the sky." */
  {
    start: 44.78,
    render: ({ t, p }) => {
      const reach = ease(seg(t, 0.3, 1.8));
      return (
        <>
          <Lake t={41} still={1} townFar={false} seams />
          <Boat p={[0, 0.1, SKY_WALL_Z + 3.4]} t={0} />
          <Character look={MILO_BAG} face="worried" pose={{ sit: true, armR: -1.5 * reach, lean: 0.25 * reach }} position={[0, 0.9, SKY_WALL_Z + 4]} rotY={Math.PI} />
          <Cam from={[5.2, 4.2, SKY_WALL_Z + 9]} to={[4.6, 4.0, SKY_WALL_Z + 8]} look={[0.4, 2.8, SKY_WALL_Z + 1]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* "It was a wall. Painted blue." – pull back, the seams show */
  {
    start: 47.48,
    render: ({ t, p }) => (
      <>
        <Lake t={41} still={1} townFar={false} seams />
        <Boat p={[0, 0.1, SKY_WALL_Z + 3.4]} t={0} />
        <Character look={MILO_BAG} face="scared" pose={{ sit: true, armR: -1.5, headX: -0.4 }} position={[0, 0.9, SKY_WALL_Z + 4]} rotY={Math.PI} />
        <Cam from={[4, 3, SKY_WALL_Z + 9]} to={[10, 6, SKY_WALL_Z + 30]} look={[0, 6, SKY_WALL_Z]} lookTo={[0, 16, SKY_WALL_Z]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "With a tiny door in it." */
  {
    start: 49.8,
    render: ({ t, p }) => (
      <>
        <Lake t={41} still={1} townFar={false} seams />
        <Boat p={[-4, 0.1, SKY_WALL_Z + 3.4]} t={0} />
        <Cam from={[1.2, 3.0, SKY_WALL_Z + 9]} to={[0.6, 2.8, SKY_WALL_Z + 6.4]} look={[0, 2.6, SKY_WALL_Z]} p={p} fov={42} t={t} />
      </>
    ),
  },
];

export const PART3_VOICE_END = 51.7;

export const PART3_SFX: Sfx[] = [
  { src: "smiling1/bell.wav", at: 13.35, vol: 0.5 },
  { src: "smiling1/freeze.wav", at: 38.8, vol: 0.25 },
  { src: "knock", at: 43.3, vol: 1 },
  { src: "boom", at: 43.32, vol: 0.25 },
  { src: "whoosh", at: PART3_VOICE_END + 0.1, vol: 0.35 },
  { src: "pop", at: PART3_VOICE_END + 66 / 30, vol: 0.3 },
];

export const PART3_BEDS: Bed[] = [
  { src: "smiling1/pad.wav", from: 0, to: 12.2, vol: 0.4, fadeIn: 0.3, fadeOut: 0.8 },
  { src: "smiling1/chirps.wav", from: 0, to: 12.2, vol: 0.25 },
  { src: "sfx/drone.wav", from: 12.2, to: 38.4, vol: 0.18, fadeIn: 0.6, fadeOut: 0.4 },
  { src: "sfx/drone.wav", from: 41.4, to: PART3_VOICE_END + 3, vol: 0.2, fadeIn: 0.4, fadeOut: 2.5 },
];
