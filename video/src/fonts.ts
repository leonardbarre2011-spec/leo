import {useEffect, useState} from 'react';
import {staticFile, continueRender, delayRender} from 'remotion';

const faces = [
  {family: 'AntonLocal', file: 'fonts/anton.woff2', weight: '400'},
  {family: 'ArchivoBlackLocal', file: 'fonts/archivo-black.woff2', weight: '400'},
  {family: 'BarlowCondLocal', file: 'fonts/barlow-cond-800.woff2', weight: '800'},
  {family: 'BarlowCondLocal', file: 'fonts/barlow-cond-800i.woff2', weight: '800', style: 'italic'},
  {family: 'InterLocal', file: 'fonts/inter.woff2', weight: '100 900'},
];

let loaded: Promise<void> | null = null;

/**
 * Fonts are shipped in /public rather than fetched from a CDN so that a headless
 * render never depends on the network — a missing display face would silently
 * reflow every text slam in the video.
 */
export const loadFonts = () => {
  if (!loaded) {
    loaded = Promise.all(
      faces.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, {
          weight: f.weight,
          style: f.style ?? 'normal',
          display: 'block',
        });
        await face.load();
        document.fonts.add(face);
      })
    ).then(() => undefined);
  }
  return loaded;
};

export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts', {timeoutInMilliseconds: 60000}));
  useEffect(() => {
    let cancelled = false;
    loadFonts().then(() => {
      if (!cancelled) continueRender(handle);
    });
    return () => {
      cancelled = true;
    };
  }, [handle]);
};
