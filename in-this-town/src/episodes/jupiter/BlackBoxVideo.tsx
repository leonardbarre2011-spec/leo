import React from "react";
import { Character, walk } from "../../lib/Character";
import type { Look } from "../../lib/Character";
import { clamp01, ease, lerp } from "../../lib/Cam";
import { Cam } from "../static/CamS";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { B } from "../../lib/Sets";
import { CASEOH, Cockpit, JOE, KEY_FIELD, Key, KREEK, MATEO, MoonSurface, ShipInterior, SPEED, withHelmet } from "./Sets";
import { BlackBox } from "./Story";
import { BigText, CctvHud, Transcript } from "./Overlays";
import data from "../../../public/jupiter2/lines.json";

type Line = { who: string; text: string; start: number; dur: number };
const LINES = data.lines as Line[];
export const JUP2_END = data.end;
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const CCTV = "grayscale(0.65) sepia(0.35) hue-rotate(55deg) saturate(1.3) contrast(1.25) brightness(1.1)";
const COLORS: Record<string, string> = {
  CaseOh: "#ffd34a",
  IShowSpeed: "#ff8a3a",
  KreekCraft: "#8aff8a",
  "Joe Bartolozzi": "#8ac8ff",
  MATEO: "#ff8ab0",
  "???": "#ff3b2a",
};
const clock = (T: number) => {
  const s = 51 + Math.floor(T);
  const mm = 29 + Math.floor(s / 60);
  return `07:${String(mm).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const withLine = (i: number, cam: string, render: Shot["render"]): Shot => ({
  start: LINES[i].start - 0.15,
  render,
  filter: CCTV,
  overlay: ({ t, T }) => (
    <>
      <CctvHud t={T} cam={cam} clock={clock(T)} />
      <Transcript t={t} stamp={`[${clock(T)}]`} who={LINES[i].who === "MATEO" ? "Mateo" : LINES[i].who} text={LINES[i].text} color={COLORS[LINES[i].who] ?? "#fff"} dur={LINES[i].dur} />
    </>
  ),
});

const Person: React.FC<{ look: Look; face?: "scared" | "worried" | "neutral" | "smug"; pose?: object; p: [number, number, number]; r?: number; s?: number }> = ({ look, face = "scared", pose = {}, p, r = 0, s = 1 }) => (
  <Character look={look} face={face} pose={pose} position={p} rotY={r} scale={s} />
);

export const JUP2_SHOTS: Shot[] = [
  /* title card */
  {
    start: 0,
    render: ({ t, p, T }) => (
      <>
        <color attach="background" args={["#020202"]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[2, 3, 3]} intensity={20} color="#ffd8a8" distance={10} decay={1.6} />
        <BlackBox p={[0, 0, 0]} t={T} r={[0.2, -0.5, 0]} />
        <Cam from={[1.6, 1.6, 5]} to={[1.0, 1.1, 3.6]} look={[0, 0, 0]} p={p} fov={40} t={t} />
      </>
    ),
    overlay: ({ t }) => <BigText t={t} lines={["RECOVERED FILE", "ODYSSEY JX-11", "FLIGHT RECORDER"]} sub="08/29/2011 · 07:29:51" />,
  },
  withLine(0, "CAM 01 · SURFACE", ({ t, p, T }) => (
    <>
      <MoonSurface t={T} night />
      {KEY_FIELD.slice(0, 40).map(([x, z, r], i) => (
        <Key key={i} p={[x * 0.7, 0.3 * (1 - seg(t, 0.2 + i * 0.02, 1 + i * 0.02)), z * 0.6]} rotY={r} t={T} awake={ease(seg(t, 0.2 + i * 0.02, 1 + i * 0.02))} />
      ))}
      <Person look={withHelmet(MATEO)} p={[2, 0, 4]} r={0.3} pose={{ armR: -1.2 }} />
      <Cam from={[6, 9, -6]} to={[6, 9, -6]} look={[0, 1, 16]} p={p} fov={54} t={0} />
    </>
  )),
  withLine(1, "CAM 04 · CORRIDOR B", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} />
      <Person look={SPEED} p={[0.6, 0, 2]} r={Math.PI + lerp(0, 0.8, seg(t, 0.2, 0.6))} pose={{ headY: 0.5 }} />
      <Cam from={[3.2, 6.8, 12]} to={[3.2, 6.8, 12]} look={[0, 2.4, 0]} p={p} fov={56} t={0} />
    </>
  )),
  withLine(2, "CAM 02 · COCKPIT", ({ t, p, T }) => (
    <>
      <Cockpit t={T} alarm />
      <Person look={KREEK} p={[-2, 1.9, -0.4]} pose={{ sit: true, armR: -2.8, armRz: 0.4, headX: -0.5 }} />
      <Person look={CASEOH} face="worried" p={[2, 1.9, -0.4]} pose={{ sit: true, headY: 0.6 }} s={1.12} />
      <Cam from={[3.8, 7.2, 4.4]} to={[3.8, 7.2, 4.4]} look={[0, 2.6, -1]} p={p} fov={60} t={0} />
    </>
  )),
  withLine(3, "CAM 04 · CORRIDOR B", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} alarm vent={1} keysIn={0.3} />
      <Person look={JOE} p={[-1.4, 0, lerp(-2, 6, seg(t, 0, 2))]} pose={walk(t, 12, 0.9)} />
      <Cam from={[3.2, 6.8, 12]} to={[3.2, 6.8, 12]} look={[0, 2.4, 0]} p={p} fov={56} t={0} />
    </>
  )),
  withLine(4, "CAM 05 · ARMORY", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} alarm />
      <Person look={CASEOH} face="smug" p={[0, 0, -2]} pose={{ armR: -1.5, armL: -1.4 }} s={1.12} />
      <group position={[0, 0, -2]} scale={1.12}>
        <B s={[0.35, 0.5, 1.8]} p={[0.6, 2.7, 1.3]} c="#2a2c30" />
      </group>
      <Cam from={[-3.2, 6.8, 6]} to={[-3.2, 6.8, 6]} look={[0, 3, -2]} p={p} fov={52} t={0} />
    </>
  )),
  withLine(5, "CAM 06 · AIRLOCK", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} alarm />
      <Person look={SPEED} p={[Math.sin(T * 30) * 0.06, 0, -12.2]} pose={{ armL: -1.6, armR: -1.6, lean: 0.35, legL: 0.4, legR: -0.3 }} />
      <Cam from={[3.4, 7, -5]} to={[3.4, 7, -5]} look={[0, 2.6, -12.4]} p={p} fov={54} t={0} shake={0.04} />
    </>
  )),
  withLine(6, "CAM 02 · COCKPIT", ({ t, p, T }) => (
    <>
      <Cockpit t={T} alarm />
      <Person look={KREEK} p={[-2, 1.9, -0.4]} pose={{ sit: true, armR: -1.2, armL: -1.2, headX: 0.3 }} />
      <Key p={[2.4, 0, 1]} rotY={-0.8} t={T} walk={1} />
      <Key p={[3.4, 0, 2.4]} rotY={-0.9} t={T + 1} walk={1} />
      <Cam from={[3.8, 7.2, 4.4]} to={[3.8, 7.2, 4.4]} look={[0, 2.6, -1]} p={p} fov={60} t={0} />
    </>
  )),
  withLine(7, "CAM 04 · CORRIDOR B", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} alarm keysIn={0.8} />
      <Person look={CASEOH} face="scared" p={[0, 0, lerp(6, 9, seg(t, 0, 2))]} r={Math.PI} pose={{ armR: -1.5, armL: -1.4 }} s={1.12} />
      <Cam from={[3.2, 6.8, 13]} to={[3.2, 6.8, 13]} look={[0, 2.4, 0]} p={p} fov={56} t={0} shake={0.03} />
    </>
  )),
  withLine(8, "CAM 06 · AIRLOCK", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} dark keysIn={seg(t, 0.6, 2)} />
      <Person look={JOE} face="neutral" p={[-2.2, 0, -11]} r={Math.PI - 0.6} pose={{ armR: -1.6 }} />
      <B s={[0.8, 1.0, 0.1]} p={[-3.0, 3.6, -13.6]} c="#ff3b2a" e="#ff2010" ei={1.5} />
      <Cam from={[3.4, 7, -5]} to={[3.4, 7, -5]} look={[0, 2.6, -12.4]} p={p} fov={54} t={0} />
    </>
  )),
  withLine(9, "CAM 04 · CORRIDOR B", ({ t, p, T }) => (
    <>
      <ShipInterior t={T} alarm />
      <Key p={[0, lerp(0, 3.0, ease(seg(t, 0, 1.2))), lerp(4, 9.4, ease(seg(t, 0, 1.2)))]} rotY={0} t={T} s={1.4} />
      <Cam from={[0, 6.6, 13.4]} to={[0, 6.6, 13.4]} look={[0, 4.6, 6]} p={p} fov={50} t={0} shake={0.05} />
    </>
  )),
  /* signal lost */
  {
    start: LINES[9].start + LINES[9].dur + 0.2,
    render: () => <color attach="background" args={["#000000"]} />,
    overlay: ({ t }) => <BigText t={t} lines={["SIGNAL LOST", "5 went to Jupiter.", "1 came back."]} />,
  },
];

export const JUP2_SFX: Sfx[] = [
  { src: "static", at: 0.1, vol: 0.4 },
  { src: "braam", at: 0.2, vol: 0.45 },
  { src: "riser", at: LINES[9].start - 2.4, vol: 0.3 },
  { src: "braam", at: LINES[9].start + LINES[9].dur + 0.15, vol: 0.55 },
  { src: "smiling1/beep.wav", at: 0.5, vol: 0.3 },
  ...LINES.map((l) => ({ src: "static", at: l.start - 0.25, vol: 0.12 })),
  { src: "knock", at: LINES[5].start + 0.2, vol: 0.7 },
  { src: "knock", at: LINES[5].start + 0.8, vol: 0.7 },
  { src: "static", at: LINES[9].start + LINES[9].dur + 0.1, vol: 0.6 },
  { src: "whoosh", at: JUP2_END + 0.1, vol: 0.35 },
  { src: "pop", at: JUP2_END + 66 / 30, vol: 0.3 },
];

export const JUP2_BEDS: Bed[] = [
  // no music: ship hum + alarm + heartbeat
  { src: "sfx/space_amb.wav", from: 0, to: JUP2_END + 3, vol: 0.14, fadeIn: 0.5, fadeOut: 2.5 },
  { src: "sfx/alarm.wav", from: LINES[2].start, to: LINES[2].start + 6, vol: 0.05, fadeIn: 0.3, fadeOut: 0.1 },
  { src: "sfx/alarm.wav", from: LINES[2].start + 6, to: LINES[8].start, vol: 0.05, fadeIn: 0.1, fadeOut: 0.5 },
  { src: "sfx/heartbeat.wav", from: LINES[4].start, to: LINES[4].start + 8, vol: 0.35, fadeIn: 0.5, fadeOut: 0.1 },
  { src: "sfx/heartbeat.wav", from: LINES[4].start + 8, to: LINES[9].start, vol: 0.4, fadeIn: 0.1, fadeOut: 0.3 },
];
