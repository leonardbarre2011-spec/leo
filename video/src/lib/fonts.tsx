import React from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

const FACES: [string, string, number][] = [
  ['Barlow Condensed', 'BarlowCondensed-600.woff2', 600],
  ['Barlow Condensed', 'BarlowCondensed-700.woff2', 700],
  ['Barlow Condensed', 'BarlowCondensed-800.woff2', 800],
  ['Inter', 'Inter-400.woff2', 400],
  ['Inter', 'Inter-500.woff2', 500],
  ['Inter', 'Inter-600.woff2', 600],
  ['Inter', 'Inter-700.woff2', 700],
  ['JetBrains Mono', 'JetBrainsMono-400.woff2', 400],
  ['JetBrains Mono', 'JetBrainsMono-500.woff2', 500],
  ['JetBrains Mono', 'JetBrainsMono-700.woff2', 700],
];

let loaded: Promise<void> | null = null;

/**
 * Fonts are vendored in public/fonts, so a render never depends on a font CDN
 * being reachable. The first frame blocks until the faces are actually ready.
 */
export const useFonts = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    if (!loaded) {
      loaded = Promise.all(
        FACES.map(async ([family, file, weight]) => {
          const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {
            weight: String(weight),
            display: 'block',
          });
          await face.load();
          (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
        })
      ).then(() => void document.fonts.ready);
    }
    loaded.then(() => continueRender(handle));
  }, [handle]);
};
