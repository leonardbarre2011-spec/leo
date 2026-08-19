import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { Crossover } from "./crossover/Main";
import {
  FPS as XFPS,
  HEIGHT as XH,
  TOTAL as XTOTAL,
  WIDTH as XW,
} from "./crossover/timing";
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
