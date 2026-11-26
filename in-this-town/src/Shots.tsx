import React from "react";
import { Character, walk, breathe } from "./lib/Character";
import { Cam, clamp01, ease, easeOut, lerp } from "./lib/Cam";
import { B, Bunker, OutsideCorridor, ShoesCorridor, Town } from "./lib/Sets";
import { DAD, GIRL, GRANDMA, GUARD, KID2, MOM, NOAH, NOAH_NOBAG, ZOMBIE, ZOMBIES } from "./lib/cast";

export type ShotCtx = { t: number; p: number; T: number };
export type Shot = { start: number; render: (c: ShotCtx) => React.ReactNode; overlay?: (c: ShotCtx) => React.ReactNode };

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const tremble = (t: number, amp = 0.05) => Math.sin(t * 55) * amp;

/* Sleeping / sitting families used in several bunker shots */
const Families: React.FC<{ t: number; asleep?: boolean; face?: "worried" | "scared" | "neutral"; look?: number; noKid?: boolean }> = ({
  t,
  asleep,
  face = "worried",
  look = 0,
  noKid,
}) =>
  asleep ? (
    <>
      <Character look={MOM} face="sleep" pose={{ lie: true }} position={[-5.2, 2.45, -3.8]} />
      <Character look={GIRL} face="sleep" pose={{ lie: true }} position={[-5.2, 5.65, -3.8]} />
      <Character look={DAD} face="sleep" pose={{ lie: true }} position={[-5.2, 2.45, 3.7]} />
      <Character look={GRANDMA} face="sleep" pose={{ lie: true }} position={[-5.2, 5.65, 3.7]} />
      <Character look={KID2} face="sleep" pose={{ lie: true }} position={[5.2, 5.65, -3.8]} />
    </>
  ) : (
    <>
      <Character look={MOM} face={face} pose={{ sit: true, ...breathe(t), headY: look }} position={[-4.1, 1.6, -7.6]} rotY={Math.PI / 2} />
      <Character look={GIRL} face={face} pose={{ sit: true, ...breathe(t + 1), headY: look }} position={[-4.1, 1.6, -5.2]} rotY={Math.PI / 2} scale={0.8} />
      <Character look={DAD} face={face} pose={{ sit: true, ...breathe(t + 2), headY: -look }} position={[-4.1, 1.6, 0.2]} rotY={Math.PI / 2} />
      <Character look={GRANDMA} face={face} pose={{ sit: true, ...breathe(t + 3), headY: -look }} position={[-4.1, 1.6, 2.2]} rotY={Math.PI / 2} />
      {noKid ? null : <Character look={KID2} face={face} pose={{ sit: true, ...breathe(t + 4), headY: look }} position={[4.1, 1.6, -6.5]} rotY={-Math.PI / 2} scale={0.8} />}
    </>
  );

