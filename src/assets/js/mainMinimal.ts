import WindowEventListener from './helpers/events';
import Helper from './helpers/helper';
import namespace from './helpers/namespace';
import FlyingFocus from './helpers/flyingfocus';
import App from './helpers/appMinimal';

window[namespace] = {
  data: {}, // Content data
  options: {}, // Module options
  helpers: new Helper(),
  flyingFocus: new FlyingFocus(),
};

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
window.addEventListener('popstate', () => {
  document.location.reload();
});

let app;

const loadApp = () => {
  app = new App();
  app.start();
};

if (document.querySelector('[load-main-script-deferred]')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      loadApp();
    }, 0);
  });
} else {
  loadApp();
}
