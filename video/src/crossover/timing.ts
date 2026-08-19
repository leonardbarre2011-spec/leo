/* ------------------------------------------------------------------ *
 *  CROSSOVER — master timeline
 *
 *  The voiceover arrived without a transcript, so it was recovered
 *  offline (PocketSphinx) and the word onsets below are its forced
 *  alignment, cross-checked against phrase boundaries from
 *  `silencedetect` on the same file. Two lines are lower confidence
 *  and are marked ⚠ — fix the string in COPY and nothing else moves.
 *
 *  fps 60 · 1380 frames · 23.000s. VO speech ends at 20.879s.
 * ------------------------------------------------------------------ */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1380;

export const s = (sec: number) => Math.round(sec * FPS);

/** Word onsets in seconds. */
export const VO = {
  // "Your crossover isn't slow."
  your: 0.04,
  crossover: 0.14,
  isnt: 0.73,
  slow: 1.12,
  p1End: 1.412,

  // "It's predictable."
  its: 1.99,
  predictable: 2.09,
  p2End: 2.671,

  // "The problem?"  ⚠ wording
  the1: 3.43,
  problem: 3.5,
  p3End: 3.962,

  // "You're changing direction without making the defender move first."
  youre: 4.36,
  changing: 4.43,
  direction: 4.9,
  without: 5.45,
  making: 5.75,
  the2: 6.08,
  defender: 6.14,
  move: 6.56,
  first1: 6.75,
  p4End: 7.21,

  // "Try this:"  ⚠ wording
  tryw: 7.53,
  this1: 7.71,
  p5End: 8.052,

  // "Attack hard."
  attack: 8.38,
  hard: 8.75,
  p6End: 9.055,

  // "Freeze for half a second."
  freeze: 9.41,
  forw: 9.69,
  half: 9.81,
  second: 10.1,
  p7End: 10.516,

  // "Then snap the ball across your body and explode."
  then1: 10.82,
  snap: 10.95,
  the3: 11.31,
  ball: 11.4,
  across: 11.62,
  your2: 11.94,
  body: 12.04,
  and1: 12.33,
  explode: 12.42,
  p8End: 13.034,

  // "Make them lean first."
  make: 13.54,
  them: 13.7,
  lean: 13.89,
  first2: 14.1,
  p9End: 14.526,

  // "Then take the space they give you."
  then2: 14.86,
  take: 15.0,
  the4: 15.26,
  space: 15.35,
  they: 15.77,
  give: 15.89,
  you2: 16.11,
  p10End: 16.294,

  // "One move."
  one1: 16.54,
  move2: 16.72,
  p11End: 17.013,

  // "One advantage."
  one2: 17.28,
  advantage: 17.48,
  p12End: 17.975,

  // "Follow if you want skills that actually work in games."
  follow: 18.45,
  ifw: 18.76,
  youw: 18.86,
  want: 18.98,
  skills: 19.19,
  that: 19.59,
  actually: 19.69,
  work: 20.05,
  inw: 20.3,
  games: 20.43,
  p13End: 20.879,
} as const;

/** The spoken words. ⚠ marks the two lines ASR was least sure of. */
export const COPY = {
  l1: "YOUR CROSSOVER ISN'T SLOW.",
  l2: "IT'S PREDICTABLE.",
  l3: "THE PROBLEM?", // ⚠
  l5: "TRY THIS", // ⚠
} as const;

/* ------------------------------------------------------------------ *
 *  SHOT BOUNDARIES
 *  Ten shots across 23s — an average of 2.3s each. Every shot holds
 *  one idea, and no idea is introduced while another is still moving.
 * ------------------------------------------------------------------ */
export const F = {
  hook: 0, //                  0.00  the move, in slow motion
  problem: 160, //             2.67  ⬛ built in Remotion: why it fails
  tryThis: 433, //             7.22  the three steps, listed
  step1: 503, //               8.38  attack hard
  step2: 565, //               9.41  freeze — a real freeze frame + timer
  step3: 649, //              10.82  snap across, then explode
  step3Fast: 721, //          12.02  the one speed change in the video
  why: 782, //                13.03  ⬛ built in Remotion: why it works
  payoff: 978, //             16.30  one move, one advantage
  proof: 1107, //             18.45  it works in a real game
  portrait: 1245, //          20.75  the identity hold
  end: TOTAL,
} as const;
