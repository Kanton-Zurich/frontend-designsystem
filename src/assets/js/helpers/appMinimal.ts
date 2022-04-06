/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import namespace from './namespace';

import Locations from '../../../modules/locations/locations';
import MapView from '../../../modules/map_view/map_view';
import Video from '../../../modules/video/video';

/* autoinsertmodulereference */ // eslint-disable-line


class App {
  public initEvents = [];
  public modules: any = {};

  constructor() {
    // Module instances
    window[namespace].modules = {};
    // Module registry - mapping module name (used in data-init) to module Class
    this.modules = {};
    this.modules.locations = Locations;
    this.modules.mapView = MapView;
    this.modules.video = Video;

    /* autoinsertmodule */ // eslint-disable-line

    // expose initModule function
    window[namespace].helpers.initModule = this.initModule;
    window[namespace].helpers.registerModulesInElement = this.registerModulesInElement;
    window[namespace].helpers.initModulesInElement = this.initModulesInElement;
    window[namespace].helpers.app = this;
    const bodyElement = document.querySelector('[data-body-element]');
    if (bodyElement) {
      window[namespace].helpers.bodyElement = bodyElement;
    } else {
      window[namespace].helpers.bodyElement = document.body;
    }

    this.getLanguage();
  }

  async start() {
    this.registerModules();
    this.initModuleInitialiser();
  }

  initModule(moduleName, element) {
    const Module = window[namespace].modules[moduleName].Class;
    const metaData = this.parseData(element, `${moduleName}Data`);
    const metaOptions = this.parseData(element, `${moduleName}Options`);
    const moduleInstance = new Module(element, metaData, metaOptions);

    window[namespace].modules[moduleName].instances[moduleInstance.uuid] = moduleInstance;
    element.dataset[`${moduleName}Instance`] = moduleInstance.uuid; // eslint-disable-line no-param-reassign
  }

  registerModules() {
    this.registerModulesInElement(document);
  }

  registerModulesInElement(queryElement: any) {
    [].slice.call(queryElement.querySelectorAll('[data-init]')).forEach((element) => {
      const modules = element.dataset.init.split(' ');

      modules.forEach((moduleName) => {
        this.registerModule(moduleName);
      });
    });
  }

  registerModule(moduleName) {
    if (!window[namespace].modules[moduleName] && this.modules[moduleName]) {
      const Module = this.modules[moduleName];

      window[namespace].modules[moduleName] = {
        initEvents: Module.initEvents,
        events: Module.events,
        instances: {},
        Class: Module,
      };

      this.initEvents = this.initEvents.concat(Module.initEvents);

      // Remove duplicates from initEvents
      this.initEvents = [...new Set(this.initEvents)];
    }
  }

  isRegistered(moduleName) {
    return window[namespace].modules[moduleName];
  }

  isInitialised(element, moduleName) {
    return element.dataset[`${moduleName}Instance`];
  }

  isInitEvent(eventType, moduleName) {
    return window[namespace].modules[moduleName].initEvents.indexOf(eventType) !== -1;
  }

  initModules() {
    this.initModulesInElement(document);
  }

  initModulesInElement(queryElement: any) {
    [].slice.call(queryElement.querySelectorAll('[data-init]')).forEach((element) => {
      const modules = element.dataset.init.split(' ');

      modules.forEach((moduleName) => {
        if (this.isRegistered(moduleName)
          && !this.isInitialised(element, moduleName)) {
          this.initModule(moduleName, element);
        }
      });
    });
  }

  initModuleInitialiser() {
    this.initModules();
  }

  parseData(element, key) {
    const data = element.dataset[key];

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      console.error(`Failed when parsing "${data}"`, element, err);

      return null;
    }
  }

  getLanguage() {
    window[namespace].lang = document.documentElement.lang;
  }
}

export default App;
