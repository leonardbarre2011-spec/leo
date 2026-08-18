import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { FPS, HEIGHT, TOTAL, WIDTH } from "./timing";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FirstStep"
      component={Main}
      durationInFrames={TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
