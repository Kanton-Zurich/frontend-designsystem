import Helper from './helper';

class FontLoader extends Helper {
  public logger: Function;
  public cssHref: string;

  constructor() {
    super();
    this.logger = this.log(FontLoader.name);

    // once cached, the css file is stored on the client forever unless
    // the URL below is changed. Any change will invalidate the cache
    this.on(window, 'load', () => {

    });
    document.addEventListener('DOMContentLoaded', () => {
      this.cssHref = document.body.getAttribute('data-fonts');
      if (!this.cssHref) {
        return;
      }
      if (this.fileIsCached()) {
        this.logger('just use the cached version');
        this.injectFontsStylesheet();
      } else {
        this.logger('don\'t block the loading of the page; wait until it\'s done; then download fonts');
        this.on(window, 'load', this.injectFontsStylesheet.bind(this));
      }
    });
  }

  public injectFontsStylesheet() {
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

  public fetchAndStoreStylesheet() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', this.cssHref, true);

    // cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
    xhr.onreadystatechange = () => {
      const ajaxDone = 4;
      const statusOk = 200;

      if (xhr.readyState === ajaxDone && xhr.status === statusOk) {
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

  public createFontStylesheet() {
    const stylesheet = document.createElement('link');

    stylesheet.href = this.cssHref;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(stylesheet);

    // just use the native browser cache
    // this requires a good expires header on the server
    document.cookie = 'fontCssCache';
  }

  public supportsLocalStorageAndXHR() {
    try {
      return window.localStorage && (<any>window).XMLHttpRequest;
    } catch (error) {
      return false;
    }
  }

  /**
   * If we have the fonts in localStorage or if we've cached them using the native browser cache
   *
   * @return {Boolean}
   */
  public fileIsCached() {
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
  public cacheIsValid(href) {
    return localStorage.fontCssCache && (localStorage.fontCssCacheFile === href);
  }

  /**
   * this is the simple utility that injects the cached or loaded css text
   * @param text
   */
  public injectRawStyle(text) {
    const style: any = document.createElement('style');

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
