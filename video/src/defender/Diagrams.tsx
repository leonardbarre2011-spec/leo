import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Floor, Footprint, PushArrow } from "../footwork/Floor";
import { CalmLine, Label } from "../crossover/CalmType";
import { C, uiStyle } from "../theme";
import { COPY, F, s, VO, WIDTH } from "./timing";

const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/** A ring that says "this is the thing you are aiming at". */
const Target: React.FC<{ x: number; y: number; at: number; label?: string }> = ({
  x,
  y,
  at,
  label,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = ease(t, 0, 14);
  if (p <= 0.002) return null;
  const ping = (Math.max(0, t) % 42) / 42;
  return (
    <svg
      width={WIDTH}
      height={1920}
      viewBox={`0 0 ${WIDTH} 1920`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g opacity={p}>
        <ellipse
          cx={x}
          cy={y}
          rx={104 * (1 + ping * 0.5)}
          ry={62 * (1 + ping * 0.5)}
          fill="none"
          stroke={C.volt}
          strokeWidth={4}
          opacity={(1 - ping) * 0.55}
        />
        <ellipse
          cx={x}
          cy={y}
          rx={104}
          ry={62}
          fill={C.volt}
          fillOpacity={0.14}
          stroke={C.volt}
          strokeWidth={7}
        />
      </g>
      {label && (
        <text
          x={x}
          y={y - 92}
          textAnchor="middle"
          fill={C.volt}
          opacity={p}
          style={{ ...uiStyle(30, 900) } as React.CSSProperties}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

/** Your shoulder line, which is the part that actually gets past him. */
const Shoulder: React.FC<{
  at: number;
  from: { x: number; y: number; rot: number };
  to: { x: number; y: number; rot: number };
  travel: number;
}> = ({ at, from, to, travel }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const p = ease(t, 0, 12);
  if (p <= 0.002) return null;
  const k = interpolate(t, [8, 8 + travel], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const x = from.x + (to.x - from.x) * k;
  const y = from.y + (to.y - from.y) * k;
  const rot = from.rot + (to.rot - from.rot) * k;
  return (
    <svg
      width={WIDTH}
      height={1920}
      viewBox={`0 0 ${WIDTH} 1920`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g opacity={p} transform={`translate(${x} ${y}) rotate(${rot})`}>
        <rect
          x={-124}
          y={-14}
          width={248}
          height={28}
          rx={14}
          fill={C.volt}
          opacity={0.92}
        />
        <circle cx={-124} cy={0} r={18} fill={C.volt} />
        <circle cx={124} cy={0} r={18} fill={C.volt} />
      </g>
      <text
        x={x - 178}
        y={y - 54}
        textAnchor="middle"
        fill={C.volt}
        opacity={p}
        style={{ ...uiStyle(26, 900) } as React.CSSProperties}
      >
        SHOULDERS
      </text>
    </svg>
  );
};

/* ================================================================== *
 *  ⬛ 1 — WHERE TO AIM                        7.68s → 11.17s
 *  His feet, not his chest. The board shows both stances, because the
 *  target is a part of his body and not a direction.
 * ================================================================== */
export const AimBoard: React.FC = () => {
  const r = (sec: number) => s(sec) - F.board;
  const jab = r(VO.one);
  const sh = r(VO.drop);

  return (
    <AbsoluteFill>
      <Floor at={0} />

      {/* his stance */}
      <Footprint x={462} y={676} rot={8} at={10} color={C.red} scale={1.28} />
      <Footprint x={646} y={598} rot={-6} at={14} color={C.red} scale={1.28} />
      <Label text="DEFENDER" at={16} y={432} color={C.red} size={28} />
      <Target x={646} y={598} at={r(VO.top)} label="TOP FOOT" />

      {/* yours */}
      <Footprint x={456} y={1264} rot={-6} at={22} color={C.volt} scale={1.28} />
      <Footprint x={628} y={1282} rot={6} at={26} color={C.volt} scale={1.28} />

      {/* the jab — short, at the foot, not past it */}
      <PushArrow
        at={jab}
        d="M 640 1214 Q 676 1130 700 1058"
        len={190}
        draw={12}
        width={13}
        head={{ x: 704, y: 1042, rot: -71 }}
      />
      <Footprint x={708} y={1024} rot={-4} at={jab + 12} filled color={C.volt} scale={1.28} label="JAB" />

      {/* and the shoulder that follows it */}
      <Shoulder
        at={sh}
        from={{ x: 522, y: 1218, rot: 0 }}
        to={{ x: 656, y: 878, rot: -34 }}
        travel={32}
      />

      <CalmLine
        segs={[{ t: "ATTACK THE" }, { t: "TOP FOOT", hi: true }]}
        at={r(VO.attack2)}
        out={jab - 6}
        y={1490}
        size={74}
      />
      <CalmLine
        segs={[{ t: "ONE HARD" }, { t: "JAB", hi: true }]}
        at={jab}
        out={sh - 6}
        y={1490}
        size={78}
      />
      <CalmLine
        segs={[{ t: "DROP YOUR" }, { t: "SHOULDER", hi: true }]}
        at={sh}
        y={1490}
        size={74}
      />
    </AbsoluteFill>
  );
};

/* ================================================================== *
 *  ⬛ 2 — TWO CHOICES                        12.88s → 16.22s
 *  He picks one of them. Both of them are yours.
 * ================================================================== */
export const ForkBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (sec: number) => s(sec) - F.fork;
  const a = r(VO.open);
  const b = r(VO.orw);

  /* his feet turn when he opens, and square back when he doesn't */
  const turn = interpolate(frame, [a, a + 24, b, b + 18], [0, 42, 42, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <Floor at={0} />

      <Chip n="1" text="OPENS HIPS" at={r(VO.two)} x={128} y={352} lit={frame >= a} />
      <Chip n="2" text={`GIVES THE ${COPY.lane}`} at={r(VO.two) + 8} x={592} y={352} lit={frame >= b} />

      {[
        { x: 452, y: 736, rot: 8, at: 10 },
        { x: 630, y: 664, rot: -6, at: 14 },
      ].map((f, i) => {
        const rad = (turn * Math.PI) / 180;
        const dx = f.x - 540;
        const dy = f.y - 700;
        return (
          <Footprint
            key={i}
            x={540 + dx * Math.cos(rad) - dy * Math.sin(rad)}
            y={700 + dx * Math.sin(rad) + dy * Math.cos(rad)}
            rot={f.rot + turn}
            at={f.at}
            color={C.red}
            scale={1.28}
          />
        );
      })}
      <Label text="DEFENDER" at={14} y={452} color={C.red} size={28} />

      <Footprint x={456} y={1268} rot={-6} at={20} color={C.volt} scale={1.28} />
      <Footprint x={628} y={1286} rot={6} at={24} color={C.volt} scale={1.28} />

      {/* he turns — so you go by his hip */}
      <PushArrow
        at={a + 10}
        d="M 512 1216 Q 336 980 412 640"
        len={640}
        draw={26}
        width={12}
        head={{ x: 416, y: 618, rot: -80 }}
      />
      {/* he stays square — so you go straight through */}
      <PushArrow
        at={b + 8}
        d="M 640 1216 Q 762 960 736 636"
        len={620}
        draw={24}
        width={12}
        head={{ x: 734, y: 614, rot: -95 }}
      />

      <CalmLine
        segs={[{ t: "TWO CHOICES" }]}
        at={r(VO.now)}
        out={a - 6}
        y={1500}
        size={80}
      />
      <CalmLine
        segs={[{ t: "OPEN THEIR" }, { t: "HIPS", hi: true }]}
        at={a}
        out={b - 6}
        y={1500}
        size={74}
      />
      <CalmLine
        segs={[{ t: "OR GIVE YOU THE" }, { t: COPY.lane, hi: true }]}
        at={b}
        y={1500}
        size={72}
      />
    </AbsoluteFill>
  );
};

const Chip: React.FC<{
  n: string;
  text: string;
  at: number;
  x: number;
  y: number;
  lit: boolean;
}> = ({ n, text, at, x, y, lit }) => {
  const frame = useCurrentFrame();
  const p = ease(frame - at, 0, 12);
  if (p <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: p * (lit ? 1 : 0.5),
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          border: `2px solid ${lit ? C.volt : "rgba(255,255,255,0.5)"}`,
          background: lit ? C.volt : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ ...uiStyle(23, 900), color: lit ? C.ink : C.white, letterSpacing: 0 }}>
          {n}
        </span>
      </div>
      <span style={{ ...uiStyle(26, 800), color: lit ? C.volt : "rgba(255,255,255,0.72)" }}>
        {text}
      </span>
    </div>
  );
};
