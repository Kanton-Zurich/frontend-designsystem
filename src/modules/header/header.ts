
/*!
 * Header
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Anchornav from '../anchornav/anchornav';
import Modal from '../modal/modal';
import WindowEventListener from '../../assets/js/helpers/events';

class Header extends Module {
  public placeholder: HTMLElement;
  public delayHeaderIsFixed: number;
  public isToggleable: boolean;

  private pinPos: number;
  public height: number;
  private headerHeights: {
    tiny: number,
    xsmall: number,
    medium: number,
  };
  private bpXsmall: number;
  private bpMedium: number;

  public options: {
    transitionDelays: {
      default: number,
    },
    domSelectors: {
      openModal: string,
      close: string,
    },
    stateClasses: {
      activeItem: string,
      open: string,
      fixedHeader: string,
      fixed: string,
      navItem: string,
    },
    colorClasses: {
      monochrome: string,
    }
  };

  public ui: {
    element: any,
    close: any,
  };

  public data: {
    activeModal: HTMLElement,
    activeItem: HTMLElement,
    scrollPosition: number,
    headerIsFixed: boolean,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      activeModal: null,
      activeItem: null,
      scrollPosition: 0,
      headerIsFixed: false,
    };
    const defaultOptions = {
      transitionDelays: {
        default: 250,
      },
      domSelectors: {
        openModal: '[data-header="openModal"]',
        close: '[data-modal="close"]',
      },
      stateClasses: {
        activeItem: 'mdl-header__nav-item--active',
        open: 'mdl-header--open',
        fixedHeader: 'fixed-header',
        fixed: 'mdl-header--fixed',
        navItem: 'mdl-header__nav-item',
      },
      colorClasses: {
        monochrome: 'cv-monochrome',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.data.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.delayHeaderIsFixed = 0;
    this.isToggleable = true;
    this.headerHeights = {
      tiny: 50,
      xsmall: 58,
      medium: 77,
    };
    this.bpXsmall = 400;
    this.bpMedium = 840;

    this.onResize();
    this.createPlaceholder();
    this.initUi();
    this.initEventListeners();
    this.initWatchers();
  }

  static get events() {
    return {
      showHeader: 'showHeader.header',
      hideHeader: 'hideHeader.header',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.openModal, this.toggleFlyout.bind(this));

    window.addEventListener(Modal.events.closed, this.hideFlyout.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    (<any>WindowEventListener).addDebouncedScrollListener(this.handleScroll.bind(this));

    window.addEventListener(Anchornav.events.isSticky, () => {
      this.ui.element.classList.add(this.options.colorClasses.monochrome);
    });

    window.addEventListener(Anchornav.events.isNotSticky, () => {
      this.ui.element.classList.remove(this.options.colorClasses.monochrome);
    });
  }

  initWatchers() {
    this.watch(this.data, 'headerIsFixed', this.toggleFixedHeader.bind(this));
  }

  toggleFlyout(event, delegate) {
    if (this.data.activeItem === delegate) {
      this.data.activeItem.setAttribute('aria-expanded', 'false');

      this.data.activeModal.dispatchEvent(new CustomEvent('Modal.close'));
    } else if (this.data.activeItem !== delegate && this.data.activeModal) {
      this.data.activeItem.setAttribute('aria-expanded', 'false');

      this.data.activeModal.dispatchEvent(new CustomEvent('Modal.switchLeft'));
      document.querySelector(`#${delegate.getAttribute('aria-controls')}`).dispatchEvent(new CustomEvent('Modal.switchRight'));

      this.switchFlyout(delegate);
    } else {
      this.showFlyout(delegate, delegate.classList.contains(this.options.stateClasses.navItem));

      (<HTMLElement>document.querySelector(this.options.domSelectors.close)).focus();
    }
  }


  showFlyout(delegate, mainNav = false) {
    this.data.activeModal = document.querySelector(`#${delegate.getAttribute('aria-controls')}`);
    this.data.activeItem = delegate;

    this.data.activeModal.dispatchEvent(new CustomEvent('Modal.open'));

    if (!this.data.activeItem.hasAttribute('data-search')) {
      this.ui.element.classList.add(this.options.stateClasses.open);
      this.ui.element.classList.add(this.options.colorClasses.monochrome);
      this.data.activeItem.classList.add(this.options.stateClasses.activeItem);
    }

    this.data.activeItem.setAttribute('aria-expanded', 'true');

    // if pageheader is present correct padding
    const pageHeader = <HTMLDivElement>document.querySelector('.mdl-page-header');
    if (pageHeader && mainNav) {
      const offsetTop = this.ui.element.clientHeight + parseInt(window.getComputedStyle(pageHeader).paddingTop, 10);
      pageHeader.style.paddingTop = `${offsetTop}px`;
    }
  }

  switchFlyout(delegate) {
    this.unsetClasses();

    this.data.activeItem = delegate;
    this.data.activeModal = document.querySelector(`#${delegate.getAttribute('aria-controls')}`);

    this.data.activeItem.classList.add(this.options.stateClasses.activeItem);
  }

  hideFlyout() {
    let anchornavIsSticky = false;

    if (document.querySelector('.mdl-anchornav')) {
      anchornavIsSticky = document.querySelector('.mdl-anchornav').classList.contains('mdl-anchornav--sticky');
    }

    this.unsetClasses();

    this.ui.element.classList.remove(this.options.stateClasses.open);

    if (!anchornavIsSticky) {
      this.ui.element.classList.remove(this.options.colorClasses.monochrome);
    }

    // if pageheader is present correct padding
    const pageHeader = <HTMLDivElement>document.querySelector('.mdl-page-header');
    if (pageHeader) {
      pageHeader.removeAttribute('style');
    }
  }

  unsetClasses() {
    if (this.data.activeModal) {
      this.data.activeItem.classList.remove(this.options.stateClasses.activeItem);

      this.data.activeModal = null;
      this.data.activeItem = null;
    }
  }

  private onResize() {
    if (window.innerWidth >= this.bpMedium) {
      this.height = this.headerHeights.medium;
    } else if (window.innerWidth >= this.bpXsmall) {
      this.height = this.headerHeights.xsmall;
    } else if (this.height !== this.headerHeights.tiny) {
      this.height = this.headerHeights.tiny;
    }

    if (this.placeholder) {
      this.placeholder.style.height = `${this.height}px`;
    }

    if (document.querySelector('.mdl-anchornav')) {
      this.pinPos = document.querySelector('.mdl-anchornav').getBoundingClientRect().top;
    }
  }

  handleScroll() {
    const newScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (newScrollPosition >= this.height) {
      this.placeholder.style.display = 'block';
      this.ui.element.classList.add(this.options.stateClasses.fixed);
    } else if (newScrollPosition === 0) {
      this.placeholder.style.display = 'none';
      this.ui.element.classList.remove(this.options.stateClasses.fixed);
      document.documentElement.classList.remove(this.options.stateClasses.fixedHeader);
    }

    // Scroll down
    if (this.data.scrollPosition < newScrollPosition && this.isToggleable) {
      this.ui.element.style.display = 'none';
      document.documentElement.classList.remove(this.options.stateClasses.fixedHeader);
      this.ui.element.classList.remove(this.options.stateClasses.fixed);
    } else if (this.data.scrollPosition > newScrollPosition && this.isToggleable) {
      // Scroll up
      this.ui.element.style.display = 'block';
      document.documentElement.classList.add(this.options.stateClasses.fixedHeader);
    }

    if (this.isToggleable) {
      this.data.scrollPosition = newScrollPosition >= 0 ? newScrollPosition : 0;
      this.isToggleable = false;
    }

    setTimeout(() => {
      this.isToggleable = true;
    }, this.delayHeaderIsFixed);
  }

  private createPlaceholder() {
    this.placeholder = document.createElement('div');
    this.placeholder.style.display = 'none';
    this.placeholder.style.height = `${this.height}px`;

    this.placeholder.classList.add('mdl-header__placeholder');

    this.ui.element.parentNode.insertBefore(this.placeholder, this.ui.element);
  }

  /**
   * Toggling the fixed header
   *
   * @param {*} propName
   * @param {*} valueBefore
   * @param {*} valueAfter The Value after its change
   * @memberof Header
   */
  toggleFixedHeader(propName, valueBefore, valueAfter) {
    let anchornavIsSticky = false;

    if (document.querySelector('.mdl-anchornav')) {
      anchornavIsSticky = document.querySelector('.mdl-anchornav').classList.contains('mdl-anchornav--sticky');
    }

    if (valueAfter) {
      if (anchornavIsSticky) {
        this.ui.element.classList.add(this.options.colorClasses.monochrome);
      }
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Header;
