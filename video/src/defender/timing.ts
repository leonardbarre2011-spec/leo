/* ------------------------------------------------------------------ *
 *  BEAT THE DEFENDER — master timeline
 *
 *  Transcript recovered offline (PocketSphinx) + `silencedetect`
 *  phrase boundaries. One word is lower confidence: "lane" at 15.87
 *  (ASR heard "wing"; "lane" is the only reading that fits the logic).
 *  It lives in COPY below.
 *
 *  fps 60 · 1440 frames · 24.000s. VO speech ends at 22.648s.
 * ------------------------------------------------------------------ */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1440;

export const s = (sec: number) => Math.round(sec * FPS);

export const VO = {
  // "99% of players make the same mistake when they drive."
  ninety: 0.06,
  percent: 0.64,
  players: 1.03,
  makew: 1.5,
  same: 1.82,
  mistake: 2.19,
  when: 2.68,
  drive: 2.92,
  p1End: 3.278,

  // "They attack the defender's chest."
  they: 3.72,
  attack1: 3.85,
  defenders: 4.34,
  chest: 4.9,
  p2End: 5.378,

  // "Never do that."
  never: 6.06,
  dow: 6.34,
  that: 6.51,
  p3End: 6.67,

  // "Attack the top foot."
  attack2: 7.69,
  the1: 8.02,
  top: 8.11,
  foot: 8.49,
  p4End: 8.739,

  // "One hard jab."
  one: 9.03,
  hard: 9.2,
  jab: 9.45,
  p5End: 9.8,

  // "Drop your shoulder."
  drop: 10.05,
  your: 10.28,
  shoulder: 10.38,
  p6End: 10.87,

  // "Then explode past it."
  then1: 11.17,
  explode: 11.25,
  past: 11.72,
  itw: 12.1,
  p7End: 12.165,

  // "Now the defender has two choices:"
  now: 12.89,
  defender2: 13.11,
  has: 13.5,
  two: 13.67,
  choices: 13.84,
  p8End: 14.339,

  // "open their hips,"
  open: 14.51,
  their: 14.71,
  hips: 14.84,
  p9End: 15.195,

  // "or give you the lane."
  orw: 15.38,
  give: 15.45,
  lane: 15.87,
  p10End: 16.223,

  // "Do this until it becomes automatic."
  do2: 16.71,
  this2: 16.82,
  until: 17.1,
  becomes: 17.43,
  automatic: 17.79,
  p11End: 18.286,

  // "Follow now, because every video here is designed to make you harder to guard."
  follow: 18.87,
  noww: 19.12,
  because: 19.44,
  every: 19.84,
  video: 20.14,
  here: 20.54,
  designed: 20.92,
  make2: 21.51,
  harder: 21.85,
  guard: 22.32,
  p12End: 22.648,
} as const;

/** The one word ASR was unsure of. Change it here, nothing else moves. */
export const COPY = {
  lane: "LANE", // ⚠ ASR heard "wing"; "lane" is the reading that fits
} as const;

/* ------------------------------------------------------------------ *
 *  SHOTS
 *
 *  Hook rebuilt: it opens at real speed rather than in slow motion,
 *  puts the number on screen in the first tenth of a second, and buys
 *  exactly one hard beat — a freeze on the word "mistake", on the frame
 *  where the drive dies in the defender's chest. One accent, not five.
 *
 *  Footage: `y1` is new material and carries the film almost end to
 *  end, in order, with no section used twice. The CTA borrows the one
 *  stretch of `x1` no earlier film has touched (163–236).
 * ------------------------------------------------------------------ */
export const F = {
  hook: 0, //          0.00  live, full speed          [y1 22–152 · new]
  freeze: 131, //      2.18  ⏸ on the word "mistake"
  chest: 197, //       3.28  the drive dies, in slow motion
  never: 364, //       6.07  one red line, and nothing else
  board: 461, //       7.68  ⬛ top foot · jab · shoulder
  explodePast: 670, // 11.17 past it                    [y1 192–232 · new]
  fork: 773, //       12.88  ⬛ two choices, both losing
  automatic: 973, //  16.22  the finish                 [y1 232–261 · new]
  cta: 1097, //       18.28  the landing                [x1 163–236 · unused]
  ctaHold: 1291, //   21.52  held on the ball
  end: TOTAL,
} as const;
