import React from "react";
import { Character, breathe, walk } from "../../lib/Character";
import type { Look } from "../../lib/Character";
import { clamp01, ease, lerp } from "../../lib/Cam";
import { Cam } from "../static/CamS";
import type { Shot } from "../../Shots";
import type { Bed, Sfx } from "../../Episode";
import { B } from "../../lib/Sets";
import { TextSign } from "../smiling/Props";
import { CASEOH, Cockpit, EscapePod, Jupiter, JOE, KEY_FIELD, Key, KREEK, Lander, MATEO, MoonSurface, ShipInterior, SPEED, withHelmet } from "./Sets";
import { FileStamp, NameCard, NewsChyron } from "./Overlays";
import cues from "../../../public/jupiter1/cues.json";

const L = cues.lines;
export const JUP1_END = cues.end;
const mid = (i: number, f = 0.5) => lerp(L[i], L[i + 1] ?? JUP1_END, f);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const Space: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={["#010104"]} />
    <ambientLight intensity={0.35} />
    <directionalLight position={[-60, 40, -100]} intensity={1.4} color="#ffd8b0" />
    <Jupiter t={t} p={[-60, 40, -400]} r={160} />
  </>
);

export const BlackBox: React.FC<{ p: [number, number, number]; t: number; r?: [number, number, number] }> = ({ p, t, r }) => (
  <group position={p} rotation={r}>
    <B s={[1.8, 1.3, 1.2]} c="#ff6a1a" />
    <B s={[1.82, 0.18, 1.22]} p={[0, 0.3, 0]} c="#111" />
    <B s={[1.82, 0.18, 1.22]} p={[0, -0.3, 0]} c="#111" />
    <TextSign text={"FLIGHT RECORDER\nDO NOT OPEN"} p={[0, 0, 0.62]} w={1.6} h={0.6} bg="#ff6a1a" fg="#111" />
    <B s={[0.15, 0.15, 0.1]} p={[0.7, 0.5, 0.62]} c="#ff2a1a" e="#ff2010" ei={Math.floor(t * 2) % 2 ? 3 : 0.2} />
  </group>
);

const Gun: React.FC = () => (
  <group position={[0.6, 2.7, 1.3]}>
    <B s={[0.35, 0.5, 1.8]} c="#2a2c30" />
    <B s={[0.25, 0.8, 0.35]} p={[0, -0.5, -0.4]} c="#2a2c30" />
    <B s={[0.2, 0.2, 0.8]} p={[0, 0.15, 1.2]} c="#4a4c50" />
  </group>
);

/* one crew intro shot */
const intro = (start: number, look: Look, name: string, role: string, status: string, scale = 1, statusColor?: string): Shot => ({
  start,
  render: ({ t, p, T }) => (
    <>
      <Cockpit t={T} />
      <Character look={look} face="smug" pose={{ ...breathe(t), armL: -0.3 }} position={[0, 0, 0.6]} scale={scale} />
      <Cam from={[0.8, 4.6 * scale, 6.4]} to={[0.6, 4.5 * scale, 5.8]} look={[0, 4.1 * scale, 0.6]} p={p} fov={42} t={t} />
    </>
  ),
  overlay: ({ t }) => <NameCard name={name} role={role} t={t} status={status} statusColor={statusColor} />,
});

