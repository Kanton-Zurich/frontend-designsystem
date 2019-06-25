/*!
 * Breadcrumb
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';

import WindowEventListener from '../../assets/js/helpers/events';
import { timingSafeEqual } from 'crypto';

class Breadcrumb extends Module {
  public ui: {
    element: any,
    item: any,
    ellipsis: any,
    showContext: any,
    contextMenu: any,
    contextMenuItem: Array<HTMLElement>,
  }

  public data: {
    itemsWiderThanElement: Boolean,
    hiddenItems: Array<Number>,
    hideableItems: Number,
    windowWidth: Number,
  }

  public options: {
    domSelectors: {
      item: string,
      ellipsis: string,
      showContext: string,
    },
    stateClasses: {
      visible: string,
      hidden: string,
    }
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      itemsWiderThanElement: false,
      hiddenItems: [],
    };
    const defaultOptions = {
      customTrigger: false,
      domSelectors: {
        item: '[data-breadcrumb="item"]',
        ellipsis: '[data-breadcrumb="ellipsis"]',
        showContext: '[data-breadcrumb="showContext"]',
        contextMenu: '.mdl-context_menu',
        contextMenuItem: '[data-context-menu="item"]',
      },
      stateClasses: {
        visible: 'mdl-breadcrumb__item--visible',
        hidden: 'mdl-breadcrumb__item--hidden',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    if (this.ui.item.length) {
      this.data.windowWidth = document.documentElement.clientWidth;

      // eslint-disable-next-line no-magic-numbers
      this.data.hideableItems = this.ui.item.length - 2;
      this.checkSpace();
      this.moveEllipsis();
      this.initContextMenu();
    }
  }

  /**
   * Checking the widths to check if certain elements have to be hidden
   */
  isElementNotEnoughWide() {
    const { scrollWidth, clientWidth } = this.ui.element;

    return scrollWidth > clientWidth;
  }

  /** Check if space is available for Breadcrumb */
  checkSpace() {
    let hideItem = this.data.hiddenItems.length + 1;

    while (this.isElementNotEnoughWide()
    && this.data.hiddenItems.length <= this.data.hideableItems) {
      this.hideItem(hideItem);

      hideItem += 1;
    }
  }

  /**
   * Hiding the defined item, and enabling it in the context menu
   * @param itemIndex <Number> the index of the breadcrumb path item
   */
  hideItem(itemIndex) {
    this.ui.item[itemIndex].classList.add(this.options.stateClasses.hidden);

    this.data.hiddenItems.push(itemIndex);

    this.showItemInContextMenu(itemIndex);

    if (this.data.hiddenItems.length > 0) {
      this.ui.ellipsis.classList.add(this.options.stateClasses.visible);
    }
  }

  unhideItem(itemIndex) {
    this.ui.item[itemIndex].classList.remove(this.options.stateClasses.hidden);

    this.data.hiddenItems.filter(value => value === itemIndex);

    if (this.data.hiddenItems.length === 0) {
      this.ui.ellipsis.classList.remove(this.options.stateClasses.visible);
    }
  }

  showItemInContextMenu(itemIndex) {
    this.ui.contextMenuItem[itemIndex - 1].style.display = 'flex';
  }

  hideItemInContextMenu(itemIndex) {
    this.ui.contextMenuItem[itemIndex - 1].removeAttribute('style');
  }

  /**
   * Moving the ellipsis to its correct position
   */
  moveEllipsis() {
    const secondItem = this.ui.item[1];
    const ellipsis = this.ui.ellipsis.cloneNode(true);

    const newEllipsis = this.ui.element.insertBefore(ellipsis, secondItem);

    this.ui.ellipsis.remove();

    this.ui.ellipsis = newEllipsis;
    this.ui.showContext = newEllipsis.querySelector('[data-breadcrumb="showContext"]');
  }

  initContextMenu() {
    const { ellipsis, showContext, contextMenu } = this.ui;

    new ContextMenu(contextMenu, {}, {
      attachTo: ellipsis,
      trigger: showContext,
    });
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      const windowWidth = document.documentElement.clientWidth;

      if (windowWidth > this.data.windowWidth) {

      } else if (windowWidth < this.data.windowWidth) {
        this.checkSpace();
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

export default Breadcrumb;
