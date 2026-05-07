/*!
 * SearchPage
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Autosuggest from '../../assets/js/helpers/autosuggest';
import ExtendedSearch from '../extended_search/extended_search';
import SearchResultList from '../search_result_list/search_result_list';
import Pagination from '../pagination/pagination';

import Form from '../../assets/js/helpers/form.class';

export type SearchResultMeta = {
  term: string;
  description: string;
};

export type SearchResultItem = {
  type: string;
  typeLabel: string;
  title: string;
  teaserText?: string;
  link?: string;
  isTopResult?: boolean;
  breadcrumb?: string;
  metadata?: SearchResultMeta[];
  icon?: string;
  publicationType?: string;
  date?: string;
  role?: string;
  email?: string;
  phone?: {
    link: string;
    title: string;
  };
};

export type ResultByType = {
  type: string;
  typeLabel: string;
  numberOfResults: number;
};

export type ResultsData = {
  numberOfResultPages: number;
  numberOfResults: number;
  queryId: string;
  resultsByType: ResultByType[];
};

export type SearchResultData = {
  results: SearchResultItem[];
  resultsData: ResultsData;
  similarTerms?: string[];
  autoCorrectedTerm?: string;
};

const STATUS_OK = 200;
const STATUS_NO_CONTENT = 204;
export const KNOWN_TYPES = ['contentpage', 'document', 'news', 'service', 'person'];
export const DEFAULT_TYPE = 'contentpage';
const TAG_NAME_TOPICS = 'extended-search-topics';
const TAG_NAME_ORGS = 'extended-search-orgs';

class SearchPage extends Module {
  public ui: {
    element: HTMLDivElement;
    input: HTMLInputElement;
    form: HTMLFormElement;
    extendedSearch: HTMLDivElement;
    dialog: HTMLDivElement;
    dialogForm: HTMLFormElement;
    autosuggest: HTMLDivElement;
    autosuggestTemplate: HTMLScriptElement;
    wrapper: HTMLDivElement;
    resultsHead: HTMLDivElement;
    autocorrection: HTMLDivElement;
    suggestions: HTMLParagraphElement;
    didYouMeanTemplate: HTMLTemplateElement;
    force: HTMLAnchorElement;
    results: HTMLDivElement;
    tabList: HTMLUListElement;
    tabButtons: NodeListOf<HTMLButtonElement>;
    moreOfType: HTMLButtonElement;
    pagination: NodeListOf<HTMLDivElement>;
    notification: HTMLDivElement;
    noResults: HTMLDivElement;
    resetResults: HTMLButtonElement;
    clearButton: HTMLButtonElement;
  };

  public options: {
    domSelectors: any;
    stateClasses: any;
    delay: number;
    url: string;
    sessionIdStorageKey: string;
    minInputLength: number;
    autosuggestURL: string;
    autocorrect: string;
    inEstatico: boolean;
  };

  public data: {
    type: string;
    page: number;
    topicTags?: string[];
    orgTags?: string[];
  };

  public result: any;
  public query: string;

  private queryId: string;
  private sessionId: string;
  private controller: AbortController;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      type: DEFAULT_TYPE,
      page: 1,
    };
    const defaultOptions = {
      delay: 450,
      minInputLength: 3,
      sessionIdStorageKey: 'kzh-session-id',
      inEstatico: false,
      domSelectors: {
        input: '[data-search="input"]',
        form: '[data-search_page="form"]',
        extendedSearch: '.mdl-extended_search',
        dialog: '.mdl-dialog',
        dialogForm: '.mdl-dialog__form',
        autosuggest: '[data-search="autosuggest"]',
        autosuggestTemplate: '[data-search="autosuggestTemplate"]',
        wrapper: '[data-search_page="wrapper"]',
        resultsHead: '[data-search_page="resultsHead"]',
        autocorrection: '.mdl-search_page__autocorrection',
        suggestions: '.mdl-search_page__suggestions',
        didYouMeanTemplate: '[data-search_page="didYouMeanTemplate"]',
        force: '[data-search_page="force"]',
        results: '[data-search_page="results"]',
        tabList: '[data-search_page="results"] .mdl-button_group',
        tabButtons: '[data-search_page="results"] .mdl-button_group button',
        moreOfType: '.mdl-top_result__more-results',
        pagination: '[data-init="pagination"]',
        notification: '.mdl-search_page__notification',
        noResults: '.mdl-search_page__no-results',
        resetResults: '.mdl-search_page__no-results .atm-button',
        clearButton: '.mdl-search__clear',
      },
      stateClasses: {
        showResults: 'mdl-search_page--show-results',
        showNoResults: 'mdl-search_page--no-results',
        showValidation: 'mdl-search_page--invalid',
        showError: 'mdl-search_page--error',
        loading: 'mdl-search_page--loading',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.result = null;
    this.query = '';
    this.controller = new AbortController();

    this.initUi();

    // setup session
    this.sessionId = (<any>window.sessionStorage).getItem(this.options.sessionIdStorageKey);
    if (!this.sessionId) {
      this.sessionId = `zh_${Math.random().toString(36).slice(2, 18)}`; // eslint-disable-line
      (<any>window.sessionStorage).setItem(this.options.sessionIdStorageKey, this.sessionId);
    }

    this.getParamsInUrl();
    this.initWatchers();
    this.initEventListeners();

    new Autosuggest(
      {
        input: this.ui.input,
        parent: this.ui.element,
        template: this.ui.autosuggestTemplate.innerHTML,
        target: this.ui.autosuggest,
        url: this.options.autosuggestURL,
        renderAsButton: true,
        autoHide: true,
      },
      {}
    );
    this.ui.autosuggest.classList.remove('initially-hidden');
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
    this.eventDelegate.on('submit', this.options.domSelectors.form, (event: Event) => {
      event.preventDefault();
      this.onQueryChange(this.ui.input.value);
      return false;
    });

    // Listen to filterChanged event from extended search
    this.ui.extendedSearch.addEventListener(ExtendedSearch.events.filterChanged, () => {
      this.data.topicTags = Array.from(
        this.ui.dialogForm.querySelectorAll(`[name="${TAG_NAME_TOPICS}"]:checked`),
        (checkbox: HTMLInputElement) => checkbox.value
      );
      this.data.orgTags = Array.from(
        this.ui.dialogForm.querySelectorAll(`[name="${TAG_NAME_ORGS}"]:checked`),
        (checkbox: HTMLInputElement) => checkbox.value
      );
      this.onFilterChange();
    });

    this.eventDelegate.on('click', this.options.domSelectors.tabButtons, (event: PointerEvent) => {
      this.onTabChange(event);
    });

    this.eventDelegate.on('click', this.options.domSelectors.moreOfType, () => {
      document
        .getElementById(this.result.results.find((item: SearchResultItem) => item.isTopResult).type)
        .click();
    });

    this.eventDelegate.on(
      'click',
      this.options.domSelectors.force,
      (_event: PointerEvent, delegate: HTMLAnchorElement) => {
        const newTerm = delegate.textContent.trim();
        this.ui.input.value = newTerm;
        this.onQueryChange(newTerm, true, true);
      }
    );

    this.eventDelegate.on(
      'keydown',
      this.options.domSelectors.force,
      (event: KeyboardEvent, delegate: HTMLAnchorElement) => {
        if (event.key === 'Enter') {
          const newTerm = delegate.textContent.trim();
          this.ui.input.value = newTerm;
          this.onQueryChange(newTerm, true, true);
        }
      }
    );

    this.ui.pagination.forEach((pagination) => {
      pagination.addEventListener(Pagination.events.change, this.onPageChange.bind(this));
    });

    this.ui.resetResults.addEventListener('click', this.onResetResults.bind(this));

    this.ui.element.addEventListener(Autosuggest.events.termSelected, (event) => {
      const term = (<CustomEvent>event).detail;
      this.ui.input.value = term;
      this.onQueryChange(term);
    });

    this.ui.input.addEventListener(Form.events.clearInput, () => {
      this.onQueryChange('');
    });
  }

  /**
   * Watchers
   *
   * @memberof SearchPage
   */
  initWatchers() {
    this.watch(this.data, 'page', (_propName: string, _oldValue: string, newValue: string) => {
      const pagination = this.ui.element.querySelector(
        `#${this.data.type}-panel [data-init="pagination"]`
      );
      pagination.dispatchEvent(
        new CustomEvent(Pagination.events.setPage, {
          detail: newValue,
        })
      );
    });
  }

  /**
   * When the search query gets changed
   *
   * @param {string} newValue
   * @param noAutoCorrection
   * @param noAutoSuggest
   * @memberof SearchPage
   */
  onQueryChange(
    newValue: string,
    noAutoCorrection: boolean = false,
    noAutoSuggest: boolean = false
  ) {
    this.query = newValue;
    this.queryId = null;

    if (noAutoSuggest)
      this.ui.autosuggest.dispatchEvent(new CustomEvent(Autosuggest.events.disableNext));

    if (newValue.length < this.options.minInputLength && !noAutoCorrection) {
      if (this.query.length === 0) {
        this.data.type = DEFAULT_TYPE;
        this.data.page = 1;
        this.ui.element.classList.remove(this.options.stateClasses.showResults);
      }

      this.setFilterInUrl();
      this.showNoResults(false);
      return false;
    }

    this.setFilterInUrl();
    return this.getData(this.generateParams(false, true, noAutoCorrection));
  }

  onResetResults() {
    this.ui.input.value = '';
    this.data.topicTags = [];
    this.data.orgTags = [];
    this.ui.extendedSearch.dispatchEvent(
      new CustomEvent(ExtendedSearch.events.setFilter, {
        detail: [],
      })
    );
    this.ui.clearButton.classList.remove('dirty');
    this.onQueryChange('');
    this.ui.input.focus();
  }

  /**
   * Generating the params
   *
   * @param page
   * @param sessionId
   * @returns {Record<string, string | string[]>}
   * @memberof SearchPage
   */
  generateParams(
    page: boolean = false,
    sessionId: boolean = false,
    noAutoCorrection: boolean = false
  ): Record<string, string | string[]> {
    const paramObj: any = {};

    if (this.query && this.query !== '') paramObj.fullText = this.query;
    paramObj.type = this.data.type ?? DEFAULT_TYPE;
    if (page && this.data.page !== 1) paramObj.page = this.data.page;
    if (sessionId && this.sessionId !== null) paramObj.sessionId = this.sessionId;
    if (this.queryId !== null) paramObj.queryId = this.queryId;
    if (this.data.topicTags && this.data.topicTags.length > 0)
      paramObj.topicTag = this.data.topicTags;
    if (this.data.orgTags && this.data.orgTags.length > 0)
      paramObj.organisationTag = this.data.orgTags;

    paramObj.noAutoCorrection = noAutoCorrection.toString();

    return paramObj;
  }

  updateQuery() {
    const newValue = this.ui.input.value;
    if (this.query !== newValue) {
      this.query = newValue;
      this.queryId = null;
    }
  }

  onFilterChange() {
    this.updateQuery();
    this.setFilterInUrl();
    return this.getData(this.generateParams(false, true));
  }

  onTabChange(event: PointerEvent) {
    const target = event.target as HTMLButtonElement;
    const button = target.closest('button') || target;
    const buttonId = button?.id;

    if (!buttonId || buttonId === this.data.type) return false;
    if (buttonId === this.data.type) return false;
    this.data.page = 1;
    this.data.type = buttonId;

    this.updateQuery();
    this.setFilterInUrl();
    return this.getData(this.generateParams(false, true));
  }

  onPageChange(event: CustomEvent) {
    if (event.detail.after === this.data.page) return false;
    this.data.page = event.detail.after;

    this.updateQuery();
    this.setFilterInUrl();
    return this.getData(this.generateParams(true, true, true));
  }

  highlightSearchTerm(text: string): string {
    if (!(typeof text === 'string') || !this.query) return text;
    const regex = new RegExp(`(${this.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  async getData(urlParams: Record<string, string | string[]>) {
    const isInvalid = this.query.length < this.options.minInputLength;
    this.ui.element.classList.toggle(this.options.stateClasses.showValidation, isInvalid);
    if (isInvalid) {
      this.showNoResults(false);
      return;
    }

    this.controller.abort(new DOMException('Newer search request', 'AbortError'));
    this.controller = new AbortController();

    this.ui.wrapper.classList.add(this.options.stateClasses.loading);
    this.ui.autosuggest.dispatchEvent(new CustomEvent(Autosuggest.events.empty));

    if (this.controller.signal.aborted) return;

    return fetch(this.generateURL(this.options.url, urlParams), {
      signal: this.controller.signal,
    })
      .then((response) => {
        if (response.status !== STATUS_OK && response.status !== STATUS_NO_CONTENT) {
          throw new Error('Error fetching resource!');
        }
        return response.json();
      })
      .then((response: SearchResultData) => {
        if (this.controller.signal.aborted || !response) return;
        if (response.resultsData && response.resultsData.queryId)
          this.queryId = response.resultsData.queryId;

        // Apply highlighting to results
        if (response.results) {
          response.results.forEach((item) => {
            if (item.teaserText) item.teaserText = this.highlightSearchTerm(item.teaserText);
          });
        }

        this.result = response;
        if (response.results && response.results.length) {
          this.dispatchPageCount();
          this.renderResults();
          document.getElementById(this.data.type)?.click();
        } else {
          this.showNoResults(true);
        }
        this.ui.element.classList.remove(this.options.stateClasses.showError);
        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        this.log('Fehler:', err);
        this.ui.element.classList.add(this.options.stateClasses.showError);
        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
      });
  }

  renderResults() {
    this.ui.element.classList.remove(this.options.stateClasses.showNoResults);

    // Fill count of ResultByType into tab buttons
    this.ui.tabButtons.forEach((tab: HTMLButtonElement) => {
      const countEl = tab.querySelector('.mdl-search_page__count');
      if (countEl) {
        const count =
          this.result.resultsData.resultsByType.find(
            (result: ResultByType) => result.type === tab.id
          )?.numberOfResults ?? 0;
        if (tab.id !== DEFAULT_TYPE) tab.classList.toggle('hidden', count === 0);
        countEl.textContent = String(count);
      }
    });

    // Show result head?
    this.ui.resultsHead.hidden = !(this.result.didYouMean?.length || this.result.autoCorrectedTerm);

    // Fill autocorrection if available
    const autocorrection = this.ui.autocorrection;
    const autocorrected = autocorrection.querySelector('.mdl-search_page__autocorrected');
    const original = autocorrection.querySelector('.mdl-search_page__original');
    if (autocorrection && autocorrected && original) {
      autocorrection.hidden = !this.result.autoCorrectedTerm;
      autocorrected.textContent = this.result.autoCorrectedTerm;
      original.textContent = this.query;
    }

    // Fill suggestions if available
    const suggestions = this.ui.suggestions;
    const container = suggestions.querySelector('span');
    if (suggestions) {
      suggestions.hidden = !this.result.didYouMean?.length;
      if (this.result.didYouMean?.length && container) {
        container.textContent = ''; // empty first
        this.result.didYouMean.forEach((suggestion: string) => {
          const didYouMean = document.importNode(
            this.ui.didYouMeanTemplate.content,
            true
          ).firstElementChild;
          didYouMean.textContent = suggestion;
          container.append(didYouMean);
        });
      }

      this.updateFlyingFocus();
    }

    // Pass results to SearchResultList component
    const resultList = this.ui.element.querySelector(
      `#${this.data.type}-panel [data-init="searchResultList"]`
    );
    if (!resultList) return;
    resultList.dispatchEvent(
      new CustomEvent(SearchResultList.events.update, {
        detail: {
          result: this.result,
          page: this.data.page,
        },
      })
    );
    document.getElementById(this.data.type)?.click();
    this.ui.element.classList.add(this.options.stateClasses.showResults);
    this.scrollTop();
  }

  empty() {
    this.ui.resultsHead.hidden = true;
    this.data = {
      type: DEFAULT_TYPE,
      page: 1,
    };
  }

  /**
   * Generates a full URL with query parameters and optional hash.
   *
   * @param baseURL - The base URL to which query params and hash will be appended.
   * @param params - An object representing key-value pairs for query parameters.
   * @param hash - Optional hash fragment to append (without the # symbol).
   * @returns A fully constructed URL string.
   */
  generateURL(baseURL: string, params: Record<string, string | string[]>, hash = ''): string {
    const url = new URL(
      !this.options.inEstatico
        ? baseURL
        : params.type && params.type !== DEFAULT_TYPE
        ? baseURL.replace('.json', `.${params.type}.json`)
        : params.fullText === 'no results'
        ? baseURL.replace('.json', `.no-results.json`)
        : baseURL,
      this.getBaseUrl()
    );
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const item of value) {
          searchParams.append(key, item);
        }
      } else {
        searchParams.append(key, value);
      }
    }

    url.search = searchParams.toString();
    if (hash) url.hash = hash;
    return url.toString();
  }

  showNoResults(show: boolean) {
    if (show) {
      const span = this.ui.noResults.querySelector('.atm-heading span');
      if (span) span.textContent = this.query;
      else console.error('No span for search term in title of no results placeholder');
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.showResults);
    }
    this.ui.element.classList.toggle(this.options.stateClasses.showNoResults, show);
  }

  /**
   * Sends an event to the pagination to tell how many pages there are
   *
   * @memberof SearchPage
   */
  dispatchPageCount() {
    let pageCount: number =
      this.result.resultsData.resultsByType.find(
        (result: ResultByType) => result.type === this.data.type
      )?.numberOfResultPages ?? 1;

    const pagination = this.ui.element.querySelector(
      `#${this.data.type}-panel [data-init="pagination"]`
    );
    if (pagination) {
      pagination.dispatchEvent(
        new CustomEvent(Pagination.events.setPageCount, {
          detail: pageCount,
        })
      );
      pagination.dispatchEvent(
        new CustomEvent(Pagination.events.setPage, {
          detail: this.data.page,
        })
      );
    }
  }

  getParamsInUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('q')?.replaceAll('+', ' ') ?? '';
    const type = searchParams.get('type') || decodeURIComponent(window.location.hash.substring(1));
    const page = searchParams.get('page');
    this.data.topicTags = searchParams
      .getAll('topicTag')
      .map((tag: string) => tag.replaceAll('+', ' '));
    this.data.orgTags = searchParams
      .getAll('organisationTag')
      .map((tag: string) => tag.replaceAll('+', ' '));

    if (query) {
      this.query = query;
      this.ui.input.value = this.query;
    }
    if (KNOWN_TYPES.includes(type)) this.data.type = type;
    if (page) this.data.page = parseInt(page, 10);
    queueMicrotask(() => {
      this.ui.extendedSearch.dispatchEvent(
        new CustomEvent(ExtendedSearch.events.setFilter, {
          detail: [...this.data.topicTags, ...this.data.orgTags],
        })
      );
    });

    if (query.length >= this.options.minInputLength) {
      this.ui.wrapper.classList.add(this.options.stateClasses.loading);

      this.getData(this.generateParams(true, true));
    }
  }

  setFilterInUrl() {
    let url = this.getBaseUrl();
    const urlParams: any = {
      q: this.query,
    };

    if (this.data.page !== 1) urlParams.page = this.data.page;
    if (this.data.topicTags && this.data.topicTags.length > 0)
      urlParams.topicTag = this.data.topicTags;
    if (this.data.orgTags && this.data.orgTags.length > 0)
      urlParams.organisationTag = this.data.orgTags;

    if (Object.keys(urlParams).length > 0) {
      url = this.generateURL(url, urlParams, this.data.type !== DEFAULT_TYPE ? this.data.type : '');
    }
    window.history.pushState({}, document.title, url);
  }

  /**
   * Scroll to top
   */
  scrollTop() {
    setTimeout(() => {
      this.ui.form.scrollIntoView({
        behavior: 'smooth',
      });
    }, 0);
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
