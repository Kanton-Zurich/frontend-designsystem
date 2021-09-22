/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import namespace from './namespace';

import Table from '../../../modules/table/table';
import Carousel from '../../../modules/carousel/carousel';
import ImageGallery from '../../../modules/image_gallery/image_gallery';
import Accordion from '../../../modules/accordion/accordion';
import DownloadList from '../../../modules/download_list/download_list';
import ContextMenu from '../../../modules/context_menu/context_menu';
import PublicationTeaser from '../../../modules/publication_teaser/publication_teaser';
import Breadcrumb from '../../../modules/breadcrumb/breadcrumb';
import BiometrieAppointment from '../../../modules/biometrie_appointment/biometrie_appointment';
import Topiclist from '../../../modules/topiclist/topiclist';
import Anchornav from '../../../modules/anchornav/anchornav';
import Header from '../../../modules/header/header';
import Search from '../../../modules/search/search';
import Modal from '../../../modules/modal/modal';
import ServiceList from '../../../modules/service_list/service_list';
import Tabs from '../../../modules/tabs/tabs';
import Subnavigation from '../../../modules/subnavigation/subnavigation';
import OrganisationNavigation from '../../../modules/organisation_navigation/organisation_navigation';
import PageHeader from '../../../modules/page_header/page_header';
import SocialMediaStream from '../../../modules/social_media_stream/social_media_stream';
import Stepper from '../../../modules/stepper/stepper';
import ServiceButton from '../../../modules/service_button/service_button';
import Application from '../../../modules/application/application';
import Datepicker from '../../../modules/datepicker/datepicker';
import FileUpload from '../../../modules/file_upload/file_upload';
import Select from '../../../modules/select/select';
import Pagination from '../../../modules/pagination/pagination';
import Range from '../../../modules/range/range';
import FilterPills from '../../../modules/filter_pills/filter_pills';
import LangSwitch from '../../../modules/lang_switch/lang_switch';
import NewsFilterMobile from '../../../modules/news_filter_mobile/news_filter_mobile';
import NewsOverview from '../../../modules/news_overview/news_overview';
import Locations from '../../../modules/locations/locations';
import MapView from '../../../modules/map_view/map_view';
import Back2top from '../../../modules/back2top/back2top';
import Tooltip from '../../../modules/tooltip/tooltip';
import SearchPage from '../../../modules/search_page/search_page';
import FlexData from '../../../modules/flex_data/flex_data';
import DrilldownSelect from '../../../modules/drilldown_select/drilldown_select';
import UserMenu from '../../../modules/user_menu/user_menu';
import CugLogin from '../../../modules/cug_login/cug_login';
import Video from '../../../modules/video/video';
import OpenData from '../../../modules/open_data/open_data';
import CookieControls from '../../../modules/cookie_controls/cookie_controls';
import Banner from '../../../modules/banner/banner';
import Contact from '../../../modules/contact/contact';
import TaxCalc from '../../../modules/tax_calc/tax_calc';
import JurisdictionFinder from '../../../modules/jurisdiction_finder/jurisdiction_finder';
import NewsletterForm from '../../../modules/newsletter_form/newsletter_form';
import ZhLex from '../../../modules/zhlex/zhlex';
import Metablock from '../../../modules/metablock/metablock';
import IFrame from '../../../modules/iframe/iframe';
import DecisionTree from '../../../modules/decision_tree/decision_tree';
/* autoinsertmodulereference */ // eslint-disable-line

import Form from './form.class';
import SearchHighlight from './searchHighlight';
import FormGlobalHelper from './form';

class App {
  public initEvents = [];
  public modules: any = {};

  constructor() {
    // Module instances
    window[namespace].modules = {};
    // Module registry - mapping module name (used in data-init) to module Class
    this.modules = {};
    this.modules.table = Table;
    this.modules.imageGallery = ImageGallery;
    this.modules.carousel = Carousel;
    this.modules.accordion = Accordion;
    this.modules.downloadList = DownloadList;
    this.modules.contextMenu = ContextMenu;
    this.modules.publicationTeaser = PublicationTeaser;
    this.modules.breadcrumb = Breadcrumb;
    this.modules.biometrieAppointment = BiometrieAppointment;
    this.modules.topiclist = Topiclist;
    this.modules.anchornav = Anchornav;
    this.modules.header = Header;
    this.modules.search = Search;
    this.modules.tabs = Tabs;
    this.modules.modal = Modal;
    this.modules.servicelist = ServiceList;
    this.modules.subnavigation = Subnavigation;
    this.modules.organisationNavigation = OrganisationNavigation;
    this.modules.pageHeader = PageHeader;
    this.modules.socialMediaStream = SocialMediaStream;
    this.modules.stepper = Stepper;
    this.modules.serviceButton = ServiceButton;
    this.modules.application = Application;
    this.modules.select = Select;
    this.modules.fileUpload = FileUpload;
    this.modules.datepicker = Datepicker;
    this.modules.pagination = Pagination;
    this.modules.range = Range;
    this.modules.filterPills = FilterPills;
    this.modules.langSwitch = LangSwitch;
    this.modules.newsFilterMobile = NewsFilterMobile;
    this.modules.newsOverview = NewsOverview;
    this.modules.locations = Locations;
    this.modules.mapView = MapView;
    this.modules.flexData = FlexData;
    this.modules.drilldownSelect = DrilldownSelect;
    this.modules.back2top = Back2top;
    this.modules.tooltip = Tooltip;
    this.modules.searchPage = SearchPage;
    this.modules.userMenu = UserMenu;
    this.modules.cugLogin = CugLogin;
    this.modules.openData = OpenData;
    this.modules.video = Video;
    this.modules.cookieControls = CookieControls;
    this.modules.banner = Banner;
    this.modules.taxCalc = TaxCalc;
    this.modules.jurisdictionFinder = JurisdictionFinder;
    this.modules.contact = Contact;
    this.modules.newsletterForm = NewsletterForm;
    this.modules.zhLex = ZhLex;
    this.modules.metablock = Metablock;
    this.modules.iframe = IFrame;
    this.modules.decisionTree = DecisionTree;
    /* autoinsertmodule */ // eslint-disable-line

    // expose initModule function
    window[namespace].helpers.initModule = this.initModule;
    window[namespace].helpers.registerModulesInElement = this.registerModulesInElement;
    window[namespace].helpers.initModulesInElement = this.initModulesInElement;
    window[namespace].helpers.app = this;
    window[namespace].form = new FormGlobalHelper();
    const bodyElement = document.querySelector('[data-body-element]');
    if (bodyElement) {
      window[namespace].helpers.bodyElement = bodyElement;
    } else {
      window[namespace].helpers.bodyElement = document.body;
    }
    window[namespace].searchHighlight = new SearchHighlight(
      window[namespace].helpers.bodyElement, {}, {},
    );

    const sAgent = window.navigator.userAgent;
    const isIE = sAgent.indexOf('MSIE');

    if (isIE > 0 || !!navigator.userAgent.match(/Trident\/7\./)) {
      document.documentElement.classList.add('is-ie');
    }

    this.getLanguage();
  }

  async start() {
    this.registerForms();

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

  registerForms() {
    const forms = document.querySelectorAll('form[novalidate]');

    forms.forEach((form) => {
      if (!form.getAttribute('initialized')) {
        new Form(form);
        form.setAttribute('initialized', 'true');
      }
    });
  }

  getLanguage() {
    window[namespace].lang = document.documentElement.lang;
  }
}

export default App;
