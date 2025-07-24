import Delegate from 'ftdomdelegate/main';
import extend from 'lodash/extend';
import uniqueId from 'lodash/uniqueId';
import namespace from './namespace';
import { watch } from 'wrist';

class Module {
  public name: string;
  public ui: {
    element: any;
  };
  public data: Object;
  public options: {
    domSelectors: any;
    stateClasses: any;
  };
  public uuid: string;
  public log: Function;
  public eventDelegate: Delegate;
  private _log: Function;
  public watchers: Object;
  public scriptsInitialized: boolean;
  public runScriptTypes: string[];

  /**
   * Helper Class
   * @param  {DOMNode} element - DOM element where to initialise the module
   * @param  {object} _defaultData - The default data object
   * @param  {object} _defaultOptions - The default options object
   * @param  {object} data - The data passed for this Module
   * @param  {object} options - The options passed as data attribute in the Module
   */
  constructor(element, _defaultData, _defaultOptions, data, options) {
    this.name = this.constructor.name.toLowerCase();
    this.watchers = {};

    this.ui = {
      element,
    };

    this.runScriptTypes = [
      'application/javascript',
      'application/ecmascript',
      'application/x-ecmascript',
      'application/x-javascript',
      'text/ecmascript',
      'text/javascript',
      'text/javascript1.0',
      'text/javascript1.1',
      'text/javascript1.2',
      'text/javascript1.3',
      'text/javascript1.4',
      'text/javascript1.5',
      'text/jscript',
      'text/livescript',
      'text/x-ecmascript',
      'text/x-javascript',
    ];
    this.scriptsInitialized = false;

    const globalData = window[namespace].data[this.name];
    const globalOptions = window[namespace].options[this.name];

    this.data = extend({}, _defaultData, globalData, data);
    this.options = extend({}, _defaultOptions, globalOptions, options);

    // Identify instance by UUID
    this.uuid = uniqueId(this.name);

    this.log = window[namespace].helpers.log(this.name);

    // Expose original log helper
    this._log = window[namespace].helpers.log; // eslint-disable-line no-underscore-dangle

    this.eventDelegate = new Delegate(element);

    this.initUi();
  }

  static get initEvents() {
    return ['DOMContentLoaded', 'ajaxLoaded'];
  }

  static get globalEvents() {
    return {
      verticalResize: 'eventname.global.vertical_resize',
    };
  }

  /**
   * Watches a property on an object, default object is this.data
   *
   * @private
   * @param {string} propertyName
   * @param {Function} callback
   * @param {Object} watchable
   * @memberof Module
   * @retusn {Object} watcher
   */
  protected watch(watchable: Object, propertyName: string, callback: Function) {
    const isDomElement = typeof (<Element>watchable).tagName !== 'undefined';

    if (Object.prototype.hasOwnProperty.call(watchable, propertyName) || isDomElement) {
      let watcher = null;
      if (isDomElement) {
        watcher = watch(watchable, propertyName, (propName, oldVal, newVal) => {
          callback(propName, oldVal, newVal, watchable);
        });
      } else {
        watcher = watch(watchable, propertyName, callback);
      }

      this.watchers[propertyName] = watcher;
      return watcher;
    }

    console.error(`The given property to watch doesn't exist: ${propertyName}`);

    return null;
  }

  /**
   *Initializes the ui automatically according to domSelectors list
   *
   * @protected
   * @memberof Module
   */
  protected initUi(enforceNodeList: any = []) {
    const domSelectorKeys = Object.keys(this.options.domSelectors);

    domSelectorKeys.forEach((selectorKey) => {
      const wrapInArray = enforceNodeList.indexOf(selectorKey) !== -1;

      const queryElements = this.ui.element.querySelectorAll(
        this.options.domSelectors[selectorKey]
      );

      this.ui[selectorKey] =
        queryElements.length > 1 || wrapInArray ? queryElements : queryElements[0];
    });
  }

  /**
   * Destroy method
   *
   * Should be overwritten in module if there are additional DOM elements, DOM data
   * and event listeners to remove
   *
   * Use cases:
   * - Unbind (namespaced) event listeners
   * - Remove data from DOM elements
   * - Remove elements from DOM
   */
  destroy() {
    // Remove event listeners connected to this instance
    this.eventDelegate.off();

    // Unwatch all watchers
    const watcherKeys = Object.keys(this.watchers);

    watcherKeys.forEach((key) => {
      this.watchers[key].unwatch();
    });

    // Delete references to instance
    delete this.ui.element.dataset[`${this.name}Instance`];

    delete window[namespace].modules[this.name].instances[this.uuid];
  }

  /**
   * Create checksum from object
   * @param obj
   */
  createObjectHash(obj: any) {
    const s = JSON.stringify(obj);
    let hash = 0;
    const strlen = s.length;
    if (strlen === 0) {
      return hash;
    }
    for (let i = 0; i < strlen; i += 1) {
      const c = s.charCodeAt(i);
      hash = (hash << 5) - hash + c; // eslint-disable-line
      hash = hash & hash; // eslint-disable-line
    }
    return hash;
  }

  /**
   * get base URL
   */
  getBaseUrl() {
    return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }

  /**
   * Update or insert rel link for canonical references
   * @param rel
   * @param href
   */
  upsertLinkRel(rel, href) {
    const relLink = document.querySelector(`link[rel="${rel}"]`); // eslint-disable-line
    if (relLink) {
      document.head.removeChild(relLink);
    }
    if (!href) {
      return;
    }
    const element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }

