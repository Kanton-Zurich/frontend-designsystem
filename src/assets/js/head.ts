import loadPolyfills from './helpers/polyfills';

import loadSvgSprites from '@unic/estatico-svgsprite/lib/loader';
import WindowEventListener from './helpers/events';
import './helpers/modernizrrc';
import Helper from './helpers/helper';
import namespace from './helpers/namespace';
import LineClamper from './helpers/lineclamper';
import FlyingFocus from './helpers/flyingfocus';
import AssetLoader from './helpers/assetloader';

loadPolyfills();

window[namespace] = {
  data: {}, // Content data
  options: {}, // Module options
  scriptLoader: new AssetLoader('data-script-main', 'script'),
  fontLoader: new AssetLoader('data-style-fonts', 'style', true),
  helpers: new Helper(),
  lineClamper: new LineClamper(),
  flyingFocus: new FlyingFocus(),
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.getAttribute('data-svgsprites-options')) {
    loadSvgSprites();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  (<any>window).estatico.lineClamper.initLineClamping();
  const adjustScrollbarWidth = () => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-wd', `${scrollBarWidth}px`);
  };
  (<any>WindowEventListener).addDebouncedResizeListener(() => {
    adjustScrollbarWidth();
  }, 'update-scrollbar-handling');
  adjustScrollbarWidth();
});
document.addEventListener('DOMContentLoaded', () => { (<any>window).estatico.flyingFocus.initFlyingFocus(); });

// reload on back or forward interaction
window.addEventListener('popstate', () => {
  document.location.reload();
});
