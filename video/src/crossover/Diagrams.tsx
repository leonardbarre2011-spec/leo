import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Blocked, CourtFloor, Marker, OpenLane, Path, START } from "./Court";
import { CalmLine, Label } from "./CalmType";
import { C } from "../theme";
import { F, s, VO } from "./timing";

/* eased position helper — every marker moves on the same curve, so the
 * board reads like one system rather than a set of separate animations */
const move = (
  t: number,
  from: number,
  to: number,
  start: number,
  len: number,
) =>
  interpolate(t, [start, start + len], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

/* ================================================================== *
 *  ⬛ REMOTION CLIP 1 — WHY IT FAILS          2.67s → 7.22s
 *  One board, built up in four beats. Nothing else moves on screen.
 * ================================================================== */
export const ProblemBoard: React.FC = () => {
  const t = useCurrentFrame();
  const r = (sec: number) => s(sec) - F.problem;

  const cross = r(VO.changing); // you start moving
  const mirror = cross + 40; // the defender goes with you
  const stop = r(VO.first1) - 6; // and you have gone nowhere

  const youX = move(t, START.you.x, 888, cross, 56);
  const youY = move(t, START.you.y, 1168, cross, 56);
  const defX = move(t, START.def.x, 868, mirror, 56);
  const defY = move(t, START.def.y, 842, mirror, 56);

  return (
    <AbsoluteFill>
      <CourtFloor at={0} />
      <Marker x={defX} y={defY} kind="def" label="DEFENDER" at={12} />
      <Marker x={youX} y={youY} kind="you" label="YOU" at={20} ball />

      {/* your crossover */}
      <Path
        d={`M ${START.you.x} ${START.you.y} Q 646 1288 888 1168`}
        at={cross}
        len={300}
        draw={40}
        color={C.volt}
        width={13}
      />
      {/* the defender simply goes with you */}
      <Path
        d={`M ${START.def.x} ${START.def.y} Q 654 934 868 842`}
        at={mirror}
        len={300}
        draw={40}
        color={C.red}
        width={10}
        dashed
      />
      <Blocked at={stop} x={956} y={1050} />
      <Label
        text="STILL IN FRONT OF YOU"
        at={stop + 8}
        y={1318}
        color={C.red}
        size={30}
      />

      {/* copy */}
      <CalmLine
        segs={[{ t: "THE PROBLEM?" }]}
        at={r(VO.the1)}
        out={r(VO.youre) - 8}
        y={1452}
        size={78}
      />
      <CalmLine
        segs={[{ t: "YOU'RE CHANGING DIRECTION" }]}
        at={r(VO.youre)}
        out={r(VO.without) - 6}
        y={1452}
        size={62}
      />
      <CalmLine
        segs={[
          { t: "WITHOUT MAKING THE DEFENDER" },
          { t: "MOVE FIRST", hi: true },
        ]}
        at={r(VO.without)}
        y={1420}
        size={58}
      />
    </AbsoluteFill>
  );
};

/* ================================================================== *
 *  ⬛ REMOTION CLIP 2 — WHY IT WORKS         13.03s → 16.30s
 *  Same board, same markers, one change: the defender's weight goes
 *  first, and the space he leaves is the whole point.
 * ================================================================== */
export const SolutionBoard: React.FC = () => {
  const t = useCurrentFrame();
  const r = (sec: number) => s(sec) - F.why;

  const push = r(VO.make) - 8; // you attack his front foot
  const lean = push + 26; // his weight commits
  const takeIt = r(VO.take) - 10; // you take what he gave up

  const youX = move(t, START.you.x, 306, push, 46);
  const youY = move(t, START.you.y, 1032, push, 46);
  /* then the snap back, into the space */
  const youX2 = move(t, youX, 838, takeIt, 40);
  const youY2 = move(t, youY, 1006, takeIt, 40);
  /* and the drive */
  const youX3 = move(t, youX2, 620, takeIt + 40, 46);
  const youY3 = move(t, youY2, 512, takeIt + 40, 46);

  const defX = move(t, START.def.x, 322, lean, 42);
  const defY = move(t, START.def.y, 852, lean, 42);
  const defLean = move(t, 0, -1, lean, 40);

  return (
    <AbsoluteFill>
      <CourtFloor at={0} />
      <OpenLane
        at={takeIt - 8}
        d="M 690 1150 L 964 1000 L 826 470 L 592 470 Z"
      />
      <Marker
        x={defX}
        y={defY}
        kind="def"
        label="DEFENDER"
        at={6}
        lean={defLean}
      />
      <Marker x={youX3} y={youY3} kind="you" label="YOU" at={10} ball />

      {/* the hard attack that buys the lean */}
      <Path
        d={`M ${START.you.x} ${START.you.y} L 306 1032`}
        at={push}
        len={220}
        draw={34}
        color={C.volt}
        width={13}
      />
      <Label
        text="WEIGHT COMMITTED"
        at={lean + 26}
        out={takeIt + 34}
        y={690}
        x={132}
        align="left"
        color={C.red}
        size={28}
      />
      {/* the snap, and the lane it opens */}
      <Path
        d="M 306 1032 Q 600 1094 838 1006 L 620 512"
        at={takeIt}
        len={820}
        draw={64}
        color={C.volt}
        width={13}
        head={{ x: 620, y: 512, rot: -113 }}
      />

      <CalmLine
        segs={[{ t: "MAKE THEM" }, { t: "LEAN", red: true }, { t: "FIRST" }]}
        at={r(VO.make)}
        out={r(VO.then2) - 8}
        y={1452}
        size={72}
      />
      <CalmLine
        segs={[{ t: "THEN TAKE THE" }, { t: "SPACE", hi: true }, { t: "THEY GIVE YOU" }]}
        at={r(VO.then2)}
        y={1420}
        size={62}
      />
    </AbsoluteFill>
  );
};
