import {loadFont} from '@remotion/fonts';
import {ASSETS} from './theme';

/**
 * Fonts ship with the repo (no network at render time) and are registered with
 * @remotion/fonts so Remotion waits for them before rasterising frame 0.
 */
loadFont({family: 'AntonReel', url: ASSETS.font('anton-latin-400-normal.woff2'), weight: '400'});
loadFont({family: 'InterReel', url: ASSETS.font('inter-latin-400-normal.woff2'), weight: '400'});
loadFont({family: 'InterReel', url: ASSETS.font('inter-latin-600-normal.woff2'), weight: '600'});
loadFont({family: 'InterReel', url: ASSETS.font('inter-latin-700-normal.woff2'), weight: '700'});
loadFont({family: 'InterReel', url: ASSETS.font('inter-latin-800-normal.woff2'), weight: '800'});
