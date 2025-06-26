/*!
 * Modal
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import HeaderExpand from '../header_expand/header_expand';
import WindowEventListener from '../../assets/js/helpers/events';
import { cause, effect } from '../../assets/js/helpers/causeEffect';
import type { OrganisationData } from '../edirectory/edirectory';
import Pagination from '../pagination/pagination';

const MAX_RESULTS_PER_PAGE = 10;

class Modal extends Module {
  private parentScrollPosition: number;
  private closeButton: HTMLButtonElement;
  private hasCloseBtn: boolean;
  private headerHeight: number;
  private isolatedElements: HTMLElement[];
  private headerResizeObserver: ResizeObserver;

  public options: {
    domSelectors: any;
    stateClasses: any;
    transitionTime: number;
    hasDynamicHeader: boolean;
    isSPA: boolean;
    isNav: boolean;
    isSearch: boolean;
    childSelectors: any;
    scrollThreshold: number;
  };

  public ui: {
    element: HTMLDivElement;
    initiable: NodeList;
    pageContainer: HTMLDivElement;
    pages: HTMLDivElement[];
    pageHeader: HTMLElement;
    breadcrumbs: HTMLElement;
    contactBlockOrganisation: HTMLElement;
    contactBlockLeaders: HTMLElement;
    membersTable: HTMLElement;
    membersPagination: HTMLElement;
    linkListOrganisations: HTMLElement;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      transitionTime: 280,
      domSelectors: {
        pageHeader: '.mdl-page-header',
        closeButton: '.mdl-page-header__close, .mdl-modal__close',
        close: '[data-modal="close"]',
        focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        initiable: '[data-init]',
        pageContainer: '.mdl-modal__pages',
        pages: '.mdl-modal__pages-page',
        breadcrumbs: '.mdl-breadcrumb',
        contactBlockOrganisation: '.mdl-contact_block--organisation',
        contactBlockLeaders: '.mdl-contact_block--leaders',
        membersTable: '.mdl-table',
        membersPagination: '.mdl-table .mdl-pagination',
        linkListOrganisations: '.mdl-linklist',
      },
      stateClasses: {
        beforeShow: 'mdl-modal--before-show',
        show: 'mdl-modal--show',
        transHide: 'mdl-modal--transition-hide',
        dynamicHeader: 'mdl-modal--dynamicheader',
        beforeHide: 'mdl-modal--before-hide',
        hide: 'mdl-modal--hide',
        noTransitionShow: 'mdl-modal--no-transition-show',
        search: 'mdl-modal--search',
        opened: 'mdl-modal--opened',
        openModal: 'open-modal',
        openModalNav: 'open-modal-nav',
      },
      childSelectors: {
        nav: '.mdl-topiclist--nav',
        spa: '[data-init="application"]',
      },
      hasDynamicHeader: false,
      isSPA: false,
      isNav: false,
      isSearch: false,
      scrollThreshold: 75,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.isolatedElements = [];

    this.initUi(['initiable']);
    this.initContent();
    this.initVariations();
    this.initEventListeners();
  }

  static get events() {
    return {
      openModal: 'Modal.open',
      initContent: 'Modal.initContent',
      closeModal: 'Modal.close',
      display: 'Modal.display',
      closed: 'Modal.closed',
      opened: 'Modal.opened',
      setPage: 'Modal.setPage',
      setData: 'Component.setData',
    };
  }

  /**
   * Set the properties if the modal is in a different variation
   */
  initVariations() {
    this.options.hasDynamicHeader = this.ui.element.classList.contains(
      this.options.stateClasses.dynamicHeader
    );

    this.options.isSPA = this.ui.element.querySelector(this.options.childSelectors.spa);
    this.options.isNav = this.ui.element.querySelector(this.options.childSelectors.nav);
    this.options.isSearch = this.ui.element.classList.contains(this.options.stateClasses.search);
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on(Modal.events.openModal, this.openModal.bind(this));
    this.eventDelegate.on(Modal.events.initContent, () => {
      if (!this.hasCloseBtn) {
        this.initContent();
      }
      if (!this.scriptsInitialized) {
        this.runScripts(this.ui.element);
      }
      (<any>window).estatico.helpers.registerModulesInElement.bind(
        (<any>window).estatico.helpers.app
      )(this.ui.element);
      (<any>window).estatico.helpers.initModulesInElement.bind((<any>window).estatico.helpers.app)(
        this.ui.element
      );
      (<any>window).estatico.helpers.app.registerForms();
    });
    this.eventDelegate.on(Modal.events.closeModal, this.closeModal.bind(this));
    this.eventDelegate.on('click', this.options.domSelectors.close, this.closeModal.bind(this));
    // move to the end of the DOM
    (<any>window).estatico.helpers.bodyElement.appendChild(this.ui.element);
    window.addEventListener('keydown', this.closeOnEscape.bind(this));
    this.eventDelegate.on(Modal.events.setPage, this.onSetPage.bind(this));
    this.ui.element.addEventListener('scroll', this.onScrollInModal.bind(this));

    /**
     * IOS Safari 10 fix background scrolling since apples safari creates tons of problems
     */
    let clientY = null; // remember Y position on touch start
    this.ui.element.addEventListener(
      'touchstart',
      (event) => {
        if (event.targetTouches.length === 1) {
          // detect single touch
          clientY = event.targetTouches[0].clientY; // eslint-disable-line
        }
      },
      false
    );

    this.ui.element.addEventListener(
      'touchmove',
      (event) => {
        if (event.targetTouches.length === 1) {
          // detect single touch
          this.disableRubberBand(event, clientY);
        }
      },
      false
    );

    if (this.ui.pageHeader) {
      this.headerResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(() => {
          this.updateSizing();
        });
      });
      this.headerResizeObserver.observe(this.ui.pageHeader);
    }
  }

  /**
   * Initialize sub modules to make them functional
   */
  initContent() {
    this.closeButton = this.ui.element.querySelector(this.options.domSelectors.closeButton);
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.closeModal.bind(this));
      this.hasCloseBtn = true;
    }

    if (this.options.hasDynamicHeader) {
      const pageHeader = this.ui.element.querySelector(this.options.domSelectors.pageHeader);
      pageHeader.addEventListener('wheel', this.onHeaderScroll.bind(this));
    }
  }

  /**
   * Update on scroll event
   * @param scrollTop
   */
  updateOnScroll(scrollTop) {
    const pageHeader = this.ui.element.querySelector(this.options.domSelectors.pageHeader);

    if (pageHeader) {
      const myEvent =
        scrollTop > this.options.scrollThreshold
          ? HeaderExpand.events.collapseTriggered
          : HeaderExpand.events.expandTriggered;
      pageHeader.dispatchEvent(new CustomEvent(myEvent, { bubbles: true }));

      this.rescaleBackgroundElements();
    }
  }

  /**
   * Update sizing of the header and content
   */
  updateSizing() {
    const pageHeader = this.ui.element.querySelector(this.options.domSelectors.pageHeader);
    if (pageHeader) {
      pageHeader.style.zIndex = 2;
      if (!this.headerHeight) {
        if (pageHeader.offsetHeight) {
          this.headerHeight = pageHeader.offsetHeight;
        } else if (pageHeader.style.pixelHeight) {
          this.headerHeight = pageHeader.style.pixelHeight;
        }
      }
      this.ui.element.style.paddingTop = `${pageHeader.offsetHeight}px`;
      this.ui.element.style.minHeight = `calc(100dvh - ${this.headerHeight}px)`;
    }
    this.updateFlyingFocus(0);
  }

  closeOnEscape(event) {
    const { activeElement } = document;

    if (activeElement.tagName !== 'INPUT') {
      if ((event.key === 'Escape' || event.key === 'Esc') && this.isolatedElements.length > 0) {
        this.closeModal();
      }
    }
  }

  /**
   * Open the modal and isolate content
   */
  openModal(event: CustomEvent) {
    // isolate modal
    this.isolatedElements = [];
    (<any>window).estatico.helpers.bodyElement.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        if (!(<HTMLElement>child).getAttribute('aria-hidden')) {
          (<HTMLElement>child).setAttribute('aria-hidden', 'true');
          this.isolatedElements.push(child);
        }
      }
    });

    // Page number of multi-step modals
    if (event.detail && event.detail.page) {
      this.setPage(event.detail.page);

      // Function to get current autority data (Behördenverzeichnis)
    } else if (typeof event.detail === 'function') {
      this.updateData(event.detail);
    }

    this.ui.element.removeAttribute('aria-hidden');

    // Set show class
    this.ui.element.classList.add(this.options.stateClasses.beforeShow);
    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.show);
    }, 1);
    document.documentElement.style.overflowY = 'hidden';

    // Accessibility features
    (<any>window).estatico.helpers.setHiddenTabIndex(this.ui.element);
    this.parentScrollPosition = document.documentElement.scrollTop;
    // delayed opacity animation and focus handling
    setTimeout(() => {
      if (this.hasCloseBtn) {
        this.closeButton.focus();
      }

      if (this.options.hasDynamicHeader) {
        this.updateOnScroll(0);
      }
    }, 1);
    this.ui.element.focus();
    this.ui.element.scrollTop = 0;

    this.updateSizing();
    (<any>WindowEventListener).addDebouncedResizeListener(this.updateSizing.bind(this));
    // If there is the navigation topic list a child, then load the navigation
    if (this.ui.initiable.length > 0) {
      this.ui.initiable.forEach((target) => {
        target.dispatchEvent(new CustomEvent(Modal.events.display));
      });
    }

    // reload Single page Applications scripts in case of asynchronous loading
    if (this.ui.element.querySelector(this.options.childSelectors.spa)) {
      setTimeout(() => {
        this.ui.element
          .querySelector(this.options.childSelectors.spa)
          .dispatchEvent(new CustomEvent('Application.initScripts'));
      }, this.options.transitionTime);
    }

    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.opened);
      window.dispatchEvent(new CustomEvent(Modal.events.opened, { detail: { sender: this } }));

      if (this.ui.initiable.length > 0) {
        this.ui.initiable.forEach((target) => {
          target.dispatchEvent(new CustomEvent(Modal.events.opened));
        });
      }
    }, this.options.transitionTime);

    document.body.classList.add(this.options.stateClasses.openModal);
    if (this.options.isNav || this.options.isSearch) {
      document.body.classList.add(this.options.stateClasses.openModalNav);
    }
  }

  /** Closes the modal */
  closeModal() {
    const focusSelector = this.ui.element.getAttribute('id').includes('edirectory')
      ? `a[href="${window.location.hash}"]`
      : `[aria-controls="${this.ui.element.getAttribute('id')}"]`;
    document.body.style.removeProperty('max-height');
    this.isolatedElements.forEach((element) => {
      element.removeAttribute('aria-hidden');
    });
    this.ui.element.classList.add(this.options.stateClasses.beforeHide);
    document.documentElement.style.overflowY = 'auto';
    this.ui.element.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.hide);
      (<any>window).estatico.helpers.resetHiddenTabIndex();
      const focusOrigin = document.querySelector(focusSelector);
      if (focusOrigin) {
        (<any>focusOrigin).focus();
      }
      this.ui.element.classList.remove(this.options.stateClasses.opened);
    }, this.options.transitionTime);
    setTimeout(() => {
      this.ui.element.classList.remove(this.options.stateClasses.beforeShow);
      this.ui.element.classList.remove(this.options.stateClasses.beforeHide);
      this.ui.element.classList.remove(this.options.stateClasses.hide);
      this.ui.element.classList.remove(this.options.stateClasses.show);
    }, this.options.transitionTime);
    window.dispatchEvent(new CustomEvent(Modal.events.closed, { detail: { sender: this } }));

    document.body.classList.remove(this.options.stateClasses.openModal);
    document.body.classList.remove(this.options.stateClasses.openModalNav);
    document.documentElement.scrollTop = this.parentScrollPosition;
  }

  onSetPage(event) {
    if (event.detail.page) {
      this.setPage(event.detail.page);
    }
  }

  setPage(page) {
    this.ui.pageContainer.setAttribute('data-page', page);
  }

  onScrollInModal(event) {
    if (this.ui.element.classList.contains(this.options.stateClasses.dynamicHeader)) {
      this.updateOnScroll((<HTMLElement>event.target).scrollTop);
    }
    this.updateFlyingFocus(0);
  }

  onHeaderScroll(event) {
    const { scrollTop } = this.ui.element;
    this.ui.element.scrollTop = scrollTop + event.deltaY;
    this.updateOnScroll(this.ui.element.scrollTop);
    this.updateFlyingFocus(0);
  }

  rescaleBackgroundElements() {
    const height = this.ui.element.clientHeight;
    document.body.style.maxHeight = `${height}px`;
  }

  private disableRubberBand(event, elementClientY) {
    const clientY = event.targetTouches[0].clientY - elementClientY;

    if (this.ui.element.scrollTop === 0 && clientY > 0) {
      // element is at the top of its scroll
      if (event.cancelable) {
        event.preventDefault();
      }
    }

    if (this.isOverlayTotallyScrolled() && clientY < 0) {
      // element is at the top of its scroll
      if (event.cancelable) {
        event.preventDefault();
      }
    }
  }

  private isOverlayTotallyScrolled() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
    return this.ui.element.scrollHeight - this.ui.element.scrollTop <= this.ui.element.clientHeight;
  }

  private updateData(authorityData: () => OrganisationData) {
    const [membersList, setMembersList] = cause([]);
    const [membersPage, setMembersPage] = cause(1);

    const dispatchSetData = (elementName: string, data: any) => {
      this.ui[elementName].dispatchEvent(
        new CustomEvent(Modal.events.setData, {
          detail: data,
        })
      );
    };

    // Effect to update the data in the modal
    effect(() => {
      const organisation = authorityData();
      if (organisation == null) return;

      dispatchSetData('pageHeader', {
        title: organisation.title,
      });
      setTimeout(() => {
        dispatchSetData('breadcrumbs', {
          title: organisation.title,
          breadcrumbs: organisation.breadcrumbs,
        });
      });
      dispatchSetData('contactBlockOrganisation', [organisation]);
      dispatchSetData('contactBlockLeaders', organisation.leaders || []);

      setMembersList(organisation.members || []);
      setMembersPage(1);
      this.ui.membersPagination.dispatchEvent(
        new CustomEvent(Pagination.events.setPage, {
          detail: 1,
        })
      );
      const handlePagination = (e: CustomEvent) => {
        setMembersPage(parseInt(e.detail.after, 10) || 1);
      };
      const pageCount = Math.ceil(organisation.members?.length / MAX_RESULTS_PER_PAGE || 1);
      if (pageCount > 1) {
        this.ui.membersPagination.removeEventListener(Pagination.events.change, handlePagination);
        this.ui.membersPagination.addEventListener(Pagination.events.change, handlePagination);
        this.ui.membersPagination.dispatchEvent(
          new CustomEvent(Pagination.events.setPageCount, {
            detail: pageCount,
          })
        );
        this.ui.membersPagination.classList.remove('hidden');
      } else {
        this.ui.membersPagination.classList.add('hidden');
      }

      dispatchSetData('linkListOrganisations', organisation);
    });

    // Effect to update the members list in the modal
    effect(() => {
      const page = membersPage();
      const members = membersList()
        .slice((page - 1) * MAX_RESULTS_PER_PAGE, page * MAX_RESULTS_PER_PAGE)
        .map((member) => {
          return {
            ...member,
            name: `${member.firstName} ${member.lastName}`,
          };
        });
      dispatchSetData('membersTable', members);
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
    this.headerResizeObserver.disconnect();
  }
}

export default Modal;
