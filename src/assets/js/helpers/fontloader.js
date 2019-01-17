import Helper from './helper';

class FontLoader extends Helper {
  constructor(href = '/assets/css/fonts.css?v1') {
    super();
    this.logger = this.log(FontLoader.name);

    // once cached, the css file is stored on the client forever unless
    // the URL below is changed. Any change will invalidate the cache
    this.cssHref = href;

    if (this.fileIsCached()) {
      this.logger('just use the cached version');
      this.injectFontsStylesheet();
    } else {
      this.logger('don\'t block the loading of the page; wait until it\'s done; then download fonts');
      this.on(window, 'load', this.injectFontsStylesheet.bind(this));
    }
  }

  injectFontsStylesheet() {
    if (this.supportsLocalStorageAndXHR()) {
      if (this.cacheIsValid(this.cssHref)) {
        this.injectRawStyle(localStorage.fontCssCache);
      } else {
        this.fetchAndStoreStylesheet();
      }
    } else {
      this.createFontStylesheet();
    }
  }

  fetchAndStoreStylesheet() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', this.cssHref, true);

    // cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // once we have the content, quickly inject the css rules
        this.injectRawStyle(xhr.responseText);

        // and cache the text content for further use
        // notice that this overwrites anything that might have already been previously cached
        localStorage.fontCssCache = xhr.responseText;
        localStorage.fontCssCacheFile = this.cssHref;
      }
    };

    xhr.send();
  }

  createFontStylesheet() {
    const stylesheet = document.createElement('link');

    stylesheet.href = this.cssHref;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(stylesheet);

    // just use the native browser cache
    // this requires a good expires header on the server
    document.cookie = 'fontCssCache';
  }

  supportsLocalStorageAndXHR() {
    return window.localStorage && window.XMLHttpRequest;
  }

  /**
   * If we have the fonts in localStorage or if we've cached them using the native browser cache
   *
   * @return {Boolean}
   */
  fileIsCached() {
    return (window.localStorage && localStorage.fontCssCache) || document.cookie.indexOf('fontCssCache') > -1;
  }

  /**
   * Determine whether a css file has been cached locally
   * and if it's the current version
   *
   * @param  {String} href - CSS path to check vs the cached one
   *
   * @return {Boolean}
   */
  cacheIsValid(href) {
    return localStorage.fontCssCache && (localStorage.fontCssCacheFile === href);
  }

  // this is the simple utility that injects the cached or loaded css text
  injectRawStyle(text) {
    const style = document.createElement('style');

    // cater for IE8 which doesn't support style.innerHTML
    style.setAttribute('type', 'text/css');

    if (style.styleSheet) {
      style.styleSheet.cssText = text;
    } else {
      style.innerHTML = text;
    }

    document.getElementsByTagName('head')[0].appendChild(style);
  }
}

export default FontLoader;
