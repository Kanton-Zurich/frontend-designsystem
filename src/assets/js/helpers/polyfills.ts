/**
 * Polyfills to be loaded by default
 *
 * Small polyfills we are being inlined
 * Larger ones are loaded async and only if needed
 *
 * If a polyfill is expected to be used only in exceptional cases it could make sense to load it
 * where needed instead of here
 *
 * !IMPORTANT! Check with core-js to see which polyfills are included for you
 * automatically with @babel/preset-env
 * Website: https://www.npmjs.com/package/core-js
 */
import '@babel/polyfill';
import 'mdn-polyfills/NodeList.prototype.forEach';
import 'mdn-polyfills/Node.prototype.remove';
import 'mdn-polyfills/CustomEvent';
import 'element-closest';

/**
 * loadPolyfills
 * Tests for surtain functionality and adds polyfills when functionality is not found
 * @return {Promise} - Resolves when all async polyfills are loaded
 */
export default function loadPolyfills() {
  const requiredPolyfills = [];

  (() => {
    // Removing SVG keyboard focus in Internet Explorer
    // Mike Foskett - webSemantics.uk - August 2016
    // http://codepen.io/2kool2/pen/bZkVRx

    // is it IE and which version?
    // https://gist.github.com/padolsey/527683/#gistcomment-805422
    const ie = () => {
      let undef;
      let rv = -1; // Return value assumes failure.
      const ua = window.navigator.userAgent;
      const msie = ua.indexOf('MSIE ');
      const trident = ua.indexOf('Trident/');

      if (msie > 0) {
        // IE 10 or older => return version number
        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); // eslint-disable-line
      } else if (trident > 0) {
        // IE 11 (or newer) => return version number
        const rvNum = ua.indexOf('rv:');
        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10); // eslint-disable-line
      }

      return ((rv > -1) ? rv : undef);
    };

    const addAttrFocusable = (bool) => {
      const svgs = document.getElementsByTagName('svg');
      let i = svgs.length;
      while (i--) { // eslint-disable-line
        svgs[i].setAttribute('focusable', bool);
      }
    };

    setTimeout(() => {
      if (ie()) {
        addAttrFocusable(!1);
      }
    },500); // eslint-disable-line
  })();

  // if (!window.fetch) {
  //   requiredPolyfills.push(import('whatwg-fetch'));
  // }

  return Promise.all(requiredPolyfills);
}
