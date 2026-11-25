import { continueRender, delayRender, staticFile } from "remotion";

// Montserrat (variable, latin) served locally so renders work offline.
export const fontFamily = "MontserratLocal";
const handle = delayRender("Loading Montserrat");
const face = new FontFace(fontFamily, `url(${staticFile("fonts/Montserrat.woff2")}) format("woff2")`, {
  weight: "100 900",
});
face
  .load()
  .then(() => {
    document.fonts.add(face);
    continueRender(handle);
  })
  .catch(() => continueRender(handle));
