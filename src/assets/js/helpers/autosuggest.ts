import { watch } from 'wrist';
import {
  debounce,
  merge,
  template,
  sortBy,
} from 'lodash';
/**
 *
 *
 * @class Autosuggest
 */
class Autosuggest {
  private options: {
    url: string,
    input: HTMLInputElement,
    target: HTMLDivElement,
    delay: number,
    parent: HTMLDivElement,
    list: HTMLUListElement,
    template: string,
    renderAsButton: boolean,
    searchPageUrl: string,
  };

  private classes: {
    parent: any,
  }

  private stateClasses: any;

  private data: any

  private query: string

  private results: Array<any> = [];

  private template: any;

  private selectedTerm: any;

  constructor(options, data) {
    this.options = merge({}, {
      delay: 500,
      list: options.target.querySelector('ul'),
    }, options);

    this.data = data;

    this.stateClasses = {
      loading: 'mdl-content_nav--loading',
    };

    // Setting the lodash template
    this.template = template(this.options.template);

    this.selectedTerm = '';

    this.addWatcher();
    this.addEvents();
  }

  static get events() {
    return {
      filtered: 'Autosuggest.filtered',
      noResult: 'Autosuggest.noResult',
      reset: 'Autosuggest.reset',
      termSelected: 'Autosuggest.termSelected',
      empty: 'Autosuggest.empty',
    };
  }

  /** Adding the watcher to see changes in the filter field */
  addWatcher() {
    watch(this.options.input, 'value', debounce(this.onQueryChange.bind(this), this.options.delay));
  }

  /**
   * Adding the events
   *
   * @memberof Autosuggest
   */
  addEvents() {
    this.options.input.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowDown' && this.options.list.childElementCount > 0) {
        this.focusFirstItem();

        return false;
      }

