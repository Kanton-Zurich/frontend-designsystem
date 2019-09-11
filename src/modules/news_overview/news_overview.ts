/*!
 * NewsOverview
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';
import NewsFilterMobile from '../news_filter_mobile/news_filter_mobile';
import Select from '../select/select';
import FilterPills from '../filter_pills/filter_pills';
import Datepicker from '../datepicker/datepicker';

class NewsOverview extends Module {
  public ui: {
    element: any,
    teaserTemplate: any,
    pagination: HTMLDivElement,
    filter: HTMLDivElement,
    paginationInput: HTMLInputElement,
    topNews: HTMLDivElement,
    filterSelects: HTMLDivElement[],
    filterMobileButton: HTMLButtonElement,
    filterMobileModal: HTMLDivElement,
    filterMobile: HTMLDivElement,
    list: any,
    pills: HTMLDivElement,
    datePicker: HTMLDivElement,
  };
  private dataUrl: string;
  private dataIdle: boolean;
  private filterLists: any[];
  private searchWord: string;
  private dateRange: any[];
  private dateString: string;
  private filterHash: number;
  private dateHash: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        teaserTemplate: '[data-teaser-template]',
        pagination: '.mdl-pagination',
        filterSelects: '.mdl-news-overview__filter .mdl-select',
        filterMobileButton: '.mdl-news-overview__filter [data-news-filter-mobile]',
        filterMobileModal: '#news-filter-mobile',
        filterMobile: '#news-filter-mobile  .mdl-news-filter-mobile',
        paginationInput: '.mdl-pagination input',
        topNews: '.mdl-news-overview__topnews',
        list: '.mdl-news-overview__newsgrid .mdl-news-teaser__content > ul',
        pills: '.mdl-filter-pills',
        datePicker: '.mdl-news-overview__filter .mdl-datepicker',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [[], [], []]; // topics - organisations - type
    this.searchWord = '';
    this.dateRange = [];
    this.dateString = '';
    this.initUi();
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.dataIdle = true;
    this.filterHash = this.createObjectHash(this.filterLists);
    this.dateHash = this.createObjectHash(this.dateRange);
    this.initEventListeners();
    this.loadNewsTeasers();
  }

  static get events() {
    return {};
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // ------------------------
    // open modal and set selected filters
    this.ui.filterMobileButton.addEventListener('click', () => {
      this.ui.filterMobileModal.dispatchEvent(new CustomEvent('Modal.open'));
      const eventData = {
        detail: {
          filterLists: this.filterLists,
        },
      };
      this.ui.filterMobile.dispatchEvent(
        new CustomEvent(NewsFilterMobile.events.setSelectedFilterItems, eventData),
      );
    });
    // ------------------------
    // Listen to page change
    this.watch(this.ui.paginationInput, 'value', () => {
      setTimeout(() => {

      }, 0);
    });
    // ------------------------
    // Filter select events -- topics, organisations, types
    this.ui.filterSelects.forEach((filterSelect, index) => {
      filterSelect.addEventListener(Select.events.valueChanged, (event: any) => {
        this.filterLists[index] = event.detail;
      });
      filterSelect.addEventListener(Select.events.close, () => {
        this.filterView();
      });
    });
    // ---------------------
    // Listen to filter changed from mobile view
    this.ui.filterMobile
      .addEventListener(NewsFilterMobile.events.setSelectedFilterItems,
        this.onSetSelectedFilterItems.bind(this));
    // ---------------------
    // Listen to remove event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.removeTag, (event: any) => {
      const value = event.detail.target.getAttribute('data-pill');
      if (value.indexOf('filter:') === 0) {
        const filterValues = value.split(':');
        this.filterLists[filterValues[1]] = this.filterLists[filterValues[1]].filter(e => e !== filterValues[2]);
      } else if (value === 'date-range') {
        this.dateRange = [];
        this.ui.datePicker.dispatchEvent(new CustomEvent(Datepicker.events.clear));
      }
      this.filterView(false);
    });
    this.ui.pills.addEventListener(FilterPills.events.clearTags, () => {
      this.filterLists = [[], [], []];
      this.dateRange = [];
      this.dateString = '';
      this.filterView();
    });
    // --------------------------
    // Listen to date changed
    this.ui.datePicker.addEventListener(Datepicker.events.dateSet, (event: any) => {
      if (event.detail.dates.length < 2) {
        return;
      }
      this.dateRange = event.detail.dates;
      this.dateString = event.detail.dateString;
      this.filterView();
    });
  }

  /**
   * Handle event on set selected filter items
   * @param event
   */
  onSetSelectedFilterItems(event) {
    this.filterLists = event.detail.filterLists;
    this.filterView();
  }

  /**
   * Update view in case filters changed
   */
  filterView(updateFilterPills = true) {
    const filterHash = this.createObjectHash(this.filterLists);
    const dateHash = this.createObjectHash(this.dateRange);

    if (this.filterHash !== filterHash || this.dateHash !== dateHash) {
      if (updateFilterPills) {
        this.updatePills();
      }
      this.loadNewsTeasers();
      this.filterHash = filterHash;
      this.dateHash = dateHash;
    }
    this.ui.filterSelects.forEach((filterSelect, index) => {
      const eventData = {
        detail: this.filterLists[index],
      };
      filterSelect.dispatchEvent(new CustomEvent(Select.events.setValue, eventData));
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }

  /**
   * Update pills to correspond with filter settings
   */
  updatePills() {
    const tags = [];
    this.filterLists.forEach((filterList, index) => {
      filterList.forEach((filterValue) => {
        const tag = {
          text: (<HTMLInputElement> this.ui.filterSelects[index]
            .querySelector(`li input[value="${filterValue}"]`)).placeholder,
          value: `filter:${index}:${filterValue}`,
        };
        tags.push(tag);
      });
    });
    if (this.dateRange.length === 2) {
      tags.push({ text: this.dateString, value: 'date-range'});
    }
    const eventData = {
      detail: tags,
    };
    this.ui.pills.dispatchEvent(new CustomEvent(FilterPills.events.setTags, eventData));
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
    this.ui.list.innerHTML = '';
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

  /**
   * Create checksum from object
   * @param obj
   */
  private createObjectHash(obj: any) {
    const s = JSON.stringify(obj);
    let hash = 0;
    const strlen = s.length;
    if (strlen === 0) {
      return hash;
    }
    for (let i = 0; i < strlen; i += 1) {
      const c = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + c; // eslint-disable-line
      hash = hash & hash; // eslint-disable-line
    }
    return hash;
  }
}

export default NewsOverview;
