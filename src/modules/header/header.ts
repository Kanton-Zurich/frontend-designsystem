/*!
 * Header
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Header extends Module {
  public options: {
    domSelectors: {
      openModal: string,
    },
    stateClasses: {
      activeItem: string,
      open: string,
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
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      activeModal: null,
    };
    const defaultOptions = {
      domSelectors: {
        openModal: '[data-header="openModal"]',
      },
      stateClasses: {
        activeItem: 'mdl-header__nav-item--active',
        open: 'mdl-header--open',
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
  }

  toggleFlyout(event, delegate) {
    if (this.data.activeModal) {
      this.hideFlyout();
    }

    this.showFlyout(delegate);
  }

  showFlyout(delegate) {
    this.data.activeModal = document.querySelector(`#${delegate.getAttribute('data-modal')}`);

    this.data.activeModal.dispatchEvent(new CustomEvent('Modal.open'));

    this.ui.element.classList.add(this.options.stateClasses.open);
    this.ui.element.classList.add(this.options.colorClasses.monochrome);
    delegate.classList.add(this.options.stateClasses.activeItem);
  }

  hideFlyout() {
    this.data.activeModal.dispatchEvent(new CustomEvent('Modal.close'));
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
