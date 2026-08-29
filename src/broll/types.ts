export type ModuleProps = {
  /** Frames elapsed since this b-roll window opened. */
  local: number;
  /** Length of the window in frames. */
  dur: number;
  fps: number;
};
