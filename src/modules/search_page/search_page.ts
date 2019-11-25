/*!
 * SearchPage
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';

import Module from '../../assets/js/helpers/module';
import Pagination from '../pagination/pagination';
import Autosuggest from '../../assets/js/helpers/autosuggest';

import Datepicker from '../datepicker/datepicker';

class SearchPage extends Module {
  public ui: {
    input: HTMLInputElement,
    element: HTMLDivElement,
    resultsHeadTemplate: HTMLScriptElement,
    resultsHead: HTMLDivElement,
    pagination: HTMLDivElement,
    results: HTMLDivElement,
    resultsTemplate: HTMLScriptElement,
    wrapper: HTMLDivElement,
    autosuggest: HTMLDivElement,
    autosuggestTemplate: HTMLScriptElement,
    dateFilter: HTMLFormElement,
    datePicker: HTMLDivElement,
  }

  public options: {
    domSelectors: any,
    stateClasses: any,
    delay: number,
    url: string,
    minInputLength: number,
    autosuggestURL: string,
  }

  public data: {
    type: string,
    page: number,
    dateTo: Date,
    dateFrom: Date,
  }

  public result: any;

  public query: string;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      type: 'all',
      page: 1,
      dateTo: '',
      dateFrom: '',
    };
    const defaultOptions = {
      delay: 450,
      minInputLength: 3,
      domSelectors: {
        input: '[data-search_page="input"]',
        form: '[data-search_page="form"]',
        resultsHeadTemplate: '[data-search_page="resultsHeadTemplate"]',
        resultsHead: '[data-search_page="resultsHead"]',
        pagination: '[data-init="pagination"]',
        results: '[data-search_page="results"]',
        resultsTemplate: '[data-search_page="resultsTemplate"]',
        wrapper: '[data-search_page="wrapper"]',
        autosuggest: '[data-search_page="autosuggest"]',
        autosuggestTemplate: '[data-search_page="autosuggestTemplate"]',
        dateFilter: '[data-search_page="dateFilter"]',
        datePicker: '[data-init="datepicker"]',
      },
      stateClasses: {
        showResults: 'mdl-search_page--show-results',
        loading: 'mdl-search_page--loading',
        dateFilterVisible: 'mdl-search_page__date-filter--visible',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.result = null;
    this.query = '';

    this.initUi();

    this.getParamsInUrl();

    this.initWatchers();
    this.initEventListeners();

    new Autosuggest({
      input: this.ui.input,
      parent: this.ui.element,
      template: this.ui.autosuggestTemplate.innerHTML,
      target: this.ui.autosuggest,
      url: this.options.autosuggestURL,
      renderAsButton: true,
    }, {});
  }

  static get events() {
    return {
      // eventname: `eventname.${ SearchPage.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('submit', this.options.domSelectors.form, () => {
      this.onQueryChange(null, null, this.ui.input.value);

      return false;
    });

    this.ui.pagination.addEventListener(Pagination.events.change, this.onPageChange.bind(this));

    this.ui.element.addEventListener(Autosuggest.events.termSelected, (event) => {
      const term = (<CustomEvent>event).detail;
      this.ui.input.value = term;

      this.onQueryChange(null, null, term);
    });
  }

  /**
   * Watchers
   *
   * @memberof SearchPage
   */
  initWatchers() {
    this.watch(this.data, 'page', (propName, oldValue, newValue) => {
      this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPage, {
        detail: newValue,
      }));
    });
  }

  initFilterEventListeners(addedDom) {
    const radios = addedDom.querySelectorAll('[type="radio"]');

    radios.forEach((filterButton) => {
      filterButton.addEventListener('click', this.onFilterChange.bind(this));
    });
  }

  /**
   * When the search query gets changed
   *
   * @param {string} propName
   * @param {string} oldValue
   * @param {string} newValue
   * @memberof SearchPage
   */
  async onQueryChange(propName, oldValue, newValue) {
    this.ui.autosuggest.dispatchEvent(new CustomEvent(Autosuggest.events.empty));
    this.empty();
    this.data.page = 1;

    if (newValue === this.query || newValue.length < this.options.minInputLength) {
      this.ui.element.classList.remove(this.options.stateClasses.showResults);

      if (this.query.length === 0) {
        this.query = '';
        this.data.type = 'all';
        this.data.page = 1;
      }

      this.setFilterInUrl();

      return false;
    }

    this.ui.wrapper.classList.add(this.options.stateClasses.loading);

    this.query = newValue;
    this.setFilterInUrl();

    return this.getData(this.generateParams(true),
      (response) => {
        this.result = response;

        this.dispatchPageCount();
        this.renderResults();

        this.ui.element.classList.add(this.options.stateClasses.showResults);
        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
      });
  }

  /**
   * Generating the params
   *
   * @param {false} query
   * @param {false} type
   * @param {false} page
   * @param {false} dates
   * @returns
   * @memberof SearchPage
   */
  generateParams(
    query: boolean = false,
    type: boolean = false,
    page: boolean = false,
    dates: boolean = false,
  ) {
    const paramObj: any = {};

    if (query && this.query && this.query !== '') {
      paramObj.q = this.query;
    }

    if (type && this.data.type !== 'all') {
      paramObj.type = this.data.type;
    }

    if (page && this.data.page !== 1) {
      paramObj.page = this.data.page;
    }

    if (dates
      && (typeof this.data.dateFrom !== 'undefined'
      && typeof this.data.dateTo !== 'undefined')
      && this.data.type === 'news') {
      paramObj.dateTo = this.getAPIDateString(this.data.dateTo);
      paramObj.dateFrom = this.getAPIDateString(this.data.dateFrom);
    }

    return paramObj;
  }

  onFilterChange(event) {
    this.emptyList();
    this.data.page = 1;

    if (event) {
      if (event.target.value === this.data.type) {
        return false;
      }

      this.data.type = event.target.value;
    }

    this.ui.results.classList.add(this.options.stateClasses.loading);

    this.setFilterInUrl();

    return this.getData(this.generateParams(true, true, false, true), (response) => {
      this.result = response;

      this.dispatchPageCount();
      this.renderList();

      this.checkIfPickerVisible();

      this.ui.results.classList.remove(this.options.stateClasses.loading);
    });
  }

  onPageChange(event) {
    if (event.detail.after === this.data.page) {
      return false;
    }

    this.emptyList();
    this.ui.results.classList.add(this.options.stateClasses.loading);

    this.data.page = event.detail.after;
    this.setFilterInUrl();

    return this.getData(this.generateParams(true, true, true, true), (response) => {
      this.result = response;

      this.dispatchPageCount();
      this.renderList();

      this.ui.results.classList.remove(this.options.stateClasses.loading);
    });
  }

  async getData(urlParams, callback) {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(this.generateURL(this.options.url, urlParams))
      .then(response => response.json())
      .then((response) => {
        if (response) {
          callback(response);
        }
      });
  }

  renderResults() {
    this.renderHead();
    this.renderList();

    this.checkIfPickerVisible();

    (<any>window).estatico.helpers.app.registerForms();
  }

  renderHead() {
    const compiledTemplate = template(this.ui.resultsHeadTemplate.innerHTML);
    const generatedHTML = compiledTemplate(this.result.resultsData);
    const parsedHTML = new DOMParser().parseFromString(generatedHTML, 'text/html').querySelector('div');

    this.ui.resultsHead.appendChild(parsedHTML);
    this.initUi();


    if (this.data.type !== 'all') {
      const radios = parsedHTML.querySelectorAll('[type="radio"]');

      radios.forEach((radio) => {
        if (radio.getAttribute('value') === this.data.type) (<HTMLInputElement>radio).click();
      });
    }

    this.initFilterEventListeners(parsedHTML);

    this.ui.datePicker.addEventListener(Datepicker.events.dateSet, (event) => {
      const { detail } = <CustomEvent>event;

      [this.data.dateFrom, this.data.dateTo] = detail.dates;

      this.onFilterChange(false);
    });
  }

  renderList() {
    const compiledTemplate = template(this.ui.resultsTemplate.innerHTML);
    const generatedHTML = compiledTemplate(this.result);
    const parsedHTML = new DOMParser().parseFromString(generatedHTML, 'text/html').querySelector('ul');

    this.ui.results.appendChild(parsedHTML);

    window.dispatchEvent(new CustomEvent('reloadLineClamper'));
    (<any>window).estatico.helpers.app.registerModulesInElement(this.ui.results.querySelector('ul'));
    (<any>window).estatico.helpers.app.initModulesInElement(this.ui.results.querySelector('ul'));
  }

  empty() {
    this.ui.resultsHead.innerHTML = '';

    this.emptyList();
  }

  emptyList() {
    const list = this.ui.results.querySelector('ul');

    if (list) list.remove();
  }

  /**
   * Generating the url with get params
   *
   * @param {*} params An object with all the params
   * @memberof SearchPage
   */
  generateURL(baseURL, params) {
    const keys = Object.keys(params);
    let url = baseURL;

    keys.forEach((key, index) => {
      if (index === 0) {
        url = `${url}?${key}=${encodeURIComponent(params[key])}`;
      } else {
        url = `${url}&${key}=${encodeURIComponent(params[key])}`;
      }
    });

    return url;
  }

  /**
   * Sends an event to the pagination to tell how many pages there are
   *
   * @memberof SearchPage
   */
  dispatchPageCount() {
    let pageCount = this.result.resultsData.numberOfResultPages;

    if (this.data.type !== 'all') {
      const typeResultInfo = this.result.resultsData.resultsByType
        .find((resultByType) => {
          this.log(resultByType.type, this.data.type, this.data.type === resultByType.type);

          return resultByType.type === this.data.type;
        });

      this.log(this.result.resultsData, typeResultInfo);

      pageCount = typeResultInfo.numberOfResultPages;
    }

    this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPageCount, {
      detail: pageCount,
    }));
  }

  getParamsInUrl() {
    const query = this.getURLParam('q', true);
    const type = this.getURLParam('type', true);
    const page = this.getURLParam('page', true);
    const dateTo = this.getURLParam('dateTo', true);
    const dateFrom = this.getURLParam('dateFrom', true);

    if (query) {
      this.ui.input.value = query;
    }
    if (type) {
      this.data.type = type;
    }
    if (page) {
      this.data.page = parseInt(page, 10);
    }

    if (dateTo && dateFrom) {
      this.data.dateTo = new Date(dateTo);
      this.data.dateFrom = new Date(dateFrom);
    }

    if (query || type || page) {
      this.ui.wrapper.classList.add(this.options.stateClasses.loading);

      this.getData(this.generateParams(true, true, true, true), (response) => {
        this.result = response;

        this.dispatchPageCount();
        this.renderResults();

        this.ui.element.classList.add(this.options.stateClasses.showResults);

        this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPage, {
          detail: this.data.page,
        }));

        if (dateTo && dateFrom) {
          this.setDatepickerInput();
        }

        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
      });
    }
  }

  setFilterInUrl() {
    let url = this.getBaseUrl();
    const urlParams : any = {
      q: this.query,
    };

    if (this.query === '') {
      delete urlParams.q;
    }

    if (this.data.page !== 1) {
      urlParams.page = this.data.page;
    }
    if (this.data.type !== 'all') {
      urlParams.type = this.data.type;
    }

    if (typeof this.data.dateFrom !== 'undefined' && typeof this.data.dateTo !== 'undefined' && this.data.type === 'news') {
      urlParams.dateFrom = this.getAPIDateString(this.data.dateFrom);
      urlParams.dateTo = this.getAPIDateString(this.data.dateTo);
    }

    if (Object.keys(urlParams).length > 0) {
      url = this.generateURL(url, urlParams);
    }

    window.history.pushState({}, document.title, url);
  }

  checkIfPickerVisible() {
    if (this.data.type === 'news') {
      this.ui.dateFilter.classList.add(this.options.stateClasses.dateFilterVisible);
    } else {
      this.ui.dateFilter.classList.remove(this.options.stateClasses.dateFilterVisible);
    }
  }

  setDatepickerInput() {
    this.ui.datePicker.dispatchEvent(new CustomEvent(Datepicker.events.injectDate, {
      detail: {
        date: [this.data.dateFrom, this.data.dateTo],
      },
    }));
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default SearchPage;
