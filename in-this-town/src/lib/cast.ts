import type { Look } from "./Character";

export const NOAH: Look = {
  skin: "#f1c27d",
  shirt: "#3b7dd8",
  pants: "#23314f",
  shoes: "#f2f2f2",
  hair: "#4a2f1d",
  hairStyle: "spiky",
  backpack: "#e0533c",
};

export const NOAH_NOBAG: Look = { ...NOAH, backpack: undefined };

export const GUARD: Look = {
  skin: "#d9a374",
  shirt: "#4d5b3a",
  pants: "#3a3a2e",
  shoes: "#1e1a16",
  hair: "#bdbdbd",
  hairStyle: "cap",
  capColor: "#34402a",
  beard: "#cfcfcf",
};

export const MOM: Look = {
  skin: "#e8b48a",
  shirt: "#b8475a",
  pants: "#2f3a5e",
  hair: "#2a1a12",
  hairStyle: "bun",
};
export const DAD: Look = {
  skin: "#c68b59",
  shirt: "#3f6b55",
  pants: "#2b2b33",
  hair: "#1a1410",
  hairStyle: "short",
};
export const GIRL: Look = {
  skin: "#f3cfa8",
  shirt: "#f2b632",
  pants: "#5a3d8a",
  hair: "#c0662e",
  hairStyle: "long",
};
export const GRANDMA: Look = {
  skin: "#efc9a4",
  shirt: "#7a6aa8",
  pants: "#4a4a5a",
  hair: "#e6e6e6",
  hairStyle: "bun",
};
export const KID2: Look = {
  skin: "#8d5a3b",
  shirt: "#2fae8f",
  pants: "#3a3f52",
  hair: "#141010",
  hairStyle: "short",
};

const zom = (shirt: string, pants: string, hair = "#2b2b22"): Look => ({
  skin: "#7fa36a",
  shirt,
  pants,
  shoes: "#2a2622",
  hair,
  hairStyle: "short",
  zombie: true,
});

export const ZOMBIE = zom("#6b5b4b", "#3b4252");
export const ZOMBIES: Look[] = [
  zom("#5a6b7a", "#3a3a3a", "#3a2a1a"),
  zom("#8a4a4a", "#2f3b4f"),
  zom("#6a7a4a", "#4a3a2a", "#1a1a1a"),
  zom("#4a4a6a", "#3a3a2a", "#5a4a2a"),
  zom("#7a6a5a", "#2a2a3a"),
  zom("#3f5f5f", "#4a3b2b", "#2a1a10"),
];