      return true;
    });

    this.options.target
      .addEventListener(Autosuggest.events.empty, this.emptyAutosuggest.bind(this));
  }

  /**
   * Dispatching the status event
   *
   * @param {*} event String with the event name
   * @memberof Autosuggest
   */
  dispatchStatusEvent(event, results = 0) {
    this.options.parent.dispatchEvent(new CustomEvent(event, {
      detail: {
        results,
        query: this.query,
      },
    }));
  }

  /**
   * Function is triggered when someone enters a filter value
   * @param propName the name of the changed property
   * @param queryBefore the value of the query before the change
   * @param queryAfter the current value of the query
   */
  async onQueryChange(propName, queryBefore, queryAfter) {
    this.query = queryAfter;

    if (this.selectedTerm !== this.query) {
      this.selectedTerm = this.query;

      if (this.options.url) {
        this.setLoading();

        await this.fetchData();
      }

      if (this.query.length > 1) {
        this.emptyAutosuggest();
        this.filterData();

        if (this.results.length > 0) {
          this.dispatchStatusEvent(Autosuggest.events.filtered, this.results.length);

          this.renderResults();


          window.dispatchEvent(new CustomEvent('reloadLineClamper'));
        } else {
          this.dispatchStatusEvent(Autosuggest.events.noResult);
        }
      } else {
        this.emptyAutosuggest();

        this.dispatchStatusEvent(Autosuggest.events.reset);
      }

      this.unsetLoading();
    }
  }

  /**
   * Emptying the autosuggest
   */
  emptyAutosuggest() {
    this.options.list.innerHTML = '';
  }

  /**
   * Adding some autosuggest classes
   */
  addAutosuggest() {
    this.options.parent.classList.add(this.classes.parent.filtered);
  }

  /* Removing the classes set by autosuggest on the parent */
  removeAutosuggest() {
    this.options.parent.classList.remove(this.classes.parent.filtered);
  }

  /**
   * Filter the given response
   *
   * @memberof Autosuggest
   */
  filterData() {
    const queryRegEx = new RegExp(`(${this.query})`, 'gi');

    if (this.results.length > 0) this.results = [];

    this.data.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'title')) {
        this.matchComplexItem(item, queryRegEx);
      } else {
        this.results.push(item.replace(queryRegEx, '<span class="bold">$1</span>'));
      }
    });
  }

  /**
   * Matching complex items with subpages etc...
   *
   * @param {any} item a complex item returned by the json
   * @param {RegExp} regEx a Regular expression to match the query
   * @memberof Autosuggest
   */
  matchComplexItem(item, regEx) {
    const titleMatch = regEx.test(item.title);
    let synonymMatch = false;

    if (item.synonyms) {
      synonymMatch = item.synonyms.filter(synonym => regEx.test(synonym)).length > 0;
    }

    if (titleMatch || synonymMatch) this.results.push(item);

    if (Object.prototype.hasOwnProperty.call(item, 'subpages')) {
      item.subpages.forEach((page) => {
        this.matchComplexItem(page, regEx);
      });
    }
  }

  /**
   * Rendering the results
   *
   * @memberof Autosuggest
   */
  renderResults() {
    const sortedResults = sortBy(this.results, ['title']);

    sortedResults.forEach((result) => {
      this.renderItem({
        shortTitle: Object.prototype.hasOwnProperty.call(result, 'title') ? result.title : result,
        buzzwords: '',
        target: Object.prototype.hasOwnProperty.call(result, 'path') ? result.path : `${this.options.searchPageUrl}?q=${encodeURIComponent(result)}`,
      });
    });

    this.addRenderedEvents();
  }

  /**
   * Rendering the content nav item
   *
   * @param {any} context the object with the context information
   * @memberof Autosuggest
   */
  renderItem(context) {
    const html = `<li class="mdl-content_nav__item">${this.template(context)}</li>`;
    const parsed = new DOMParser().parseFromString(html, 'text/html').querySelector('li');

    if (this.options.renderAsButton) {
      const aTag = parsed.querySelector('a');
      aTag.setAttribute('role', 'button');
      aTag.removeAttribute('href');
      aTag.setAttribute('data-term', context.shortTitle);

      aTag.addEventListener('click', this.dispatchTerm.bind(this, aTag));
    }

    this.options.list.appendChild(parsed);
  }

  /**
   * Fetching the data, for autosuggest in search, topiclists will be loaded beforehand
   *
   * @returns Promise
   * @memberof Autosuggest
   */
  async fetchData() {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(`${this.options.url}?q=${encodeURIComponent(this.query)}`)
      .then(response => response.json())
      .then((response) => {
        if (Object.prototype.hasOwnProperty.call(response, 'suggestions')) {
          this.data = response.suggestions;
        }
      });
  }

  /**
   * Adds the arrow up/down event listeners, which only works when there actually list item
   *
   * @memberof Autosuggest
   */
  addRenderedEvents() {
    const listItems = this.options.list.querySelectorAll('a, button');

    listItems.forEach((listItem) => {
      listItem.addEventListener('keydown', (event) => {
        switch ((<KeyboardEvent>event).code) {
          case 'ArrowUp':
            this.focusPrevItem(event.target);
            break;
          case 'ArrowDown':
            this.focusNextItem(event.target);
            break;
          default:
            break;
        }
      });
    });
  }

  /**
   * Focus the first item in the last
   *
   * @memberof Autosuggest
   */
  focusFirstItem() {
    (<HTMLElement> this.options.list.querySelector('a, button')).focus();
  }

  focusPrevItem(currentFocus) {
    const { parentElement } = currentFocus;

    if (parentElement.previousSibling) {
      parentElement.previousSibling.querySelector('a, button').focus();
    } else {
      this.options.input.focus();
    }
  }

  focusNextItem(currentFocus) {
    const { parentElement } = currentFocus;

    if (parentElement.nextSibling) {
      parentElement.nextSibling.querySelector('a, button').focus();
    }
  }

  setLoading() {
    this.options.target.classList.add(this.stateClasses.loading);
  }

  unsetLoading() {
    this.options.target.classList.remove(this.stateClasses.loading);
  }

  dispatchTerm(aTag) {
    this.selectedTerm = aTag.dataset.term;

    this.options.parent.dispatchEvent(new CustomEvent(Autosuggest.events.termSelected, {
      detail: aTag.dataset.term,
    }));
  }
}

export default Autosuggest;