  /**
   * Update flying focus with a delay
   */
  updateFlyingFocus(delay = 0) {
    setTimeout(() => {
      (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
    }, delay);
  }

  /**
   * Fetch json data
   *
   * @param url endpoint URL to fetch data from
   */
  async fetchJsonData(url: string, managed: boolean = true): Promise<any> {
    if (managed) {
      return fetch(url)
        .then((response) => response.json())
        .catch((err) => {
          this.log('error', err);
          throw new Error(`Failed to fetch data from "${url}"!`);
        });
    }
    return fetch(url).then((response) => response);
  }

  /**
   * Fetch form data
   *
   * @param url endpoint URL to fetch data from
   */
  postFormData(form: any): Promise<any> {
    return new Promise<any>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve(xhr);
        }
      };
      xhr.open(form.method, form.action, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(this.serializeForm(form));
    });
  }

  /**
   * Post object as JSON to given URL.
   * Expects a JSON response body to which the Promise will resolve to.
   *
   * @param url endpoint URL to fetch data from
   * @param payload the request body object (will be stringified)
   */
  postJsonData(url: string, payload: object): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // eslint-disable-next-line no-magic-numbers
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Response unparseable!'));
            }
          } else {
            reject(new Error(`Post failed with status ${xhr.status}`));
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(payload));
    });
  }

  /**
   * Redirect via script
   * @param url
   */
  redirect(url: string) {
    window.location.href = url;
  }

  /**
   * Return a yyyy-mm-dd string for the api
   *
   * @param {Date} date
   * @returns string
   * @memberof Module
   */
  getAPIDateString(date: Date) {
    const singleDigitMonth = 9;
    const singleDigitDays = 10;

    if (date.getMonth && date.getDate && date.getFullYear) {
      const month =
        date.getMonth() < singleDigitMonth ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const day = date.getDate() < singleDigitDays ? `0${date.getDate()}` : date.getDate();

      return `${date.getFullYear()}-${month}-${day}`;
    }

    return '';
  }

  /**
   * Serialize a form
   * @param form
   */
  serializeForm(form) {
    const s = [];
    let field;
    let l;
    if (typeof form === 'object' && form.nodeName === 'FORM') {
      const len = form.elements.length;
      for (let i = 0; i < len; i += 1) {
        field = form.elements[i];
        if (
          field.name &&
          !field.disabled &&
          field.type !== 'file' &&
          field.type !== 'reset' &&
          field.type !== 'submit' &&
          field.type !== 'button'
        ) {
          if (field.type === 'select-multiple') {
            l = form.elements[i].options.length;
            for (let j = 0; j < l; j += 1) {
              if (field.options[j].selected) {
                s[s.length] = `${encodeURIComponent(field.name)}=${encodeURIComponent(
                  field.options[j].value
                )}`;
              }
            }
          } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
            s[s.length] = `${encodeURIComponent(field.name)}=${encodeURIComponent(field.value)}`;
          }
        }
      }
    }
    return s.join('&').replace(/%20/g, '+');
  }

  /**
   * When vertical content size changes due to interaction expand / collapse
   */
  dispatchVerticalResizeEvent(timeout: number = 0) {
    if (timeout > 0) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(Module.globalEvents.verticalResize));
      }, timeout);
      return;
    }
    window.dispatchEvent(new CustomEvent(Module.globalEvents.verticalResize));
  }

  /**
   * Check support for localstorage
   */
  public supportsLocalStorage() {
    try {
      return window.localStorage;
    } catch (error) {
      return false;
    }
  }

  // Checks if the module is visually rendered
  protected isVisible() {
    return this.ui.element.offsetWidth !== 0 && this.ui.element.offsetHeight !== 0;
  }

  /**
   * All scripts are loaded
   */
  scriptsDone() {
    const DOMContentLoadedEvent = document.createEvent('Event');
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(DOMContentLoadedEvent);
  }

  /**
   * Sequential run
   * @param arr
   * @param callback
   * @param idx
   */
  seq(arr, callback, idx = 0) {
    let index = idx;
    arr[index](() => {
      index += 1;
      if (index === arr.length) {
        callback();
      } else {
        this.seq(arr, callback, index);
      }
    });
  }

  /**
   * Inject scripts
   * @param $script
   * @param callback
   */
  insertScript($script, callback) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    if ($script.src) {
      s.onload = callback;
      s.onerror = callback;
      s.src = $script.src;
    } else {
      s.textContent = $script.innerHTML;
    }

    // re-insert the script tag so it executes.
    document.head.appendChild(s);

    // clean-up
    $script.parentNode.removeChild($script);

    // run the callback immediately for inline scripts
    if (!$script.src) {
      callback();
    }
  }

  /**
   * Run injected scripts
   * @param $container
   */
  runScripts($container) {
    this.scriptsInitialized = true;
    // get scripts tags from a node
    const $scripts = $container.querySelectorAll('script');
    const runList = [];
    let typeAttr;

    [].forEach.call($scripts, ($script) => {
      typeAttr = $script.getAttribute('type');

      // only run script tags without the type attribute
      // or with a javascript mime attribute value
      if (!typeAttr || this.runScriptTypes.indexOf(typeAttr) !== -1) {
        runList.push((callback) => {
          this.insertScript($script, callback);
        });
      }
    });

    // insert the script tags sequentially
    // to preserve execution order
    if (runList.length > 0) {
      this.seq(runList, this.scriptsDone);
    }
  }
}

export default Module;
