/* ------------------------------------------------------------------ *
 *  MASTER TIMELINE
 *  Every value below is derived from the voiceover waveform
 *  (phrase boundaries via silence detection, word onsets via
 *  syllable-peak analysis of the RMS envelope). Nothing is guessed.
 *  fps = 60, total = 1500 frames = 25.000s. VO ends at 23.616s.
 * ------------------------------------------------------------------ */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1500;

/** seconds -> frame */
export const s = (sec: number) => Math.round(sec * FPS);

/** Word onsets (seconds) measured from the voiceover. */
export const VO = {
  // "You're losing your defender BEFORE you even dribble."
  youre: 0.15,
  losing: 0.32,
  your1: 0.6,
  defender: 0.72,
  before: 1.2,
  you2: 1.46,
  even: 1.73,
  dribble: 2.06,
  p1End: 2.27,

  // "If you stand like this, your first step is already dead."
  ifyou: 3.47,
  stand: 3.83,
  like: 3.97,
  this: 4.07,
  your2: 4.29,
  first1: 4.54,
  step: 4.75,
  isAlready: 4.87,
  already: 5.02,
  dead: 5.55,
  p2End: 5.94,

  // "Drop your hips."
  drop: 6.52,
  your3: 6.79,
  hips: 6.95,
  p3End: 7.28,

  // "Load your outside foot."
  load: 7.62,
  your4: 8.02,
  outside: 8.19,
  foot1: 8.59,
  p4End: 8.68,

  // "Then attack their top foot."
  then1: 9.22,
  attack: 9.35,
  their: 9.7,
  top: 9.91,
  foot2: 10.15,
  p5End: 10.25,

  // "Do this:"
  do1: 11.14,
  this2: 11.27,
  p6End: 11.54,

  // "jab hard,"
  jab: 11.95,
  hard: 12.28,
  p7End: 12.54,

  // "explode past the cone, then finish immediately."
  explode: 12.9,
  past: 13.33,
  cone: 13.71,
  then2: 13.9,
  finish: 14.11,
  immediately: 14.5,
  p8End: 15.1,

  // "The goal isn't more moves."
  the1: 16.02,
  goal: 16.16,
  isnt: 16.31,
  more: 16.66,
  moves: 16.81,
  p9End: 17.19,

  // "It's making your FIRST move impossible to stop."
  its: 17.43,
  making: 17.64,
  your5: 17.92,
  first2: 18.16,
  move: 18.45,
  impossible: 18.76,
  to: 19.4,
  stop: 19.63,
  p10End: 19.89,

  // "Follow if you want to become the player defenders hate guarding."
  follow: 20.88,
  ifyou2: 21.29,
  want: 21.43,
  to2: 21.58,
  become: 21.73,
  player: 22.08,
  defenders: 22.45,
  hate: 22.9,
  guarding: 23.15,
  p11End: 23.45,
} as const;

/** Frame-accurate shot boundaries. */
export const F = {
  // ── 1. HOOK ─────────────────────────────────────────────
  hookLive: 0, //            0.00  live, slow push
  hookFreeze: s(VO.before), //   1.20  freeze + punch to stance
  hookDiag: s(VO.p1End) + 1, //  2.28  diagnostic pull-back
  hookOut: 200, //               3.33  whip out

  // ── 2. THE MISTAKE ──────────────────────────────────────
  badWide: s(VO.ifyou) - 4, //   3.40  wide, BAD tag
  badFeet: s(VO.your2), //       4.29  punch to the feet
  deadHit: s(VO.dead), //        5.55  DEAD freeze
  flip: s(VO.p2End), //          5.94  wrong -> right flip

  // ── 3. THE FIX ──────────────────────────────────────────
  step1: s(VO.drop) - 3, //      6.47  01 drop your hips
  step2: s(VO.load) - 4, //      7.55  02 load outside foot
  ramp: s(VO.p4End) + 2, //      8.71  load -> explode ramp
  step3: s(VO.then1) - 3, //     9.17  03 attack their top foot
  replay: s(VO.p5End) + 2, //   10.28  ⭐ the replay loop
  replayA: 620,
  replayB: 636,
  replayC: 652,

  // ── 4. THE DRILL ────────────────────────────────────────
  doThis: s(VO.do1) - 5, //     11.06
  jab: s(VO.jab) - 8, //        11.82
  explodeIn: 752, //            12.53  pre-roll tension
  explodeHit: s(VO.explode), // 12.90  ⭐ biggest movement
  explodeRun: 800,
  finish: s(VO.then2) - 6, //   13.80

  // ── 5. GAME APPLICATION ─────────────────────────────────
  drillOut: 906, //             15.10  chips collapse
  notMoves: 918, //             15.30  grayscale / predictable
  splitAB: 1031, //             17.18  before | after
  after: s(VO.its) + 3, //      17.48  full-speed proof
  firstMove: s(VO.first2), //   18.16  FIRST MOVE dominant
  impossible: s(VO.impossible), // 18.76
  release: 1153, //             19.22  freeze on the release
  stopHit: s(VO.stop), //       19.63  ⭐ the word lands on the frozen contest
  bucket: 1193, //              19.88  the shot drops in the pause
  whip: 1211, //                20.18

  // ── 6. FOLLOW CONVERSION ────────────────────────────────
  cta: 1221, //                 20.35
  ctaFreeze: 1421, //           23.68
  end: TOTAL,
} as const;
