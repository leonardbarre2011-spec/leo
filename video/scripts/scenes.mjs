/**
 * The cut. Every entry is one held idea; `from`/`to` are seconds on the
 * trimmed timeline. Boundaries were placed against the voice-over so a scene
 * turns over on a breath, never mid-word.
 */
export const SCENES = [
  { id: 'hook', from: 0.0, to: 1.05 },
  { id: 'loop', from: 1.05, to: 5.45 },
  { id: 'wait', from: 5.45, to: 8.95 },
  { id: 'scale', from: 8.95, to: 11.45 },
  { id: 'stress', from: 11.45, to: 13.9 },
  { id: 'twohundred', from: 13.9, to: 15.92 },
  { id: 'smooth', from: 15.92, to: 20.1 },
  { id: 'positions', from: 20.1, to: 22.85 },
  { id: 'sameplan', from: 22.85, to: 25.45 },
  { id: 'read', from: 25.45, to: 28.45 },
  { id: 'air', from: 28.45, to: 30.45 },
  { id: 'help', from: 30.45, to: 33.05 },
  { id: 'differentjob', from: 33.05, to: 34.55 },
  { id: 'samedrills', from: 34.55, to: 36.1 },
  { id: 'nothing', from: 36.1, to: 37.95 },
  { id: 'turn', from: 37.95, to: 42.7 },
  { id: 'diverge', from: 42.7, to: 45.68 },
  { id: 'cardio', from: 45.68, to: 48.35 },
  { id: 'end', from: 48.35, to: 52.85 },
];

export const sceneAt = (id) => SCENES.find((s) => s.id === id);
