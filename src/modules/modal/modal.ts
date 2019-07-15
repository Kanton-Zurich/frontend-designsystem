/*!
 * Modal
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';


class Modal extends Module {
  private parentScrollPosition: number;
  private closeOnEscapeFunction: any;
  private hasCloseBtn: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        closeButton: '.mdl-page-header__closebutton',
      },
      stateClasses: {
        show: 'mdl-modal--show',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      openModal: 'Modal.open',
      setModalContent: 'Modal.setCloseButton',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.closeOnEscapeFunction = this.closeOnEscape.bind(this);
    const closeButton = this.ui.element.querySelector(this.options.domSelectors.closeButton);
    if (closeButton) {
      closeButton.addEventListener('click',
        () => {
          this.closeModal();
        });
      this.hasCloseBtn = true;
    }
    this.eventDelegate.on('Modal.open', () => {
      window.addEventListener('keydown', this.closeOnEscapeFunction);
      this.parentScrollPosition = document.documentElement.scrollTop;
      this.ui.element.classList.add(this.options.stateClasses.show);
      this.ui.element.focus();
      this.ui.element.scrollTo(0, 0);
    });
    this.eventDelegate.on('Modal.setCloseButton', () => {
      if (!this.hasCloseBtn) {
        const closeBtn = this.ui.element.querySelector(this.options.domSelectors.closeButton);
        if (closeBtn) {
          closeBtn.addEventListener('click',
            () => {
              this.closeModal();
            });
        }
      }
    });
  }

  closeOnEscape(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.closeModal();
    }
  }

  closeModal() {
    this.ui.element.classList.remove(this.options.stateClasses.show);
    document.documentElement.scrollTo(0, this.parentScrollPosition);
    window.removeEventListener('keydown', this.closeOnEscapeFunction);
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
