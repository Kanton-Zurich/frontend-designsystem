/*!
 * NewsOverview
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';
import NewsFilterMobile from '../news_filter_mobile/news_filter_mobile';

class NewsOverview extends Module {
  public ui: {
    element: any,
    teaserTemplate: any,
    pagination: HTMLDivElement,
    filter: HTMLDivElement,
    paginationInput: HTMLInputElement,
    topNews: HTMLDivElement,
    filterMobileButton: HTMLButtonElement,
    filterMobileModal: HTMLDivElement,
    filterMobile: HTMLDivElement,
    list: any,
  };
  private dataUrl: string;
  private dataIdle: boolean;
  public filterLists: any[];

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        teaserTemplate: '[data-teaser-template]',
        pagination: '.mdl-pagination',
        filter: '.mdl-news-overview__filter',
        filterMobileButton: '.mdl-news-overview__filter [data-news-filter-mobile]',
        filterMobileModal: '#news-filter-mobile',
        filterMobile: '#news-filter-mobile [data-filters]',
        paginationInput: '.mdl-pagination input',
        topNews: '.mdl-news-overview__topnews',
        list: '.mdl-news-overview__newsgrid .mdl-news-teaser__content > ul',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [];
    this.initUi();
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.dataIdle = true;
    this.initEventListeners();
    this.loadNewsTeasers();
  }

  static get events() {
    return {
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.filterMobileButton.addEventListener('click', () => {
      this.ui.filterMobileModal.dispatchEvent(new CustomEvent('Modal.open'));
    });
    this.watch(this.ui.paginationInput, 'value', () => {
      setTimeout(() => {

      }, 0);
    });

    this.ui.filterMobile
      .addEventListener(NewsFilterMobile.events.onSetSelectedFilterItems,
        this.onSetSelectedFilterItems.bind(this));
  }

  /**
   * Handle event on selected filter items changed
   * @param event
   */
  onSetSelectedFilterItems(event) {
    this.filterLists = event.detail.filterLists;
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }

  /**
   * Fetch teaser data
   * @param dataSource
   * @param callback
   */
  async fetchData(callback: Function) {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(this.dataUrl) // TODO: add filters
      .then(response => response.json())
      .then((response) => {
        if (response) {
          callback(response);
        }
      })
      .catch((err) => {
        this.log('error', err);
      });
  }

  /**
   * Load news teasers
   */
  private loadNewsTeasers() {
    if (this.dataIdle) {
      this.dataIdle = false;
      this.fetchData((jsonData) => {
        this.populateNewsTeasers(jsonData);
        this.dataIdle = true;
      });
    }
  }

  /**
   * Build news raster
   * @param jsonData
   */
  private populateNewsTeasers(jsonData) {
    // Todo: Check if filters are active and hide top this.ui.topNews
    this.ui.pagination.setAttribute('data-pagecount', jsonData.numberOfResultPages);
    this.ui.pagination.querySelector('.mdl-pagination__page-count > span').innerHTML = jsonData.numberOfResultPages;
    (<HTMLInputElement> this.ui.pagination.querySelector('.atm-form_input__input')).value = '1';
    jsonData.news.forEach((item) => {
      const element = document.createElement('li');
      element.classList.add('mdl-news-teaser__item');
      element.innerHTML = this.teaserItemFromTemplate(this.ui.teaserTemplate.innerHTML, item);
      this.ui.list.appendChild(element);
    });
  }

  /**
   * Create markup with template and properties
   * @param teaserTemplate
   * @param props
   */
  private teaserItemFromTemplate(teaserTemplate, props) {
    const compiled = template(teaserTemplate.replace(/this\./gm, 'self.')); // eslint-disable-line
    const data = {
      self: props,
    };
    return compiled(data);
  }
}

export default NewsOverview;
