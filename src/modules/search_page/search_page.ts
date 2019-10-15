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
      type: null,
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
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.result = null;
    this.query = '';

    this.initUi();
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
  }

  /**
   * Watchers
   *
   * @memberof SearchPage
   */
  initWatchers() {
    this.watch(this.ui.input, 'value', debounce(this.onQueryChange.bind(this), this.options.delay));
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
    if (newValue === this.query && this.query.length < this.options.minInputLength) {
      return false;
    }

    this.query = newValue;

    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(`${this.options.url}?q=${encodeURIComponent(this.query)}`)
      .then(response => response.json())
      .then((response) => {
        if (response) {
          this.result = response;

          this.dispatchPageCount();
          this.renderResults();
        }
      });
  }

  renderResults() {
    this.empty();

    this.renderHead();
    this.renderList();
  }

  renderHead() {
    const compiledTemplate = template(this.ui.resultsHeadTemplate.innerHTML);
    const generatedHTML = compiledTemplate(this.result.results);
    const parsedHTML = new DOMParser().parseFromString(generatedHTML, 'text/html').querySelector('div');

    this.ui.resultsHead.appendChild(parsedHTML);
  }

  renderList() {

  }

  empty() {
    this.ui.resultsHead.innerHTML = '';
  }

  /**
   * Sends an event to the pagination to tell how many pages there are
   *
   * @memberof SearchPage
   */
  dispatchPageCount() {
    this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPageCount, {
      detail: this.data.page,
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
