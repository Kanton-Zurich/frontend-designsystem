import Helper from './helper';

class BulkStyleLoader extends Helper {
  public logger: Function;
  public cssHref: string;

  constructor() {
    super();
    this.logger = this.log(BulkStyleLoader.name);

    // once cached, the css file is stored on the client forever unless
    // the URL below is changed. Any change will invalidate the cache
    document.addEventListener('DOMContentLoaded', () => {
      this.cssHref = document.body.getAttribute('data-style-main');
      if (this.cssHref !== null) {
        if (this.fileIsCached()) {
          this.logger('just use the cached version');
          this.injectStylesheet();
        } else {
          this.logger('don\'t block the loading of the page; wait until it\'s done; then download styles');
          this.on(window, 'load', this.injectStylesheet.bind(this));
        }
      }
    });
  }

  public injectStylesheet() {
    if (this.supportsLocalStorageAndXHR()) {
      if (this.cacheIsValid(this.cssHref)) {
        this.injectRawStyle(localStorage.styleCssCache);
      } else {
        this.fetchAndStoreStylesheet();
      }
    } else {
      this.createStylesheet();
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
        localStorage.styleCssCache = xhr.responseText;
        localStorage.styleCssCacheFile = this.cssHref;
      }
    };

    xhr.send();
  }

  public createStylesheet() {
    const stylesheet = document.createElement('link');

    stylesheet.href = this.cssHref;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(stylesheet);

    // just use the native browser cache
    // this requires a good expires header on the server
    document.cookie = 'styleCssCache';
  }

  public supportsLocalStorageAndXHR() {
    return window.localStorage && (<any>window).XMLHttpRequest;
  }

  /**
   * If we have the fonts in localStorage or if we've cached them using the native browser cache
   *
   * @return {Boolean}
   */
  public fileIsCached() {
    return (window.localStorage && localStorage.styleCssCache) || document.cookie.indexOf('styleCssCache') > -1;
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
    return localStorage.styleCssCache && (localStorage.styleCssCacheFile === href);
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

export default BulkStyleLoader;
