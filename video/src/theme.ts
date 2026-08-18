import { ANTON_WOFF2, INTER_WOFF2 } from "./fonts";

/* ------------------------------------------------------------------ *
 *  BRAND SYSTEM
 *  One accent (VOLT) drives every correction / action / CTA element.
 *  RED is reserved strictly for WRONG / WARNING.
 * ------------------------------------------------------------------ */
export const C = {
  volt: "#D8FF3E",
  voltDim: "#A8C82E",
  red: "#FF2E2E",
  redDim: "#B01A1A",
  ink: "#07080A",
  white: "#FFFFFF",
  bone: "#EDEFE9",
  smoke: "rgba(255,255,255,0.62)",
} as const;

export const FONT = {
  display: "'Anton', 'Arial Black', sans-serif",
  ui: "'Inter', system-ui, sans-serif",
} as const;

/* Fonts are embedded as data URIs: no network fetch during a render,
 * so a frame can never be drawn with a fallback face and delayRender
 * always clears. */
const style = document.createElement("style");
style.textContent = `
@font-face {
  font-family: "Anton";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url("data:font/woff2;base64,${ANTON_WOFF2}") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900;
  font-display: block;
  src: url("data:font/woff2;base64,${INTER_WOFF2}") format("woff2");
}`;
document.head.appendChild(style);

/* No delayRender needed: a data URI resolves inside the first layout
 * pass, and font-display:block keeps a fallback face off screen. */
document.fonts.load('400 100px "Anton"').catch(() => undefined);
document.fonts.load('800 100px "Inter"').catch(() => undefined);

/* Shared text treatments */
export const displayStyle = (size: number): React.CSSProperties => ({
  fontFamily: FONT.display,
  fontSize: size,
  lineHeight: 0.86,
  letterSpacing: -size * 0.012,
  textTransform: "uppercase",
  WebkitFontSmoothing: "antialiased",
});

export const uiStyle = (
  size: number,
  weight: number = 800,
): React.CSSProperties => ({
  fontFamily: FONT.ui,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: size * 0.12,
  textTransform: "uppercase",
  WebkitFontSmoothing: "antialiased",
});

/* Legibility: a tight shadow, never a glow-blob */
export const legible = (strength = 1): React.CSSProperties => ({
  textShadow: `0 ${4 * strength}px ${18 * strength}px rgba(0,0,0,${0.55 * strength}), 0 ${1 * strength}px ${3 * strength}px rgba(0,0,0,${0.7 * strength})`,
});
