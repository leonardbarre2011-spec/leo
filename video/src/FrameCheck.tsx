import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Broll, BrollProps, GRADE_HOT} from './components/Broll';
import {C, F} from './theme';

/** Development-only contact sheet: 16 candidate framings at once, so crops can
 *  be judged against each other instead of one slow still at a time. */
export type Shot = BrollProps & {name: string};

export const SHOTS: Shot[] = [];

export const FrameCheck: React.FC<{shots: Shot[]}> = ({shots}) => (
  <AbsoluteFill style={{background: '#111', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start'}}>
    {shots.slice(0, 16).map((s, i) => (
      <div key={i} style={{width: 270, height: 480, position: 'relative', overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            width: 1080,
            height: 1920,
            transform: 'scale(0.25)',
            transformOrigin: '0 0',
          }}
        >
          <Broll {...s} freeze grade={s.grade ?? GRADE_HOT} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 4,
            bottom: 4,
            fontFamily: F.ui,
            fontSize: 15,
            fontWeight: 800,
            color: C.lime,
            background: 'rgba(0,0,0,0.75)',
            padding: '2px 6px',
          }}
        >
          {s.name}
        </div>
        <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.25)'}} />
      </div>
    ))}
  </AbsoluteFill>
);
