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
  private headerHeight: number;
  public scrollThreshold: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        pageHeader: '.mdl-page-header',
        closeButton: '.mdl-page-header__closebutton',
      },
      stateClasses: {
        show: 'mdl-modal--show',
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
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.closeOnEscapeFunction = this.closeOnEscape.bind(this);
    this.initContent();
    this.eventDelegate.on('Modal.open', () => {
      window.addEventListener('keydown', this.closeOnEscapeFunction);
      this.parentScrollPosition = document.documentElement.scrollTop;
      this.ui.element.classList.add(this.options.stateClasses.show);
      this.ui.element.focus();
      this.ui.element.scrollTo(0, 0);
      this.updateOnScroll(0);
      this.updateSizing();
      document.documentElement.style.overflowY = 'hidden';
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
  }

  initContent() {
    const closeButton = this.ui.element.querySelector(this.options.domSelectors.closeButton);
    this.ui.element.addEventListener('scroll', (event) => {
      this.updateOnScroll(event.target.scrollTop);
    });
    if (closeButton) {
      closeButton.addEventListener('click',
        () => {
          this.closeModal();
        });
      this.hasCloseBtn = true;
    }
  }

  updateOnScroll(scrollTop) {
    const pageHeader = this.ui.element.querySelector(this.options.domSelectors.pageHeader);
    if (pageHeader) {
      const pageLogo = pageHeader.querySelector('.mdl-page-header__logo-container');
      const headerContainer = pageHeader.querySelectorAll('.cell')[1];
      if (scrollTop > this.scrollThreshold) {
        pageLogo.classList.remove('tiny-2');
        headerContainer.classList.remove('tiny-10', 'xsmall-10', 'small-10');
        pageHeader.classList.add('mdl-page-header--minimal');
        pageLogo.classList.add('tiny-0');
        headerContainer.classList.add('tiny-6', 'xsmall-6', 'small-7');
      } else {
        pageHeader.classList.remove('mdl-page-header--minimal');
        pageLogo.classList.remove('tiny-0');
        headerContainer.classList.remove('tiny-6', 'xsmall-6', 'small-7');
        pageLogo.classList.add('tiny-2');
        headerContainer.classList.add('tiny-10', 'xsmall-10', 'small-10');
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
