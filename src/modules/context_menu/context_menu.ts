/*!
 * ContextMenu
 *
 * @author
 * @copyright
 */
import { uniqueId } from 'lodash';

import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

import { INTERACTION_ELEMENTS_QUERY } from '../../assets/js/helpers/constants';

class ContextMenu extends Module {
  public options: {
    showImmediate: Boolean,
    attachTo: HTMLElement,
    trigger: HTMLElement,
    domSelectors: any,
    stateClasses: {
      active: string;
    },
  };

  public data: {
    copiedNode: HTMLElement,
    isActive: Boolean,
    escapeEvent: any,
    uniqueId: string,
  };

  public hideListener: any;


  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      copiedNode: null,
      isActive: false,
      escapeEvent: null,
      uniqueId: '',
    };
    const defaultOptions = {
      showImmediate: false,
      attachTo: null,
      trigger: null,
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
      },
      stateClasses: {
        active: 'mdl-context_menu--active',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.hideListener = () => {
      this.hide();
    };

    this.initUi();
    this.initEventListeners();

    this.initARIA();

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

    this.options.trigger.setAttribute('aria-expanded', 'true');

    this.setFocusOnOpen();

    // deferred event to listen for clicking outside, this is removed
    // as soon as the menu is destroyed or hidden
    setTimeout(() => {
      document.addEventListener('click', this.hideListener);
    }, 100);
  }

  /**
   * Hiding the menu
   *
   * @memberof ContextMenu
   */
  hide() {
    // remove deferred hide listener
    document.removeEventListener('click', this.hideListener);
    this.data.isActive = false;

    this.removeDomNode();

    window.removeEventListener('keydown', this.data.escapeEvent);

    this.options.trigger.setAttribute('aria-expanded', 'false');

    // Setting the focus on the trigger
    this.options.trigger.focus();
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

    this.ui.element.removeAttribute('id');
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
    this.data.copiedNode.style.maxWidth = `${attachToPos.width}px`;

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
      if (this.data.isActive && (keyEvent.key === 'Escape' || keyEvent.key === 'Esc')) {
        this.hide();
      }
    };

    window.addEventListener('keydown', this.data.escapeEvent);
  }

  /**
   * Setting the focus on the first "focusable" element in the context menu
   *
   * @memberof ContextMenu
   */
  setFocusOnOpen() {
    (<HTMLElement>this.data.copiedNode.querySelector(INTERACTION_ELEMENTS_QUERY)).focus(); //eslint-disable-line
  }

  /**
   * Removing the copied dom node
   *
   * @memberof ContextMenu
   */
  removeDomNode() {
    document.body.removeChild(this.data.copiedNode);

    this.ui.element.setAttribute('id', this.data.uniqueId);

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

  initARIA() {
    this.data.uniqueId = uniqueId('contextmenu');

    this.options.trigger.setAttribute('aria-controls', this.data.uniqueId);
    this.ui.element.setAttribute('id', this.data.uniqueId);
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
