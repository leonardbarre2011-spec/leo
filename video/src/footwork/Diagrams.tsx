import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  Cone,
  Defender,
  Floor,
  Footprint,
  GapMeter,
  Plant,
  PushArrow,
} from "./Floor";
import { CalmLine, Label } from "../crossover/CalmType";
import { C, uiStyle } from "../theme";
import { F, s, VO, WIDTH } from "./timing";

const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/* ================================================================== *
 *  ⬛ 1 — WHAT MOVES WHAT                      5.32s → 6.88s
 *  The whole script turns on one comparison, so it gets one frame:
 *  hands move the ball, feet move the defender.
 * ================================================================== */
export const HandsVsFeet: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (sec: number) => s(sec) - F.feet;
  const strike = ease(frame - 14, 0, 12);

  return (
    <AbsoluteFill style={{ background: "#0A0C11" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(70% 46% at 50% 50%, rgba(216,255,62,0.06) 0%, rgba(0,0,0,0) 72%)",
        }}
      />
      <svg
        width={WIDTH}
        height={1920}
        viewBox={`0 0 ${WIDTH} 1920`}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* HANDS — the ball goes somewhere, nobody else does */}
        <g opacity={ease(frame, 0, 12)}>
          <path
            d="M 236 700 Q 400 500 564 700"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth={7}
            strokeDasharray="18 16"
          />
          <circle cx={400} cy={618} r={84} fill="#E8873B" opacity={0.92} />
          <circle cx={824} cy={612} r={76} fill={C.red} fillOpacity={0.14} stroke={C.red} strokeWidth={10} />
          <text
            x={824}
            y={752}
            textAnchor="middle"
            fill={C.red}
            style={{ ...uiStyle(27, 900) } as React.CSSProperties}
          >
            DOESN&apos;T MOVE
          </text>
        </g>
        {strike > 0.01 && (
          <line
            x1={168}
            y1={520}
            x2={168 + 760 * strike}
            y2={520 + 132 * strike}
            stroke={C.red}
            strokeWidth={17}
            strokeLinecap="round"
            opacity={0.95}
          />
        )}

        {/* FEET — you move, and he has to */}
        <g opacity={ease(frame - 26, 0, 14)}>
          <path
            d="M 636 1234 Q 726 1188 812 1146"
            fill="none"
            stroke={C.volt}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <path d="M 828 1138 l -46 -28 l 12 28 l -12 28 z" fill={C.volt} />
        </g>
      </svg>

      <Footprint x={392} y={1224} rot={-8} at={20} color={C.volt} scale={1.3} />
      <Footprint x={546} y={1244} rot={8} at={26} filled color={C.volt} scale={1.3} />
      <Defender x={900} y={1150} at={34} weight={0.55} label="MOVES" />

      <Label text="HANDS" at={4} y={400} x={168} align="left" color={C.red} size={44} />
      <Label text="FEET" at={26} y={992} x={168} align="left" color={C.volt} size={44} />

      <CalmLine
        segs={[{ t: "INSTEAD OF YOUR" }, { t: "FEET", hi: true }]}
        at={r(VO.instead)}
        y={1520}
        size={72}
      />
    </AbsoluteFill>
  );
};

/* ================================================================== *
 *  ⬛ 2 — THE FLOOR                            6.88s → 12.40s
 *  Four beats on one piece of hardwood: a stride in, a foot into the
 *  floor, a second where only his weight moves, and the way out.
 * ================================================================== */
