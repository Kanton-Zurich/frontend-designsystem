/*!
 * SearchPage
 *
 * @author
 * @copyright
 */
import { debounce, template } from 'lodash';

import Module from '../../assets/js/helpers/module';
import Pagination from '../pagination/pagination';

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
  }

  public options: {
    domSelectors: any,
    stateClasses: any,
    delay: number,
    url: string,
    minInputLength: number,
  }

  public data: {
    type: string,
    page: number,
  }

  public result: any;

  public query: string;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      type: 'all',
      page: 1,
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
      },
      stateClasses: {
        showResults: 'mdl-search_page--show-results',
        loading: 'mdl-search_page--loading',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.result = null;
    this.query = '';

    this.initUi();

    this.getParamsInUrl();

    this.initWatchers();
    this.initEventListeners();
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
  }

  /**
   * Watchers
   *
   * @memberof SearchPage
   */
  initWatchers() {
    this.watch(this.ui.input, 'value', debounce(this.onQueryChange.bind(this), this.options.delay));
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

    return this.getData({
      q: this.query,
    }, (response) => {
      this.result = response;

      this.dispatchPageCount();
      this.renderResults();

      this.ui.element.classList.add(this.options.stateClasses.showResults);
      this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
    });
  }

  onFilterChange(event) {
    this.emptyList();
    this.data.page = 1;

    if (event.target.value === this.data.type) {
      return false;
    }

    this.ui.results.classList.add(this.options.stateClasses.loading);

    this.data.type = event.target.value;
    this.setFilterInUrl();

    return this.getData({
      q: this.query,
      type: this.data.type,
    }, (response) => {
      this.result = response;

      this.dispatchPageCount();
      this.renderList();

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

    return this.getData({
      q: this.query,
      type: this.data.type,
      page: this.data.page,
    }, (response) => {
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
  }

  renderHead() {
    const compiledTemplate = template(this.ui.resultsHeadTemplate.innerHTML);
    const generatedHTML = compiledTemplate(this.result.resultsData);
    const parsedHTML = new DOMParser().parseFromString(generatedHTML, 'text/html').querySelector('div');

    this.ui.resultsHead.appendChild(parsedHTML);

    if (this.data.type !== 'all') {
      const radios = parsedHTML.querySelectorAll('[type="radio"]');

      radios.forEach((radio) => {
        if (radio.getAttribute('value') === this.data.type) (<HTMLInputElement>radio).click();
      });
    }

    this.initFilterEventListeners(parsedHTML);
  }

  renderList() {
    const compiledTemplate = template(this.ui.resultsTemplate.innerHTML);
    const generatedHTML = compiledTemplate(this.result);
    const parsedHTML = new DOMParser().parseFromString(generatedHTML, 'text/html').querySelector('ul');

    this.ui.results.appendChild(parsedHTML);

    window.dispatchEvent(new CustomEvent('reloadLineClamper'));
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
        .find(resultByType => resultByType.type === this.data.type);

      pageCount = typeResultInfo.numberOfResultPages;
    }

    this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPageCount, {
      detail: pageCount,
    }));
  }

  getParamsInUrl() {
    const query = this.getURLParam('q');
    const type = this.getURLParam('type');
    const page = this.getURLParam('page');
    const urlParams : any = {};

    if (query) {
      this.ui.input.value = query;

      urlParams.q = query;
    }
    if (type) {
      this.data.type = type;

      urlParams.type = type;
    }
    if (page) {
      this.data.page = parseInt(page, 10);

      urlParams.page = page;
    }

    if (query || type || page) {
      this.ui.wrapper.classList.add(this.options.stateClasses.loading);

      this.getData(urlParams, (response) => {
        this.result = response;

        this.dispatchPageCount();
        this.renderResults();

        this.ui.element.classList.add(this.options.stateClasses.showResults);

        this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPage, {
          detail: this.data.page,
        }));

        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
      });
    }
  }

  getURLParam(paramName) {
    const regex = new RegExp(`[\\?&]${paramName}=([^&#]*)`);
    const results = regex.exec(window.location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  setFilterInUrl() {
    let url = `${window.location.origin}${window.location.pathname}`;
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

    if (Object.keys(urlParams).length > 0) {
      url = this.generateURL(url, urlParams);
    }

    window.history.replaceState({}, document.title, url);
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
