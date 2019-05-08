/*!
 * ContextMenu
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

class ContextMenu extends Module {
  public options: {
    showImmediate: Boolean,
    attachTo: HTMLElement,
    domSelectors: any,
    stateClasses: {
      active: string;
    },
  }

  public data: {
    copiedNode: HTMLElement,
    isActive: Boolean,
    escapeEvent: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      copiedNode: null,
      isActive: false,
      escapeEvent: null,
    };
    const defaultOptions = {
      showImmediate: false,
      attachTo: null,
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
      },
      stateClasses: {
        active: 'mdl-context_menu--active',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    if (this.options.showImmediate) {
      this.show();
    }
  }

  /**
   * Toggling between the states
   *
   * @memberof ContextMenu
   */
  toggle() {
    if (this.data.isActive) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * showing the menu
   *
   * @memberof ContextMenu
   */
  show() {
    // First we want to hide all other context menus which are active
    this.closeOther();

    this.data.isActive = true;

    this.copyDomNode();
    this.positionMenu();
    this.addEscapeEvent();
  }

  /**
   * Hiding the menu
   *
   * @memberof ContextMenu
   */
  hide() {
    this.data.isActive = false;

    this.removeDomNode();

    window.removeEventListener('keydown', this.data.escapeEvent);
  }

  /**
   * Copying the dome node to the end of the body
   *
   * @memberof ContextMenu
   */
  copyDomNode() {
    this.data.copiedNode = this.ui.element.cloneNode(true);

    this.data.copiedNode.classList.add(this.options.stateClasses.active);
    this.data.copiedNode.addEventListener('hide', this.hide.bind(this));

    document.body.appendChild(this.data.copiedNode);
  }

  /**
   * Positioning the context menu to its attachTo Node
   *
   * @memberof ContextMenu
   */
  positionMenu() {
    const attachToPos = this.options.attachTo.getBoundingClientRect();
    const documentScrollTop = document.documentElement.scrollTop;

    this.data.copiedNode.style.top = `${attachToPos.top + documentScrollTop + attachToPos.height}px`;
    this.data.copiedNode.style.left = `${attachToPos.left}px`;

    // Check if context menu is not completely visible, then put it above attach to target
    const copiedNodeRect = this.data.copiedNode.getBoundingClientRect();
    const contextMenuBottomPoint = copiedNodeRect.top + copiedNodeRect.height;


    if (contextMenuBottomPoint > document.documentElement.clientHeight) {
      this.data.copiedNode.style.top = `${attachToPos.top + documentScrollTop - copiedNodeRect.height}px`;
    }
  }

  /**
   * Close other context menus
   *
   * @memberof ContextMenu
   */
  closeOther() {
    const activeContextMenus = document.querySelectorAll(`.${this.options.stateClasses.active}`);

    activeContextMenus.forEach((actMenu) => {
      actMenu.dispatchEvent(new CustomEvent('hide'));
    });
  }

  /**
   * Adding event to handle escape
   *
   * @memberof ContextMenu
   */
  addEscapeEvent() {
    this.data.escapeEvent = (keyEvent) => {
      if (this.data.isActive && keyEvent.key === 'Escape') {
        this.hide();
      }
    };

    window.addEventListener('keydown', this.data.escapeEvent);
  }

  /**
   * Removing the copied dom node
   *
   * @memberof ContextMenu
   */
  removeDomNode() {
    document.body.removeChild(this.data.copiedNode);

    this.data.copiedNode = null;
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('show', this.show.bind(this))
      .on('hide', this.hide.bind(this))
      .on('toggle', this.toggle.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      if (this.data.isActive) {
        this.positionMenu();
      }
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default ContextMenu;
