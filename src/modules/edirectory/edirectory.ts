/*!
 * Edirectory
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { cause, derive, effect } from '../../assets/js/helpers/causeEffect';
import Modal from '../modal/modal';
import Pagination from '../pagination/pagination';

export type OrganisationType = 'group' | 'authority';
export type MemberRole = 'leader' | 'member' | 'companyRepresentative';

export type NodeLink = {
  type: OrganisationType;
  id: string;
  title: string;
};

export type MemberData = {
  order: number;
  category: string;
  firstName: string;
  lastName: string;
  role: MemberRole;
  jobTitle?: string;
  email?: string;
  phone?: string;
  website?: string;
};

export type OrganisationData = {
  type: OrganisationType;
  id: string;
  order: number;
  title: string;
  phone?: string;
  email?: string;
  website?: string;
  leaders?: MemberData[];
  members?: MemberData[];
  organisations: OrganisationData[];
  breadcrumbs?: NodeLink[];
  searchable?: string;
};

export type TreeData = {
  rootOrganisations: OrganisationData[];
};

type ResultData = {
  id: string;
  title: string;
  leaders: string;
  breadcrumbs: string;
};

const ROLE_LEADER = 'leader';
const ROLE_REPRESENTATIVE = 'companyRepresentative';
const MAX_RESULTS_PER_PAGE = 10;
const FILTERABLE_THRESHOLD = 40;

class Edirectory extends Module {
  public ui: {
    element: HTMLDivElement;
    form: HTMLFormElement;
    query: HTMLInputElement;
    clear: HTMLButtonElement;
    search: HTMLButtonElement;
    error: HTMLDivElement;
    dismiss: HTMLButtonElement;
    results: HTMLDivElement;
    resultsCount: HTMLSpanElement;
    resultsTable: HTMLDivElement;
    resultsPagination: HTMLDivElement;
    noResult: HTMLDivElement;
    noResultsClear: HTMLAnchorElement;
    modal: HTMLDivElement;
    toc: HTMLDivElement;
  };
  public dataUrl: string;
  public treeData: TreeData;
  public idMap = new Map<string, OrganisationData>();
  public authorityId: () => string;
  public setAuthorityId: (id: string) => void; // eslint-disable-line no-unused-vars
  public authorityData: () => OrganisationData;
  public searchResults: () => ResultData[];
  public setSearchResults: (v: ResultData[]) => void; // eslint-disable-line no-unused-vars
  public paginationPage: () => number;
  public setPaginationPage: (v: number) => void; // eslint-disable-line no-unused-vars

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        form: '.mdl-edirectory__form',
        query: '[name="query"]',
        clear: '[data-edirectory-clear]',
        search: '[data-edirectory-search]',
        error: '[data-edirectory-error]',
        dismiss: '[data-edirectory-dismiss]',
        results: '[data-edirectory-results]',
        resultsCount: '[data-edirectory-results] h3 span',
        resultsTable: '[data-edirectory-results] .mdl-table',
        resultsPagination: '[data-edirectory-results] .mdl-pagination',
        noResult: '[data-edirectory-no-results]',
        noResultsClear: '[data-edirectory-no-results] .atm-button',
        modal: '.mdl-modal',
        toc: '.mdl-toc-list',
      },
      stateClasses: {
        loading: 'mdl-edirectory__form--loading',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.loadData();

    this.initUi();
    this.initEventListeners();
  }

  async loadData() {
    this.ui.form.classList.add(this.options.stateClasses.loading);

    const isLeaderOrRepresentative = (member: MemberData) =>
      member.role === ROLE_LEADER || member.role === ROLE_REPRESENTATIVE;

    const includeInBreadcrumbs = (node: OrganisationData) =>
      node.type === 'authority' ||
      node.organisations.length > FILTERABLE_THRESHOLD ||
      !node.breadcrumbs;

    const walkNode = (node: OrganisationData, parent?: OrganisationData) => {
      const searchable = [node.title];
      if (parent) {
        node.breadcrumbs = includeInBreadcrumbs(parent)
          ? [
              ...(parent.breadcrumbs || []),
              {
                type: parent.type,
                id: parent.id,
                title: parent.title,
              },
            ]
          : parent.breadcrumbs;
      }
      if (node.members) {
        node.leaders = node.members
          .filter(isLeaderOrRepresentative)
          .sort((a: MemberData, b: MemberData) => a.order - b.order);
        node.leaders.forEach((leader) => searchable.push(`${leader.firstName} ${leader.lastName}`));
        node.members = node.members
          .filter((member) => !isLeaderOrRepresentative(member))
          .sort((a: MemberData, b: MemberData) => a.order - b.order);
      }
      if (node.organisations) {
        node.organisations.sort((a: OrganisationData, b: OrganisationData) => a.order - b.order);
      }
      node.searchable = searchable.join(' ').toLocaleLowerCase();
      this.idMap.set(node.id, node);
      if (node.organisations) {
        node.organisations.forEach((child) => walkNode(child, node));
      }
    };

    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        this.ui.error.classList.remove('hidden');
        console.error(`HTTP error! status: ${response.status}`);
      }
      this.treeData = await response.json();
      this.treeData.rootOrganisations.forEach((org) => walkNode(org));

      // Signals
      [this.authorityId, this.setAuthorityId] = cause('');
      this.authorityData = derive(() => this.idMap.get(this.authorityId()));
      [this.searchResults, this.setSearchResults] = cause([]);
      [this.paginationPage, this.setPaginationPage] = cause(1);

      // Effect to open modal on authority selection
      effect(() => {
        const authorityId = this.authorityId();
        window.location.hash = authorityId ? `#${authorityId}` : '';
        if (!authorityId) return;
        this.ui.modal.dispatchEvent(
          new CustomEvent('Modal.open', {
            detail: this.authorityData,
          })
        );
      });

      // Effect to update search results count and pagination
      effect(() => {
        const results = this.searchResults();
        if (!results.length) return;
        this.ui.resultsCount.textContent = String(results.length);
        this.setPaginationPage(1);
        this.ui.resultsPagination.dispatchEvent(
          new CustomEvent(Pagination.events.setPage, {
            detail: 1,
          })
        );
        const pageCount = Math.ceil(results.length / MAX_RESULTS_PER_PAGE);
        if (pageCount > 1) {
          this.ui.resultsPagination.dispatchEvent(
            new CustomEvent(Pagination.events.setPageCount, {
              detail: pageCount,
            })
          );
          this.ui.resultsPagination.classList.remove('hidden');
        } else {
          this.ui.resultsPagination.classList.add('hidden');
        }
      });

      // Effect to fill a different slice of results into the table
      effect(() => {
        const page = this.paginationPage();
        const results = this.searchResults().slice(
          (page - 1) * MAX_RESULTS_PER_PAGE,
          page * MAX_RESULTS_PER_PAGE
        );
        if (!results.length) return;
        this.ui.resultsTable.dispatchEvent(
          new CustomEvent('Component.setData', {
            detail: results,
          })
        );
      });

      this.ui.form.classList.remove(this.options.stateClasses.loading);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    const linkClickHandler = (event: MouseEvent) => {
      const el = event.target as HTMLAnchorElement;
      if (el.getAttribute('href')?.startsWith('#')) {
        event.stopPropagation();
        event.preventDefault();
        this.setAuthorityId(el.getAttribute('href').replace('#', ''));
      }
    };

    const showResults = (hasResult: boolean) => {
      this.ui.clear.classList.remove('hidden');
      this.ui.toc.classList.add('hidden');

      if (hasResult) {
        this.ui.results.classList.remove('hidden');
        this.ui.noResult.classList.add('hidden');
      } else {
        this.ui.noResult.classList.remove('hidden');
        this.ui.results.classList.add('hidden');
      }
    };

    const hideResults = () => {
      this.ui.results.classList.add('hidden');
      this.ui.noResult.classList.add('hidden');
      this.ui.clear.classList.add('hidden');
      this.ui.toc.classList.remove('hidden');
    };

    const clearResults = () => {
      this.ui.query.value = '';
      window.location.hash = '';
      hideResults();
    };

    const validateSearchQuery = () => this.ui.query.value.length; // non-empty query

    this.ui.query.addEventListener('input', () => {
      if (validateSearchQuery()) {
        this.ui.clear.classList.remove('hidden');
        this.ui.search.classList.remove('atm-button--disabled');
        this.ui.search.disabled = false;
      } else {
        this.ui.clear.classList.add('hidden');
        this.ui.search.classList.add('atm-button--disabled');
        this.ui.search.disabled = true;
      }
    });

    this.ui.query.addEventListener('keydown', (e) => {
      if (validateSearchQuery() && e.key === 'Enter') {
        this.ui.form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
    this.ui.form.addEventListener('keypress', (event: any) => {
      const active = document.activeElement;
      if (
        event.key === 'Enter' &&
        (active.tagName !== 'BUTTON' || active.hasAttribute('data-edirectory-search'))
      ) {
        event.preventDefault();
        this.ui.search.click();
        return false;
      }
      return true;
    });

    this.ui.clear.addEventListener('click', clearResults);
    this.ui.noResultsClear.addEventListener('click', clearResults);

    this.ui.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Array.from(this.idMap.values())
        .filter((node) => node.searchable.includes(this.ui.query.value.toLowerCase() || ''))
        .map((org: OrganisationData) => ({
          id: org.id,
          title: org.title,
          ariaControls: this.ui.modal.id,
          leaders: (org.leaders ?? [])
            .map((member: MemberData) => `${member.firstName} ${member.lastName}`)
            .join(' '),
          breadcrumbs: (org.breadcrumbs ?? [])
            .map((breadcrumb: NodeLink) => breadcrumb.title)
            .join(' ‣ '),
        }))
        .sort((a: ResultData, b: ResultData) =>
          a.title.localeCompare(b.title, 'de-CH', { sensitivity: 'accent' })
        );

      this.setSearchResults(results);
      showResults(results.length > 0);
    });

    this.ui.dismiss.addEventListener('click', () => {
      this.ui.error.classList.add('hidden');
    });

    this.ui.resultsPagination.addEventListener(Pagination.events.change, (e: CustomEvent) => {
      this.setPaginationPage(parseInt(e.detail.after, 10) || 1);
      this.ui.resultsPagination.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
    });

    this.ui.modal.addEventListener('click', linkClickHandler);
    this.ui.element.addEventListener('click', linkClickHandler);

    window.addEventListener(Modal.events.closed, () => {
      this.setAuthorityId(null);
    });

    window.onhashchange = () => {
      const newId = decodeURI(window.location.hash).split('#')[1];

      if (newId && this.idMap.get(newId)) {
        this.setAuthorityId(newId);
      }
    };
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
    this.treeData = { rootOrganisations: [] };
    window.onhashchange = null;
  }
}

export default Edirectory;
