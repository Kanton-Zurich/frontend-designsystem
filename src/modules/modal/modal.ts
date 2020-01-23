/*!
 * Modal
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

class Modal extends Module {
  private parentScrollPosition: number;
  private hasCloseBtn: boolean;
  private headerHeight: number;
  private isolatedElements: HTMLElement[];

  public options: {
    domSelectors: any,
    stateClasses: any,
    transitionTime: number,
    hasDynamicHeader: boolean,
    isSPA: boolean,
    isNav: boolean,
    isSearch: boolean,
    childSelectors: any,
    scrollThreshold: number,
  };

  public ui: {
    element: HTMLDivElement,
    initiable: NodeListOf<HTMLElement>,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      transitionTime: 250,
      domSelectors: {
        pageHeader: '.mdl-page-header',
        closeButton: '.mdl-page-header__closebutton',
        close: '[data-modal="close"]',
        focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        initiable: '[data-init]',
      },
      stateClasses: {
        beforeShow: 'mdl-modal--before-show',
        show: 'mdl-modal--show',
        transHide: 'mdl-modal--transition-hide',
        dynamicHeader: 'mdl-modal--dynamicheader',
        beforeHide: 'mdl-modal--before-hide',
        hide: 'mdl-modal--hide',
        switchLeft: 'mdl-modal--switch-left',
        noTransitionShow: 'mdl-modal--no-transition-show',
        beforeSwitchRight: 'mdl-modal--before-switch-right',
        switchRight: 'mdl-modal--switch-right',
        search: 'mdl-modal--search',
        opened: 'mdl-modal--opened',
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
    };
  }

  /**
   * Set the properties if the modal is in a different variation
   */
  initVariations() {
    this.options.hasDynamicHeader = this.ui.element.classList
      .contains(this.options.stateClasses.dynamicHeader);

    this.options.isSPA = this.ui.element.querySelector(this.options.childSelectors.spa);
    this.options.isNav = this.ui.element.querySelector(this.options.childSelectors.nav);
    this.options.isSearch = this.ui.element.classList.contains(this.options.stateClasses.search);
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('Modal.open', this.openModal.bind(this));
    this.eventDelegate.on('Modal.initContent', () => {
      if (!this.hasCloseBtn) {
        this.initContent();
      }
      (<any>window).estatico.helpers.registerModulesInElement
        .bind((<any>window).estatico.helpers.app)(this.ui.element);
      (<any>window).estatico.helpers.initModulesInElement
        .bind((<any>window).estatico.helpers.app)(this.ui.element);
      (<any>window).estatico.helpers.app.registerForms();
    });
    this.eventDelegate.on('Modal.close', this.closeModal.bind(this));
    this.eventDelegate.on('click', this.options.domSelectors.close, this.closeModal.bind(this));
    // move to the end of the DOM
    (<any>window).estatico.helpers.bodyElement.appendChild(this.ui.element);
    this.eventDelegate.on('Modal.switchLeft', this.switchLeft.bind(this));
    this.eventDelegate.on('Modal.switchRight', this.switchRight.bind(this));
    window.addEventListener('keydown', this.closeOnEscape.bind(this));
  }

  /**
   * Initialize sub modules to make them functional
   */
  initContent() {
    const closeButton = this.ui.element.querySelector(this.options.domSelectors.closeButton);
    if (this.ui.element.classList.contains(this.options.stateClasses.dynamicHeader)) {
      this.ui.element.addEventListener('scroll', (event) => {
        this.updateOnScroll((<HTMLElement>event.target).scrollTop);
      });
    }
    if (closeButton) {
      closeButton.addEventListener('click', this.closeModal.bind(this));
      this.hasCloseBtn = true;
    }
  }

  /**
   * Update on scroll event
   * @param scrollTop
   */
  updateOnScroll(scrollTop) {
    const pageHeader = this.ui.element.querySelector(this.options.domSelectors.pageHeader);

    if (pageHeader) {
      if (scrollTop > this.options.scrollThreshold) {
        pageHeader.dispatchEvent(new CustomEvent('PageHeader.collapse'));
      } else {
        pageHeader.dispatchEvent(new CustomEvent('PageHeader.expand'));
      }
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
      this.ui.element.style.paddingTop = `${this.headerHeight}px`;
    }
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
  openModal() {
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

    // Set show class
    this.ui.element.classList.add(this.options.stateClasses.beforeShow);
    setTimeout(() => { this.ui.element.classList.add(this.options.stateClasses.show); }, 1);
    document.documentElement.style.overflowY = 'hidden';

    // Accessibility features
    (<any>window).estatico.helpers.setHiddenTabIndex(this.ui.element);
    this.parentScrollPosition = document.documentElement.scrollTop;
    // delayed opacity animation and focus handling
    setTimeout(() => {
      const focusable = this.ui.element.querySelectorAll(this.options.domSelectors.focusable);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 1);
    this.ui.element.focus();
    this.ui.element.scrollTop = 0;


    if (this.options.hasDynamicHeader) {
      this.updateOnScroll(0);
    }
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
        this.ui.element.querySelector(this.options.childSelectors.spa).dispatchEvent(new CustomEvent('Application.initScripts'));
      }, this.options.transitionTime);
    }

    this.log(this.options.transitionTime);

    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.opened);
      window.dispatchEvent(new CustomEvent(Modal.events.opened, { detail: { sender: this } }));
    }, this.options.transitionTime);
  }

  /** Closes the modal */
  closeModal() {
    this.isolatedElements.forEach((element) => {
      element.removeAttribute('aria-hidden');
    });
    this.ui.element.classList.add(this.options.stateClasses.beforeHide);
    document.documentElement.style.overflowY = 'auto';
    this.ui.element.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.hide);
      (<any>window).estatico.helpers.resetHiddenTabIndex();
      const focusOrigin = document.querySelector(`[aria-controls="${this.ui.element.getAttribute('id')}"]`);
      if (focusOrigin) {
        (<any> focusOrigin).focus();
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
  }

  switchLeft() {
    // Accessibility integrate the isolated
    this.isolatedElements.forEach((element) => {
      element.removeAttribute('aria-hidden');
    });

    this.ui.element.classList.add(this.options.stateClasses.switchLeft);

    // After the animation we can set the modal to display: none
    setTimeout(() => {
      this.ui.element.classList.remove(this.options.stateClasses.beforeShow);
      this.ui.element.classList.remove(this.options.stateClasses.beforeHide);
      this.ui.element.classList.remove(this.options.stateClasses.hide);
      this.ui.element.classList.remove(this.options.stateClasses.show);

      this.ui.element.classList.remove(this.options.stateClasses.switchLeft);
    }, this.options.transitionTime);
  }

  switchRight() {
    this.isolatedElements = [];
    (<any>window).estatico.helpers.bodyElement.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        if (!(<HTMLElement>child).getAttribute('aria-hidden')) {
          (<HTMLElement>child).setAttribute('aria-hidden', 'true');
          this.isolatedElements.push(child);
        }
      }
    });

    if (this.options.isNav) {
      this.ui.element.querySelector(this.options.childSelectors.nav)
        .dispatchEvent(new CustomEvent(Modal.events.display));
    }

    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.noTransitionShow);

      setTimeout(() => {
        this.ui.element.classList.add(this.options.stateClasses.beforeSwitchRight);
        this.ui.element.classList.add(this.options.stateClasses.show);
        this.ui.element.classList.add(this.options.stateClasses.beforeShow);
        this.ui.element.classList.remove(this.options.stateClasses.noTransitionShow);
      }, 1);

      this.ui.element.classList.add(this.options.stateClasses.switchRight);

      setTimeout(() => {
        this.ui.element.classList.remove(this.options.stateClasses.beforeSwitchRight);
        this.ui.element.classList.remove(this.options.stateClasses.switchRight);
      }, this.options.transitionTime);
    }, this.options.transitionTime);
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Modal;
