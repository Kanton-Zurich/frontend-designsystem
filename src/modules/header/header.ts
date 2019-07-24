/*!
 * Header
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Header extends Module {
  public options: {
    transitionDelays: {
      big: number,
      small: number,
    },
    domSelectors: {
      openModal: string,
    },
    stateClasses: {
      activeItem: string,
      open: string,
      fixedHeader: string,
    },
    colorClasses: {
      monochrome: string,
    }
  }

  public ui: {
    element: any,
  }

  public data: {
    activeModal: HTMLElement,
    activeItem: HTMLElement,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      activeModal: null,
      activeItem: null,
    };
    const defaultOptions = {
      transitionDelays: {
        big: 500,
        small: 300,
      },
      domSelectors: {
        openModal: '[data-header="openModal"]',
      },
      stateClasses: {
        activeItem: 'mdl-header__nav-item--active',
        open: 'mdl-header--open',
        fixedHeader: 'fixed-header',
      },
      colorClasses: {
        monochrome: 'cv-monochrome',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Header.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.openModal, this.toggleFlyout.bind(this));

    window.addEventListener('keydown', this.closeOnEscape.bind(this));
  }

  toggleFlyout(event, delegate) {
    if (this.data.activeModal) {
      this.hideFlyout();
    }

    this.showFlyout(delegate);
  }

  closeOnEscape(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.hideFlyout();
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
  }

  hideFlyout() {
    this.data.activeModal.dispatchEvent(new CustomEvent('Modal.close'));

    setTimeout(this.unsetClasses.bind(this), this.options.transitionDelays.small);
  }

  unsetClasses() {
    this.ui.element.classList.remove(this.options.stateClasses.open);
    this.ui.element.classList.remove(this.options.colorClasses.monochrome);
    this.data.activeItem.classList.remove(this.options.stateClasses.activeItem);
    document.documentElement.classList.remove(this.options.stateClasses.fixedHeader);

    this.data.activeModal = null;
    this.data.activeItem = null;
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
