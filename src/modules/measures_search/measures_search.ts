/*!
 * MeasuresSearch
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import template from 'lodash/template';
import { sanitizeSearchString, getAllURLParams } from '../../assets/js/helpers/common';
import FilterPills from '../filter_pills/filter_pills';
import Pagination from '../pagination/pagination';
import { ResultItem } from './measures_search.types';

class MeasuresSearch extends Module {
  public ui: {
    element: any;
    teaserTemplate: any;
    pagination: HTMLDivElement;
    filter: HTMLDivElement;
    dialog: HTMLDivElement;
    dialogForm: HTMLFormElement;
    filterFormSections: HTMLFieldSetElement[];
    paginationWrapper: HTMLDivElement;
    paginationInput: HTMLInputElement;
    list: any;
    pills: HTMLDivElement;
    pillsClearButton: HTMLButtonElement;
    sortButton: HTMLButtonElement;
    sortDropdown: HTMLDivElement;
    results: HTMLDivElement;
    sort: HTMLDivElement;
    selection: HTMLDivElement;
    searchWordInput: HTMLInputElement;
    searchWordInputClear: HTMLButtonElement;
    advancedSearchButton: HTMLButtonElement;
    wrapper: HTMLDivElement;
    noResults: HTMLParagraphElement;
    notification: HTMLDivElement;
    hasNoFilters: HTMLParagraphElement;
  };

  public options: {
    domSelectors: any;
    stateClasses: any;
    dataSelectors: any;
    filterPillsThreshold: number;
    loadDelay: number;
  };

  private dataUrl: string;
  private dataIdle: boolean;
  private dataLoaded: boolean;
  private filterLists: any[];
  private searchWord: string;
  private filterHash: number;
  private filterHashZero: number;
  private searchWordHash: number;
  private searchWordHashZero: number;
  private orderBy: string;
  private currentUrl: string;
  private currentPage: number;
  private paginationInteraction: boolean;
  private maxResultItems: number;
  private numberOfResultPages: number;
  private allResults: ResultItem[];
  private filteredResults: ResultItem[];
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        dialog: '.mdl-dialog',
        dialogForm: '.mdl-dialog__form',
        filterFormSections: '.mdl-dialog__content .form__section',
        teaserTemplate: '[data-teaser-template]',
        paginationWrapper: '.mdl-measures_search__pagination',
        pagination: '.mdl-pagination',
        paginationInput: '.mdl-pagination input',
        results: '.mdl-measures_search__results',
        list: '.mdl-measures_search__results .mdl-measures_list__list',
        pills: '.mdl-filter-pills',
        pillsClearButton: '.mdl-filter-pills button[data-clear]',
        sortButton: '.mdl-measures_search__sort-dropdown',
        sort: '.mdl-measures_search__sort',
        selection: '.mdl-measures_search__selection',
        sortDropdown: '.mdl-measures_search__sort .mdl-context_menu',
        searchWordInput: '.mdl-measures_search__simple .atm-form_input input',
        searchWordInputClear: '.mdl-measures_search__simple .atm-form_input > button',
        advancedSearchButton: '.mdl-measures_search__simple .atm-button',
        wrapper: '[data-measures_search="wrapper"]',
        noResults: '.mdl-measures_search__no-results',
        notification: '.mdl-measures_search__notification',
        hasNoFilters: '[data-measures_search="hasNoFilters"]',
      },
      stateClasses: {
        loading: 'mdl-measures_search--loading',
      },
      filterPillsThreshold: 5,
      loadDelay: 50,
    };

    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [[], [], []]; // policyArea - status - responsibleBody
    this.searchWord = '';
    this.orderBy = this.ui.element.getAttribute('data-order-by');
    this.initUi();
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.dataIdle = true;
    this.dataLoaded = false;
    this.paginationInteraction = false;
    this.maxResultItems = 8;
    this.currentPage = 1;
    this.numberOfResultPages = 1;
    this.allResults = [];
    this.filteredResults = [];
    this.filterHash = this.createObjectHash(this.filterLists);
    this.searchWordHash = this.createObjectHash(this.searchWord);
    this.filterHashZero = this.filterHash;
    this.searchWordHashZero = this.searchWordHash;
    this.initEventListeners();
    // deferred filtering from URL params
    this.filterFromUrlParams();
    setTimeout(() => {
      this.filterView(true, true, false, false, true);
    }, 0);

    window.sessionStorage.removeItem('origin');
  }

  static get events() {
    return {
      // eventname: `eventname.${ MeasuresSearch.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.advancedSearchButton.addEventListener('click', () => {
      this.updateDialogSelection();
      this.ui.dialog.dispatchEvent(new CustomEvent('Dialog.open'));
    });

    this.ui.dialogForm.addEventListener('submit', (event) => {
      event.preventDefault();

      this.filterLists = [[], [], []]; // policyArea - status - responsibleBody
      const formData = new FormData(event.target as HTMLFormElement);

      formData.forEach((value, key) => {
        if (key === 'measure-policy-area') {
          this.filterLists[0].push(value);
        } else if (key === 'measure-status') {
          this.filterLists[1].push(value);
        } else if (key === 'measure-responsible-body') {
          this.filterLists[2].push(value);
        }
      });

      this.filterView(true, true, false, false, true);
    });
    // -----------------------------------------------
    // focus first element before print
    window.addEventListener('beforeprint', () => {
      this.ui.searchWordInput.focus();
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
    // Listen to remove event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.removeTag, (event: any) => {
      const value = event.detail.target.getAttribute('data-pill');
      if (value.indexOf('filter:') === 0) {
        const filterValues = value.split(':');
        this.filterLists[filterValues[1]] = this.filterLists[filterValues[1]].filter(
          (e) => e !== filterValues[2]
        );
      } else if (value.indexOf('fullText:') === 0) {
        this.searchWord = '';
        this.ui.searchWordInput.value = '';
        (<HTMLButtonElement>(
          this.ui.sortDropdown.querySelector(
            `button[data-sort="${this.ui.element.getAttribute('data-order-by')}"]`
          )
        )).click();
      }
      this.filterView(false);
    });
    // -----------------------------------------------
    // Listen to clear event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.clearTags, () => {
      this.filterLists = [[], [], []];
      this.searchWord = '';
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

    // EventListener to set session storage
    this.eventDelegate.on('click', `${this.options.domSelectors.results} a`, () => {
      window.sessionStorage.setItem('origin', window.location.href);
    });
  }

  /**
   * Update view in case filters changed
   */
  filterView(
    updateFilterPills = true,
    forced = false,
    resetPaging = true,
    scroll = false,
    replaceState = false
  ) {
    // eslint-disable-line
    const filterHash = this.createObjectHash(this.filterLists);
    const searchWordHash = this.createObjectHash(this.searchWord);
    this.paginationInteraction = false;
    // only reload view if there is a change or forced load
    if (forced || this.filterHash !== filterHash || this.searchWordHash !== searchWordHash) {
      if (updateFilterPills) {
        this.updatePills();
      }
      if (resetPaging) {
        this.ui.paginationInput.value = '1';
      }
      if (!this.dataLoaded) {
        this.loadDatasets(scroll, replaceState);
      } else {
        this.renderDatasets(scroll, replaceState);
      }
      this.filterHash = filterHash;
      this.searchWordHash = searchWordHash;
    }
    this.updateDialogSelection();

    // hide visually hidden text for no filters if any filter is active
    if (
      this.filterHash !== this.filterHashZero ||
      this.searchWordHash !== this.searchWordHashZero
    ) {
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
   * Update checkboxes in advanced search dialog
   */
  updateDialogSelection() {
    Array.from(this.ui.dialogForm.querySelectorAll('.atm-checkbox input')).forEach(
      (checkbox: HTMLInputElement) => {
        checkbox.checked = false;
        this.filterLists.forEach((filterList) => {
          if (filterList.includes(checkbox.value)) {
            checkbox.checked = true;
          }
        });
      }
    );
  }

  /**
   * Update pills to correspond with filter settings
   */
  updatePills() {
    const tags = [];
    // add pills for selected filters
    this.filterLists.forEach((filterList, index) => {
      filterList.forEach((filterValue) => {
        const inputCheckbox: HTMLInputElement = this.ui.filterFormSections[index].querySelector(
          `.atm-checkbox input[value="${filterValue}"]`
        );
        if (inputCheckbox) {
          const tag = {
            text: inputCheckbox.parentNode.querySelector('label').childNodes[0].textContent,
            value: `filter:${index}:${filterValue}`,
          };
          tags.push(tag);
        }
      });
    });
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
    const urlParams: any = getAllURLParams();
    const searchWord = urlParams.fullText ? urlParams.fullText[0] : '';
    const policyArea = urlParams.policyArea ? urlParams.policyArea : [];
    const status = urlParams.status ? urlParams.status : [];
    const responsibleBody = urlParams.responsibleBody ? urlParams.responsibleBody : [];
    const page = urlParams.page ? Number.parseInt(urlParams.page[0], 10) : 1;
    const orderBy = urlParams.orderBy ? urlParams.orderBy[0] : 'code';
    if (page) {
      setTimeout(() => {
        this.ui.pagination.dispatchEvent(
          new CustomEvent(Pagination.events.setPage, { detail: page })
        );
      }, 0);
    }
    this.searchWord = searchWord || '';
    this.filterLists = [
      policyArea !== null ? policyArea.map((item) => decodeURIComponent(item)) : [],
      status !== null ? status.map((item) => (item === null ? '' : decodeURIComponent(item))) : [],
      responsibleBody !== null ? responsibleBody.map((item) => decodeURIComponent(item)) : [],
    ];
    // update control modules with the gathered parameters
    if (searchWord && this.searchWord.length > 0) {
      this.ui.searchWordInput.value = this.searchWord;
      this.ui.searchWordInput.classList.add('dirty');
    }
    if (orderBy && orderBy.length > 0) {
      const orderByLabel = this.ui.sortDropdown.querySelector(
        `li > button[data-sort="${orderBy}"] span`
      ).innerHTML;
      this.ui.sortButton.querySelector('span').innerHTML = orderByLabel;
      this.orderBy = orderBy;
    }
  }

  /**
   * Fetch teaser data
   * @param callback
   */
  async fetchData(callback: Function) {
    // add Loading class
    this.ui.wrapper.classList.add(this.options.stateClasses.loading);
    this.currentUrl = this.constructUrl();

    return fetch(this.currentUrl)
      .then((response) => {
        // eslint-disable-next-line no-magic-numbers
        if (response.status !== 200 && response.status !== 204) {
          throw new Error('Error fetching resource!');
        }
        return response.status === 204 ? {} : response.json(); // eslint-disable-line
      })
      .then((response) => {
        if (response) {
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
   * Load measure datasets
   */
  private loadDatasets(scroll = false, replaceState = false) {
    if (this.dataIdle) {
      this.dataIdle = false;
      this.fetchData((jsonData) => {
        if (jsonData.error) {
          this.ui.notification.classList.remove('hidden');
          this.ui.noResults.classList.remove('visible');
          this.ui.paginationWrapper.classList.add('hidden');
          this.ui.selection.classList.add('hidden');
          this.ui.sort.classList.add('hidden');
          this.ui.results.classList.add('hidden');
          this.dataIdle = true;
          return;
        }
        this.parseDatasets(jsonData);
        this.renderDatasets(scroll, replaceState);
        this.dataIdle = true;
        this.dataLoaded = true;
      });
    }
  }

  /**
   * Convert measure datasets
   * @param item object
   * @param statusObj object
   * @return converted item object
   */
  private convertMeasureDataset(item, statusObj) {
    const converted = {
      ...item,
      withStatus: !!statusObj,
      status: undefined,
    };
    if (statusObj) {
      converted.status = {
        modifier: statusObj.modifier,
        text: statusObj.title,
        icon: statusObj.icon,
      };
    }
    converted.responsibleBodies = item.responsibleBodies.join(', ');
    return converted;
  }

  /**
   * Parse measure list items
   * @param jsonData
   */
  private parseDatasets(jsonData) {
    if (jsonData.measures && jsonData.measures.length) {
      this.allResults = [];
      jsonData.measures.forEach((item) => {
        const statusObj = jsonData.status.filter((status) => status.id === item.statusId)[0];
        const statusText = statusObj ? statusObj.title : '';
        this.allResults.push({
          title: item.title,
          code: item.id,
          status: statusText,
          policyArea: item.policyArea,
          responsibleBodies: item.responsibleBodies,
          html: this.teaserItemFromTemplate(
            this.ui.teaserTemplate.innerHTML,
            this.convertMeasureDataset(item, statusObj)
          ),
        });
      });
    }
  }

  /**
   * Apply filters
   */
  private applyFilters() {
    // full text search for title
    if (this.searchWord) {
      this.filteredResults = this.allResults.filter((result) =>
        result.title.toLocaleLowerCase().includes(this.searchWord.toLocaleLowerCase())
      );
    } else {
      this.filteredResults = this.allResults;
    }

    // policy area
    if (this.filterLists[0].length > 0) {
      this.filteredResults = this.filteredResults.filter((result) =>
        this.filterLists[0].includes(result.policyArea)
      );
    }

    // status
    if (this.filterLists[1].length > 0) {
      this.filteredResults = this.filteredResults.filter((result) =>
        this.filterLists[1].includes(result.status)
      );
    }

    // responsible body
    if (this.filterLists[2].length > 0) {
      this.filteredResults = this.filteredResults.filter((result) =>
        result.responsibleBodies.some(
          (el) =>
            this.filterLists[2].findIndex(
              (filterValue) => el.toLocaleLowerCase() === filterValue.toLocaleLowerCase()
            ) !== -1
        )
      );
    }
  }

  /**
   * Apply sort order
   */
  private applySortOrder() {
    const sortByCategory = (a, b) => {
      const aCat = a ? a.toLocaleLowerCase() : '';
      const bCat = b ? b.toLocaleLowerCase() : '';
      if (aCat < bCat) {
        return -1;
      }
      if (aCat > bCat) {
        return 1;
      }
      return 0;
    };

    if (this.orderBy === 'status') {
      this.filteredResults.sort((a, b) => sortByCategory(a.status, b.status));
    } else if (this.orderBy === 'responsibleBodies') {
      this.filteredResults.sort((a, b) =>
        sortByCategory(a.responsibleBodies[0], b.responsibleBodies[0])
      );
    } else {
      // order by code/Nummer
      this.filteredResults.sort((a, b) => {
        const aNumber = parseInt(a.code, 10);
        const bNumber = parseInt(b.code, 10);

        if (aNumber === bNumber) {
          return a.code.localeCompare(b.code);
        }

        return aNumber - bNumber;
      });
    }
  }

  /**
   * Apply pagination
   */
  private applyPagination() {
    const urlParams: any = getAllURLParams();
    this.currentPage = urlParams.page ? Number.parseInt(urlParams.page[0], 10) : 1;
    const start = (this.currentPage - 1) * this.maxResultItems;
    this.filteredResults = this.filteredResults.slice(start, start + this.maxResultItems);
  }

  /**
   * Render measure list items
   * @param scroll boolean
   * @param replaceState boolean
   */
  private renderDatasets(scroll = false, replaceState = false) {
    this.ui.selection.classList.remove('hidden');
    this.ui.sort.classList.remove('hidden');
    this.ui.results.classList.remove('hidden');

    this.applyFilters();
    if (this.filteredResults.length > this.maxResultItems) {
      this.ui.paginationWrapper.classList.remove('hidden');
      this.numberOfResultPages = Math.ceil(this.filteredResults.length / this.maxResultItems);
    } else {
      this.ui.paginationWrapper.classList.add('hidden');
      this.numberOfResultPages = 1;
    }
    // update canonical href
    this.currentUrl = this.constructUrl();
    this.ui.pagination.dispatchEvent(
      new CustomEvent(Pagination.events.setPageCount, { detail: this.numberOfResultPages })
    );
    const canonicalUrl = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1]}`;
    let prevUrl = '';
    if (parseInt(this.ui.paginationInput.value, 10) > 1) {
      prevUrl = `${this.getBaseUrl()}?${this.currentUrl
        .split('?')[1]
        .replace(
          /page=(0|[1-9][0-9]*)/,
          `page=${parseInt(this.ui.paginationInput.value, 10) - 1}`
        )}`;
    }
    let nextUrl = '';
    if (parseInt(this.ui.paginationInput.value, 10) < this.numberOfResultPages) {
      nextUrl = `${this.getBaseUrl()}?${this.currentUrl
        .split('?')[1]
        .replace(
          /page=(0|[1-9][0-9]*)/,
          `page=${parseInt(this.ui.paginationInput.value, 10) + 1}`
        )}`;
    }
    this.ui.pagination.dispatchEvent(
      new CustomEvent(Pagination.events.setCanonicalUrls, {
        detail: { prev: prevUrl, next: nextUrl },
      })
    );
    // update canonical links
    this.upsertLinkRel('prev', prevUrl);
    this.upsertLinkRel('next', nextUrl);
    this.upsertLinkRel('canonical', canonicalUrl);

    const urlParams: any = getAllURLParams();
    const wcmmode = urlParams.wcmmode ? urlParams.wcmmode[0] : null;
    // eslint-disable-next-line no-magic-numbers
    const canonical = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1]}${
      wcmmode ? '&wcmmode=' + wcmmode : ''
    }`;
    if (replaceState) {
      history.replaceState({ url: canonical }, null, canonical); // eslint-disable-line
    } else {
      history.pushState({ url: canonical }, null, canonical); // eslint-disable-line
    }

    this.applySortOrder();
    this.applyPagination();
    this.ui.list.innerHTML = '';
    if (this.filteredResults.length === 0) {
      this.ui.noResults.classList.add('visible');
    } else {
      this.ui.noResults.classList.remove('visible');

      this.filteredResults.forEach((item) => {
        const element = document.createElement('li');
        element.classList.add('mdl-measures_list__item');
        element.innerHTML = item.html;
        this.ui.list.appendChild(element);
      });
    }
    this.updateFlyingFocus(this.options.loadDelay);

    if (
      [].slice.call(this.ui.pills.querySelectorAll('[data-pill]')).length >=
      this.options.filterPillsThreshold
    ) {
      this.ui.pillsClearButton.classList.remove('hidden');
    } else {
      this.ui.pillsClearButton.classList.add('hidden');
    }
    this.updateFlyingFocus(0);
    if (scroll) {
      this.scrollTop();
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
    const compiled = template(teaserTemplate); // eslint-disable-line
    let dataset = compiled(props);
    if (props.link) {
      dataset = `<a href="${props.link}">${dataset}</a>`;
    }
    return dataset;
  }

  /**
   * Assemble URL from base url and filters
   */
  private constructUrl() {
    let resultUrl = this.dataUrl;
    const append = (key, value) => {
      resultUrl += resultUrl === this.dataUrl ? '?' : '&';
      resultUrl += `${key}=`;
      if (value) {
        resultUrl += encodeURIComponent(value);
      }
    };
    this.filterLists[0].forEach((policyArea) => {
      append('policyArea', policyArea);
    });
    this.filterLists[1].forEach((status) => {
      append('status', status);
    });
    this.filterLists[2].forEach((responsibleBody) => {
      append('responsibleBody', responsibleBody);
    });
    append('fullText', this.searchWord);
    append('page', this.ui.paginationInput.value);
    append('orderBy', this.orderBy);

    return resultUrl;
  }
}

export default MeasuresSearch;
