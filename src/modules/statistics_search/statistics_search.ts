/*!
 * StatisticsSearch
 *
 * @author
 * @copyright
 */
import template from 'lodash/template';
import Module from '../../assets/js/helpers/module';
import FilterPills from '../filter_pills/filter_pills';
import Pagination from '../pagination/pagination';
import { StatisticsDetailPage } from './statistics_search.types';
import Autosuggest from '../../assets/js/helpers/autosuggest';

class StatisticsSearch extends Module {
  public ui: {
    element: HTMLDivElement;
    teaserTemplate: HTMLDivElement;
    pagination: HTMLDivElement;
    filter: HTMLDivElement;
    filterControls: HTMLDivElement;
    dialog: HTMLDivElement;
    dialogForm: HTMLFormElement;
    filterFormContent: HTMLDivElement;
    paginationWrapper: HTMLDivElement;
    paginationInput: HTMLInputElement;
    teaserList: HTMLDivElement;
    autosuggestTemplate: HTMLDivElement;
    autosuggest: HTMLDivElement;
    pills: HTMLDivElement;
    pillsClearButton: HTMLButtonElement;
    results: HTMLDivElement;
    selection: HTMLDivElement;
    searchWordInput: HTMLInputElement;
    searchWordInputClear: HTMLButtonElement;
    advancedSearchButton: HTMLButtonElement;
    wrapper: HTMLDivElement;
    resultCell: HTMLDivElement;
    noResults: HTMLParagraphElement;
    noResultsResetButton: HTMLButtonElement;
    notification: HTMLDivElement;
    hasNoFilters: HTMLParagraphElement;
  };

  public options: {
    domSelectors: { [element: string]: string };
    stateClasses: { [element: string]: string };
    filterPillsThreshold: number;
    loadDelay: number;
  };

