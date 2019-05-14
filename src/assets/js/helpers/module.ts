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
    domSelectors: Object;
    stateClasses: Object;
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
  protected initUi() {
    const domSelectorKeys = Object.keys(this.options.domSelectors);

    domSelectorKeys.forEach((selectorKey) => {
      const queryElements = this.ui.element
        .querySelectorAll(this.options.domSelectors[selectorKey]);

      this.ui[selectorKey] = queryElements.length > 1 ? queryElements : queryElements[0];
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
}

export default Module;
