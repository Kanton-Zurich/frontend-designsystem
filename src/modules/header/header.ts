/*!
 * Header
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Anchornav from '../anchornav/anchornav';

class Header extends Module {
  public options: {
    transitionDelays: {
      big: number,
      small: number,
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
    },
    colorClasses: {
      monochrome: string,
    }
  }

  public ui: {
    element: any,
    close: any,
  }

  public data: {
    activeModal: HTMLElement,
    activeItem: HTMLElement,
    scrollPosition: number,
    headerIsFixed: boolean,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      activeModal: null,
      activeItem: null,
      scrollPosition: 0,
      headerIsFixed: false,
    };
    const defaultOptions = {
      transitionDelays: {
        big: 500,
        small: 300,
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
      },
      colorClasses: {
        monochrome: 'cv-monochrome',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.data.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

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

    window.addEventListener('keydown', this.closeOnEscape.bind(this));
    window.addEventListener('Modal.closed', this.unsetClasses.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));

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
    if (this.data.activeModal) {
      const unsetHeaderClasses = this.data.activeItem.getAttribute('data-modal') === delegate.getAttribute('data-modal');

      this.hideFlyout(unsetHeaderClasses);
    }

    this.showFlyout(delegate);

    (<HTMLElement>document.querySelector(this.options.domSelectors.close)).focus();
  }

  closeOnEscape(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.hideFlyout(true);
    }
  }

  showFlyout(delegate) {
    this.data.activeModal = document.querySelector(`#${delegate.getAttribute('data-modal')}`);
    this.data.activeItem = delegate;

    this.data.activeModal.dispatchEvent(new CustomEvent('Modal.open'));

    this.ui.element.classList.add(this.options.stateClasses.open);
    this.ui.element.classList.add(this.options.colorClasses.monochrome);
    this.data.activeItem.classList.add(this.options.stateClasses.activeItem);
    document.documentElement.classList.add(this.options.stateClasses.fixedHeader);

    this.data.activeItem.setAttribute('aria-expanded', 'true');
  }

  hideFlyout(unsetClasses) {
    if (this.data.activeModal) {
      this.data.activeModal.dispatchEvent(new CustomEvent('Modal.close'));

      this.data.activeItem.setAttribute('aria-expanded', 'false');

      if (unsetClasses) {
        setTimeout(this.unsetClasses.bind(this), this.options.transitionDelays.small);
      }
    }
  }

  unsetClasses() {
    if (this.data.activeModal) {
      this.ui.element.classList.remove(this.options.stateClasses.open);
      this.ui.element.classList.remove(this.options.colorClasses.monochrome);
      this.data.activeItem.classList.remove(this.options.stateClasses.activeItem);
      document.documentElement.classList.remove(this.options.stateClasses.fixedHeader);

      this.data.activeModal = null;
      this.data.activeItem = null;
    }
  }

  handleScroll() {
    const newScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (this.data.scrollPosition > newScrollPosition && !this.data.headerIsFixed) {
      this.data.headerIsFixed = true;
    } else if (this.data.scrollPosition < newScrollPosition && this.data.headerIsFixed) {
      this.data.headerIsFixed = false;
    }

    this.data.scrollPosition = newScrollPosition;
  }

  toggleFixedHeader(propName, valueBefore, valueAfter) {
    const anchornavIsSticky = document.querySelector('.mdl-anchornav').classList.contains('.mdl-anchornav--sticky');

    if (valueAfter) {
      if (anchornavIsSticky) {
        this.ui.element.classList.add(this.options.colorClasses.monochrome);
      }

      this.ui.element.classList.add(this.options.stateClasses.fixed);
      document.documentElement.classList.add(this.options.stateClasses.fixedHeader);
    } else {
      this.ui.element.classList.remove(this.options.colorClasses.monochrome);
      this.ui.element.classList.remove(this.options.stateClasses.fixed);
      document.documentElement.classList.remove(this.options.stateClasses.fixedHeader);
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
