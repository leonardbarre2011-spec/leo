import { sceneAt, viralSceneAt } from './scenes.mjs';

/**
 * The sound-design sheet. Every cue is authored against the same trimmed
 * timeline the animation reads, so nothing can drift: the SFX stem is baked
 * once and played as a single track next to the voice-over.
 *
 * Rule followed throughout: sound only where something physically happens
 * on screen. No stingers for their own sake.
 */
export function buildCues(tl) {
  const cues = [];
  const at = (t, kind, opts = {}) => cues.push({ t, kind, ...opts });
  const S = (id) => sceneAt(id);
  const wordT = (id, i) => tl.byId[id].words[i].t;

  /* --- room tone: two long beds, swapped at the turn ------------------- */
  at(0.0, 'drone', { dur: 38.4, root: 51, level: 0.9 });
  at(S('turn').from - 0.3, 'drone', { dur: 15.0, root: 68, level: 1.25 });

  /* --- 0.00 cold open: the odometer ----------------------------------- */
  // 14 accelerating dribbles under the spinning rep counter
  for (let i = 0; i < 14; i++) {
    const p = i / 13;
    const t = 0.02 + 0.86 * (1 - Math.pow(1 - p, 1.9));
    at(t, 'dribble', { pitch: 1 + p * 0.5, level: 0.34 + p * 0.5, pan: (i % 2 ? 0.12 : -0.12) });
  }
  at(0.9, 'sub', { from: 74, to: 30, decay: 0.75, level: 1.0 });
  at(0.9, 'whoosh', { dur: 0.5, dir: -1, level: 0.8 });
  at(0.905, 'click', { freq: 1200, decay: 0.03, level: 0.7 });

  /* --- A: the loop — a year of identical days ------------------------- */
  // the calendar fills; a tick per week, a bounce per quarter
  for (let i = 0; i < 26; i++) {
    const t = 1.09 + i * 0.053;
    at(t, 'click', { freq: 2900 + (i % 4) * 260, decay: 0.007, level: 0.12 });
  }
  at(1.12, 'bounce', { pitch: 1.02, level: 0.34, pan: -0.1 });
  at(2.34, 'bounce', { pitch: 1.02, level: 0.34, pan: 0.08 });
  at(3.23, 'bounce', { pitch: 1.02, level: 0.34, pan: -0.06 });
  at(4.12, 'bounce', { pitch: 1.02, level: 0.38, pan: 0.1 });
  at(wordT('A', 10), 'click', { freq: 1500, decay: 0.02, level: 0.3 }); // "same"

  /* --- B: waiting ------------------------------------------------------ */
  at(S('wait').from, 'whoosh', { dur: 0.62, dir: -1, level: 0.5 });
  for (let i = 0; i < 7; i++) at(5.78 + i * 0.44, 'click', { freq: 1750, decay: 0.01, level: 0.16 });
  at(wordT('B', 2), 'squeak', { dur: 0.13, level: 0.16 }); // "wait"
  at(8.42, 'bounce', { pitch: 0.86, level: 0.5 });

  /* --- C: more of the same, scaled up --------------------------------- */
  at(S('scale').from, 'whoosh', { dur: 0.4, dir: 1, level: 0.4 });
  [9.16, 9.62, 10.05, 10.52].forEach((t, i) =>
    at(t, 'stamp', { level: 0.34 + i * 0.14, pan: i % 2 ? 0.14 : -0.14 })
  );
  at(wordT('C', 8), 'sub', { from: 58, to: 32, decay: 0.5, level: 0.55 });

  /* --- D: the stress test --------------------------------------------- */
  at(S('stress').from, 'whoosh', { dur: 0.45, dir: 1, level: 0.55 });
  for (let i = 0; i < 9; i++) at(11.62 + i * 0.115, 'click', { freq: 2100, decay: 0.008, level: 0.1 + i * 0.018 });
  at(wordT('D', 3), 'impact', { level: 0.9 }); // "breaks"
  at(wordT('D', 3) + 0.02, 'squeak', { dur: 0.1, level: 0.2 });
  at(wordT('D', 6), 'latch', { level: 0.45 }); // "pressure" → failure pin drops

  /* --- E: two hundred dribbles ---------------------------------------- */
  // a metronome that gets uncomfortably mechanical
  for (let i = 0; i < 30; i++) {
    const p = i / 29;
    const t = 13.98 + i * (0.115 - 0.055 * p);
    if (t > 15.85) break;
    at(t, 'dribble', { pitch: 1.25, level: 0.4 - 0.16 * p, pan: Math.sin(i * 1.7) * 0.3 });
  }

  /* --- F: smoothing, then the same fracture --------------------------- */
  at(S('smooth').from, 'whoosh', { dur: 0.8, dir: 1, level: 0.42 });
  at(16.4, 'blip', { freq: 520, level: 0.7 });
  at(wordT('F', 3), 'paper', { dur: 0.7, level: 0.5 }); // "smoother"
  at(wordT('F', 10) - 0.05, 'impact', { level: 1.0 }); // "breaks"
  at(wordT('F', 10) + 0.26, 'sub', { from: 48, to: 26, decay: 0.8, level: 0.6 });

  /* --- G: five positions ---------------------------------------------- */
  at(S('positions').from, 'whoosh', { dur: 0.55, dir: 1, level: 0.6 });
  [20.45, 20.6, 20.75, 20.9, 21.05].forEach((t, i) =>
    at(t, 'blip', { freq: 420 + i * 90, level: 0.55, pan: -0.35 + i * 0.175 })
  );
  at(wordT('G', 7), 'stamp', { level: 0.8 }); // "position"

  /* --- H: one workout, two bodies ------------------------------------- */
  at(S('sameplan').from, 'paper', { dur: 0.5, level: 0.6 });
  at(wordT('H', 4), 'stamp', { level: 0.7, pan: -0.3 }); // "guard"
  at(wordT('H', 7), 'stamp', { level: 0.7, pan: 0.3 }); // "big"
  [23.3, 23.42, 23.54, 23.66].forEach((t) => at(t, 'click', { freq: 2400, decay: 0.008, level: 0.14 }));

  /* --- I: half a second ------------------------------------------------ */
  at(S('read').from, 'whoosh', { dur: 0.5, dir: 1, level: 0.55 });
  at(S('read').from + 0.08, 'squeak', { dur: 0.15, level: 0.3, pan: -0.2 });
  for (let i = 0; i < 10; i++) at(26.5 + i * 0.13, 'click', { freq: 3000, decay: 0.006, level: 0.2 });
  at(wordT('I', 6), 'blip', { freq: 880, level: 0.8 }); // "read"
  at(wordT('I', 10), 'click', { freq: 1300, decay: 0.03, level: 0.5 }); // "second"

  /* --- J/K: the ball is still in the air ------------------------------- */
  at(S('air').from - 0.04, 'swish', { level: 0.7 });
  at(S('air').from, 'whoosh', { dur: 0.9, dir: 1, level: 0.45 });
  at(wordT('K', 4), 'blip', { freq: 700, level: 0.7 }); // "help"
  at(wordT('K', 7), 'bounce', { pitch: 0.92, level: 0.95 }); // "catches"
  at(wordT('K', 7) + 0.01, 'squeak', { dur: 0.14, level: 0.26, pan: 0.25 });

  /* --- L/M: different job / same drills -------------------------------- */
  at(S('differentjob').from, 'whoosh', { dur: 0.32, dir: -1, level: 0.6 });
  at(wordT('L', 0), 'impact', { level: 0.7 });
  at(S('samedrills').from, 'whoosh', { dur: 0.3, dir: -1, level: 0.6 });
  at(wordT('M', 0), 'stamp', { level: 0.9 });
  at(wordT('M', 1), 'stamp', { level: 0.7 });

  /* --- N: nothing changes ---------------------------------------------- */
  at(S('nothing').from, 'sub', { from: 52, to: 24, decay: 1.1, level: 0.7 });
  at(wordT('N', 3), 'click', { freq: 700, decay: 0.05, level: 0.45 }); // "changes" → odometer stops

  /* --- O: the turn ------------------------------------------------------ */
  at(S('turn').from - 0.85, 'riser', { dur: 0.92, level: 0.8 });
  at(S('turn').from, 'impact', { level: 1.05 });
  at(S('turn').from + 0.02, 'swish', { level: 0.5 });
  // the flat line unrolls into twelve weeks: one latch per week node
  for (let i = 0; i < 12; i++) {
    at(38.42 + i * 0.108, 'latch', { level: 0.3 + i * 0.028, pan: -0.3 + (i / 11) * 0.6 });
  }
  at(39.78, 'paper', { dur: 0.75, level: 0.75 }); // the document settles
  at(39.86, 'whoosh', { dur: 0.5, dir: -1, level: 0.4 });
  [40.42, 40.72, 41.02, 41.32].forEach((t, i) => at(t, 'blip', { freq: 560 + i * 70, level: 0.55 }));
  at(41.66, 'latch', { level: 0.6 });

  /* --- P: two futures --------------------------------------------------- */
  at(S('diverge').from, 'whoosh', { dur: 0.55, dir: 1, level: 0.5 });
  at(wordT('P', 6), 'blip', { freq: 940, level: 0.7 }); // "different"
  for (let i = 0; i < 6; i++) at(43.5 + i * 0.22, 'click', { freq: 2600, decay: 0.007, level: 0.13 });

  /* --- Q: the punchline -------------------------------------------------- */
  at(S('cardio').from, 'whoosh', { dur: 0.4, dir: -1, level: 0.45 });
  at(46.1, 'bounce', { pitch: 1.0, level: 0.4, pan: -0.2 });
  at(46.62, 'bounce', { pitch: 1.0, level: 0.36, pan: -0.2 });
  at(47.14, 'bounce', { pitch: 1.0, level: 0.32, pan: -0.2 });
  at(wordT('Q', 6), 'blip', { freq: 380, level: 0.6 }); // "cardio", deadpan

  /* --- R: end card -------------------------------------------------------- */
  at(S('end').from, 'whoosh', { dur: 0.6, dir: 1, level: 0.5 });
  // the word being typed into the comment field
  'GAME'.split('').forEach((_, i) => at(49.0 + i * 0.09, 'click', { freq: 3100, decay: 0.007, level: 0.26 }));
  at(wordT('R', 7), 'latch', { level: 0.6 }); // "link"
  at(51.35, 'bounce', { pitch: 0.9, level: 0.55 });
  at(51.36, 'swish', { level: 0.4 });

  return cues.sort((a, b) => a.t - b.t);
}