export const JUP1_SHOTS: Shot[] = [
  /* "In 2011, five people launched on a secret mission to Jupiter." */
  {
    start: L[0],
    render: ({ t, p, T }) => (
      <>
        <Space t={T} />
        <group position={[lerp(-8, 6, p), lerp(-4, 2, p), lerp(10, -30, p)]} rotation={[0.2, 0.6, 0.1]} scale={0.5}>
          <Lander p={[0, 0, 0]} />
        </group>
        <Cam from={[0, 2, 24]} to={[0, 3, 18]} look={[0, 2, -40]} p={p} fov={50} t={t} linear />
      </>
    ),
    overlay: ({ t }) => <FileStamp t={t} title="CLASSIFIED" sub="MISSION JX-11 · 2011" />,
  },
  /* "The ship was called Odyssey J X eleven." */
  {
    start: L[1],
    render: ({ t, p, T }) => (
      <>
        <Space t={T} />
        <Lander p={[0, -10, -10]} />
        <Cam from={[-6, 2, 8]} to={[4, 1.4, 6]} look={[0, 0.6, -5]} p={p} fov={46} t={t} linear />
      </>
    ),
  },
  /* the crew */
  intro(L[2], CASEOH, "CaseOh", "COMMANDER", "", 1.12),
  intro(mid(2, 0.183), KREEK, "KreekCraft", "PILOT", ""),
  intro(mid(2, 0.364), SPEED, "IShowSpeed", "FLIGHT ENGINEER", ""),
  intro(mid(2, 0.525), JOE, "Joe Bartolozzi", "SCIENCE OFFICER", ""),
  intro(mid(2, 0.762), MATEO, "Mateo", "ROOKIE", ""),
  /* "They landed on a frozen moon, right under the giant red storm." */
  {
    start: L[3],
    render: ({ t, p, T }) => (
      <>
        <MoonSurface t={T} />
        <Lander p={[0, lerp(30, 0, ease(seg(t, 0, 2.4))), -20]} />
        {t < 2.4 ? <pointLight position={[0, lerp(28, 0, ease(seg(t, 0, 2.4))), -20]} intensity={120} color="#ffb84a" distance={30} decay={1.4} /> : null}
        <Cam from={[30, 4, 50]} to={[26, 5, 44]} look={[0, 12, -20]} lookTo={[-10, 40, -80]} p={p} fov={52} t={t} shake={t > 2.2 && t < 2.6 ? 0.12 : 0} />
      </>
    ),
  },
  /* "And on the ice, they found thousands of golden keys. Just lying there." */
  {
    start: L[4],
    render: ({ t, p, T }) => (
      <>
        <MoonSurface t={T} />
        <Lander />
        {KEY_FIELD.map(([x, z, r], i) => (
          <Key key={i} p={[x, 0.3, z]} rotY={r} t={T} awake={0} />
        ))}
        {[CASEOH, KREEK, SPEED, JOE, MATEO].map((lk, i) => (
          <Character key={i} look={withHelmet(lk)} face="worried" pose={walk(t + i, 4, 0.35)} position={[-6 + i * 3, 0, -2 + t * 0.8]} scale={lk === CASEOH ? 1.12 : 1} />
        ))}
        <Cam from={[0, 7, -12]} to={[0, 8, -10]} look={[0, 1, 24]} p={p} fov={54} t={t} />
      </>
    ),
  },
  /* "…Asleep." */
  {
    start: mid(4, 0.72),
    render: ({ t, p, T }) => (
      <>
        <MoonSurface t={T} />
        <Key p={[0, 0.3, 0]} rotY={0.4} t={T} awake={0} />
        <Cam from={[2.6, 3.4, 3.2]} to={[2.2, 3.0, 2.6]} look={[0, 0.5, -2]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "Mateo picked one up." */
  {
    start: L[5],
    render: ({ t, p, T }) => {
      const k = ease(seg(t, 0.1, 1.0));
      return (
        <>
          <MoonSurface t={T} />
          <Character look={withHelmet(MATEO)} face="smile" pose={{ lean: 0.5 * (1 - k), armR: -1.3 * k - 0.3, armL: -0.2 }} position={[0, 0, 0]} rotY={Math.PI} />
          <Key p={[0.7 + 0 * k, lerp(0.3, 2.4, k), lerp(-2.0, -1.5, k)]} rotY={0} t={T} awake={0} s={0.45} />
          <Cam from={[4, 4.6, -6]} to={[3.4, 4.2, -5.4]} look={[0.3, 2.6, -0.8]} p={p} fov={44} t={t} />
        </>
      );
    },
  },
  /* "It opened its eyes." */
  {
    start: L[6],
    render: ({ t, p, T }) => (
      <>
        <MoonSurface t={T} />
        <Key p={[0, 0, 0]} rotY={0} t={T} awake={1} eyes={t > 0.5 ? 1 : 0} />
        <Cam from={[0, 3.8, 3.6]} to={[0, 3.75, 3.0]} look={[0, 3.75, 0]} p={p} fov={30} t={t} shake={t > 0.5 && t < 0.7 ? 0.06 : 0} />
      </>
    ),
  },
  /* "By nightfall, the keys were inside the ship. Through the vents." */
  {
    start: L[7],
    render: ({ t, p, T }) => (
      <>
        <MoonSurface t={T} night />
        <Lander lights={false} />
        {KEY_FIELD.map(([x, z, r], i) => (
          <Key key={i} p={[x * 0.6, 0, z * 0.5 - 12 + Math.sin(T + i) * 0.4]} rotY={Math.PI + Math.sin(i) * 0.4} t={T + i} walk={1} />
        ))}
        <Cam from={[24, 10, 30]} to={[20, 9, 26]} look={[0, 6, -14]} p={p} fov={50} t={t} />
      </>
    ),
  },
  {
    start: mid(7, 0.5),
    render: ({ t, p, T }) => (
      <>
        <ShipInterior t={T} dark vent={ease(seg(t, 0.1, 0.7))} keysIn={seg(t, 0.4, 1.6)} />
        <Cam from={[-1.5, 3.4, 13]} to={[-1.2, 3.6, 11]} look={[1.6, 5, 0]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* "The black box recorded everything." */
  {
    start: L[8],
    render: ({ t, p, T }) => (
      <>
        <Cockpit t={T} alarm />
        <BlackBox p={[0, 0.65, 2.4]} t={T} r={[0, -0.4, 0]} />
        <Cam from={[2.6, 2.6, 6]} to={[1.8, 2.2, 5.2]} look={[0, 0.7, 2.4]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "'It's in the vents!' KreekCraft screamed." */
  {
    start: L[9],
    render: ({ t, p, T }) => (
      <>
        <Cockpit t={T} alarm />
        <Character look={KREEK} face="scared" pose={{ sit: true, armR: -2.8, armRz: 0.4, headX: -0.4 }} position={[-2, 1.9, -0.4]} />
        <Cam from={[-0.6, 5.0, 4.6]} to={[-0.8, 4.9, 4.0]} look={[-2, 4.6, -0.4]} p={p} fov={42} t={t} shake={0.04} />
      </>
    ),
    overlay: ({ t }) => <NameCard name="KreekCraft" role="PILOT" t={t} status="SIGNAL LOST" />,
  },
  /* "Then his radio went silent." */
  {
    start: mid(9, 0.6),
    render: ({ t, p, T }) => (
      <>
        <Cockpit t={T} alarm />
        <TextSign text={"NO SIGNAL"} p={[-2.6, 3.6, -3.84]} w={2.1} h={1.3} bg="#050505" fg="#ff3b2a" glow />
        <Cam from={[-1.4, 4.2, 1.6]} to={[-1.6, 4.0, 1.0]} look={[-2.6, 3.6, -3.9]} p={p} fov={36} t={t} />
      </>
    ),
  },
  /* "Speed held the airlock door, alone, for eleven minutes." */
  {
    start: L[10],
    render: ({ t, p, T }) => (
      <>
        <ShipInterior t={T} alarm />
        <Character look={SPEED} face="scared" pose={{ armL: -1.6, armR: -1.6, lean: 0.35, legL: 0.4, legR: -0.3 }} position={[0 + Math.sin(T * 30) * 0.05, 0, -12.2]} />
        <Cam from={[2.6, 4.6, -4]} to={[2.2, 4.4, -5]} look={[0, 3.4, -12.6]} p={p} fov={46} t={t} shake={0.03} />
      </>
    ),
    overlay: ({ t }) => <NameCard name="IShowSpeed" role="FLIGHT ENGINEER" t={t} status="11 MINUTES" statusColor="#ffd34a" />,
  },
  /* "Mateo's body was never found." */
  {
    start: L[11],
    render: ({ t, p, T }) => (
      <>
        <ShipInterior t={T} dark />
        <mesh position={[0.6, 1.0, 3]}>
          <sphereGeometry args={[1.05, 18, 14]} />
          <meshStandardMaterial color="#cfe8ff" transparent opacity={0.4} roughness={0.05} />
        </mesh>
        <pointLight position={[0.6, 3, 5]} intensity={18} color="#cfe0ff" distance={8} decay={1.6} />
        <Cam from={[2.6, 2.6, 8]} to={[2.2, 2.2, 7]} look={[0.6, 1, 3]} p={p} fov={40} t={t} />
      </>
    ),
    overlay: ({ t }) => <NameCard name="Mateo" role="ROOKIE" t={t} status="MISSING" />,
  },
  /* "Joe was never found either. But some say… he opened the door for them." */
  {
    start: L[12],
    render: ({ t, p, T }) => (
      <>
        <ShipInterior t={T} dark />
        <pointLight position={[0, 5, -7]} intensity={30} color="#9fb4ff" distance={12} decay={1.5} />
        <Character look={JOE} face="neutral" pose={{ armR: -1.4 }} position={[-2.2, 0, -11]} rotY={Math.PI - 0.6} />
        <B s={[0.8, 1.0, 0.1]} p={[-3.0, 3.6, -13.6]} c="#3bff6a" e="#2aff5a" ei={1.2} />
        <Cam from={[1.6, 4.2, -3]} to={[1.2, 4.0, -4]} look={[-2.2, 3.4, -11.5]} p={p} fov={44} t={t} />
      </>
    ),
    overlay: ({ t }) => <NameCard name="Joe Bartolozzi" role="SCIENCE OFFICER" t={t} status="MISSING" />,
  },
  {
    start: mid(12, 0.55),
    render: ({ t, p, T }) => (
      <>
        <ShipInterior t={T} dark keysIn={seg(t, 0.4, 1.6)} />
        <pointLight position={[0, 5, -7]} intensity={30} color="#9fb4ff" distance={12} decay={1.5} />
        <Character look={JOE} face="smug" pose={{ armR: -1.6 }} position={[-2.2, 0, -11]} rotY={Math.PI - 0.6} />
        <B s={[0.8, 1.0, 0.1]} p={[-3.0, 3.6, -13.6]} c="#ff3b2a" e="#ff2010" ei={1.5} />
        <Cam from={[-0.8, 4.8, -6.8]} to={[-1.0, 4.7, -7.2]} look={[-2.2, 4.4, -11]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* "CaseOh grabbed the only gun on board, and made it to the escape pod." */
  {
    start: L[13],
    render: ({ t, p, T }) => (
      <>
        <ShipInterior t={T} alarm />
        <group position={[0, 0, lerp(-6, 6, seg(t, 0, 2))]}>
          <Character look={CASEOH} face="worried" pose={{ ...walk(t, 10, 0.7), armR: -1.5, armL: -1.4 }} scale={1.12} />
          <group scale={1.12}>
            <Gun />
          </group>
        </group>
        <Cam from={[0, 5, 14]} to={[0, 5, 13]} look={[0, 3.6, 0]} p={p} fov={46} t={t} />
      </>
    ),
    overlay: ({ t }) => <NameCard name="CaseOh" role="COMMANDER" t={t} status="SURVIVOR" statusColor="#3bff6a" />,
  },
  {
    start: mid(13, 0.55),
    render: ({ t, p, T }) => (
      <>
        <MoonSurface t={T} night />
        <Lander lights={false} />
        <EscapePod p={[-14, lerp(0, 40, ease(seg(t, 0.3, 2.4))), -18]} t={T} flame={seg(t, 0, 0.3)} />
        <Cam from={[10, 3, 24]} to={[8, 4, 20]} look={[-14, 8, -18]} lookTo={[-14, 30, -18]} p={p} fov={52} t={t} shake={0.08 * (1 - seg(t, 0, 2))} />
      </>
    ),
  },
  /* "Five went to Jupiter. Only one came back." */
  {
    start: L[14],
    render: ({ t, p, T }) => (
      <>
        <Space t={T} />
        <EscapePod p={[lerp(-2, 4, p), lerp(-2, 1, p), lerp(-6, -24, p)]} r={[0.9, 0.3, 0]} t={T} flame={0.6} />
        <Cam from={[0, 1, 10]} to={[0, 1.4, 8]} look={[0, 0, -40]} p={p} fov={50} t={t} linear />
      </>
    ),
  },
  /* "He never talks about it." */
  {
    start: L[15],
    render: ({ t, p, T }) => (
      <>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.1} />
        <spotLight position={[0, 12, 2]} angle={0.5} penumbra={0.5} intensity={220} color="#ffe6c8" distance={30} decay={1.4} />
        <B s={[30, 0.2, 30]} p={[0, -0.1, 0]} c="#2a2a2e" />
        <B s={[4, 0.3, 2.4]} p={[0, 2.6, 1.6]} c="#5a3a24" />
        <Character look={{ ...CASEOH, shirt: "#3a3a44", pants: "#2a2a30", patch: undefined }} face="neutral" pose={{ sit: true, armL: -1.2, armR: -1.2, headX: 0.15 }} position={[0, 1.6, 0]} scale={1.12} />
        <Cam from={[0, 5.2, 9]} to={[0, 5.0, 8]} look={[0, 4.2, 0]} p={p} fov={40} t={t} />
      </>
    ),
    overlay: ({ t }) => <NewsChyron t={t} />,
  },
  /* "But if you play the black box at full volume… you can still hear them." */
  {
    start: L[16],
    render: ({ t, p, T }) => (
      <>
        <color attach="background" args={["#020202"]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[2, 3, 3]} intensity={20} color="#ffd8a8" distance={10} decay={1.6} />
        <BlackBox p={[0, 0, 0]} t={T} r={[0.2, -0.5, 0]} />
        <Cam from={[1.4, 1.4, 4.4]} to={[0.9, 1.0, 3.2]} look={[0, 0, 0]} p={p} fov={40} t={t} />
      </>
    ),
  },
];

export const JUP1_SFX: Sfx[] = [
  { src: "rumble", at: L[3], vol: 0.3 },
  { src: "thud", at: L[3] + 2.3, vol: 0.5 },
  { src: "boom", at: L[6] + 0.5, vol: 0.4 },
  { src: "creak", at: mid(7, 0.5), vol: 0.4 },
  { src: "smiling1/beep.wav", at: L[8], vol: 0.25 },
  { src: "static", at: mid(9, 0.6), vol: 0.35 },
  { src: "knock", at: L[10] + 0.3, vol: 0.6 },
  { src: "knock", at: L[10] + 0.9, vol: 0.6 },
  { src: "knock", at: L[10] + 1.4, vol: 0.6 },
  { src: "rumble", at: mid(13, 0.55), vol: 0.35 },
  { src: "jupiter2/keys_chant.wav", at: L[16] + 1.6, vol: 0.35 },
  { src: "whoosh", at: JUP1_END + 0.1, vol: 0.35 },
  { src: "pop", at: JUP1_END + 66 / 30, vol: 0.3 },
];

export const JUP1_BEDS: Bed[] = [
  { src: "sfx/synth.wav", from: 0, to: L[3], vol: 0.22, fadeIn: 0.5, fadeOut: 0.8 },
  { src: "sfx/drone.wav", from: L[3], to: JUP1_END + 3, vol: 0.2, fadeIn: 1.0, fadeOut: 2.5 },
  { src: "sfx/bass.wav", from: L[7], to: JUP1_END + 3, vol: 0.22, fadeIn: 1.0, fadeOut: 2.5 },
];
