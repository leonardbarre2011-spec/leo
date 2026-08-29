import React from 'react';
import {Img, interpolate} from 'remotion';
import {ASSETS, COLORS, FONTS} from '../theme';
import {EASE_OUT, pop, wobble} from '../components/anim';
import {Avatar, Bar, Cross, CourtPlan, Display, Label, Panel, PlayGlyph} from './ui';
import type {ModuleProps} from './types';

/**
 * "Since I started this account, I always wondered..."
 * A profile card built from real frames of this very reel, with the question
 * mark landing exactly on the word "wondered".
 */
export const ProfileBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 13);
  const x = interpolate(enter, [0, 1], [-140, 0]);
  const qPop = pop(local, fps, 26, 10);

  return (
    <Panel style={{left: 64, top: 940, width: 452, height: 524, transform: `translateX(${x}px)`}}>
      <div style={{padding: 28, display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Avatar size={64} ring={COLORS.orange} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
            <Bar w={168} h={14} c="rgba(247,244,238,0.42)" />
            <Bar w={112} h={10} />
          </div>
          <div
            style={{
              marginLeft: 'auto',
              padding: '8px 14px',
              borderRadius: 10,
              background: COLORS.orange,
              fontFamily: FONTS.ui,
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: 1.6,
              color: COLORS.ink,
            }}
          >
            HOOPS
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 124px)', gap: 8}}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => {
            const a = interpolate(local, [8 + i * 2, 16 + i * 2], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE_OUT,
            });
            return (
              <div
                key={n}
                style={{
                  width: 124,
                  height: 124,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#0b0d12',
                  opacity: a,
                  transform: `scale(${0.9 + a * 0.1})`,
                }}
              >
                <Img
                  src={ASSETS.still(n)}
                  style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.9)'}}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* the "I always wondered" beat */}
      <div
        style={{
          position: 'absolute',
          right: -22,
          top: -18,
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: COLORS.amber,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${qPop}) rotate(${wobble(local, 26, 7)}deg)`,
          boxShadow: '0 12px 30px rgba(255,176,32,0.42)',
          fontFamily: FONTS.display,
          fontSize: 58,
          color: COLORS.ink,
        }}
      >
        ?
      </div>
    </Panel>
  );
};

/**
 * "...help the young ballers out there that train alone"
 * Four team-mates fade out, one player is left on the floor.
 */
export const AloneBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 13);
  const x = interpolate(enter, [0, 1], [150, 0]);
  const lonely = interpolate(local, [14, 34], [1, 0.14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const ring = 1 + wobble(local, 30, 0.16);

  const mates = [
    {x: 70, y: 46},
    {x: 214, y: 34},
    {x: 246, y: 152},
    {x: 118, y: 176},
  ];

  return (
    <Panel
      style={{left: 566, top: 964, width: 450, height: 500, transform: `translateX(${x}px)`}}
      accent={COLORS.red}
    >
      <div style={{padding: '26px 28px 0'}}>
        <Label color={COLORS.red}>The reality</Label>
        <Display size={44} style={{marginTop: 10}}>
          Training
          <br />
          solo
        </Display>
      </div>

      <div style={{position: 'absolute', left: 28, top: 210, width: 394, height: 220}}>
        <CourtPlan w={394} h={220} />
        {mates.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: m.x,
              top: m.y,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(247,244,238,0.55)',
              opacity: lonely,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 96,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: COLORS.orange,
            boxShadow: `0 0 0 ${10 * ring}px rgba(255,90,31,0.16), 0 0 26px ${COLORS.orange}`,
          }}
        />
      </div>

      <div style={{position: 'absolute', left: 28, bottom: 22}}>
        <Label size={19} color="rgba(247,244,238,0.5)">
          No coach. No plan.
        </Label>
      </div>
    </Panel>
  );
};

/**
 * "...with some TikTok workout"
 * A generic feed of unrelated workout clips, scrolling past and getting
 * crossed out - the pain the offer resolves.
 */
export const TikTokBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 13);
  const y = interpolate(enter, [0, 1], [220, 0]);
  const scroll = interpolate(local, [6, 72], [0, -286], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const cards = [0, 1, 2, 3, 4];

  return (
    <Panel
      style={{
        left: 596,
        top: 830,
        width: 420,
        height: 634,
        transform: `translateY(${y}px)`,
        borderRadius: 42,
        border: '3px solid rgba(247,244,238,0.16)',
      }}
      accent={COLORS.red}
    >
      {/* phone status strip */}
      <div
        style={{
          height: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(247,244,238,0.1)',
        }}
      >
        <Label size={19}>Random workouts</Label>
      </div>

      <div style={{position: 'absolute', top: 58, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
        <div style={{transform: `translateY(${scroll}px)`, padding: 18, display: 'flex', flexDirection: 'column', gap: 16}}>
          {cards.map((i) => {
            const stamp = pop(local - (10 + i * 9), fps, 0, 9);
            return (
              <div
                key={i}
                style={{
                  height: 200,
                  borderRadius: 16,
                  background: 'linear-gradient(160deg, #1a1f29, #0d1016)',
                  border: '1px solid rgba(247,244,238,0.09)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <PlayGlyph size={42} />
                <div style={{position: 'absolute', left: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8}}>
                  <Bar w={168} h={11} />
                  <Bar w={104} h={9} c="rgba(247,244,238,0.14)" />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: 14,
                    width: 62,
                    height: 62,
                    borderRadius: '50%',
                    background: 'rgba(255,59,48,0.16)',
                    border: `3px solid ${COLORS.red}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${stamp})`,
                  }}
                >
                  <Cross size={34} stroke={4.5} />
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(9,11,15,0.9) 0%, rgba(9,11,15,0) 18%, rgba(9,11,15,0) 74%, rgba(9,11,15,0.96) 100%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 18,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: 'rgba(255,59,48,0.16)',
            border: `2px solid ${COLORS.red}`,
          }}
        >
          <Label size={20} color={COLORS.red}>
            No structure
          </Label>
        </div>
      </div>
    </Panel>
  );
};

/**
 * "So I imagined a solution - but only for the best of them."
 * A funnel that narrows a crowd down to a few.
 */
export const FunnelBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 13);
  const y = interpolate(enter, [0, 1], [140, 0]);
  const stamp = pop(local, fps, 34, 9);
  const cols = 14;

  return (
    <Panel style={{left: 64, top: 1064, width: 952, height: 386, transform: `translateY(${y}px)`}}>
      <div style={{padding: '26px 34px 0', display: 'flex', alignItems: 'baseline', gap: 18}}>
        <Label color={COLORS.amber}>The filter</Label>
        <Label size={20} color="rgba(247,244,238,0.42)">
          Built for the ones who actually put in the work
        </Label>
      </div>

      <div style={{position: 'absolute', left: 34, top: 118, width: 884, height: 150}}>
        {Array.from({length: cols * 3}).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const keep = col > cols - 4 && row === 1;
          const t = interpolate(local, [6 + col * 2.2, 22 + col * 2.2], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE_OUT,
          });
          const squeeze = interpolate(col, [0, cols - 1], [0, 1]);
          const spread = interpolate(squeeze, [0, 1], [1, 0.12]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: col * 63,
                top: 62 + (row - 1) * 52 * spread,
                width: keep ? 30 : 22,
                height: keep ? 30 : 22,
                borderRadius: '50%',
                background: keep ? COLORS.green : 'rgba(247,244,238,0.32)',
                boxShadow: keep ? `0 0 22px ${COLORS.green}` : 'none',
                opacity: keep ? t : t * (1 - squeeze * 0.72),
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 34,
          bottom: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transform: `scale(${stamp})`,
          transformOrigin: 'left center',
        }}
      >
        <Display size={52} color={COLORS.cream}>
          Only for the best
        </Display>
      </div>
    </Panel>
  );
};
