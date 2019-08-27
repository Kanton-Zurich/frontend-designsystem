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
    stateClasses: any;
    transitionTime: number,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      transitionTime: 500,
      domSelectors: {
        pageHeader: '.mdl-page-header',
        closeButton: '.mdl-page-header__closebutton',
        close: '[data-modal="close"]',
        singlePageApp: '[data-init="application"]',
      },
      stateClasses: {
        show: 'mdl-modal--show',
        transHide: 'mdl-modal--transition-hide',
        dynamicHeader: 'mdl-modal--dynamicheader',
      },
    };
    super($element, defaultData, defaultOptions, data, options);
    this.scrollThreshold = 75;
    this.initUi();
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
   * Event listeners initialisation
   */
  initEventListeners() {
    this.closeOnEscapeFunction = this.closeOnEscape.bind(this);
    this.initContent();
    this.eventDelegate.on('Modal.open', () => {
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
      (<any>window).estatico.helpers.wrapAccessibility(this.ui.element);
      window.addEventListener('keydown', this.closeOnEscapeFunction);
      this.parentScrollPosition = document.documentElement.scrollTop;
      this.ui.element.removeAttribute('style');
      (<any>window).estatico.helpers.setHiddenTabIndex(this.ui.element);
      // delayed opacity animation
      setTimeout(() => { this.ui.element.classList.add(this.options.stateClasses.show); }, 1);
      const focusable = this.ui.element.querySelector('[data-modal-focus]');
      if (focusable) {
        focusable.focus();
      } else {
        this.ui.element.focus();
      }
      this.ui.element.scrollTo(0, 0);
      if (this.ui.element.classList.contains(this.options.stateClasses.dynamicHeader)) {
        this.updateOnScroll(0);
      }
      this.updateSizing();
      (<any>WindowEventListener).addDebouncedResizeListener(this.updateSizing.bind(this));
      document.documentElement.style.overflowY = 'hidden';

      this.ui.element.setAttribute('aria-hidden', 'false');

      // If there is the navigation topic list a child, then load the navigation
      if (this.ui.element.querySelector('.mdl-topiclist--nav')) {
        this.ui.element.querySelector('.mdl-topiclist--nav').dispatchEvent(new CustomEvent('loadNavigation'));
      }
      // reload Single page Applications scripts in case of asynchronous loading
      const spa = this.ui.element.querySelector(this.options.domSelectors.singlePageApp);
      if (spa) {
        spa.dispatchEvent(new CustomEvent('Application.initScripts'));
      }
    });
    this.eventDelegate.on('Modal.initContent', () => {
      if (!this.hasCloseBtn) {
        this.initContent();
      }
      (<any>window).estatico.helpers.registerModulesInElement
        .bind((<any>window).estatico.helpers.app)(this.ui.element);
      (<any>window).estatico.helpers.initModulesInElement
        .bind((<any>window).estatico.helpers.app)(this.ui.element);
    });
    this.eventDelegate.on('Modal.close', this.closeModal.bind(this));
    this.eventDelegate.on('click', this.options.domSelectors.close, this.closeModal.bind(this));
    // move to the end of the DOM
    (<any>window).estatico.helpers.bodyElement.appendChild(this.ui.element);
    this.ui.element.style.display = 'none';
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
      if (scrollTop > this.scrollThreshold) {
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

  closeModal() {
    document.documentElement.style.overflowY = 'initial';
    this.ui.element.classList.add(this.options.stateClasses.transHide);
    document.documentElement.scrollTo(0, this.parentScrollPosition);
    window.removeEventListener('keydown', this.closeOnEscapeFunction);
    this.isolatedElements.forEach((element) => {
      element.removeAttribute('aria-hidden');
    });
    this.ui.element.setAttribute('aria-hidden', 'true');

    window.dispatchEvent(new CustomEvent('Modal.closed'));

    setTimeout(() => {
      this.ui.element.classList.remove(this.options.stateClasses.show);
      this.ui.element.classList.remove(this.options.stateClasses.transHide);
      this.ui.element.style.display = 'none';
      (<any>window).estatico.helpers.unwrapAccessibility(this.ui.element);
      (<any>window).estatico.helpers.resetHiddenTabIndex();
      const focusOrigin = document.querySelector(`[aria-controls="${this.ui.element.getAttribute('id')}"]`);
      if (focusOrigin) {
        (<any> focusOrigin).focus();
      }
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
