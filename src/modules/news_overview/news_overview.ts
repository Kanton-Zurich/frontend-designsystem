/*!
 * NewsOverview
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';
import { sanitizeSearchString, getURLParam } from '../../assets/js/helpers/common';
import NewsFilterMobile from '../news_filter_mobile/news_filter_mobile';
import Select from '../select/select';
import FilterPills from '../filter_pills/filter_pills';
import Datepicker from '../datepicker/datepicker';
import Pagination from '../pagination/pagination';
import Modal from '../modal/modal';

class NewsOverview extends Module {
  public ui: {
    element: any,
    teaserTemplate: any,
    pagination: HTMLDivElement,
    filter: HTMLDivElement,
    paginationWrapper: HTMLDivElement,
    paginationInput: HTMLInputElement,
    topNews: HTMLDivElement,
    filterSelects: HTMLDivElement[],
    filterMobileButton: HTMLButtonElement,
    filterMobileModal: HTMLDivElement,
    filterMobile: HTMLDivElement,
    list: any,
    pills: HTMLDivElement,
    datePicker: HTMLDivElement,
    datePickerInput: HTMLInputElement,
    pillsClearButton: HTMLButtonElement,
    sortButton: HTMLButtonElement,
    sortDropdown: HTMLDivElement,
    newsGrid: HTMLDivElement,
    sort: HTMLDivElement,
    selection: HTMLDivElement,
    searchWordInput: HTMLInputElement,
    searchWordInputClear: HTMLButtonElement,
    wrapper: HTMLDivElement,
    noResults: HTMLParagraphElement,
    notification: HTMLDivElement,
    hasNoFilters: HTMLParagraphElement,
  };

  public options: {
    domSelectors: any,
    stateClasses: any,
    dataSelectors: any,
    filterPillsThreshold: number,
    loadDelay: number,
  };

  private dataUrl: string;
  private dataIdle: boolean;
  private filterLists: any[];
  private searchWord: string;
  private dateRange: any[];
  private dateString: string;
  private filterHash: number;
  private filterHashZero: number;
  private dateHash: number;
  private dateHashZero: number;
  private searchWordHash: number;
  private searchWordHashZero: number;
  private orderBy: string;
  private currentUrl: string;
  private paginationInteraction: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        teaserTemplate: '[data-teaser-template]',
        paginationWrapper: '.mdl-news-overview__pagination',
        pagination: '.mdl-pagination',
        filterSelects: '.mdl-news-overview__filter .mdl-select',
        filterMobileButton: '.mdl-news-overview__filter [data-news-filter-mobile]',
        filterMobileModal: '#news-filter-mobile',
        filterMobile: '#news-filter-mobile  .mdl-news-filter-mobile',
        paginationInput: '.mdl-pagination input',
        topNews: '.mdl-news-overview__topnews',
        newsGrid: '.mdl-news-overview__newsgrid',
        list: '.mdl-news-overview__newsgrid .mdl-news-teaser__content > ul',
        pills: '.mdl-filter-pills',
        pillsClearButton: '.mdl-filter-pills button[data-clear]',
        datePicker: '.mdl-news-overview__filter .mdl-datepicker',
        datePickerInput: '.mdl-news-overview__filter .mdl-datepicker .atm-form_input__input',
        sortButton: '.mdl-news-overview__sort-dropdown',
        sort: '.mdl-news-overview__sort',
        selection: '.mdl-news-overview__selection',
        sortDropdown: '.mdl-news-overview__sort .mdl-context_menu',
        searchWordInput: '.mdl-news-overview__filter > .atm-form_input input',
        searchWordInputClear: '.mdl-news-overview__filter > .atm-form_input > button',
        wrapper: '[data-news_overview="wrapper"]',
        noResults: '.mdl-news-overview__no-results',
        notification: '.mdl-news-overview__notification',
        hasNoFilters: '[data-news_overview="hasNoFilters"]',
      },
      stateClasses: {
        loading: 'mdl-news-overview--loading',
      },
      filterPillsThreshold: 5,
      loadDelay: 50,
    };

    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [[], [], []]; // topics - organisations - type
    this.searchWord = '';
    this.dateRange = [];
    this.dateString = '';
    this.orderBy = this.ui.element.getAttribute('data-order-by');
    this.initUi();
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.dataIdle = true;
    this.paginationInteraction = false;
    this.filterHash = this.createObjectHash(this.filterLists);
    this.dateHash = this.createObjectHash(this.dateRange);
    this.searchWordHash = this.createObjectHash(this.searchWord);
    this.filterHashZero = this.filterHash;
    this.dateHashZero = this.dateHash;
    this.searchWordHashZero = this.searchWordHash;
    this.initEventListeners();
    // deferred filtering from URL params
    this.filterFromUrlParams();
    setTimeout(() => { this.filterView(true, true, false, false, true); }, 0);
  }

  static get events() {
    return {};
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // -----------------------------------------------
    // focus first element before print
    window.addEventListener('beforeprint', () => {
      this.ui.searchWordInput.focus();
    });
    // -----------------------------------------------
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
    // -----------------------------------------------
    // Listen to pagination change event
    this.ui.pagination.addEventListener(Pagination.events.change, () => {
      this.filterView(false, true, false, this.paginationInteraction);
    });
    this.ui.pagination.addEventListener(Pagination.events.interaction, () => {
      this.paginationInteraction = true;
    });
    // -----------------------------------------------
    // Filter select events -- topics, organisations, types
    this.ui.filterSelects.forEach((filterSelect, index) => {
      filterSelect.addEventListener(Select.events.valueChanged, (event: any) => {
        this.filterLists[index] = event.detail;
      });
      filterSelect.addEventListener(Select.events.close, () => {
        this.filterView();
      });
    });
    // -----------------------------------------------
    // Listen to date changed
    this.ui.datePicker.addEventListener(Datepicker.events.dateSet, this.onDateSet.bind(this));
    // -----------------------------------------------
    // Listen to date changed from mobile view
    this.ui.filterMobile.addEventListener(NewsFilterMobile.events.dateSet,
      this.onMobileDateSet.bind(this));
    // -----------------------------------------------
    // Listen to filter changed from mobile view -- topics, organisations, types
    this.ui.filterMobile
      .addEventListener(NewsFilterMobile.events.setSelectedFilterItems,
        (event: any) => {
          this.filterLists = event.detail.filterLists;
          this.filterView();
        });
    // -----------------------------------------------
    // Listen to date changed from mobile view
    this.ui.filterMobile.addEventListener(NewsFilterMobile.events.confirm,
      () => {
        this.ui.filterMobileModal.dispatchEvent(new CustomEvent(Modal.events.closeModal));
      });
    // -----------------------------------------------
    // Listen to remove event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.removeTag, (event: any) => {
      const value = event.detail.target.getAttribute('data-pill');
      if (value.indexOf('filter:') === 0) {
        const filterValues = value.split(':');
        this.filterLists[filterValues[1]] = this.filterLists[filterValues[1]]
          .filter(e => e !== filterValues[2]);
      } else if (value === 'date-range') {
        this.dateRange = [];
        this.ui.datePicker.dispatchEvent(new CustomEvent(Datepicker.events.clear));
        this.ui.filterMobile.dispatchEvent(new CustomEvent(NewsFilterMobile.events.clearDate));
      } else if (value.indexOf('fullText:') === 0) {
        this.searchWord = '';
        this.ui.searchWordInput.value = '';
        (<HTMLButtonElement> this.ui.sortDropdown
          .querySelector(`button[data-sort="${this.ui.element.getAttribute('data-order-by')}"]`)).click();
      }
      this.filterView(false);
    });
    // -----------------------------------------------
    // Listen to clear event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.clearTags, () => {
      this.filterLists = [[], [], []];
      this.dateRange = [];
      this.dateString = '';
      this.searchWord = '';
      this.ui.datePicker.dispatchEvent(new CustomEvent(Datepicker.events.clear));
      this.ui.filterMobile.dispatchEvent(new CustomEvent(NewsFilterMobile.events.clearDate));
      this.ui.searchWordInput.value = '';
      this.filterView();
    });
    // -----------------------------------------------
    // Listen to sort-dropdown events
    this.ui.sortButton.addEventListener('click', () => {
      this.ui.sortDropdown.classList.toggle('visible');
    });
    this.ui.sortDropdown.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (event: any) => {
        this.orderBy = button.getAttribute('data-sort');
        this.ui.sortButton.querySelector('span').innerHTML = event.target.innerHTML;
        this.ui.sortDropdown.classList.remove('visible');
        this.filterView(false, true);
      });
    });
    // -----------------------------------------------
    // Listen to Search input and clear event
    this.ui.searchWordInput.addEventListener('keypress', (event: any) => {
      if (event.key === 'Enter') {
        this.searchWord = sanitizeSearchString(event.target.value);
        this.filterView();
      }
    });
    this.ui.searchWordInputClear.addEventListener('click', () => {
      this.searchWord = '';
      this.filterView();
    });
    this.ui.searchWordInput.addEventListener('focusout', (event: any) => {
      this.searchWord = sanitizeSearchString(event.target.value);
      this.filterView();
    });
  }

  /**
   * Update view in case filters changed
   */
  filterView(updateFilterPills = true, forced = false, resetPaging = true, scroll = false, replaceState = false) { // eslint-disable-line
    const filterHash = this.createObjectHash(this.filterLists);
    const dateHash = this.createObjectHash(this.dateRange);
    const searchWordHash = this.createObjectHash(this.searchWord);
    this.paginationInteraction = false;
    // only reload view if there is a change or forced load
    if (forced || this.filterHash !== filterHash
      || this.dateHash !== dateHash
      || this.searchWordHash !== searchWordHash) {
      if (this.searchWord !== '' && this.searchWordHash !== searchWordHash) {
        (<HTMLButtonElement> this.ui.sortDropdown
          .querySelector('button[data-sort="relevance"]')).click();
      }
      if (updateFilterPills) {
        this.updatePills();
      }
      if (resetPaging) {
        this.ui.paginationInput.value = '1';
      }
      this.loadNewsTeasers(scroll, replaceState);
      this.filterHash = filterHash;
      this.dateHash = dateHash;
      this.searchWordHash = searchWordHash;
    }
    // update filter dropdown modules
    this.ui.filterSelects.forEach((filterSelect, index) => {
      const eventData = {
        detail: {
          data: this.filterLists[index],
          emit: false,
        },
      };
      filterSelect.dispatchEvent(new CustomEvent(Select.events.setValue, eventData));
    });
    // hide top news if any filter is active
    if (this.ui.topNews) {
      if (this.dateHash !== this.dateHashZero
        || this.filterHash !== this.filterHashZero
        || this.searchWordHash !== this.searchWordHashZero
        || parseInt(this.ui.paginationInput.value, 10) > 1) {
        this.ui.topNews.classList.remove('visible');
      } else {
        this.ui.topNews.classList.add('visible');
      }
    }

    // hide visually hidden text for no filters if any filter is active
    if (this.dateHash !== this.dateHashZero
      || this.filterHash !== this.filterHashZero
      || this.searchWordHash !== this.searchWordHashZero) {
      this.ui.hasNoFilters.setAttribute('aria-hidden', 'true');
    } else {
      this.ui.hasNoFilters.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
    // Custom destroy actions go here
  }

  /**
   * On Update date input set
   * @param event
   */
  onDateSet(event: any) {
    if (event.detail.dates.length < 2) { // eslint-disable-line
      return;
    }
    this.updateDate(event.detail);
    this.ui.filterMobile.dispatchEvent(new CustomEvent(NewsFilterMobile.events.setDate, event));
  }

  /**
   * On mobile date input set
   * @param event
   */
  onMobileDateSet(event: any) {
    if (event.detail.dates.length < 2) { // eslint-disable-line
      return;
    }
    this.ui.datePickerInput.value = event.detail.dateString;
    this.ui.datePicker.classList.add('dirty');
    this.updateDate(event.detail);
  }

  /**
   * Update date
   * @param dates
   */
  updateDate(dates) {
    this.dateRange = dates.dates;
    this.dateString = dates.dateString;
    this.filterView();
  }

  /**
   * Update pills to correspond with filter settings
   */
  updatePills() {
    const tags = [];
    // add pills for selected filters
    this.filterLists.forEach((filterList, index) => {
      filterList.forEach((filterValue) => {
        const inputCheckbox = (<HTMLInputElement> this.ui.filterSelects[index]
          .querySelector(`li input[value="${filterValue}"]`));
        if (inputCheckbox) {
          const tag = {
            text: (<HTMLInputElement> this.ui.filterSelects[index]
              .querySelector(`li input[value="${filterValue}"]`)).placeholder,
            value: `filter:${index}:${filterValue}`,
          };
          tags.push(tag);
        }
      });
    });
    // add pill for date
    if (this.dateRange.length === 2) { // eslint-disable-line
      tags.push({ text: this.dateString, value: 'date-range' });
    }
    // add pill for search word
    if (this.searchWord.length > 0) {
      tags.push({ text: this.searchWord, value: `fullText:${this.searchWord}` });
    }
    const eventData = {
      detail: tags,
    };
    // update pills module
    this.ui.pills.dispatchEvent(new CustomEvent(FilterPills.events.setTags, eventData));
  }

  /**
   * Filters from URL params
   */
  filterFromUrlParams() {
    const topics = getURLParam('topic');
    const organisations = getURLParam('organisation');
    const types = getURLParam('type');
    const dateFromStr = getURLParam('dateFrom', true);
    const dateToStr = getURLParam('dateTo', true);
    const searchWord = getURLParam('fullText', true);
    const page = getURLParam('page', true);
    const orderBy = getURLParam('orderBy', true);
    if (page) {
      setTimeout(() => {
        this.ui.pagination
          .dispatchEvent(new CustomEvent(Pagination.events.setPage, { detail: page }));
      }, 0);
    }
    this.searchWord = searchWord !== null ? searchWord : '';
    this.filterLists = [
      topics !== null ? topics : [],
      organisations !== null ? organisations : [],
      types !== null ? types : [],
    ];
    // update control modules with the gathered parameters
    if (dateToStr && dateFromStr) {
      const dateTo = new Date(dateToStr);
      const dateFrom = new Date(dateFromStr);
      this.dateRange = [ dateFrom, dateTo ];
      this.dateString = `${('0' + dateFrom.getDate()).slice(-2)}.${('0' + (dateFrom.getMonth() + 1)).slice(-2)}.${dateFrom.getFullYear()} - ${('0' + dateTo.getDate()).slice(-2)}.${('0' + (dateTo.getMonth() + 1)).slice(-2)}.${dateTo.getFullYear()}`; // eslint-disable-line
      setTimeout(() => {
        this.ui.datePickerInput.value = this.dateString;
        this.ui.datePicker.classList.add('dirty');
        this.ui.datePickerInput.classList.add('dirty');
      }, 0);
    }
    if (this.searchWord.length > 0) {
      this.ui.searchWordInput.value = this.searchWord;
      this.ui.searchWordInput.classList.add('dirty');
    }
    if (orderBy && orderBy.length > 0) {
      this.ui.sortButton.querySelector('span').innerHTML = this.ui.sortDropdown
        .querySelector(`li > button[data-sort="${orderBy}"] span`).innerHTML;
      this.orderBy = orderBy;
    }
  }

  /**
   * Fetch teaser data
   * @param callback
   */
  async fetchData(callback: Function, replaceState = false) {
    // add Loading class
    this.ui.wrapper.classList.add(this.options.stateClasses.loading);

    if (!window.fetch) {
      await import('whatwg-fetch');
    }
    this.currentUrl = this.constructUrl();

    return fetch(this.currentUrl)
      .then((response) => {
        if (response.status !== 200 && response.status !== 204 ) { // eslint-disable-line
          throw new Error('Error fetching resource!');
        }
        return response.status === 204 ? {} : response.json(); // eslint-disable-line
      })
      .then((response) => {
        if (response) {
          const wcmmode = getURLParam('wcmmode');
          const canonical = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1]}${wcmmode ? '&wcmmode=' + wcmmode : ''}`; // eslint-disable-line
          if (replaceState) {
            history.replaceState({url: canonical,}, null, canonical); // eslint-disable-line
          } else {
            history.pushState({url: canonical,}, null, canonical); // eslint-disable-line
          }
          callback(response);
          this.ui.notification.classList.add('hidden');
        }
        // Remove loading class
        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
      })
      .catch((err) => {
        this.log('error', err);
        this.ui.notification.classList.remove('hidden');
        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
        callback({ error: err });
      });
  }

  /**
   * Load news teasers
   */
  private loadNewsTeasers(scroll = false, replaceState = false) {
    if (scroll) {
      this.scrollTop();
    }
    if (this.dataIdle) {
      this.dataIdle = false;
      this.fetchData((jsonData) => {
        this.ui.selection.classList.remove('hidden');
        this.ui.sort.classList.remove('hidden');
        this.ui.newsGrid.classList.remove('hidden');
        if (jsonData.error) {
          this.ui.notification.classList.remove('hidden');
          this.ui.noResults.classList.remove('visible');
          this.ui.paginationWrapper.classList.add('hidden');
          this.ui.selection.classList.add('hidden');
          this.ui.sort.classList.add('hidden');
          this.ui.newsGrid.classList.add('hidden');
          this.dataIdle = true;
          return;
        }
        if (jsonData.numberOfResultPages > 1) {
          this.ui.paginationWrapper.classList.remove('hidden');
        } else {
          this.ui.paginationWrapper.classList.add('hidden');
        }
        // update canonical href
        this.ui.pagination.dispatchEvent(new CustomEvent(Pagination
          .events.setPageCount, { detail: jsonData.numberOfResultPages }));
        const canonicalUrl = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1]}`;
        let prevUrl = '';
        if (parseInt(this.ui.paginationInput.value, 10) > 1) {
          prevUrl = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1].replace(/page=(0|[1-9][0-9]*)/, `page=${parseInt(this.ui.paginationInput.value, 10) - 1}`)}`;
        }
        let nextUrl = '';
        if (parseInt(this.ui.paginationInput.value, 10) < jsonData.numberOfResultPages) {
          nextUrl = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1].replace(/page=(0|[1-9][0-9]*)/, `page=${parseInt(this.ui.paginationInput.value, 10) + 1}`)}`;
        }
        this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setCanonicalUrls,
          { detail: { prev: prevUrl, next: nextUrl } }));
        // update canonical links
        this.upsertLinkRel('prev', prevUrl);
        this.upsertLinkRel('next', nextUrl);
        this.upsertLinkRel('canonical', canonicalUrl);
        this.populateNewsTeasers(jsonData);
        this.updateFlyingFocus(0);
        if (scroll) {
          this.scrollTop();
        }
        this.dataIdle = true;
      }, replaceState);
    }
  }

  /**
   * Build news raster
   * @param jsonData
   */
  private populateNewsTeasers(jsonData) {
    this.ui.list.innerHTML = '';
    if (!jsonData.news || jsonData.news.length === 0) {
      this.ui.noResults.classList.add('visible');
    } else {
      this.ui.noResults.classList.remove('visible');

      jsonData.news.forEach((item) => {
        const element = document.createElement('li');
        element.classList.add('mdl-news-teaser__item');
        element.innerHTML = this.teaserItemFromTemplate(this.ui.teaserTemplate.innerHTML, item);
        this.ui.list.appendChild(element);
      });
    }
    (<any>window).estatico.lineClamper.updateLineClamping();
    this.updateFlyingFocus(this.options.loadDelay);

    if ([].slice.call(this.ui.pills.querySelectorAll('[data-pill]')).length >= this.options.filterPillsThreshold) {
      this.ui.pillsClearButton.classList.remove('hidden');
    } else {
      this.ui.pillsClearButton.classList.add('hidden');
    }
  }

  /**
   * Scroll to top
   */
  scrollTop() {
    setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const rect = this.ui.element.getBoundingClientRect();
      window.scroll(0, rect.top + scrollTop);
    }, 0);
  }

  /**
   * Scroll to bottom
   */
  scrollBottom() {
    setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const rect = this.ui.pagination.getBoundingClientRect();
      const elementOffset = rect.height * 2; // eslint-disable-line
      window.scroll(0, rect.top + scrollTop - window.innerHeight + elementOffset);
    }, 0);
  }

  /**
   * Create markup with template and properties
   * @param teaserTemplate
   * @param props
   */
  private teaserItemFromTemplate(teaserTemplate, props) {
    let tmp = teaserTemplate.replace(/this\./gm, 'self.');
    tmp = tmp.replace(/=else/gm, ' } else { ');

    const compiled = template(tmp); // eslint-disable-line
    const data = {
      self: props,
    };
    return compiled(data);
  }

  /**
   * Assemble URL from base url and filters
   */
  private constructUrl() {
    let resultUrl = this.dataUrl;
    const append = (key, value) => {
      if (value.length > 0) {
        resultUrl += resultUrl === this.dataUrl ? '?' : '&';
        resultUrl += `${key}=${encodeURIComponent(value)}`;
      }
    };
    this.filterLists[0].forEach((topic) => { append('topic', topic); });
    this.filterLists[1].forEach((organisation) => { append('organisation', organisation); });
    this.filterLists[2].forEach((type) => { append('type', type); });
    if (this.dateRange.length > 1) {
      append('dateFrom', `${this.dateRange[0].getFullYear()}-${('0' + (this.dateRange[0].getMonth() + 1)).slice(-2)}-${('0' + this.dateRange[0].getDate()).slice(-2)}`); // eslint-disable-line
      append('dateTo', `${this.dateRange[1].getFullYear()}-${('0' + (this.dateRange[1].getMonth() + 1)).slice(-2)}-${('0' + this.dateRange[1].getDate()).slice(-2)}`); // eslint-disable-line
    }
    append('fullText', this.searchWord);
    append('page', this.ui.paginationInput.value);
    append('orderBy', this.orderBy);

    return resultUrl;
  }
}

export default NewsOverview;
