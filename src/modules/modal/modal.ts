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
  private closeOnEscapeFunction: any;
  private hasCloseBtn: boolean;
  private headerHeight: number;
  public scrollThreshold: number;
  private isolatedElements: HTMLElement[];

  public options: {
    domSelectors: any,
    stateClasses: any,
    transitionTime: number,
    hasDynamicHeader: boolean,
    isSPA: false,
    isNav: false,
    childSelectors: any,
    scrollThreshold: number,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      transitionTime: 250,
      domSelectors: {
        pageHeader: '.mdl-page-header',
        closeButton: '.mdl-page-header__closebutton',
        close: '[data-modal="close"]',
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
      },
      childSelectors: {
        nav: '.mdl-topiclist--nav',
        spa: '[data-init="application"]',
      },
      hasDynamicHeader: false,
      isSPA: false,
      isNav: false,
      scrollThreshold: 75,
    };
    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initContent();
    this.initVariations();
    this.initEventListeners();
  }

  static get events() {
    return {
      openModal: 'Modal.open',
      initContent: 'Modal.initContent',
      closeModal: 'Modal.close',
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

  initContent() {
    const closeButton = this.ui.element.querySelector(this.options.domSelectors.closeButton);
    if (this.ui.element.classList.contains(this.options.stateClasses.dynamicHeader)) {
      this.ui.element.addEventListener('scroll', (event) => {
        this.updateOnScroll(event.target.scrollTop);
      });
    }
    if (closeButton) {
      closeButton.addEventListener('click', this.closeModal.bind(this));
      this.hasCloseBtn = true;
    }
  }

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
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeModal();
    }
  }

  /**
   * opens the modal
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
    (<any>window).estatico.helpers.wrapAccessibility(this.ui.element);
    (<any>window).estatico.helpers.setHiddenTabIndex(this.ui.element);

    // Set parent scrollPosition
    this.parentScrollPosition = document.documentElement.scrollTop;

    // delayed opacity animation
    this.ui.element.focus();
    this.ui.element.scrollTop = 0;


    if (this.options.hasDynamicHeader) {
      this.updateOnScroll(0);
    }

    this.updateSizing();

    (<any>WindowEventListener).addDebouncedResizeListener(this.updateSizing.bind(this));

    // If there is the navigation topic list a child, then load the navigation
    if (this.options.isNav) {
      this.ui.element.querySelector(this.options.childSelectors.nav).dispatchEvent(new CustomEvent('loadNavigation'));
    }

    // reload Single page Applications scripts in case of asynchronous loading
    if (this.options.isSPA) {
      this.ui.element.querySelector(this.options.childSelectors.spa).dispatchEvent(new CustomEvent('Application.initScripts'));
    }
  }

  /** Closes the modal */
  closeModal() {
    const multiplier = 2;

    // Accessibility integrate the isolated
    this.isolatedElements.forEach((element) => {
      element.removeAttribute('aria-hidden');
    });

    this.ui.element.classList.add(this.options.stateClasses.beforeHide);

    document.documentElement.style.overflowY = 'auto';


    // Modal.closed, should only fire after the timeout

    // After the animation we can set the modal to display: none
    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.hide);
    }, this.options.transitionTime);
    setTimeout(() => {
      this.ui.element.classList.remove(this.options.stateClasses.beforeShow);
      this.ui.element.classList.remove(this.options.stateClasses.beforeHide);
      this.ui.element.classList.remove(this.options.stateClasses.hide);
      this.ui.element.classList.remove(this.options.stateClasses.show);
      window.dispatchEvent(new CustomEvent('Modal.closed'));
    }, this.options.transitionTime * multiplier);
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
      this.ui.element.querySelector(this.options.childSelectors.nav).dispatchEvent(new CustomEvent('loadNavigation'));
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
