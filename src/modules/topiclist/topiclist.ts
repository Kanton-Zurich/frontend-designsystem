/*!
 * Topiclist
 *
 * @author
 * @copyright
 */
import { debounce, template } from 'lodash';

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
      filtered: string,
      nav: string,
    };
  }

  public data: {
    query: string,
    isNav: boolean,
    json: {
      topics: Array<{
        title: string,
        synonyms: Array<string>,
        path: string,
      }>,
      filterField: {
        noResultsLabel: string,
        searchInSiteSearchLabel: string,
        searchPage: string,
      },
    },
    topics: Array<{
      title: string,
      synonyms: Array<string>,
      path: string,
    }>,
  }

  public ui: {
    element: any,
    showAllButton: any,
    input: any,
    autosuggest: any,
    contentNav: any,
    contentTeaserTemplate: any,
    searchLink: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      query: '',
      json: {},
      topics: [],
      isNav: false,
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
        searchLink: '[data-topiclist="searchLink"]',
      },
      stateClasses: {
        expanded: 'mdl-topiclist--expanded',
        filtered: 'mdl-topiclist--filtered',
        nav: 'mdl-topiclist--nav',
      },
    };
    super($element, defaultData, defaultOptions, data, options);

    this.options.hasFilter = typeof this.ui.input !== typeof undefined;

    this.data.isNav = this.ui.element.classList.contains(this.options.stateClasses.nav);

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

    if (this.data.isNav) {
      this.eventDelegate
        .on('loadNavigation', async () => {
          if (Object.keys(this.data.json).length === 0) {
            await this.fetchData();
          }
        });
    }
  }

  initWatchers() {
    this.watch(this.ui.input, 'value', debounce(this.onValueChange.bind(this), this.options.inputDelay));
  }

  /**
   * Shows all hidden items from the content nav list
   */
  showAll() {
    this.ui.element.classList.add(this.options.stateClasses.expanded);

    this.ui.showAllButton.style.display = 'none';
  }

  async onValueChange(propName, valueBefore, valueAfter) {
    if (valueBefore === valueAfter) {
      return false;
    }
    const entriesToShowButton = 8;

    this.data.query = valueAfter;

    if (Object.keys(this.data.json).length === 0) {
      await this.fetchData();
    }

    if (this.data.query.length > 1) {
      this.filterTopics(this.data.query);
      this.ui.autosuggest.innerHTML = '';

      this.ui.element.classList.add(this.options.stateClasses.filtered);

      if (this.data.topics.length > 0) {
        this.renderAutoSuggest();

        this.ui.element.classList.remove(this.options.stateClasses.expanded);

        if (this.data.topics.length >= entriesToShowButton) {
          this.ui.showAllButton.style.display = 'inline-flex';
        } else {
          this.ui.showAllButton.style.display = 'none';
        }
      } else {
        this.renderNoResult();
      }
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.filtered);
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

    this.data.json.topics.forEach((item) => {
      this.getMatchingItems(item, queryRegEx);
    });
  }

  getMatchingItems(item, query) {
    const titleMatch = query.test(item.title);
    let synonymMatch = false;

    if (item.synonyms) {
      synonymMatch = item.synonyms.filter(synonym => query.test(synonym)).length > 0;
    }

    if (titleMatch || synonymMatch) this.data.topics.push(item);

    if (item.subpages) {
      item.subpages.forEach((subpage) => {
        this.getMatchingItems(subpage, query);
      });
    }
  }

  checkItemForMatch(item, query) {
    const titleMatch = query.test(item.title);
    let synonymMatch = false;
    let subpagesMatch = false;

    if (item.synonyms) {
      synonymMatch = item.synonyms.filter(synonym => query.test(synonym)).length > 0;
    }

    if (Object.prototype.hasOwnProperty.call(item, 'subpages')) {
      subpagesMatch = item.subpages
        .filter(subpage => this.checkItemForMatch(subpage, query)).length > 0;
    }

    return titleMatch || synonymMatch || subpagesMatch;
  }

  renderAutoSuggest() {
    this.data.topics.forEach((topic) => {
      const compiled = template(this.ui.contentTeaserTemplate.innerHTML);
      let html = compiled({
        shortTitle: topic.title,
        buzzwords: '',
        target: topic.path,
      });

      html = `<li class="mdl-content_nav__item">${html}</li>`;

      const parsedHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('li');

      this.ui.autosuggest.append(parsedHTML);

      window.dispatchEvent(new CustomEvent('reloadLineClamper'));
    });
  }

  renderNoResult() {
    const compiled = template(this.ui.contentTeaserTemplate.innerHTML);
    const html = compiled({
      shortTitle: this.data.json.filterField.noResultsLabel,
      buzzwords: '',
      target: '',
    });

    const parsedHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('a');

    parsedHTML.setAttribute('disabled', 'disabled');
    parsedHTML.querySelector('[data-lineclamp]').removeAttribute('data-lineclamp');
    parsedHTML.removeAttribute('href');

    this.ui.autosuggest.append(parsedHTML);

    // Render the link to the search
    const compiled2 = template(this.ui.searchLink.innerHTML);
    const html2 = compiled2({
      title: this.data.json.filterField.searchInSiteSearchLabel.replace(/\${query}/g, this.data.query),
      path: this.data.json.filterField.searchPage.replace(/\${query}/g, this.data.query),
    });

    const parsedLink = new DOMParser().parseFromString(html2, 'text/html').querySelector('a');

    this.ui.autosuggest.append(parsedLink);
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
