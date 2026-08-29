import React from 'react';
import {interpolate} from 'remotion';
import {COLORS, FONTS} from '../theme';
import {EASE_OUT, pop, wobble} from '../components/anim';
import {POSITIONS} from '../data/script';
import {Avatar, Bar, Check, Chevron, CourtPlan, Display, Label, LinkIcon, Panel} from './ui';
import type {ModuleProps} from './types';

/**
 * HERO BEAT - "a 12-week basketball program specific to your position".
 * The single most important frame of the whole reel: this is the offer.
 * Twelve weeks fill in one by one, then the five positions light up.
 */
export const ProgramBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 14);
  const y = interpolate(enter, [0, 1], [90, 0]);
  const op = interpolate(local, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Panel
      style={{
        left: 64,
        top: 600,
        width: 952,
        height: 790,
        transform: `translateY(${y}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        opacity: op,
      }}
    >
      <div style={{padding: '34px 40px 0'}}>
        <Label color={COLORS.amber}>The program</Label>
        <Display size={82} style={{marginTop: 14}}>
          12 weeks.
        </Display>
        <Display size={82} color={COLORS.orange}>
          Your position.
        </Display>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 300,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 209px)',
          gap: 18,
        }}
      >
        {Array.from({length: 12}).map((_, i) => {
          const fill = interpolate(local, [10 + i * 3.4, 22 + i * 3.4], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE_OUT,
          });
          return (
            <div
              key={i}
              style={{
                height: 96,
                borderRadius: 14,
                border: '2px solid rgba(247,244,238,0.12)',
                background: `linear-gradient(120deg, rgba(255,90,31,${0.9 * fill}), rgba(255,176,32,${0.55 * fill}))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.display,
                fontSize: 40,
                color: fill > 0.5 ? COLORS.ink : 'rgba(247,244,238,0.34)',
                transform: `scale(${0.94 + fill * 0.06})`,
                boxShadow: fill > 0.5 ? '0 10px 26px rgba(255,90,31,0.28)' : 'none',
              }}
            >
              W{i + 1}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 40,
          bottom: 34,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {POSITIONS.map((p, i) => {
          const on = interpolate(local, [56 + i * 5, 66 + i * 5], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE_OUT,
          });
          return (
            <div
              key={p}
              style={{
                width: 138,
                height: 74,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.display,
                fontSize: 40,
                letterSpacing: 1,
                color: on > 0.5 ? COLORS.ink : COLORS.creamDim,
                background: on > 0.5 ? COLORS.cream : 'rgba(247,244,238,0.06)',
                border: '2px solid rgba(247,244,238,0.14)',
                transform: `translateY(${(1 - on) * 22}px) scale(${0.9 + on * 0.1})`,
                opacity: 0.35 + on * 0.65,
              }}
            >
              {p}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

/**
 * "...with some specialized drills and advice."
 * A play draws itself on a half court while the drill cards deal in.
 */
export const DrillsBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 13);
  const y = interpolate(enter, [0, 1], [150, 0]);
  const draw = interpolate(local, [10, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const draw2 = interpolate(local, [26, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const cards = ['Drill 01', 'Drill 02', 'Drill 03'];

  return (
    <Panel style={{left: 64, top: 1006, width: 952, height: 444, transform: `translateY(${y}px)`}}>
      <div style={{padding: '24px 34px 0'}}>
        <Label color={COLORS.amber}>Inside</Label>
      </div>

      {/* half court with an animated action */}
      <div style={{position: 'absolute', left: 34, top: 92, width: 430, height: 316}}>
        <CourtPlan w={430} h={316} />
        <svg width={430} height={316} viewBox="0 0 300 220" style={{position: 'absolute', inset: 0}} fill="none">
          <path
            d="M232 168 C 190 150, 150 138, 118 118"
            stroke={COLORS.amber}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="140"
            strokeDashoffset={140 * (1 - draw)}
          />
          <path
            d="M118 118 C 104 100, 96 84, 92 62"
            stroke={COLORS.orange}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="9 8"
            strokeDashoffset={90 * (1 - draw2)}
            opacity={draw2 > 0 ? 1 : 0}
          />
          <circle cx="232" cy="168" r="10" fill={COLORS.cream} opacity={draw > 0.05 ? 1 : 0} />
          <g opacity={draw2 > 0.6 ? 1 : 0}>
            <path d="M86 56l6 6 6-6" stroke={COLORS.orange} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
          <path d="M112 112l6 6 6-6" stroke={COLORS.amber} strokeWidth="4" strokeLinecap="round" opacity={draw > 0.9 ? 1 : 0} />
        </svg>
      </div>

      {/* drill cards + coach note */}
      <div style={{position: 'absolute', right: 34, top: 92, width: 430, display: 'flex', flexDirection: 'column', gap: 14}}>
        {cards.map((c, i) => {
          const a = pop(local, fps, 12 + i * 7, 13);
          return (
            <div
              key={c}
              style={{
                height: 74,
                borderRadius: 14,
                background: 'rgba(247,244,238,0.06)',
                border: '2px solid rgba(247,244,238,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 18px',
                transform: `translateX(${(1 - a) * 90}px)`,
                opacity: a,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: COLORS.orange,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONTS.display,
                  fontSize: 24,
                  color: COLORS.ink,
                }}
              >
                {i + 1}
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <div style={{fontFamily: FONTS.ui, fontWeight: 800, fontSize: 28, color: COLORS.cream, letterSpacing: 1.4}}>
                  {c.toUpperCase()}
                </div>
                <Bar w={190} h={9} />
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: pop(local, fps, 34, 13),
          }}
        >
          <Check size={30} progress={interpolate(local, [36, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
          <Label size={25} color={COLORS.green}>
            + coaching advice
          </Label>
        </div>
      </div>
    </Panel>
  );
};

/**
 * "...sent them to beta testers and they loved it. So now I'm officially
 * releasing them." Messages land one by one, then the release stamp slams in.
 */
export const ProofBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 13);
  const x = interpolate(enter, [0, 1], [-160, 0]);
  const stampAt = 73; // ~20.35s, exactly on "officially releasing"
  const stamp = pop(local, fps, stampAt, 9);
  const bubbles = [0, 1, 2];

  return (
    <>
      <Panel style={{left: 64, top: 936, width: 592, height: 528, transform: `translateX(${x}px)`}} accent={COLORS.green}>
        <div style={{padding: '26px 30px 0', display: 'flex', alignItems: 'center', gap: 12}}>
          <Label color={COLORS.green}>Beta testers</Label>
          <div style={{width: 10, height: 10, borderRadius: '50%', background: COLORS.green, opacity: 0.5 + 0.5 * Math.abs(wobble(local, 34, 1))}} />
        </div>

        <div style={{position: 'absolute', left: 30, right: 30, top: 92, display: 'flex', flexDirection: 'column', gap: 16}}>
          {bubbles.map((i) => {
            const a = pop(local, fps, 8 + i * 12, 12);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transform: `translateY(${(1 - a) * 40}px)`,
                  opacity: a,
                }}
              >
                <Avatar size={54} />
                <div
                  style={{
                    flex: 1,
                    background: 'rgba(247,244,238,0.07)',
                    border: '1px solid rgba(247,244,238,0.11)',
                    borderRadius: '18px 18px 18px 6px',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <Bar w={280 - i * 40} h={11} />
                  <Bar w={200 - i * 30} h={9} c="rgba(247,244,238,0.14)" />
                </div>
                <Check size={34} progress={interpolate(local, [16 + i * 12, 28 + i * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 30, bottom: 26}}>
          <Display size={40} color={COLORS.cream}>
            They loved it
          </Display>
        </div>
      </Panel>

      {/* release stamp */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 700,
          width: 840,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${interpolate(stamp, [0, 1], [1.9, 1])}) rotate(-7deg)`,
          opacity: interpolate(local, [stampAt, stampAt + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <div
          style={{
            padding: '18px 40px',
            border: `7px solid ${COLORS.green}`,
            borderRadius: 18,
            background: 'rgba(6,26,18,0.72)',
            boxShadow: `0 0 60px rgba(22,224,138,0.35)`,
          }}
        >
          <Display size={78} color={COLORS.green}>
            Officially out
          </Display>
        </div>
      </div>
    </>
  );
};

/** "So if you want one..." - a short pointer beat that hands over to the CTA. */
export const YouBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const a = pop(local, fps, 0, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 290,
        top: 1150,
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        transform: `scale(${a})`,
      }}
    >
      <div
        style={{
          padding: '14px 30px',
          borderRadius: 999,
          background: COLORS.cream,
          fontFamily: FONTS.display,
          fontSize: 48,
          color: COLORS.ink,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        }}
      >
        THAT&apos;S YOU?
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{opacity: 0.25 + 0.75 * Math.max(0, Math.sin((local / 9) - i * 0.7)), marginTop: -12}}>
          <Chevron size={54} />
        </div>
      ))}
    </div>
  );
};

/**
 * HERO BEAT - "check the link in my bio".
 * The destination, shown as the thing the viewer is about to tap.
 */
export const BioBroll: React.FC<ModuleProps> = ({local, fps}) => {
  const enter = pop(local, fps, 0, 14);
  const tapAt = 26;
  const press = interpolate(local, [tapAt, tapAt + 5, tapAt + 12], [1, 0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const cursorX = interpolate(local, [6, tapAt], [250, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const cursorY = interpolate(local, [6, tapAt], [190, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const tapped = local > tapAt + 4;
  const ring = 1 + wobble(local, 24, 0.22);

  return (
    <Panel
      style={{
        left: 110,
        top: 706,
        width: 860,
        height: 636,
        transform: `translateY(${interpolate(enter, [0, 1], [80, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
      }}
      accent={COLORS.amber}
    >
      <div style={{padding: '34px 38px 0', display: 'flex', alignItems: 'center', gap: 20}}>
        <Avatar size={96} ring={COLORS.orange} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <Bar w={230} h={17} c="rgba(247,244,238,0.42)" />
          <Bar w={160} h={12} />
        </div>
        <div style={{marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end'}}>
          <Bar w={120} h={12} />
          <Bar w={90} h={10} c="rgba(247,244,238,0.14)" />
        </div>
      </div>

      <div style={{position: 'absolute', left: 38, right: 38, top: 178, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.55}}>
          <Bar w={620} h={12} />
          <Bar w={520} h={12} />
        </div>

        {/* the link row */}
        <div
          style={{
            marginTop: 16,
            height: 118,
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '0 26px',
            background: tapped
              ? 'linear-gradient(96deg, rgba(255,90,31,0.22), rgba(255,176,32,0.14))'
              : 'rgba(247,244,238,0.06)',
            border: `3px solid ${tapped ? COLORS.orange : 'rgba(247,244,238,0.16)'}`,
            boxShadow: tapped
              ? `0 0 0 ${8 * ring}px rgba(255,90,31,0.14), 0 20px 50px rgba(255,90,31,0.22)`
              : 'none',
            transform: `scale(${press})`,
          }}
        >
          <LinkIcon size={38} color={tapped ? COLORS.orange : COLORS.creamDim} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <div
              style={{
                fontFamily: FONTS.ui,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: 1.2,
                color: COLORS.cream,
              }}
            >
              THE 12-WEEK PROGRAM
            </div>
            <Bar w={260} h={10} />
          </div>
          <div style={{marginLeft: 'auto', opacity: tapped ? 1 : 0.25}}>
            <Check size={40} progress={interpolate(local, [tapAt + 4, tapAt + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 38, bottom: 30}}>
        <Label color={COLORS.amber}>Two taps away</Label>
        <Display size={68} style={{marginTop: 12}}>
          Grab the program
        </Display>
      </div>

      {/* finger / cursor */}
      <div
        style={{
          position: 'absolute',
          left: 470,
          top: 292,
          width: 74,
          height: 74,
          borderRadius: '50%',
          background: 'rgba(247,244,238,0.22)',
          border: '3px solid rgba(247,244,238,0.6)',
          transform: `translate(${cursorX}px, ${cursorY}px) scale(${press === 1 ? 1 : 0.86})`,
          opacity: local > tapAt + 16 ? 0 : 1,
        }}
      />
    </Panel>
  );
};