  private dataUrl: string;
  private dataIdle: boolean;
  private dataLoaded: boolean;
  private filterTags: Set<string>;
  private forcedFilters: Set<string>;
  private filterHash: number;
  private filterHashZero: number;
  private currentUrl: string;
  private currentPage: number;
  private paginationInteraction: boolean;
  private maxResultItems: number;
  private numberOfResultPages: number;
  private allResults: StatisticsDetailPage[];
  private filteredResults: StatisticsDetailPage[];
  constructor($element: HTMLDivElement, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        dialog: '.mdl-dialog',
        dialogForm: '.mdl-dialog__form',
        filterFormContent: '.mdl-dialog__content',
        filterControls: '.mdl-statistics_search__controls',
        teaserTemplate: '[data-statisticTeaser-template]',
        paginationWrapper: '.mdl-statistics_search__pagination',
        autosuggestTemplate: '[data-statistics="autosuggestTemplate"]',
        autosuggest: '[data-statistics="autosuggest"]',
        pagination: '.mdl-pagination',
        paginationInput: '.mdl-pagination input',
        results: '.mdl-statistics_search__results',
        teaserList: '.mdl-statistics_search__results .mdl-statistics_teaser__list',
        pills: '.mdl-filter-pills',
        pillsClearButton: '.mdl-filter-pills button[data-clear]',
        selection: '.mdl-statistics_search__selection',
        searchWordInput: '.mdl-statistics_search__simple .atm-form_input input',
        searchWordInputClear: '.mdl-statistics_search__simple .atm-form_input > button',
        advancedSearchButton: '.mdl-statistics_search__simple .atm-button',
        wrapper: '[data-statistics_search="wrapper"]',
        resultCell: '.mdl-statistics_search__result-cell',
        noResults: '.mdl-statistics_search__no-results',
        noResultsResetButton: '.mdl-statistics_search__no-results .atm-button',
        notification: '.mdl-statistics_search__notification',
        hasNoFilters: '[data-statistics_search="hasNoFilters"]',
      },
      stateClasses: {
        loading: 'mdl-statistics_search--loading',
      },
      filterPillsThreshold: 5,
      loadDelay: 50,
    };

    super($element, defaultData, defaultOptions, data, options);

    const autosuggestList = (
      [...this.ui.dialogForm.querySelectorAll('.atm-checkbox')] as HTMLInputElement[]
    ).flatMap((checkbox) => {
      const label = checkbox.querySelector('label').innerText;
      const synonymsString = checkbox.querySelector('input').dataset.synonyms;
      const synonyms = synonymsString ? JSON.parse(synonymsString.replace(/'/g, '"')) : [];
      synonyms.push(label); // add label as synonym to make it searchable
      return synonyms.map((synonym: string) => ({
        title: synonym === label ? synonym : `${synonym} (${label})`,
        value: checkbox.querySelector('input').value,
      }));
    });

    new Autosuggest(
      {
        input: this.ui.searchWordInput,
        target: this.ui.autosuggest,
        parent: this.ui.element,
        template: this.ui.autosuggestTemplate.innerHTML,
        renderAsButton: true,
        autoHide: true,
        preventEnter: true,
        maxResults: 8,
        searchTermFirst: true,
      },
      autosuggestList
    );

    // hack to move the autosuggest element to be part of the search input
    this.ui.searchWordInput.parentNode.appendChild(this.ui.autosuggest);
    // hack to move the pagination element to be part of the teaser list
    this.ui.element.querySelector('.mdl-statistics_teaser').appendChild(this.ui.paginationWrapper);

    this.filterTags = new Set<string>();
    this.initUi();
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.dataIdle = true;
    this.dataLoaded = false;
    this.paginationInteraction = false;
    this.maxResultItems = 9; // (per page)
    this.currentPage = 1;
    this.numberOfResultPages = 1;
    this.allResults = [];
    this.filteredResults = [];
    this.filterHash = this.createObjectHash([...this.filterTags]);
    this.filterHashZero = this.filterHash;
    this.initEventListeners();
    // deferred filtering from URL params

    // turn sections in dialog into two columns if applicable
    this.ui.filterFormContent
      .querySelectorAll('.form__section')
      .forEach((item: HTMLFieldSetElement) => {
        if (item.querySelectorAll('.form__group').length > 1) {
          item.classList.add('form__section--two-columns');
        }
      });

    this.filterFromUrlParams();
    this.setForcedFilters();
    setTimeout(() => {
      this.filterView(true, true, false, false, true);
    }, 0);

    window.sessionStorage.removeItem('origin');
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.searchWordInput.addEventListener('keydown', (event: KeyboardEvent) => {
      // prevent scroll down from search input
      if (event.code === 'ArrowDown') {
        event.preventDefault();

        // intercept enter key in search input
      } else if (event.code === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        this.updateFlyingFocus(0);
        return false;

        // intercept esc key in search input
      } else if (event.code === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.clearInput();
        return false;
      }
      return true;
    });

    this.ui.searchWordInputClear.addEventListener('click', () => {
      this.clearInput();
    });

    this.ui.advancedSearchButton.addEventListener('click', () => {
      this.updateDialogSelection();
      this.clearInput(false);
      this.ui.dialog.dispatchEvent(new CustomEvent('Dialog.open'));
    });

    this.ui.dialogForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.setFiltersFromDialog();
      this.filterView(true, true, false, false, true);
    });

    // focus first element before print
    window.addEventListener('beforeprint', () => {
      this.ui.searchWordInput.focus();
    });

    // Autosuggest Do something when a filter is selected
    this.ui.element.addEventListener(Autosuggest.events.termSelected, (event: CustomEvent) => {
      this.filterTags.add(event.detail);
      this.ui.searchWordInput.value = '';
      this.ui.searchWordInput.focus();
      this.updateFlyingFocus(0);
      this.filterView();
    });

    // Listen to pagination change event
    this.ui.pagination.addEventListener(Pagination.events.change, () => {
      this.filterView(false, true, false, this.paginationInteraction);
    });
    this.ui.pagination.addEventListener(Pagination.events.interaction, () => {
      this.paginationInteraction = true;
    });

    // Listen to remove event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.removeTag, (event: CustomEvent) => {
      this.log('FilterPills.events.removeTag');
      const value = event.detail.target.getAttribute('data-pill');
      if (value.startsWith('filter>')) {
        const filterValues = value.split('>')[1];
        this.filterTags = new Set([...this.filterTags].filter((e) => e !== filterValues));
      } else if (value.startsWith('fullText>')) {
        this.ui.searchWordInput.value = '';
      }
      this.filterView(false);
    });

    // Listen to clear event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.clearTags, () => this.resetFilters());

    // Listen to reset button click event
    this.ui.noResultsResetButton.addEventListener('click', () => this.resetFilters());

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
    const filterHash = this.createObjectHash([...this.filterTags]);
    this.paginationInteraction = false;
    // only reload view if there is a change or forced load
    this.log(
      'updateFilterPills',
      updateFilterPills,
      'forced',
      forced,
      'resetPaging',
      resetPaging,
      'scroll',
      scroll,
      'replaceState',
      replaceState
    );
    if (forced || this.filterHash !== filterHash) {
      if (updateFilterPills) {
        this.updatePills();
      }
      if (resetPaging) {
        this.ui.paginationInput.value = '1';
      }
      if (!this.dataLoaded) {
        this.loadStatisticsCards(scroll, replaceState);
      } else {
        this.renderStatisticsCards(scroll, replaceState);
      }
      this.filterHash = filterHash;

      // clear button?
      if ([...this.filterTags].length >= this.options.filterPillsThreshold) {
        this.ui.pillsClearButton.classList.remove('hidden');
      } else {
        this.ui.pillsClearButton.classList.add('hidden');
      }
    }
    this.updateDialogSelection();

    // hide visually hidden text for no filters if any filter is active
    if (this.filterHash !== this.filterHashZero) {
      this.ui.hasNoFilters.setAttribute('aria-hidden', 'true');
      this.ui.filterControls.style.display = 'flex';
    } else {
      this.ui.hasNoFilters.setAttribute('aria-hidden', 'false');
      this.ui.filterControls.style.display = 'none';
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }

  /**
   * Update checkboxes in advanced search dialog
   */
  updateDialogSelection() {
    [...this.ui.dialogForm.querySelectorAll('.atm-checkbox input')].forEach(
      (checkbox: HTMLInputElement) => {
        checkbox.checked = false;
        [...this.filterTags].forEach((filterTag) => {
          if (filterTag === checkbox.value) {
            checkbox.checked = true;
          }
        });
      }
    );
  }

  /**
   * Check which checkboxes are selected in advanced search dialog and set in filterTags
   */
  setFiltersFromDialog() {
    const selectedValues = [...this.ui.dialogForm.querySelectorAll('input[type="checkbox"]')]
      .filter((checkbox: HTMLInputElement) => checkbox.checked)
      .map((checkbox: HTMLInputElement) => checkbox.value);
    this.filterTags = new Set(selectedValues);
  }

  setForcedFilters() {
    const forcedFilters = [...this.ui.dialogForm.querySelectorAll('input[type="checkbox"]')]
      .filter((checkbox: HTMLInputElement) => checkbox.checked)
      .filter((checkbox: HTMLInputElement) => checkbox.disabled)
      .map((checkbox: HTMLInputElement) => checkbox.value);
    this.forcedFilters = new Set(forcedFilters);
  }

  /**
   * Update pills to correspond with filter settings
   */
  updatePills() {
    const tags = [];
    // add pills for selected filters
    this.filterTags.forEach((filterValue) => {
      const inputCheckbox: HTMLInputElement = this.ui.dialogForm.querySelector(
        `.atm-checkbox input[value="${filterValue}"]`
      );
      if (inputCheckbox) {
        const tag = {
          text: inputCheckbox.parentNode.querySelector('label').childNodes[0].textContent,
          value: `filter>${filterValue}`,
          disabled: inputCheckbox.disabled,
        };
        tags.push(tag);
      }
    });

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
    const urlParams = new URLSearchParams(window.location.search);

    const page = urlParams.get('page') || 1;

    // if there are tags in url get them, if not see if checkboxes are preselected
    if (urlParams.has('tag')) {
      this.filterTags = new Set(urlParams.getAll('tag'));
    } else {
      this.setFiltersFromDialog();
    }

    this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setPage, { detail: page }));
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
        // eslint-disable-next-line
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
        this.ui.notification.classList.remove('hidden');
        this.ui.wrapper.classList.remove(this.options.stateClasses.loading);
        callback({ error: err });
      });
  }

  /**
   * Load statisticCards
   */
  private loadStatisticsCards(scroll = false, replaceState = false) {
    if (this.dataIdle) {
      this.dataIdle = false;
      this.fetchData((jsonData) => {
        if (jsonData.statistics && jsonData.statistics.length) {
          this.allResults = jsonData.statistics;
          this.renderStatisticsCards(scroll, replaceState);
          this.dataIdle = true;
          this.dataLoaded = true;
        } else {
          this.ui.notification.classList.remove('hidden');
          this.ui.noResults.classList.remove('visible');
          this.ui.paginationWrapper.classList.add('hidden');
          this.ui.selection.classList.add('hidden');
          this.ui.results.classList.add('hidden');
          this.dataIdle = true;
        }
      });
    }
  }

  /**
   * Apply filters
   */
  private applyFilters() {
    this.clearInput(false);

    // full text search for title
    this.filteredResults = this.allResults;

    if (this.filterTags.size > 0) {
      // Filterkriterien innerhalb der Hauptkategorie mit einem ODER (inclusive) verknüpfen.
      // Filterkriterien zwischen den verschiedenen Hauptkategorien mit einem UND verknüpfen.
      // tag -> namespace:catalog/maincategory/group/filter

      // turn ['a: 1', 'a: 2', 'a: 3'] into { a: [ '1', '2', '3' ] }
      const filterTagsGrouped = [...this.filterTags].reduce((acc, cur) => {
        const [...rawcriterion] = cur.split('/');
        const filter = rawcriterion.pop();
        const criterion = `${rawcriterion.pop()}/${filter}`;
        const category = rawcriterion.join('/');
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(criterion);
        return acc;
      }, {});

      const results = this.filteredResults.filter((item) =>
        Object.keys(filterTagsGrouped).every((category) =>
          filterTagsGrouped[category] // ANDs
            .some((criterion) => item.tags?.includes(`${category}/${criterion}`))
        )
      ); // ORs

      this.filteredResults = results;
    }
  }

  /**
   * Reset filters
   */
  private resetFilters() {
    this.log('resetFilters');
    this.ui.searchWordInput.value = '';
    this.filterTags = new Set(this.forcedFilters);
    setTimeout(() => {
      this.filterView();
    }, 0);
  }

  /**
   * Apply pagination
   */
  private applyPagination() {
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = Number(urlParams.get('page')) || 1;
    const start = (this.currentPage - 1) * this.maxResultItems;
    this.filteredResults = this.filteredResults.slice(start, start + this.maxResultItems);
  }

  /**
   * Render statistic list items
   * @param scroll boolean
   * @param replaceState boolean
   */
  private renderStatisticsCards(scroll = false, replaceState = false) {
    this.ui.selection.classList.remove('hidden');
    this.ui.results.classList.remove('hidden');

    this.applyFilters();
    if (this.filteredResults.length > this.maxResultItems) {
      this.ui.paginationWrapper.classList.remove('hidden');
      this.numberOfResultPages = Math.ceil(this.filteredResults.length / this.maxResultItems);
    } else {
      this.ui.paginationWrapper.classList.add('hidden');
      this.numberOfResultPages = 1;
    }

    if (this.filteredResults.length > 0) {
      this.ui.resultCell.classList.add('small-offset-2', 'small-10');
    } else {
      this.ui.resultCell.classList.remove('small-offset-2', 'small-10');
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

    const urlParams = new URLSearchParams(window.location.search);
    const wcmmode = urlParams.get('wcmmode');
    const canonical = `${this.getBaseUrl()}?${this.currentUrl.split('?')[1]}${
      wcmmode ? `&wcmmode=${wcmmode}` : ''
    }`;
    if (replaceState) {
      window.history.replaceState({ url: canonical }, null, canonical);
    } else {
      window.history.pushState({ url: canonical }, null, canonical);
    }

    this.applyPagination();
    this.ui.teaserList.innerHTML = '';

    if (this.filteredResults.length === 0) {
      this.ui.noResults.classList.add('visible');
    } else {
      this.ui.noResults.classList.remove('visible');

      this.filteredResults.forEach((item) => {
        const element = document.createElement('li');
        element.classList.add('mdl-statistics_teaser__item');
        const teaserItem = this.teaserItemFromTemplate(this.ui.teaserTemplate.innerHTML, item);
        element.innerHTML = teaserItem;
        this.ui.teaserList.appendChild(element);
      });

      this.updateFlyingFocus(this.options.loadDelay);

      if (scroll) {
        this.scrollTop();
      }
    }
  }

  /**
   * Clear search word input
   */
  clearInput(focusInput = true) {
    this.ui.searchWordInput.value = '';
    if (focusInput) {
      this.ui.searchWordInput.focus();
      this.updateFlyingFocus(0);
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
    const compiled = template(teaserTemplate);
    const card = compiled({ ...props, headingLevel: 3 });
    return card;
  }

  /**
   * Assemble URL from base url and filters
   */
  private constructUrl() {
    const queryString = new URLSearchParams();
    queryString.append('page', this.ui.paginationInput.value || '1');
    this.filterTags.forEach((filterTag) => queryString.append('tag', filterTag));

    const resultUrl = `${this.dataUrl}?${queryString.toString()}`;
    return resultUrl;
  }
}

export default StatisticsSearch;