export const FloorDrill: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (sec: number) => s(sec) - F.watch;

  const stride = r(VO.attack);
  const plant = r(VO.plant);
  const hold = r(VO.freeze);
  const go = r(VO.then1);

  /* his weight leaves during the freeze, and never comes back in time */
  const weight = interpolate(frame, [hold + 6, hold + 36], [-0.12, -0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const defX = interpolate(frame, [hold + 6, hold + 40], [540, 424], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <Floor at={0} />

      <Defender
        x={defX}
        y={556}
        at={10}
        weight={weight}
        showBar={frame > hold + 2}
        barAt={hold + 4}
      />

      {/* where you start */}
      <Footprint x={452} y={1282} rot={-6} at={22} color={C.volt} scale={1.34} />
      <Footprint x={634} y={1296} rot={6} at={26} color={C.volt} scale={1.34} />

      {/* 1 — the stride in */}
      <PushArrow
        at={stride}
        d="M 452 1200 Q 386 1130 344 1080"
        len={220}
        draw={16}
        width={12}
      />
      <Footprint x={330} y={1024} rot={-16} at={stride + 10} color={C.volt} scale={1.34} />

      {/* 2 — the foot goes into the floor */}
      <Footprint x={330} y={1024} rot={-16} at={plant} filled color={C.volt} scale={1.34} label="PLANT" />
      <Plant x={330} y={1024} at={plant + 2} />

      {/* 3 — the half second where only his weight moves */}
      {frame > hold && frame < go && (
        <Label text="HOLD IT" at={hold + 6} y={912} color={C.white} size={34} />
      )}

      {/* 4 — out the other way */}
      <PushArrow
        at={go + 4}
        d="M 356 1058 Q 660 1236 906 1076"
        len={660}
        draw={28}
        head={{ x: 922, y: 1062, rot: -32 }}
        width={15}
      />
      <Footprint x={790} y={1252} rot={16} at={go + 22} color={C.volt} scale={1.34} />
      <Footprint x={932} y={1010} rot={20} at={go + 32} filled color={C.volt} scale={1.34} />
      <GapMeter at={go + 44} x1={410} x2={930} y={1398} />

      {/* copy */}
      <Label text="WATCH THIS" at={r(VO.watch)} out={stride - 6} y={1520} color={C.volt} size={36} />
      <CalmLine
        segs={[{ t: "ATTACK", hi: true }, { t: "HARD" }]}
        at={stride}
        out={plant - 6}
        y={1486}
        size={76}
      />
      <CalmLine
        segs={[{ t: "PLANT", hi: true }]}
        at={plant}
        out={hold - 6}
        y={1486}
        size={84}
      />
      <CalmLine
        segs={[{ t: "FREEZE THEM" }, { t: "HALF A SECOND", hi: true }]}
        at={hold}
        out={go - 6}
        y={1462}
        size={62}
      />
      <CalmLine
        segs={[{ t: "THEN EXPLODE THE" }, { t: "OPPOSITE WAY", hi: true }]}
        at={go}
        y={1462}
        size={62}
      />
    </AbsoluteFill>
  );
};

/* ================================================================== *
 *  ⬛ 3 — THE DRILL IS NOT THE FINISH LINE     14.78s → 17.52s
 * ================================================================== */
export const DrillToGame: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (sec: number) => s(sec) - F.train;
  const struck = r(VO.dont) + 6;
  const swap = r(VO.dont) + 32;

  return (
    <AbsoluteFill>
      <Floor at={0} />
      {frame < swap + 14 && <Cone x={540} y={578} at={12} struck={struck} />}
      {frame >= swap && <Defender x={540} y={556} at={swap} weight={-0.2} label="GAME" />}
      <Label
        text="DRILL"
        at={16}
        out={swap - 6}
        y={704}
        color="rgba(255,255,255,0.72)"
        size={30}
      />

      <Footprint x={452} y={1282} rot={-6} at={20} color={C.volt} scale={1.34} />
      <Footprint x={634} y={1296} rot={6} at={24} color={C.volt} scale={1.34} />
      <Footprint x={330} y={1024} rot={-16} at={30} ghost color={C.volt} scale={1.34} />
      <Footprint x={932} y={1010} rot={20} at={36} ghost color={C.volt} scale={1.34} />

      <CalmLine
        segs={[{ t: "WHEN YOU TRAIN IT" }]}
        at={r(VO.when)}
        out={r(VO.dont) - 6}
        y={1486}
        size={66}
      />
      <CalmLine
        segs={[{ t: "DON'T STOP AT THE" }, { t: "DRILL", red: true }]}
        at={r(VO.dont)}
        y={1462}
        size={66}
      />
    </AbsoluteFill>
  );
};
