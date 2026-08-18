import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, FPS} from './theme';

/** Development-only: tiles already-rendered stills into one review sheet. */
export const Tiles: React.FC<{frames: number[]}> = ({frames}) => (
  <AbsoluteFill
    style={{
      background: '#000',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
    }}
  >
    {frames.slice(0, 12).map((f) => (
      <div key={f} style={{width: 270, height: 480, position: 'relative', overflow: 'hidden'}}>
        <Img src={staticFile(`_review/${f}.png`)} style={{width: 270, height: 480}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontFamily: F.ui,
            fontSize: 17,
            fontWeight: 900,
            color: C.black,
            background: C.lime,
            padding: '1px 7px',
          }}
        >
          {f} · {(f / FPS).toFixed(2)}s
        </div>
        <div style={{position: 'absolute', inset: 0, border: '1px solid #333'}} />
      </div>
    ))}
  </AbsoluteFill>
);
