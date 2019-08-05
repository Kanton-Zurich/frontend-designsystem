import WindowEventListener from './helpers/events';
import './helpers/modernizrrc';
import FontLoader from './helpers/fontloader';
import Helper from './helpers/helper';
import namespace from './helpers/namespace';
import LineClamper from './helpers/lineclamper';
import FlyingFocus from './helpers/flyingfocus';
import AssetLoader from './helpers/assetloader';

/* eslint-disable no-var,vars-on-top,prefer-arrow-callback,func-names,prefer-template */
/* globals document, window, ActiveXObject */

/**
 * SVG Icon Sprite Loader
 *
 * @author Unic AG
 * @copyright Unic AG
 */

const loadSvgSprites = () => {
  var id = 'm-svgsprites';
  var spriteContainer = document.createElement('div');
  var spritesToLoad;
  var spritesAmount;

  setTimeout(() => {
    const rootElement = document.querySelector('[data-svgsprites-options]');
    if (rootElement) {
      spritesToLoad = JSON.parse(rootElement.getAttribute('data-svgsprites-options'));
      spritesAmount = spritesToLoad.length;

      /**
       * Check if we can send a XMLHttpRequest
       * @returns {*}
       */

      const getXMLHttpRequest = () => {
        if ((<any>window).XMLHttpRequest) {
          return new (<any>window).XMLHttpRequest();
        }
        try {
          return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } catch (e) {
          return null;
        }
      };

      /**
       * RequestSVG
       * @param url - string holding the url to the svg file
       * @constructor
       */
      const RequestSVG = (url) => {
        var oReq = getXMLHttpRequest();
        var container = document.getElementById(id);
        var handler = function () {
          if (oReq.readyState === 4) { // eslint-disable-line
            if (oReq.status === 200) { // eslint-disable-line
              container.innerHTML += oReq.responseText;
            }
          }
        };

        oReq.open('GET', url, true);
        oReq.onreadystatechange = handler;
        oReq.send();
      };

      /**
       * Send getXMLHttpRequest for each SVG sprite reference
       * found in the data-icon-sets attribute on the body tag
       */
      if (spritesAmount > 0 && (document.getElementById(id) === null)) {
        var i = spritesAmount;
        var html = document.getElementsByTagName('html')[0];

        if (getXMLHttpRequest() !== null) {
          spriteContainer.setAttribute('id', id);
          spriteContainer.setAttribute('data-svgsprites', 'wrapper'); // for potential later usage within JavaScript
          spriteContainer.setAttribute('style', 'display: none');

          document.body.appendChild(spriteContainer);

          while (i--) { // eslint-disable-line no-plusplus
            new RequestSVG(spritesToLoad[i]); // eslint-disable-line no-new
          }

          html.setAttribute('class', html.getAttribute('class') + ' svgsprites--loaded'); // word of caution: the SVG files might not really be loaded yet, this is rather about having them requested (for now)
        }
      }
    }
  }, 100);
};


window[namespace] = {
  data: {}, // Content data
  options: {}, // Module options
  scriptLoader: new AssetLoader('data-script-main', 'script'),
  fontLoader: new FontLoader(),
  helpers: new Helper(),
  lineClamper: new LineClamper(),
  flyingFocus: new FlyingFocus(),
};

document.addEventListener('DOMContentLoaded', loadSvgSprites);
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
