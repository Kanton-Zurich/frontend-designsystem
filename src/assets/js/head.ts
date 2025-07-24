import loadSvgSprites from '@unic/estatico-svgsprite/lib/loader';
import WindowEventListener from './helpers/events';
import Helper from './helpers/helper';
import namespace from './helpers/namespace';
import FlyingFocus from './helpers/flyingfocus';
import AssetLoader from './helpers/assetloader';

// eslint-disable-next-line
const trackingCallback = function () {
  if ((<any>window).startTracking && (<any>window).startTracking instanceof Function) {
    (<any>window).startTracking();
  }
};

window[namespace] = {
  data: {}, // Content data
  options: {}, // Module options
  scriptLoader: new AssetLoader('data-script-main', 'script', false, trackingCallback),
  helpers: new Helper(),
  flyingFocus: new FlyingFocus(),
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.getAttribute('data-svgsprites-options')) {
    loadSvgSprites();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const adjustScrollbarWidth = () => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-wd', `${scrollBarWidth}px`);
  };
  (<any>WindowEventListener).addDebouncedResizeListener(() => {
    adjustScrollbarWidth();
  }, 'update-scrollbar-handling');
  adjustScrollbarWidth();
});
document.addEventListener('DOMContentLoaded', () => {
  (<any>window).estatico.flyingFocus.initFlyingFocus();
});

// reload on back or forward interaction
let prevLoc = window.location;
window.addEventListener('popstate', () => {
  const locationServerPart = (loc: Location) => loc.origin + loc.pathname + loc.search;
  if (locationServerPart(window.location) === locationServerPart(prevLoc)) {
    prevLoc = window.location;
  } else {
    document.location.reload();
  }
});
