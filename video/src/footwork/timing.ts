/* ------------------------------------------------------------------ *
 *  FOOTWORK FOR SEPARATION — master timeline
 *
 *  Transcript recovered offline (PocketSphinx) and cross-checked
 *  against `silencedetect` phrase boundaries, same method as CROSSOVER.
 *  This one came back clean — no low-confidence lines.
 *
 *  fps 60 · 1500 frames · 25.000s. VO speech ends at 23.686s.
 * ------------------------------------------------------------------ */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1500;

export const s = (sec: number) => Math.round(sec * FPS);

export const VO = {
  // "If you can't create separation, this is probably why."
  ifw: 0.05,
  cant: 0.25,
  create: 0.53,
  separation: 0.92,
  this1: 1.61,
  probably: 1.95,
  why: 2.44,
  p1End: 2.791,

  // "You're trying to beat defenders with your hands instead of your feet."
  youre: 3.29,
  trying: 3.39,
  beat: 3.78,
  defenders: 3.99,
  with: 4.56,
  your1: 4.7,
  hands: 4.81,
  instead: 5.42,
  of: 5.83,
  your2: 5.92,
  feet: 6.02,
  p2End: 6.419,

  // "Watch this:"
  watch: 6.89,
  this2: 7.23,
  p3End: 7.557,

  // "Attack hard."
  attack: 7.8,
  hard: 8.1,
  p4End: 8.44,

  // "Plant."
  plant: 8.7,
  p5End: 9.102,

  // "Freeze them for half a second."
  freeze: 9.22,
  them: 9.64,
  half: 9.93,
  second: 10.21,
  p6End: 10.617,

  // "Then explode the opposite way."
  then1: 10.9,
  explode: 11.05,
  the1: 11.61,
  opposite: 11.74,
  way: 12.17,
  p7End: 12.391,

  // "One move,"
  one1: 13.01,
  move: 13.28,
  p8End: 13.613,

  // "one advantage."
  one2: 13.93,
  advantage: 14.15,
  p9End: 14.791,

  // "When you train it,"
  when: 15.36,
  youw: 15.59,
  train: 15.69,
  itw: 16.02,
  p10End: 16.099,

  // "don't stop at the drill."
  dont: 16.44,
  stop: 16.68,
  atw: 16.97,
  drill: 17.14,
  p11End: 17.518,

  // "Use it against a defender."
  use: 17.71,
  it2: 17.98,
  against: 18.05,
  defender2: 18.48,
  p12End: 18.934,

  // "Follow now"
  follow: 19.74,
  now: 20.11,
  p13End: 20.483,

  // "because every video here is designed to make you harder to guard."
  because: 20.75,
  every: 21.08,
  video: 21.33,
  here: 21.69,
  isw: 21.93,
  designed: 22.04,
  make: 22.52,
  you2: 22.75,
  harder: 22.84,
  to2: 23.23,
  guard: 23.31,
  p14End: 23.686,
} as const;

/* ------------------------------------------------------------------ *
 *  SHOTS — nine, averaging 2.8s. Same unhurried tempo as CROSSOVER.
 *
 *  Footage note: the supplied clips are the same four files used in the
 *  earlier two films, so this edit deliberately draws from the parts of
 *  them nothing has touched yet — the seconds before the shot goes up,
 *  the walk-off after it drops, the arena still celebrating — and the
 *  warm-up clip appears only as a framing that has never been used
 *  (hands on the ball). The hooded portrait, which closed both earlier
 *  films, is not used at all.
 * ------------------------------------------------------------------ */
export const F = {
  hook: 0, //          0.00  guarded, going nowhere            [x2 0–62 · unused]
  hands: 196, //       3.27  hands on the ball, tight          [c1 · new framing]
  feet: 319, //        5.32  ⬛ hands move the ball, feet move the defender
  watch: 413, //       6.88  ⬛ the floor sets up, then
  //                         attack · plant · freeze · explode
  payoff: 744, //     12.40  one move, one advantage           [x1 236–330 · unused]
  train: 887, //      14.78  ⬛ drill is not the finish line
  useIt: 1051, //     17.52  against a live defender           [x1 · wide, full speed]
  cta: 1184, //       19.73  the arena, still going            [x2 205–350 · unused]
  ctaClose: 1331, //  22.18  the walk-off, held                [x1 296–348 · unused]
  end: TOTAL,
} as const;
