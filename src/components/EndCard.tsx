import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {ASSETS, COLORS, FONTS, SOURCE_DURATION_IN_FRAMES} from '../theme';
import {pop, wobble} from './anim';
import {Display, Label} from '../broll/ui';

/**
 * Optional 2s closing card (the `UpgradedWithEndCard` composition). Worth
 * A/B testing: it converts harder, but it costs completion rate, which is why
 * the default cut ends exactly on the last frame of the original reel.
 */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(frame, fps, 0, 14);
  const pulse = 1 + wobble(frame, 24, 0.03);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      <Freeze frame={SOURCE_DURATION_IN_FRAMES - 2}>
        <AbsoluteFill style={{opacity: 0.35, transform: 'scale(1.12)'}}>
          <OffthreadVideo src={ASSETS.bg()} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      </Freeze>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(90% 55% at 50% 45%, rgba(255,90,31,0.22) 0%, rgba(7,9,12,0.94) 62%)',
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          transform: `scale(${interpolate(a, [0, 1], [0.9, 1])})`,
          opacity: interpolate(frame, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <Label color={COLORS.amber} size={26}>
          Position-specific training
        </Label>
        <Display size={124} style={{textAlign: 'center', lineHeight: 0.94}}>
          12 weeks
          <br />
          <span style={{color: COLORS.orange}}>to level up</span>
        </Display>
        <div
          style={{
            marginTop: 18,
            padding: '22px 54px',
            borderRadius: 999,
            background: `linear-gradient(96deg, ${COLORS.orange}, ${COLORS.amber})`,
            color: COLORS.ink,
            fontFamily: FONTS.ui,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: 1.6,
            transform: `scale(${pulse})`,
            boxShadow: '0 20px 60px rgba(255,90,31,0.5)',
          }}
        >
          LINK IN BIO
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
