/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import namespace from './namespace';
import loadPolyfills from './polyfills';

/** Demo modules * */
// import SkipLinks from '../../../demo/modules/skiplinks/skiplinks';
// import SlideShow from '../../../demo/modules/slideshow/slideshow';
import Table from '../../../modules/table/table';
import Carousel from '../../../modules/carousel/carousel';
import ImageGallery from '../../../modules/image_gallery/image_gallery';
import Accordion from '../../../modules/accordion/accordion';
import DownloadList from '../../../modules/download_list/download_list';
import ContextMenu from '../../../modules/context_menu/context_menu';
import Teaser from '../../../modules/teaser/teaser';
import PublicationTeaser from '../../../modules/publication_teaser/publication_teaser';
import Breadcrumb from '../../../modules/breadcrumb/breadcrumb';
import Topiclist from '../../../modules/topiclist/topiclist';
import Anchornav from '../../../modules/anchornav/anchornav';
import Header from '../../../modules/header/header';
import Search from '../../../modules/search/search';
import Modal from '../../../modules/modal/modal';
import ServiceList from '../../../modules/service_list/service_list';
import Tabs from '../../../modules/tabs/tabs';
import PageHeader from '../../../modules/page_header/page_header';
import SocialMediaStream from '../../../modules/social_media_stream/social_media_stream';
/* autoinsertmodulereference */ // eslint-disable-line

import Form from './form.class';
import FormGlobalHelper from './form';

class App {
  public initEvents = [];
  public modules: any = {};

  constructor() {
    // Module instances
    window[namespace].modules = {};
    // Module registry - mapping module name (used in data-init) to module Class
    this.modules = {};
    // this.modules.slideshow = SlideShow;
    // this.modules.skiplinks = SkipLinks;
    this.modules.table = Table;
    this.modules.imageGallery = ImageGallery;
    this.modules.carousel = Carousel;
    this.modules.accordion = Accordion;
    this.modules.downloadList = DownloadList;
    this.modules.contextMenu = ContextMenu;
    this.modules.teaser = Teaser;
    this.modules.publicationTeaser = PublicationTeaser;
    this.modules.breadcrumb = Breadcrumb;
    this.modules.topiclist = Topiclist;
    this.modules.anchornav = Anchornav;
    this.modules.header = Header;
    this.modules.search = Search;
    this.modules.tabs = Tabs;
    this.modules.modal = Modal;
    this.modules.servicelist = ServiceList;
    this.modules.pageHeader = PageHeader;
    this.modules.socialMediaStream = SocialMediaStream;
    /* autoinsertmodule */ // eslint-disable-line

    // expose initModule function
    window[namespace].helpers.initModule = this.initModule;
    window[namespace].helpers.registerModulesInElement = this.registerModulesInElement;
    window[namespace].helpers.initModulesInElement = this.initModulesInElement;
    window[namespace].helpers.app = this;
    window[namespace].form = new FormGlobalHelper();

    // Check for touch support
    const hasTouchSupport = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    if (hasTouchSupport) document.documentElement.classList.add('touch');

    const sAgent = window.navigator.userAgent;
    const isIE = sAgent.indexOf('MSIE');

    if (isIE > 0 || !!navigator.userAgent.match(/Trident\/7\./)) {
      document.documentElement.classList.add('is-ie');
    }
  }

  async start() {
    await loadPolyfills();

    this.registerModules();
    this.initModuleInitialiser();
    this.registerForms();
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

  registerForms() {
    const forms = document.querySelectorAll('form[novalidate]');

    forms.forEach((form) => {
      new Form(form);
    });
  }
}

export default App;
