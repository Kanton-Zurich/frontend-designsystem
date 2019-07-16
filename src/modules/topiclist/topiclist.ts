/*!
 * Topiclist
 *
 * @author
 * @copyright
 */
import debounce from 'lodash/debounce';

import Handlebars from '../../../node_modules/handlebars/lib/handlebars.js'

import Module from '../../assets/js/helpers/module';

class Topiclist extends Module {
  public options: {
    hasFilter: Boolean,
    inputDelay: number,
    domSelectors: {
      showAllButton: string,
      contentNavItems: string,
      hiddenContentNavItems: any,
    },
    stateClasses: {
      expanded: string,
    };
  }

  public data: {
    query: String,
    json: {
      topics: Array<{
        title: string,
        synonyms: Array<string>,
      }>,
    },
    topics: Array<{
      title: string,
      synonyms: Array<string>,
    }>,
  }

  public ui: {
    element: any,
    showAllButton: any,
    input: any,
    autosuggest: any,
    contentNav: any,
    contentTeaserTemplate: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      query: '',
      json: {},
      topics: [],
    };
    const defaultOptions = {
      hasFilter: false,
      inputDelay: 250,
      domSelectors: {
        showAllButton: '[data-topiclist="showAllTrigger"]',
        contentNavItems: '[data-init="topiclist"] .mdl-content_nav > ul > li',
        input: '[data-topiclist="input"]',
        autosuggest: '[data-topiclist="autosuggest"]',
        contentNav: '[data-topiclist="contentNav"]',
        contentTeaserTemplate: '[data-topiclist="contentTeaserTemplate"]',
      },
      stateClasses: {
        expanded: 'mdl-topiclist--expanded',
      },
    };
    super($element, defaultData, defaultOptions, data, options);

    this.options.hasFilter = typeof this.ui.input !== typeof undefined;

    this.initUi();
    this.initEventListeners();

    if (this.options.hasFilter) {
      this.initWatchers();
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.showAllButton, this.showAll.bind(this));
  }

  initWatchers() {
    this.watch(this.ui.input, 'value', debounce(this.onValueChange.bind(this), this.options.inputDelay));
  }

  /**
   * Shows all hidden items from the content nav list
   */
  showAll() {
    this.ui.element.classList.add(this.options.stateClasses.expanded);

    this.ui.showAllButton.remove();
  }

  async onValueChange(propName, valueBefore, valueAfter) {
    if (valueBefore === valueAfter) {
      return false;
    }

    this.data.query = valueAfter;

    if (Object.keys(this.data.json).length === 0) {
      await this.fetchData();
    }

    if (this.data.query.length > 1) {
      this.filterTopics(this.data.query);
      this.renderAutoSuggest();
    }
    return true;
  }

  async fetchData() {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch('/mocks/modules/topiclist/topiclist.json')
      .then(response => response.json())
      .then((response) => {
        if (response) {
          const response2 = response;

          response2.topics.forEach((element, index) => {
            element.id = index;
          });

          this.data.json = response2;
        }
      })
      .catch((err) => {
        this.log('error', err);
      });
  }

  filterTopics(query) {
    const queryRegEx = new RegExp(query, 'gi');

    this.data.topics = this.data.json.topics.filter((item) => {
      const titleMatch = queryRegEx.test(item.title);
      const synonymMatch = item.synonyms.filter(synonym => queryRegEx.test(synonym)).length > 0;

      return titleMatch || synonymMatch;
    });
  }

  renderAutoSuggest() {
    this.data.topics.forEach((topic) => {
      const template = Handlebars.compile(this.ui.contentTeaserTemplate.innerHTML);
      const html = template({
        shortTitle: topic.title,
      });

      this.log(html);
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Topiclist;