/**
 * Cue sheet for the short cut. Same kit, tighter placement: with the runway
 * gone the film has to land a physical hit on frame 1, and every scene change
 * carries an impact so the edit reads as fast even on a phone speaker.
 */
export function buildViralCues(tl) {
  const cues = [];
  const at = (t, kind, opts = {}) => cues.push({ t, kind, ...opts });
  const S = (id) => viralSceneAt(id);
  const wordT = (id, i) => tl.byId[id].words[i].t;

  at(0.0, 'drone', { dur: 24.6, root: 51, level: 0.9 });
  at(S('turn').from - 0.3, 'drone', { dur: 14.0, root: 68, level: 1.25 });

  /* --- the ball hits the floor on frame one ---------------------------- */
  at(0.0, 'impact', { level: 1.0 });
  at(0.0, 'bounce', { pitch: 0.9, level: 0.9 });
  at(0.02, 'swish', { level: 0.45 });
  // the counter spinning under the first line
  for (let i = 0; i < 22; i++) at(0.24 + i * 0.062, 'click', { freq: 2900 + (i % 4) * 240, decay: 0.007, level: 0.13 });
  at(1.52, 'bounce', { pitch: 1.02, level: 0.32, pan: -0.1 });
  at(2.2, 'bounce', { pitch: 1.02, level: 0.32, pan: 0.09 });
  at(wordT('A', 10), 'stamp', { level: 0.6 }); // "same"

  /* --- C: more of the same, scaled up ---------------------------------- */
  at(S('same').from, 'whoosh', { dur: 0.4, dir: 1, level: 0.5 });
  [4.51, 4.94, 5.4, 5.8].forEach((t, i) =>
    at(t, 'stamp', { level: 0.36 + i * 0.16, pan: i % 2 ? 0.14 : -0.14 })
  );
  at(wordT('C', 8), 'sub', { from: 58, to: 32, decay: 0.5, level: 0.6 });

  /* --- G: five positions ------------------------------------------------ */
  at(S('five').from, 'whoosh', { dur: 0.5, dir: 1, level: 0.65 });
  [7.1, 7.24, 7.38, 7.52, 7.66].forEach((t, i) =>
    at(t, 'blip', { freq: 420 + i * 90, level: 0.6, pan: -0.35 + i * 0.175 })
  );
  at(wordT('G', 7), 'stamp', { level: 0.9 }); // "position"

  /* --- H: one workout, two bodies --------------------------------------- */
  at(S('two').from, 'paper', { dur: 0.5, level: 0.65 });
  at(wordT('H', 4), 'stamp', { level: 0.75, pan: -0.3 }); // "guard"
  at(wordT('H', 7), 'stamp', { level: 0.75, pan: 0.3 }); // "big"
  [10.7, 10.82, 10.94, 11.06].forEach((t) => at(t, 'click', { freq: 2400, decay: 0.008, level: 0.15 }));

  /* --- I: half a second -------------------------------------------------- */
  at(S('read').from, 'whoosh', { dur: 0.5, dir: 1, level: 0.6 });
  at(S('read').from + 0.06, 'squeak', { dur: 0.15, level: 0.3, pan: -0.2 });
  for (let i = 0; i < 10; i++) at(12.9 + i * 0.13, 'click', { freq: 3000, decay: 0.006, level: 0.21 });
  at(wordT('I', 6), 'blip', { freq: 880, level: 0.85 }); // "read"
  at(wordT('I', 10), 'click', { freq: 1300, decay: 0.03, level: 0.55 }); // "second"

  /* --- J/K: the pass, and the read under it ------------------------------ */
  at(S('air').from - 0.04, 'swish', { level: 0.75 });
  at(S('air').from, 'whoosh', { dur: 0.85, dir: 1, level: 0.5 });
  at(wordT('K', 4), 'blip', { freq: 700, level: 0.75 }); // "help"
  at(wordT('K', 7), 'bounce', { pitch: 0.92, level: 1.0 }); // "catches"
  at(wordT('K', 7) + 0.01, 'squeak', { dur: 0.14, level: 0.28, pan: 0.25 });

  /* --- L/M: different job / same drills ----------------------------------- */
  at(S('diff').from, 'whoosh', { dur: 0.3, dir: -1, level: 0.65 });
  at(wordT('L', 0), 'impact', { level: 0.8 });
  at(S('drills').from, 'whoosh', { dur: 0.28, dir: -1, level: 0.65 });
  at(wordT('M', 0), 'stamp', { level: 1.0 });
  at(wordT('M', 1), 'stamp', { level: 0.8 });

  /* --- N: nothing changes -------------------------------------------------- */
  at(S('flat').from, 'sub', { from: 52, to: 24, decay: 1.1, level: 0.75 });
  at(wordT('N', 3), 'click', { freq: 700, decay: 0.05, level: 0.5 });

  /* --- the turn ------------------------------------------------------------ */
  at(S('turn').from - 0.8, 'riser', { dur: 0.86, level: 0.85 });
  at(S('turn').from, 'impact', { level: 1.1 });
  at(S('turn').from + 0.02, 'swish', { level: 0.55 });
  for (let i = 0; i < 12; i++) {
    at(24.62 + i * 0.072, 'latch', { level: 0.32 + i * 0.028, pan: -0.3 + (i / 11) * 0.6 });
  }
  at(25.52, 'paper', { dur: 0.7, level: 0.8 });
  at(25.6, 'whoosh', { dur: 0.45, dir: -1, level: 0.42 });
  [26.14, 26.5, 26.86, 27.22].forEach((t, i) => at(t, 'blip', { freq: 560 + i * 70, level: 0.6 }));
  at(27.62, 'latch', { level: 0.65 });

  /* --- P: the climb --------------------------------------------------------- */
  at(S('climb').from, 'whoosh', { dur: 0.5, dir: 1, level: 0.55 });
  at(wordT('P', 6), 'blip', { freq: 940, level: 0.75 });
  for (let i = 0; i < 7; i++) at(29.1 + i * 0.2, 'click', { freq: 2600, decay: 0.007, level: 0.14 });

  /* --- Q: the punchline ------------------------------------------------------ */
  at(S('cardio').from, 'whoosh', { dur: 0.38, dir: -1, level: 0.5 });
  [31.8, 32.3, 32.8].forEach((t, i) => at(t, 'bounce', { pitch: 1.0, level: 0.4 - i * 0.04, pan: -0.2 }));
  at(wordT('Q', 6), 'blip', { freq: 380, level: 0.65 }); // "cardio", deadpan

  /* --- R: end card, and the hand-off back to frame one ----------------------- */
  at(S('end').from, 'whoosh', { dur: 0.55, dir: 1, level: 0.55 });
  'GAME'.split('').forEach((_, i) => at(34.5 + i * 0.09, 'click', { freq: 3100, decay: 0.007, level: 0.28 }));
  at(wordT('R', 7), 'latch', { level: 0.65 });
  // the loop: this bounce is the same hit the film opens on
  at(37.3, 'bounce', { pitch: 0.9, level: 0.6 });

  return cues.sort((a, b) => a.t - b.t);
}
