import { Delegate } from 'dom-delegate';
import extend from 'lodash/extend';
import uniqueId from 'lodash/uniqueId';
import namespace from './namespace';
import wrist from 'wrist';

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
        watcher = wrist.watch(watchable, propertyName, (propName, oldVal, newVal) => {
          callback(propName, oldVal, newVal, watchable);
        });
      } else {
        watcher = wrist.watch(watchable, propertyName, callback);
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

      const queryElements = this.ui.element
        .querySelectorAll(this.options.domSelectors[selectorKey]);

      this.ui[selectorKey] = queryElements.length > 1 || wrapInArray
        ? queryElements : queryElements[0];
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
      hash = ((hash << 5) - hash) + c; // eslint-disable-line
      hash = hash & hash; // eslint-disable-line
    }
    return hash;
  }


  /**
   * Extract url parameters
   * @param param
   * @param singleValue
   */
  getURLParam(param, singleValue = false) {
    let result = null;
    const url = window.location.href;
    const paramList = url.split('?').length > 1 ? url.split('?')[1].split('&') : null;
    if (paramList) {
      result = paramList.filter(paramString => paramString.substr(0, param.length) === param)
        .map(item => item.split('=')[1].replace('#', ''));
      if (result.length > 0 && singleValue) {
        result = result[0].replace('#', '');
      }
    }
    return result && result.length > 0 ? result : null;
  }

  /**
   * Get all URL params as object
   */
  getAllURLParams() {
    const url = window.location.href;
    const stringParams = url.split('?').length > 1 ? url.split('?')[1].split('&') : null;
    let params = {};
    if (stringParams) {
      params = stringParams.reduce((total, amount) => {
        const keyValue = amount.split('=');
        total[keyValue[0]] = total[keyValue[0]] ? total[keyValue[0]] : [];
        total[keyValue[0]].push(keyValue[1] ? keyValue[1] : null);
        return total;
      }, {});
    }
    return params;
  }

  /**
   * get base URL
   */
  getBaselUrl() {
    return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }

  /**
   * Update or insert rel link for canonical references
   * @param rel
   * @param href
   */
  upsertLinkRel(rel, href) {
    const relLink = document.querySelector(`link[rel="${rel}"]`);
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
   * Fetch json data
   *
   * @param url endpoint URL to fetch data from
   */
  async fetchJsonData(url: string): Promise<any> {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(url)
      .then(response => response.json())
      .catch((err) => {
        this.log('error', err);
        throw new Error(`Failed to fetch data from "${url}"!`);
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
          if (xhr.status >= 200 && xhr.status < 300) { // eslint-disable-line no-magic-numbers
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
}

export default Module;
