import React from "react";
import { Cam as BaseCam } from "../../lib/Cam";
import type { V3 } from "../../lib/Cam";

// Same as Cam, but never closer than MIN to what it looks at (keeps close-ups readable in 9:16).
const MIN = 5.6;
const push = (from: V3, look: V3): V3 => {
  const d = [from[0] - look[0], from[1] - look[1], from[2] - look[2]];
  const len = Math.hypot(d[0], d[1], d[2]);
  if (len >= MIN || len === 0) return from;
  const k = MIN / len;
  return [look[0] + d[0] * k, look[1] + d[1] * k, look[2] + d[2] * k];
};
export const Cam: React.FC<React.ComponentProps<typeof BaseCam>> = (props) => {
  const lookTo = props.lookTo ?? props.look;
  return <BaseCam {...props} from={push(props.from, props.look)} to={props.to ? push(props.to, lookTo) : undefined} />;
};
