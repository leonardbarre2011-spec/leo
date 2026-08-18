import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Sequence} from 'remotion';
import {C, F} from '../theme';
import {Slam, Chip} from '../components/KineticText';
import {Texture, Flash} from '../components/Overlays';
import {
  CourtStage,
  CourtMarkings,
  OffenseDot,
  DefenseX,
  Route,
  ShotArc,
  Swish,
  HOOP,
} from '../components/Court';
import {at, CUE} from '../data/vo';
import {ease, clamp01} from '../components/anim';

export const DRILL_START = at(CUE.sprint);
export const DRILL_END = at(CUE.make);

const L = (f: number) => f - DRILL_START;

/** Real drill geometry, in court units. The step-back at the end deliberately
 *  crosses the three-point line so the diagram is telling the truth about
 *  where the shot comes from. */
const P0 = {x: 250, y: 440};
const P1 = {x: 110, y: 300};
const P2 = {x: 300, y: 200};
const P3 = {x: 395, y: 255};
const DEF = {x: 305, y: 208};

const seg = (a: {x: number; y: number}, b: {x: number; y: number}) => ({
  d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
  length: Math.hypot(b.x - a.x, b.y - a.y),
});

const S1 = seg(P0, P1);
const S2 = seg(P1, P2);
const S3 = seg(P2, P3);

const T = {
  sprint: L(at(CUE.sprint)),
  change: L(at(CUE.change)),
  direction: L(at(CUE.direction)),
  create: L(at(CUE.create)),
  space: L(at(CUE.space)),
  shoot: L(at(CUE.shoot)),
};

/** Dot that walks the polyline as each segment draws, so the diagram reads as
 *  a player moving rather than as lines appearing. */
const Traveler: React.FC = () => {
  const frame = useCurrentFrame();
  const legs = [
    {a: P0, b: P1, from: T.sprint, to: T.sprint + 12},
    {a: P1, b: P2, from: T.change, to: T.change + 13},
    {a: P2, b: P3, from: T.create, to: T.create + 12},
  ];
  let pos = P0;
  for (const l of legs) {
    if (frame >= l.from) {
      const k = clamp01((frame - l.from) / (l.to - l.from));
      const e = 1 - Math.pow(1 - k, 2.4);
      pos = {x: l.a.x + (l.b.x - l.a.x) * e, y: l.a.y + (l.b.y - l.a.y) * e};
    }
  }
  const moving = legs.some((l) => frame >= l.from && frame < l.to);
  return (
    <g>
      {moving ? <circle cx={pos.x} cy={pos.y} r={34} fill={C.lime} opacity={0.16} /> : null}
      <circle cx={pos.x} cy={pos.y} r={17} fill={C.lime} stroke={C.black} strokeWidth={3.5} />
      <text
        x={pos.x}
        y={pos.y + 7}
        fill={C.black}
        fontFamily={F.ui}
        fontWeight={900}
        fontSize={18}
        textAnchor="middle"
      >
        YOU
      </text>
    </g>
  );
};

const Step: React.FC<{at: number; out?: number; n: string; word: string; sub: string}> = ({
  at: a,
  out,
  n,
  word,
  sub,
}) => (
  <Sequence from={a} durationInFrames={out ? out - a : undefined} layout="none">
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22}}>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 68,
            color: C.lime,
            transform: 'skewX(-8deg) translateY(-14px)',
          }}
        >
          {n}
        </div>
        <Slam at={0} size={word.length > 14 ? 100 : word.length > 10 ? 132 : 168} from="up" skew={7} color={C.white}>
          {word}
        </Slam>
      </div>
      <Slam at={2} size={44} from="up" font={F.kicker} color={C.lime} tracking={0.14}>
        {sub}
      </Slam>
    </AbsoluteFill>
  </Sequence>
);

export const TheDrill: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = frame + DRILL_START;
  const total = DRILL_END - DRILL_START;

  const keys = [T.sprint, T.change, T.create, T.shoot, total];
  const cam = (vals: number[]) =>
    interpolate(frame, keys, vals, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 2.6),
    });
  const camX = cam([460, 470, 700, 760, 700]);
  const camY = cam([1120, 900, 830, 700, 660]);
  const camScale = cam([1.0, 1.1, 1.26, 1.2, 1.24]);

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(72% 40% at 50% 44%, rgba(198,255,46,0.13) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      {/* the diagram gets a camera: it pushes toward whichever part of the
          drill is being taught, so a static graphic never sits still */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale})`,
          transformOrigin: `${(camX / 1080) * 100}% ${(camY / 1920) * 100}%`,
        }}
      >
        <CourtStage k={2.02} ox={35} oy={330}>
        <rect x={0} y={0} width={500} height={470} fill="#12161C" />
        <rect x={170} y={0} width={160} height={190} fill="rgba(255,122,24,0.07)" />
        <CourtMarkings at={0} color="rgba(255,255,255,0.42)" />

        <Route {...S1} at={T.sprint} dur={12} color={C.lime} width={11} />
        <Route {...S2} at={T.change} dur={13} color={C.lime} width={11} />
        <Route {...S3} at={T.create} dur={12} color={C.lime} width={11} dashed />

        <DefenseX x={DEF.x} y={DEF.y} at={T.change + 6} />
        <Traveler />
        <ShotArc fromX={P3.x} fromY={P3.y} at={T.shoot} dur={9} ball width={7} />
        <Swish at={T.shoot + 9} />

        {/* separation made literal */}
        {frame >= T.space ? (
          <g opacity={clamp01((frame - T.space) / 5)}>
            <line
              x1={DEF.x}
              y1={DEF.y + 34}
              x2={P3.x}
              y2={P3.y + 34}
              stroke={C.lime}
              strokeWidth={4}
              strokeDasharray="10 8"
            />
            <text
              x={(DEF.x + P3.x) / 2 + 26}
              y={DEF.y + 84}
              fill={C.lime}
              fontFamily={F.kicker}
              fontStyle="italic"
              fontWeight={800}
              fontSize={34}
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              SEPARATION
            </text>
          </g>
        ) : null}
        </CourtStage>
      </AbsoluteFill>

      <Texture grain={0.08} vignette={0.66} />

      <AbsoluteFill style={{alignItems: 'flex-start', paddingTop: 132, paddingLeft: 58}}>
        <Chip at={0} label="DO THIS INSTEAD · ONE REP" color={C.lime} fg={C.black} size={50} />
      </AbsoluteFill>

      <Step at={T.sprint} out={T.change - 1} n="01" word="SPRINT" sub="ARRIVE TIRED, LIKE THE 4TH" />
      <Step at={T.change} out={T.create - 1} n="02" word="CHANGE DIRECTION" sub="PLANT HARD. NO ROUNDED CUTS" />
      <Step at={T.create} out={T.shoot - 1} n="03" word="CREATE SPACE" sub="STEP BACK BEHIND THE LINE" />
      <Step at={T.shoot} n="04" word="THEN SHOOT" sub="ONE SHOT. GAME SPEED." />

      <Flash at={T.shoot + 9} len={5} color={C.lime} max={0.2} />

      <AbsoluteFill
        style={{
          background: C.black,
          opacity: ease(abs, DRILL_END - 4, DRILL_END, 0, 1),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
