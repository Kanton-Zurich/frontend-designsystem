/*!
 * Dialog
 *
 * @author
 * @copyright
 */
import Form from '../../assets/js/helpers/form.class';
import Module from '../../assets/js/helpers/module';

class Dialog extends Module {
  private parentScrollPosition: number;
  private closeButton: HTMLButtonElement;
  private hasCloseBtn: boolean;
  private isolatedElements: HTMLElement[];

  public options: {
    domSelectors: any;
    stateClasses: any;
    transitionTime: number;
  };

  public ui: {
    element: HTMLDivElement;
    form: HTMLFormElement;
    submitButton: HTMLButtonElement;
    resetButton: HTMLButtonElement;
    initiable: NodeList;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      transitionTime: 280,
      domSelectors: {
        window: '.mdl-dialog__window',
        form: '.mdl-dialog__form',
        closeButton: '.mdl-dialog__close',
        close: '[data-dialog="close"]',
        submitButton: '[data-dialog="submit"]',
        resetButton: '[data-dialog="reset"]',
        additionalActionButton: '.mdl-dialog__additional-action',
        focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        initiable: '[data-init]',
      },
      stateClasses: {
        beforeShow: 'mdl-dialog--before-show',
        show: 'mdl-dialog--show',
        transHide: 'mdl-dialog--transition-hide',
        beforeHide: 'mdl-dialog--before-hide',
        hide: 'mdl-dialog--hide',
        noTransitionShow: 'mdl-dialog--no-transition-show',
        opened: 'mdl-dialog--opened',
        openDialog: 'open-dialog',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.isolatedElements = [];

    this.initUi(['initiable']);
    this.initContent();
    this.initEventListeners();
  }

  static get events() {
    return {
      openDialog: 'Dialog.open',
      initContent: 'Dialog.initContent',
      closeDialog: 'Dialog.close',
      display: 'Dialog.display',
      closed: 'Dialog.closed',
      opened: 'Dialog.opened',
      additionalAction: 'Dialog.additionalAction',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on(Dialog.events.openDialog, this.openDialog.bind(this));
    this.eventDelegate.on(Dialog.events.initContent, () => {
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
    this.eventDelegate.on(Dialog.events.closeDialog, this.closeDialog.bind(this));
    this.eventDelegate.on('click', this.options.domSelectors.close, (event) => {
      if (event.srcElement.getAttribute('data-dialog') === 'close') {
        this.closeDialog();
      }
    });
    window.addEventListener('keydown', this.closeOnEscape.bind(this));

    this.eventDelegate.on('click', this.options.domSelectors.additionalActionButton, () => {
      window.dispatchEvent(
        new CustomEvent(Dialog.events.additionalAction, { detail: { sender: this } })
      );
    });

    this.ui.element.querySelector(this.options.domSelectors.form).addEventListener('submit', () => {
      this.closeDialog();
    });

    // move to the end of the DOM
    (<any>window).estatico.helpers.bodyElement.appendChild(this.ui.element);

    /**
     * IOS Safari 10 fix background scrolling since apples safari creates tons of problems
     *
    let clientY = null; // remember Y position on touch start
    this.ui.element.addEventListener('touchstart', (event) => {
      if (event.targetTouches.length === 1) {
        // detect single touch
        clientY = event.targetTouches[0].clientY; // eslint-disable-line
      }
    }, false);

    this.ui.element.addEventListener('touchmove', (event) => {
      if (event.targetTouches.length === 1) {
        // detect single touch
        this.disableRubberBand(event, clientY);
      }
    }, false); */
  }

  /**
   * Initialize sub modules to make them functional
   */
  initContent() {
    this.closeButton = this.ui.element.querySelector(this.options.domSelectors.closeButton);
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.closeDialog.bind(this));
      this.hasCloseBtn = true;
    }
  }

  closeOnEscape(event) {
    const { activeElement } = document;

    if (activeElement.tagName !== 'INPUT') {
      if ((event.key === 'Escape' || event.key === 'Esc') && this.isolatedElements.length > 0) {
        this.closeDialog();
      }
    }
  }

  /**
   * Open the dialog and isolate content
   */
  openDialog() {
    // isolate dialog
    this.isolatedElements = [];
    (<any>window).estatico.helpers.bodyElement.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        if (!(<HTMLElement>child).getAttribute('aria-hidden')) {
          (<HTMLElement>child).setAttribute('aria-hidden', 'true');
          this.isolatedElements.push(child);
        }
      }
    });

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
    }, 1);
    this.ui.element.focus();
    this.ui.element.scrollTop = 0;

    // If there is the navigation topic list a child, then load the navigation
    if (this.ui.initiable.length > 0) {
      this.ui.initiable.forEach((target) => {
        target.dispatchEvent(new CustomEvent(Dialog.events.display));
      });
    }

    setTimeout(() => {
      this.ui.element.classList.add(this.options.stateClasses.opened);
      window.dispatchEvent(new CustomEvent(Dialog.events.opened, { detail: { sender: this } }));

      if (this.ui.initiable.length > 0) {
        this.ui.initiable.forEach((target) => {
          target.dispatchEvent(new CustomEvent(Dialog.events.opened));
        });
      }
      this.ui.form.dispatchEvent(new CustomEvent(Form.events.resizeForm));
      this.dispatchVerticalResizeEvent();
    }, this.options.transitionTime);

    document.body.classList.add(this.options.stateClasses.openDialog);
  }

  /**
   * Close the dialog
   */
  closeDialog() {
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
      const focusOrigin = document.querySelector(
        `[aria-controls="${this.ui.element.getAttribute('id')}"]`
      );
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
    window.dispatchEvent(new CustomEvent(Dialog.events.closed, { detail: { sender: this } }));

    document.body.classList.remove(this.options.stateClasses.openDialog);
    document.documentElement.scrollTop = this.parentScrollPosition;
  }

  /* private disableRubberBand(event, elementClientY) {
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
  } */

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Dialog;
