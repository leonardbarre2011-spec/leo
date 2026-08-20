/* ------------------------------------------------------------------ *
 *  IMPROVE YOUR JUMPER — master timeline
 *
 *  Transcript recovered offline (PocketSphinx) + `silencedetect`
 *  boundaries. Clean read; nothing flagged.
 *
 *  This one is a list, not a fix. Lists are the format people save, so
 *  the edit is built around scannability: a chapter number that lands
 *  on every count, a 1/5 progress bar that never leaves, and a full
 *  recap card at the end — the frame someone screenshots.
 *
 *  fps 60 · 1800 frames · 30.000s. VO speech ends at 28.490s.
 * ------------------------------------------------------------------ */
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 1800;

export const s = (sec: number) => Math.round(sec * FPS);

export const VO = {
  // "Want a better jumper?"
  want: 0.05,
  better: 0.22,
  jumper: 0.44,
  p1End: 0.837,

  // "Stop just taking more shots."
  stop: 1.25,
  taking: 1.81,
  more: 2.09,
  shots1: 2.28,
  p2End: 2.779,

  // "Do these five exercises instead."
  dow: 3.1,
  five1: 3.46,
  exercises: 3.71,
  instead: 4.38,
  p3End: 4.749,

  // 1 · "Form shots." / "Build perfect mechanics."
  one: 5.0,
  form: 5.73,
  build: 6.73,
  mechanics: 7.35,
  p4End: 7.977,

  // 2 · "One-hand shots." / "Fix your release."
  two: 8.34,
  oneHand: 8.88,
  fix: 10.07,
  release: 10.48,
  p5End: 11.021,

  // 3 · "Wall shooting." / "Sharpen your wrist and follow-through."
  three: 11.69,
  wall: 12.23,
  sharpen: 13.11,
  wrist: 13.63,
  followThrough: 14.07,
  p6End: 14.658,

  // 4 · "Catch-and-shoot sprints." / "Train your shot when you're tired."
  four: 15.06,
  catchAnd: 15.34,
  sprints: 15.83,
  train: 16.54,
  tired: 17.48,
  p7End: 17.868,

  // 5 · "Game-speed pull-ups."
  five2: 18.14,
  gameSpeed: 18.95,
  pullUps: 19.51,
  p8End: 20.022,

  // "Because practice only matters if it transfers to games."
  because: 20.23,
  practice: 20.51,
  matters: 21.2,
  transfers: 21.91,
  games: 22.57,
  p9End: 23.025,

  // "Save this workout, do it consistently,"
  save: 23.21,
  workout: 23.65,
  doIt: 24.3,
  consistently: 24.53,
  p10End: 25.256,

  // "and follow for more drills that actually make you a better scorer."
  andFollow: 25.4,
  drills: 26.26,
  actually: 27.04,
  betterScorer: 27.86,
  p11End: 28.49,
} as const;

/** The five, in the order they are spoken. */
export const DRILLS = [
  { n: "1", name: "FORM SHOTS", why: "BUILD PERFECT MECHANICS" },
  { n: "2", name: "ONE-HAND SHOTS", why: "FIX YOUR RELEASE" },
  { n: "3", name: "WALL SHOOTING", why: "SHARPEN WRIST & FOLLOW-THROUGH" },
  { n: "4", name: "CATCH-AND-SHOOT SPRINTS", why: "TRAIN YOUR SHOT WHEN TIRED" },
  { n: "5", name: "GAME-SPEED PULL-UPS", why: "MAKE IT TRANSFER TO GAMES" },
] as const;

/* ------------------------------------------------------------------ *
 *  SHOTS
 *
 *  Footage note: no clips came with this script and the library is
 *  spent, so this film uses the two clips that are actually about
 *  shooting — the warm-up jumper (`c4`) and the pull-up (`c3`) — both
 *  of which have not been touched since the first film, and c4's
 *  follow-through (133–192) never at all. Everything else is drawn.
 * ------------------------------------------------------------------ */
export const F = {
  hook: 0, //          0.00  a counter climbing, going nowhere
  strike: 75, //       1.25  and the red line through it
  promise: 186, //     3.10  all five, up front — the reason to stay
  d1: 296, //          4.93  form shots            [c4 · mechanics]
  d2: 500, //          8.33  one-hand shots        [c4 · the release]
  d3: 700, //         11.67  wall shooting         [c4 133–192 · unused]
  d4: 902, //         15.03  catch-and-shoot       [c3 · into the shot]
  d5: 1086, //        18.10  game-speed pull-ups   [c3 · the pull-up]
  why: 1212, //       20.20  it has to transfer    [c3 · the make]
  recap: 1383, //     23.05  ⬛ the card people screenshot
  end: TOTAL,
} as const;
