import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.overrideWebpackConfig((c) => c);
Config.setChromiumOpenGlRenderer('angle-egl');
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setConcurrency(3);

/**
 * The sandbox blocks Remotion's Chrome Headless Shell download host, so the
 * pre-installed Chromium in the image is used instead.
 */
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
