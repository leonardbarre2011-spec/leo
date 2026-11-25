import type { Look } from "../../lib/Character";

// Original cast for "The Smiling Town".
export const MILO: Look = {
  skin: "#f5c99b",
  shirt: "#f7c531",
  pants: "#2f4f8f",
  shoes: "#ffffff",
  hair: "#5a3820",
  hairStyle: "capBack",
  capColor: "#d23c3c",
};

export const NEIGHBOR: Look = {
  skin: "#e3ae80",
  shirt: "#4f8a5b",
  pants: "#c8b58a",
  shoes: "#5a3a24",
  hair: "#9a9a9a",
  hairStyle: "short",
  mustache: "#8a8a8a",
};

export const TOWNSFOLK: Look[] = [
  { skin: "#f2c8a0", shirt: "#e66a8a", pants: "#ffffff", hair: "#e8c85a", hairStyle: "long" },
  { skin: "#c68b59", shirt: "#5ab0e8", pants: "#2b2b33", hair: "#1a1410", hairStyle: "short" },
  { skin: "#efc9a4", shirt: "#ffffff", pants: "#6a8fd0", hair: "#7a4a2a", hairStyle: "bun" },
  { skin: "#8d5a3b", shirt: "#f29a3a", pants: "#3a3f52", hair: "#141010", hairStyle: "short" },
  { skin: "#f3cfa8", shirt: "#9a7ae0", pants: "#4a4a5a", hair: "#e6e6e6", hairStyle: "bun" },
];

export const WATCHER: Look = {
  skin: "#3a3d44",
  shirt: "#1c1e24",
  pants: "#15161a",
  shoes: "#0d0d0d",
  hair: "#0d0d0f",
  hairStyle: "short",
  headset: true,
};
