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

export type ServiceData = {
  id: string;
  order: number;
  title: string;
  teaserText: string;
  metadata: {
    relevantChannel?: string;
    electronicAddress?: string;
    inputFileFormats?: string;
    attachmentFileFormats?: string;
  };
  serviceUrl?: string;
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
  services?: ServiceData[];
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

// eslint-disable-next-line no-unused-vars
type InsertableContent = string | Element | Element[] | ((el: Element) => void);

const ROLE_LEADER = 'leader';
const ROLE_REPRESENTATIVE = 'companyRepresentative';
const ORG_TYPE_GROUP = 'group';
const ORG_TYPE_AUTHORITY = 'authority';
const MAX_RESULTS_PER_PAGE = 10;
const MAX_ORG_CHILDREN = 20;
const FILTERABLE_THRESHOLD = 40;
const HIDDEN_CLASS = 'hidden';
const DISABLED_CLASS = 'atm-button--disabled';

class Edirectory extends Module {
  public ui: {
    element: HTMLDivElement;
    form: HTMLFormElement;
    query: HTMLInputElement;
    clear: HTMLButtonElement;
    search: HTMLButtonElement;
    error: HTMLDivElement;
    results: HTMLDivElement;
    resultsCount: HTMLSpanElement;
    resultsTable: HTMLDivElement;
    resultsPagination: HTMLDivElement;
    noResult: HTMLDivElement;
    noResultsClear: HTMLAnchorElement;
    modal: HTMLDivElement;
    toc: HTMLDivElement;
    tocContent: HTMLDivElement;
    accordionTemplate: HTMLTemplateElement;
    accordionItemTemplateLinked: HTMLTemplateElement;
    accordionItemTemplateCollapsible: HTMLTemplateElement;
    linklistTemplate: HTMLTemplateElement;
    linklistItemTemplate: HTMLTemplateElement;
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
        results: '[data-edirectory-results]',
        resultsCount: '[data-edirectory-results] h3 span',
        resultsTable: '[data-edirectory-results] .mdl-table',
        resultsPagination: '[data-edirectory-results] .mdl-pagination',
        noResult: '[data-edirectory-no-results]',
        noResultsClear: '[data-edirectory-no-results] .atm-button',
        modal: '.mdl-modal',
        toc: '.mdl-toc-list',
        tocContent: '#mdl-edirectory__toc-content',
        accordionTemplate: '#mdl-edirectory__accordion-template',
        accordionItemTemplateLinked: '#mdl-edirectory__accordion-item-template--linked',
        accordionItemTemplateCollapsible: '#mdl-edirectory__accordion-item-template--collapsible',
        linklistTemplate: '#mdl-edirectory__linklist-template',
        linklistItemTemplate: '#mdl-edirectory__linklist-item-template',
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
      node.type === ORG_TYPE_AUTHORITY ||
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
      if (node.services) {
        node.services.sort((a: ServiceData, b: ServiceData) => a.order - b.order);
      }
      node.searchable = searchable.join(' ').toLocaleLowerCase();
      this.idMap.set(node.id, node);
      if (node.organisations) {
        node.organisations.forEach((child) => walkNode(child, node));
      }
    };

    const render = (template: HTMLTemplateElement, data: Record<string, InsertableContent>) => {
      const html = document.importNode(template.content, true).firstElementChild;
      if (!html) console.error(`Template returns no HTML:`, template);
      for (const [selector, content] of Object.entries(data)) {
        const el = selector === '' ? html : html.querySelector(selector);
        if (el) {
          if (typeof content === 'string') el.textContent = content;
          else if (typeof content === 'function') content(el);
          else if (Array.isArray(content)) content.forEach((item) => el.appendChild(item));
          else if (content !== null) el.appendChild(content);
          else console.error('Unexpected empty content for:', template, data);
        }
      }
      return html;
    };

    const renderLinklist = (orgs: OrganisationData[]) =>
      render(this.ui.linklistTemplate, {
        '.mdl-linklist__list': orgs.map((org) =>
          render(this.ui.linklistItemTemplate, {
            '.atm-linklist_item': (el: HTMLAnchorElement) => {
              el.href = `#${org.id}`;
            },
            '.atm-linklist_item__text > span': org.title,
          })
        ),
      });

    const renderAccordionItems = (orgs: OrganisationData[]) =>
      orgs.map((org) =>
        org.type === ORG_TYPE_GROUP &&
        org.organisations.length &&
        org.organisations.length <= MAX_ORG_CHILDREN
          ? render(this.ui.accordionItemTemplateCollapsible, {
              '.mdl-accordion__control': org.title,
              '.mdl-accordion__panel-content': renderLinklist(org.organisations),
            })
          : render(this.ui.accordionItemTemplateLinked, {
              '.mdl-accordion__button': (el: HTMLAnchorElement) => {
                el.href = `#${org.id}`;
              },
              '.mdl-accordion__control': org.title,
            })
      );

    const renderAccordion = (node: OrganisationData) => {
      const items = renderAccordionItems(node.organisations);
      const html = render(this.ui.accordionTemplate, {
        h3: node.title,
        '': items,
      });
      this.ui.tocContent.appendChild(html);
    };

    const showError = (message: string) => {
      this.ui.form.classList.remove(this.options.stateClasses.loading);
      this.ui.error.classList.remove(HIDDEN_CLASS);
      this.ui.form.classList.add(HIDDEN_CLASS);
      this.log(message);
    };

    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) showError(`HTTP error! Status: ${response.status}`);
      this.treeData = await response.json();
      this.treeData.rootOrganisations.forEach((org) => walkNode(org));

      // Render TOC list
      this.treeData.rootOrganisations.sort((a, b) => a.order - b.order).forEach(renderAccordion);

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
          this.ui.resultsPagination.classList.remove(HIDDEN_CLASS);
        } else {
          this.ui.resultsPagination.classList.add(HIDDEN_CLASS);
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
      showError(`Could not load or parse data from ${this.dataUrl}: ${error}`);
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
      this.ui.clear.classList.remove(HIDDEN_CLASS);
      this.ui.toc.classList.add(HIDDEN_CLASS);

      if (hasResult) {
        this.ui.results.classList.remove(HIDDEN_CLASS);
        this.ui.noResult.classList.add(HIDDEN_CLASS);
      } else {
        this.ui.noResult.classList.remove(HIDDEN_CLASS);
        this.ui.results.classList.add(HIDDEN_CLASS);
      }
    };

    const hideResults = () => {
      this.ui.results.classList.add(HIDDEN_CLASS);
      this.ui.noResult.classList.add(HIDDEN_CLASS);
      this.ui.clear.classList.add(HIDDEN_CLASS);
      this.ui.toc.classList.remove(HIDDEN_CLASS);
    };

    const clearResults = () => {
      this.ui.query.value = '';
      window.location.hash = '';
      this.ui.search.classList.add(DISABLED_CLASS);
      this.ui.search.disabled = true;
      hideResults();
    };

    const validateSearchQuery = () => this.ui.query.value.length; // non-empty query

    if (!validateSearchQuery()) {
      this.ui.search.classList.add(DISABLED_CLASS);
      this.ui.search.disabled = true;
    }

    this.ui.query.addEventListener('input', () => {
      if (validateSearchQuery()) {
        this.ui.clear.classList.remove(HIDDEN_CLASS);
        this.ui.search.classList.remove(DISABLED_CLASS);
        this.ui.search.disabled = false;
      } else {
        this.ui.clear.classList.add(HIDDEN_CLASS);
        this.ui.search.classList.add(DISABLED_CLASS);
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
