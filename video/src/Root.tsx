import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { Crossover } from "./crossover/Main";
import { Footwork } from "./footwork/Main";
import { Defender } from "./defender/Main";
import { Jumper } from "./jumper/Main";
import {
  FPS as XFPS,
  HEIGHT as XH,
  TOTAL as XTOTAL,
  WIDTH as XW,
} from "./crossover/timing";
import {
  FPS as WFPS,
  HEIGHT as WH,
  TOTAL as WTOTAL,
  WIDTH as WW,
} from "./footwork/timing";
import {
  FPS as DFPS,
  HEIGHT as DH,
  TOTAL as DTOTAL,
  WIDTH as DW,
} from "./defender/timing";
import {
  FPS as JFPS,
  HEIGHT as JH,
  TOTAL as JTOTAL,
  WIDTH as JW,
} from "./jumper/timing";
import { FPS, HEIGHT, TOTAL, WIDTH } from "./timing";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FirstStep"
        component={Main}
        durationInFrames={TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Jumper"
        component={Jumper}
        durationInFrames={JTOTAL}
        fps={JFPS}
        width={JW}
        height={JH}
      />
      <Composition
        id="Defender"
        component={Defender}
        durationInFrames={DTOTAL}
        fps={DFPS}
        width={DW}
        height={DH}
      />
      <Composition
        id="Footwork"
        component={Footwork}
        durationInFrames={WTOTAL}
        fps={WFPS}
        width={WW}
        height={WH}
      />
      <Composition
        id="Crossover"
        component={Crossover}
        durationInFrames={XTOTAL}
        fps={XFPS}
        width={XW}
        height={XH}
      />
    </>
  );
};
