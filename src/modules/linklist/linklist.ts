/*!
 * Linklist
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { cause, effect } from '../../assets/js/helpers/causeEffect';
import type { OrganisationData } from '../edirectory/edirectory';
import Modal from '../modal/modal';
import Pagination from '../pagination/pagination';
import Form from '../../assets/js/helpers/form.class';
import { showElement, hideElement } from '../../assets/js/helpers/common';

const MAX_RESULTS_PER_PAGE = 10;

class Linklist extends Module {
  public ui: {
    element: HTMLElement;
    list: HTMLElement;
    templateListItem: HTMLTemplateElement;
    title: HTMLElement;
    groupList: HTMLElement;
    group: HTMLElement;
    searchForm: HTMLFormElement;
    searchInput: HTMLInputElement;
    searchInputClear: HTMLButtonElement;
    pagination: HTMLDivElement;
    placeholder: HTMLElement;
    placeHolderUndo: HTMLElement;
  };

  public data: {
    isSPA: boolean;
    hasFilter: boolean;
  };

  public results: OrganisationData[];
  public synonymsMap: Map<HTMLElement, string[]>;
  public searchResults: () => OrganisationData[];
  public setSearchResults: (v: OrganisationData[]) => void; // eslint-disable-line no-unused-vars
  public paginationPage: () => number;
  public setPaginationPage: (v: number) => void; // eslint-disable-line no-unused-vars
  public pageCount: () => number;
  public setPageCount: (v: number) => void; // eslint-disable-line no-unused-vars

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      isSPA: false,
      hasFilter: false,
    };
    const defaultOptions = {
      domSelectors: {
        list: '[data-linklist="linklist-list"]',
        templateListItem: '[data-linklist="template-linklist-item"]',
        title: '[data-linklist="title"]',
        groupList: '[data-linklist="group-list"]',
        group: '[data-linklist="group"]',
        searchForm: '[data-linklist="form"]',
        searchInput: '[data-linklist="form"] .atm-form_input__input',
        searchInputClear: '[data-linklist="form"] button[data-buttontype="clear"]',
        pagination: '.mdl-linklist .mdl-pagination',
        placeholder: '[data-linklist-no-results]',
        placeHolderUndo: '[data-linklist-no-results] .atm-button',
      },
      stateClasses: {
        spa: 'mdl-linklist--spa',
        filter: 'mdl-linklist--filter',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.data.isSPA = this.ui.element.classList.contains(this.options.stateClasses.spa);
    this.data.hasFilter = this.ui.element.classList.contains(this.options.stateClasses.filter);
    this.initEventListeners();
  }

  setData(authority: OrganisationData) {
    const { domSelectors } = this.options;
    const { organisations } = authority;

    const cloneGroups = (n: number) => {
      const clone = this.ui.group.cloneNode(true);
      this.ui.groupList.replaceChildren();
      for (let i = 0; i < n; i += 1) {
        this.ui.groupList.appendChild(clone.cloneNode(true));
      }
    };

    const initSearch = (group: HTMLDivElement, orgs: OrganisationData[]) => {
      const searchForm = group.querySelector(domSelectors.searchForm);
      const searchInput = group.querySelector(domSelectors.searchInput);
      const pagination = group.querySelector(domSelectors.pagination);
      const placeholder = group.querySelector(this.options.domSelectors.placeholder);
      const placeholderUndo = group.querySelector(this.options.domSelectors.placeHolderUndo);
      const pageCount = Math.ceil(orgs.length / MAX_RESULTS_PER_PAGE || 1);

      this.results = orgs;
      [this.searchResults, this.setSearchResults] = cause([]);
      [this.paginationPage, this.setPaginationPage] = cause(1);
      [this.pageCount, this.setPageCount] = cause(pageCount);

      if (pageCount > 1) {
        showElement(searchForm);
        showElement(pagination);

        // init form and pagination Module
        new Form(searchInput);
        searchInput.setAttribute('initialized', 'true');
        (<any>window).estatico.helpers.app.initModule('pagination', pagination);
        this.setSearchResults(this.results);
        pagination.addEventListener(Pagination.events.change, (e: CustomEvent) => {
          this.setPaginationPage(parseInt(e.detail.after, 10) || 1);
        });

        searchInput.addEventListener('input', (event) => {
          const searchResults = this.results.filter((org) => {
            return org.title.toLowerCase().includes(event.target.value.toLowerCase().trim() || '');
          });
          const filteredPageCount = Math.ceil(searchResults.length / MAX_RESULTS_PER_PAGE || 1);
          this.setSearchResults(searchResults);
          this.setPageCount(filteredPageCount);

          // reset page to 1
          this.setPaginationPage(1);
          pagination.dispatchEvent(
            new CustomEvent(Pagination.events.setPage, {
              detail: 1,
            })
          );
        });

        placeholderUndo.addEventListener('click', this.resetSearchInput(searchInput));

        effect(() => {
          const currentPage = this.paginationPage();
          const paginatedResult = this.searchResults().slice(
            (currentPage - 1) * MAX_RESULTS_PER_PAGE,
            currentPage * MAX_RESULTS_PER_PAGE
          );

          pagination.dispatchEvent(
            new CustomEvent(Pagination.events.setPageCount, {
              detail: this.pageCount(),
            })
          );

          showElement(pagination, this.pageCount() !== 1);
          showElement(placeholder, paginatedResult.length === 0);

          fillList(group, paginatedResult);
        });
      } else {
        hideElement(searchForm);
        hideElement(pagination);
      }
    };

    const fillList = (group: HTMLDivElement, orgs: OrganisationData[]) => {
      const list = group.querySelector(domSelectors.list);
      list.replaceChildren();
      orgs.forEach((organisation) => {
        const liElement = this.ui.templateListItem.content.cloneNode(true) as HTMLElement;
        (
          liElement.querySelector('.atm-linklist_item') as HTMLAnchorElement
        ).href = `#${organisation.id}`;
        (liElement.querySelector('.atm-linklist_item__text span') as HTMLSpanElement).textContent =
          organisation.title;
        list.appendChild(liElement);
      });
    };

    // Many grouped linklists of sub-organisations
    if (organisations.length && organisations.every((org) => org.type === 'group')) {
      showElement(this.ui.element);
      cloneGroups(organisations.length);
      this.ui.groupList.querySelectorAll(domSelectors.group).forEach((groupNode, index) => {
        groupNode.querySelector(domSelectors.title).textContent = organisations[index].title;
        fillList(groupNode, organisations[index].organisations);
        initSearch(groupNode, organisations);
      });

      // Single linklist of sub-organisations
    } else if (organisations.length) {
      showElement(this.ui.element);
      cloneGroups(1);
      const groupNode = this.ui.groupList.querySelector(domSelectors.group);
      const groupTitle = groupNode.querySelector(domSelectors.title);
      groupTitle.textContent = authority.title;
      groupTitle.classList.add('visuallyhidden');
      fillList(groupNode, organisations);
      initSearch(groupNode, organisations);

      // No sub-organisations
    } else {
      hideElement(this.ui.element);
    }
  }

  financialReportSearchInputHandler(event) {
    const MIN_SEARCH_TERM_LENGTH = 2;
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    let resultCounter = 0;

    if (searchTerm.length < MIN_SEARCH_TERM_LENGTH) {
      for (const [element] of this.synonymsMap) {
        showElement(element);
      }
      hideElement(this.ui.placeholder);
      return;
    }

    for (const [element, synonyms] of this.synonymsMap) {
      const matches = synonyms.some((synonym) => synonym.includes(searchTerm));
      if (matches) resultCounter += 1;
      showElement(element, matches);
    }

    showElement(this.ui.placeholder, resultCounter === 0);
  }

  resetSearchInput(input: HTMLInputElement) {
    return () => {
      input.value = '';
      input.dispatchEvent(new CustomEvent('input', { bubbles: true }));
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    if (this.data.hasFilter && this.data.isSPA) {
      this.eventDelegate.on(Modal.events.setData, (event) => {
        this.setData(event.detail);
      });
    }

    if (this.data.hasFilter && !this.data.isSPA) {
      this.synonymsMap = new Map();
      this.ui.element
        .querySelectorAll('.mdl-linklist__item')
        .forEach((linkListItem: HTMLElement) => {
          const synonyms = JSON.parse(linkListItem.dataset.synonyms.replace(/'/g, '"')).map(
            (synonym: string) => synonym.toLowerCase().trim()
          );
          synonyms.push(linkListItem.dataset.pageTitle.toLowerCase());
          synonyms.push(linkListItem.textContent.toLowerCase().trim());
          this.synonymsMap.set(linkListItem, synonyms);
        });
      this.ui.searchInput.addEventListener(
        'input',
        this.financialReportSearchInputHandler.bind(this)
      );
      this.ui.placeHolderUndo.addEventListener('click', this.resetSearchInput(this.ui.searchInput));
      this.ui.searchInputClear.addEventListener(
        'click',
        this.resetSearchInput(this.ui.searchInput)
      );
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }
}

export default Linklist;
