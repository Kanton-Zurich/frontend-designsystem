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
  };

  private classes: {
    parent: any,
  }

  private data: any

  private query: string

  private results: Array<any> = [];

  private template: any;

  constructor(options, data) {
    this.options = merge({}, {
      delay: 250,
      list: options.target.querySelector('ul'),
    }, options);

    this.data = data;

    // Setting the lodash template
    this.template = template(this.options.template);

    this.addWatcher();
  }

  static get events() {
    return {
      filtered: 'Autosuggest.filtered',
      noResult: 'Autosuggest.noResult',
      reset: 'Autosuggest.reset',
    };
  }

  /** Adding the watcher to see changes in the filter field */
  addWatcher() {
    watch(this.options.input, 'value', debounce(this.onQueryChange.bind(this), this.options.delay));
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
      this.dispatchStatusEvent(Autosuggest.events.reset);
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
    const queryRegEx = new RegExp(this.query, 'gi');

    if (this.results.length > 0) this.results = [];

    this.data.forEach((item) => {
      if (Object.prototype.hasOwnProperty.call(item, 'title')) {
        this.matchComplexItem(item, queryRegEx);
      } else {
        // eslint-disable-next-line
        if (queryRegEx.test(item)) {
          this.results.push(item);
        }
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
        target: Object.prototype.hasOwnProperty.call(result, 'path') ? result.path : '',
      });
    });
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

    this.options.list.appendChild(parsed);
  }
}

export default Autosuggest;