export const SHOTS: Shot[] = [
  /* 0.00 "In this town," – aerial over the town at dusk */
  {
    start: 0,
    render: ({ t, p }) => (
      <>
        <Town t={t} />
        <Cam from={[34, 42, 52]} to={[24, 30, 34]} look={[-4, 2, -10]} lookTo={[-6, 4, -12]} p={p} fov={45} t={t} linear />
      </>
    ),
  },
  /* 0.95 "when the siren goes off," – siren close-up */
  {
    start: 0.95,
    render: ({ t, p }) => (
      <>
        <Town t={t + 3} />
        <Cam from={[-1.5, 6, -4]} to={[-2.5, 7, -6.5]} look={[-6.5, 12.4, -14]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* 1.96 "everyone goes down to the bunker." – people run to the hatch */
  {
    start: 1.96,
    render: ({ t, p }) => {
      const run = (z0: number, x: number, look: typeof MOM, ph: number, s = 1) => {
        const z = z0 + t * 7;
        const x2 = lerp(x, -11, seg(z, 2, 12));
        return <Character key={z0} look={look} face="scared" pose={walk(t + ph, 14, 1)} position={[x2, 0, Math.min(z, 12)]} rotY={x2 < x - 0.5 ? -0.6 : 0} scale={s} />;
      };
      return (
        <>
          <Town t={t + 4} />
          {run(-4, -3, MOM, 0)}
          {run(-7, -1, GIRL, 1, 0.8)}
          {run(-10, -4, DAD, 2)}
          {run(-13, 0, GRANDMA, 3)}
          {run(-2, 1.5, KID2, 4, 0.8)}
          {run(-16, -2, GUARD, 5)}
          <Cam from={[3.5, 4.2, -14]} to={[2.5, 4.8, -5]} look={[-2, 2.8, -2]} lookTo={[-8, 2.4, 10]} p={p} fov={50} t={t} />
        </>
      );
    },
  },
  /* 3.27 "And there's only one rule." – bunker wide */
  {
    start: 3.27,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Families t={t} />
        <Character look={GUARD} face="neutral" pose={breathe(t)} position={[1.2, 0, -9.5]} rotY={Math.PI} />
        <Cam from={[0, 4.6, 8.5]} to={[0, 4.3, 5]} look={[0, 3.2, -12]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* 4.42 "You never open the door." – the wheel locks, bolt slams */
  {
    start: 4.42,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} wheel={-easeOut(seg(t, 0, 0.6)) * 2.5} />
        <Cam from={[2.6, 3.4, -6.4]} to={[1.8, 3.1, -8.4]} look={[0.5, 2.8, -12]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* 5.76 "Not even if someone knocks." – worried families */
  {
    start: 5.76,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Families t={t} />
        <Cam from={[2.4, 4.8, -1.2]} to={[1.6, 4.6, -2.2]} look={[-4.1, 3.6, -5.6]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* 7.05 "Because every night," – slow push on the door */
  {
    start: 7.05,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Cam from={[0, 3.2, -1]} to={[0, 3.0, -5.5]} look={[0, 3, -12]} p={p} fov={42} t={t} linear />
      </>
    ),
  },
  /* 8.02 "someone knocks." – door shakes, faces snap to it */
  {
    start: 8.02,
    render: ({ t, p, T }) => {
      const k = seg(t, 0.4, 0.55);
      const look = -0.9 * easeOut(k);
      return (
        <>
          <Bunker t={T} outside={false} doorShake={Math.sin(t * 60) * Math.max(0, 1 - Math.abs(t - 0.42) * 8)} />
          <Character look={GIRL} face={t > 0.45 ? "scared" : "worried"} pose={{ sit: true, headY: look }} position={[-4.1, 1.6, -5.2]} rotY={Math.PI / 2} scale={0.8} />
          <Character look={MOM} face={t > 0.45 ? "scared" : "worried"} pose={{ sit: true, headY: look * 0.8 }} position={[-4.1, 1.6, -7.6]} rotY={Math.PI / 2} />
          <Cam from={[2.6, 4.6, -1.6]} to={[2.2, 4.5, -2.2]} look={[-4.1, 3.5, -6.4]} p={p} fov={44} t={t} shake={t > 0.4 && t < 0.7 ? 0.06 : 0} />
        </>
      );
    },
  },
  /* 9.11 "Noah was 12. He'd just moved there." – Noah walks in, looks around */
  {
    start: 9.11,
    render: ({ t, p, T }) => {
      const z = lerp(-8.5, -2.5, ease(seg(t, 0, 1.4)));
      const moving = t < 1.4;
      return (
        <>
          <Bunker t={T} outside={false} />
          <Families t={t} face="neutral" look={0.4} />
          <Character
            look={NOAH}
            face="neutral"
            pose={{ ...(moving ? walk(t, 8, 0.6) : breathe(t)), headY: Math.sin(t * 2.2) * 0.5 }}
            position={[0.4, 0, z]}
          />
          <Cam from={[1.6, 5.4, 4.5]} to={[1.2, 5.3, 2.8]} look={[0.4, 4.2, z]} p={p} fov={40} t={t} />
        </>
      );
    },
  },
  /* 10.84 "He asked who was knocking." – over the shoulder to the guard */
  {
    start: 10.84,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Character look={NOAH} face="neutral" pose={{ ...breathe(t), armR: -0.6 - Math.sin(t * 6) * 0.15, headX: -0.08 }} position={[1.2, 0, -2.5]} rotY={Math.PI} />
        <Character look={GUARD} face="neutral" pose={{ ...breathe(t), headX: 0.12 }} position={[-0.6, 0, -6.5]} rotY={0.2} />
        <Cam from={[4.2, 5.4, -0.4]} to={[4.0, 5.3, -1.0]} look={[-0.9, 4.5, -6.5]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* 12.02 "The old guard just said," – guard close-up */
  {
    start: 12.02,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Character look={GUARD} face="worried" pose={{ ...breathe(t), headX: 0.08 }} position={[-0.6, 0, -6.5]} rotY={0.2} />
        <Cam from={[0.8, 5.0, -0.6]} to={[0.6, 4.95, -1.6]} look={[-0.6, 4.4, -6.5]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* 12.91 "The last family who opened it," – extreme close, he glances at the door */
  {
    start: 12.91,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Character look={GUARD} face="worried" pose={{ headY: -0.55 * ease(seg(t, 0.2, 0.9)), headX: 0.1 }} position={[-0.6, 0, -6.5]} rotY={0.2} />
        <Cam from={[0.3, 4.4, -2.4]} to={[0.2, 4.45, -3.0]} look={[-0.6, 4.65, -6.5]} p={p} fov={36} t={t} />
      </>
    ),
  },
  /* 14.12 "all we found were their shoes." – shoes alone in a corridor */
  {
    start: 14.12,
    render: ({ t, p }) => (
      <>
        <ShoesCorridor t={t} />
        <Cam from={[0.4, 1.6, 7]} to={[0.1, 0.9, 2.4]} look={[0, 0.3, 0]} p={p} fov={38} t={t} linear />
      </>
    ),
  },
  /* 15.81 "Noah laughed." */
  {
    start: 15.81,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Character look={NOAH} face="laugh" pose={{ headX: -0.15 + Math.abs(Math.sin(t * 14)) * 0.12, armL: 0.1, armR: -0.1 }} position={[1.2, 0, -2.5]} rotY={-0.3} />
        <Cam from={[0.3, 4.9, 3.0]} to={[0.4, 4.85, 2.2]} look={[1.2, 4.4, -2.5]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* 16.36 "He thought it was just a story to scare little kids." – smug, lies down */
  {
    start: 16.36,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} outside={false} />
        <Families t={t} face="worried" noKid />
        <Character look={NOAH_NOBAG} face="smug" pose={{ lie: true, armL: -2.9, armR: -2.9, headX: 0.2 }} position={[5.2, 2.45, -3.8]} />
        <Cam from={[3.4, 4.2, -4.6]} to={[4.4, 4.2, -5.4]} look={[5.2, 2.8, -8.4]} p={p} fov={50} t={t} />
      </>
    ),
  },
  /* 18.49 "So that night," – bunker at night, everyone asleep */
  {
    start: 18.49,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} mood="night" outside={false} />
        <Families t={t} asleep />
        <Character look={NOAH_NOBAG} face="sleep" pose={{ lie: true }} position={[5.2, 2.45, -3.8]} />
        <Cam from={[0, 7, 8.5]} to={[0, 6.6, 6.5]} look={[0, 2.2, -9]} p={p} fov={52} t={t} linear />
      </>
    ),
  },
  /* 19.21 "when everyone was asleep," – Noah opens his eyes */
  {
    start: 19.21,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} mood="night" outside={false} />
        <Character look={NOAH_NOBAG} face={t > 0.75 ? "neutral" : "sleep"} pose={{ lie: true, headY: t > 0.9 ? -0.4 * ease(seg(t, 0.9, 1.2)) : 0 }} position={[5.2, 2.45, -3.8]} />
        <Cam from={[5.0, 4.2, -6.2]} to={[5.1, 4.2, -6.7]} look={[5.2, 2.8, -8.9]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* 20.42 "Knock, knock, knock," – the door, at night */
  {
    start: 20.42,
    render: ({ t, p, T }) => {
      const hits = [0.03, 0.47, 0.88];
      const shake = hits.reduce((s, h) => s + Math.max(0, 1 - Math.abs(t - h - 0.04) * 10) * Math.sin(t * 70), 0);
      return (
        <>
          <Bunker t={T} mood="night" outside={false} doorShake={shake} />
          <Cam from={[0.8, 3.1, -5.2]} to={[0.4, 3.0, -7.6]} look={[0, 2.9, -12]} p={p} fov={40} t={t} shake={Math.abs(shake) * 0.03} linear />
        </>
      );
    },
  },
  /* 21.94 "he opened it." – Noah's hand on the wheel, door swings */
  {
    start: 21.94,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} mood="night" door={0.5 * easeOut(seg(t, 0.15, 0.72))} wheel={t * 2} />
        <Character look={NOAH_NOBAG} face="worried" pose={{ armR: -1.5, armL: -0.3 }} position={[0.9, 0, -9.6]} rotY={Math.PI} />
        <Cam from={[3.8, 7.8, -2.6]} to={[3.4, 7.6, -3.6]} look={[0.2, 2.6, -12]} p={p} fov={46} t={t} />
      </>
    ),
  },
  /* 22.66 "A zombie was standing right in front of him." – the reveal */
  {
    start: 22.66,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} mood="night" door={0.55} />
          <pointLight position={[0.5, 4.5, -8]} color="#9fe0a8" intensity={12} distance={10} decay={1.5} />
        <Character look={ZOMBIE} pose={{ ...breathe(t, 0.05), headZ: 0.12, armL: -0.2, armR: -0.1 }} position={[0, 0, -13.6]} />
        <Cam from={[0.3, 3.4, -8.4]} to={[0.2, 3.6, -9.4]} look={[0, 4.6, -13.6]} p={p} fov={44} t={t} />
      </>
    ),
  },
  /* 24.40 "Noah fell backwards." */
  {
    start: 24.4,
    render: ({ t, p, T }) => {
      const f = ease(seg(t, 0.05, 0.55));
      return (
        <>
          <Bunker t={T} mood="night" door={0.55} />
          <pointLight position={[0.5, 4.5, -8]} color="#9fe0a8" intensity={12} distance={10} decay={1.5} />
          <Character look={ZOMBIE} pose={breathe(t, 0.05)} position={[0, 0, -13.4]} />
          <Character
            look={NOAH_NOBAG}
            face="scared"
            pose={{ lean: -1.25 * f, armL: -2.6 * f, armR: -2.4 * f, legL: -0.8 * f, legR: -0.5 * f }}
            position={[0, -0.0 + f * 0.6, -9.6 + f * 1.4]}
            rotY={Math.PI}
          />
          <Cam from={[2.4, 3.4, 1.2]} to={[2.2, 3.2, 0.4]} look={[0, 2.4, -10]} p={p} fov={52} t={t} shake={t > 0.5 && t < 0.7 ? 0.12 : 0} />
        </>
      );
    },
  },
  /* 25.40 "The zombie stepped closer and raised its hand." – low angle from the floor */
  {
    start: 25.4,
    render: ({ t, p, T }) => {
      const z = lerp(-13.4, -10.8, ease(seg(t, 0, 1.0)));
      const raise = ease(seg(t, 1.05, 1.8));
      return (
        <>
          <Bunker t={T} mood="night" door={0.55} />
          <pointLight position={[0.5, 4.5, -8]} color="#9fe0a8" intensity={12} distance={10} decay={1.5} />
          <Character look={ZOMBIE} pose={{ ...(t < 1 ? walk(t, 4.5, 0.35) : {}), armR: -2.7 * raise, headX: 0.25 }} position={[0, 0, z]} />
          <Cam from={[0.5, 1.1, -6.8]} to={[0.4, 1.0, -7.4]} look={[0, 4.8, -11]} p={p} fov={46} t={t} />
        </>
      );
    },
  },
  /* 27.43 "Then it whispered," – extreme close-up on the zombie */
  {
    start: 27.43,
    render: ({ t, p, T }) => (
      <>
        <Bunker t={T} mood="night" door={0.55} />
          <pointLight position={[0.5, 4.5, -8]} color="#9fe0a8" intensity={12} distance={10} decay={1.5} />
        <Character look={ZOMBIE} pose={{ armR: -2.7, headX: 0.15, headZ: 0.1 + Math.sin(t * 2) * 0.03 }} position={[0, 0, -10.8]} />
        <Cam from={[0.4, 4.8, -5.6]} to={[0.3, 4.7, -6.4]} look={[0, 4.4, -10.8]} p={p} fov={40} t={t} />
      </>
    ),
  },
  /* 28.15 "Close it. Quick!" – the zombie slips in and hides behind Noah */
  {
    start: 28.15,
    render: ({ t, p, T }) => {
      const m = ease(seg(t, 0, 0.55));
      return (
        <>
          <Bunker t={T} mood="night" door={0.55} />
          <pointLight position={[0.5, 4.5, -8]} color="#9fe0a8" intensity={12} distance={10} decay={1.5} />
          <Character look={NOAH_NOBAG} face="scared" pose={{ sit: true, armL: 0.4, armR: 0.4, headY: lerp(0, -2.6, ease(seg(t, 0.5, 0.9))) }} position={[0.2, 1.6, -8.2]} rotY={Math.PI} />
          <Character
            look={ZOMBIE}
            pose={t < 0.55 ? { ...walk(t, 12, 0.8), lean: 0.4 } : { sit: true, armL: -2.9, armR: -2.9, headX: 0.5, lean: 0.15 }}
            position={[lerp(0, -1.8, m) + (t > 0.55 ? tremble(t) : 0), t < 0.55 ? 0 : 1.6, lerp(-10.8, -4.4, m)]}
            rotY={t < 0.55 ? Math.PI * 0.95 : 0}
          />
          <Cam from={[3.2, 5.2, 0.4]} to={[3.0, 5.0, 0.0]} look={[-1.0, 2.0, -6.4]} p={p} fov={56} t={t} />
        </>
      );
    },
  },
  /* 29.40 "The zombies weren't knocking to get in." – the corridor full of scared zombies */
  {
    start: 29.4,
    render: ({ t, p, T }) => {
      const spots: [number, number, number, boolean][] = [
        [-2.2, -15.5, 0.4, false],
        [1.8, -16.5, -0.3, true],
        [-0.4, -18.5, 0.1, false],
        [2.4, -20.5, -0.5, false],
        [-2.6, -21.5, 0.6, true],
        [0.6, -23.5, 0.0, false],
      ];
      return (
        <>
          <Bunker t={T} mood="night" door={0.9} />
          {spots.map(([x, z, ry, crouch], i) => (
            <Character
              key={i}
              look={ZOMBIES[i]}
              pose={
                crouch
                  ? { sit: true, armL: -2.8, armR: -2.8, headX: 0.4 }
                  : { armL: -2.6 + Math.sin(t * 3 + i) * 0.1, armR: -2.5, armLz: 0.3, armRz: -0.3, headY: Math.sin(t * 1.5 + i) * 0.5 }
              }
              position={[x + tremble(t + i, 0.04), crouch ? 1.6 : 0, z]}
              rotY={ry}
            />
          ))}
          <Cam from={[0.3, 4.4, -8.6]} to={[0.2, 4.6, -11.8]} look={[0, 3.6, -22]} p={p} fov={46} t={t} linear />
        </>
      );
    },
  },
  /* 31.22 "They were knocking to hide." – close on two zombies huddled together */
  {
    start: 31.22,
    render: ({ t, p, T }) => (
      <>
        <color attach="background" args={["#030604"]} />
        <fog attach="fog" args={["#06100a", 6, 30]} />
        <ambientLight intensity={0.08} />
        <OutsideCorridor t={T} bright={0.8} />
        <Character look={ZOMBIES[1]} pose={{ armL: -1.4, armR: -1.2, armRz: -0.8, headY: 0.5 + Math.sin(t * 6) * 0.1, headX: 0.2 }} position={[-1.1 + tremble(t), 0, -17]} rotY={0.5} />
        <Character look={ZOMBIES[3]} pose={{ armL: -1.4, armLz: 0.8, armR: -1.2, headY: -0.5 + Math.sin(t * 6 + 1) * 0.1, headX: 0.2 }} position={[1.1 + tremble(t + 2), 0, -17]} rotY={-0.5} scale={0.92} />
        <Character look={ZOMBIES[5]} pose={{ sit: true, armL: -2.9, armR: -2.9, headX: 0.5 }} position={[2.6 + tremble(t + 4), 1.6, -19.5]} rotY={-0.3} />
        <Cam from={[0.8, 4.8, -10.2]} to={[0.5, 4.6, -11.6]} look={[0, 4.2, -17]} p={p} fov={38} t={t} />
      </>
    ),
  },
  /* 32.76 "Outside, something was sniffing the ground." – the real monster */
  {
    start: 32.76,
    render: ({ t, p }) => {
      const y = lerp(46, 13, ease(seg(t, 0, 1.9)));
      const sniff = Math.sin(t * 7.8) * 0.4;
      const shake = 0.05 + seg(t, 0.5, 2.2) * 0.22;
      return (
        <>
          <Town t={t} mood="night" siren={false} fog={140} />
          <color attach="background" args={["#1c2a40"]} />
          <directionalLight position={[0, 40, -40]} intensity={0.4} color="#6a7aa0" />
          {/* the giant: dark blocky head with a long snout, sniffing */}
          <group position={[-12 + Math.sin(t * 1.3) * 2, y, -14]} rotation={[0.35 + sniff * 0.05, 0.4 * Math.sin(t * 0.9), 0]}>
            <B s={[20, 18, 20]} c="#0b0c0e" />
            <B s={[10, 8, 10]} p={[0, -6 + sniff, 13]} c="#1d2024" />
            <B s={[2, 1.4, 0.4]} p={[-2.4, -7.5 + sniff, 18.1]} c="#050505" />
            <B s={[2, 1.4, 0.4]} p={[2.4, -7.5 + sniff, 18.1]} c="#050505" />
            <B s={[3.4, 2, 0.4]} p={[-5.2, 3, 10.1]} c="#ff3b2a" e="#ff2010" ei={4} />
            <B s={[3.4, 2, 0.4]} p={[5.2, 3, 10.1]} c="#ff3b2a" e="#ff2010" ei={4} />
          </group>
          <pointLight position={[-12, y + 2, 2]} color="#ff3020" intensity={120} distance={40} decay={1.4} />
          <Cam from={[-4, 2.2, 36]} to={[-5.5, 2.0, 31]} look={[-11, 7, 0]} lookTo={[-11, 9, -4]} p={p} fov={50} t={t} shake={shake} />
        </>
      );
    },
  },
];

export const VOICE_END = 35.25;
