/*!
 * Breadcrumb
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';

import WindowEventListener from '../../assets/js/helpers/events';

class Breadcrumb extends Module {
  public ui: {
    element: any,
    item: any,
    ellipsis: any,
    showContext: any,
    contextMenu: any,
    contextMenuItem: Array<any>,
  };

  public data: {
    itemsWiderThanElement: boolean,
    hiddenItems: Array<number>,
    hideableItems: number,
    windowWidth: number,
    mobileBreakpoint: number,
    isBackOnly: boolean,
  };

  public options: {
    hasContextMenu: boolean,
    internalReferrerLink: string,
    domSelectors: {
      item: string,
      ellipsis: string,
      showContext: string,
    },
    stateClasses: {
      visible: string,
      hidden: string,
      backOnly: string,
      parentOnly: string,
      parentItem: string,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      itemsWiderThanElement: false,
      hiddenItems: [],
      mobileBreakpoint: 400,
    };
    const defaultOptions = {
      customTrigger: false,
      internalReferrerLink: $element.dataset.internalReferrerLink,
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
        backOnly: 'mdl-breadcrumb--backlink',
        parentOnly: 'mdl-breadcrumb--parent-only',
        parentItem: 'mdl-breadcrumb__item--parent',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    if (!this.ui.element.classList.contains('mdl-breadcrumb--backlink')) {
      this.initUi(['contextMenuItem', 'item']);
      this.initEventListeners();

      this.options.hasContextMenu = this.ui.item.length > 1;
      this.setParentItem();

      if (this.ui.item.length) {
        this.data.windowWidth = document.documentElement.clientWidth;

        // eslint-disable-next-line no-magic-numbers
        this.data.hideableItems = this.ui.item.length - 2;
        this.checkSpace();
        this.moveEllipsis();
        this.initContextMenu();
      }
    } else {
      let actualReferrer = null;

      if (this.ui.element.hasAttribute('data-storage')) {
        actualReferrer = window.localStorage.getItem(this.ui.element.getAttribute('data-storage'));
      }
      const internalReferrer = this.ui.item.querySelector('a');
      const referrer = document.createElement('a');
      referrer.href = document.referrer;

      this.ui.item.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (actualReferrer) {
          window.location.href = actualReferrer;
        } else if (document.referrer
            && document.referrer.length > 0
            && internalReferrer.hostname === referrer.hostname) { // eslint-disable-line
          window.history.back();
        }
      });
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
    && hideItem <= this.data.hideableItems) {
      this.hideItem(hideItem);

      hideItem += 1;
    }
    const windowWidth = window.innerWidth;

    if (this.isElementNotEnoughWide() || windowWidth < this.data.mobileBreakpoint) {
      this.setBackOnly();
    }
  }

  /**
   * Check space after the resize actually enlarged the screen
   */
  checkSpaceAfterWidening() {
    if (this.data.isBackOnly) {
      this.removeBackOnly();
    }

    let unhideItem = this.data.hiddenItems.length;
    let notTooWide = true;

    while (unhideItem > 0 && notTooWide) {
      this.unhideItem(unhideItem);

      if (this.isElementNotEnoughWide()) {
        this.checkSpace();

        notTooWide = false;
      }

      unhideItem -= 1;
    }
  }


  setBackOnly() {
    this.ui.element.classList.add(this.options.stateClasses.backOnly);
    this.ui.element.classList.add(this.options.stateClasses.parentOnly);

    this.data.isBackOnly = true;
  }

  removeBackOnly() {
    this.ui.element.classList.remove(this.options.stateClasses.backOnly);
    this.ui.element.classList.remove(this.options.stateClasses.parentOnly);

    this.data.isBackOnly = false;
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

  /**
   * Makes an element visible again and hides in the context menu
   * @param itemIndex <Number> the index of the breadcrumb path item
   */
  unhideItem(itemIndex) {
    this.ui.item[itemIndex].classList.remove(this.options.stateClasses.hidden);

    this.data.hiddenItems.splice(itemIndex - 1, 1);

    if (this.data.hiddenItems.length === 0) {
      this.ui.ellipsis.classList.remove(this.options.stateClasses.visible);
    }
  }

  /**
   * Show Item in context menu
   *
   * @param {Number} itemIndex
   * @memberof Breadcrumb
   */
  showItemInContextMenu(itemIndex) {
    this.ui.contextMenuItem[itemIndex - 1].style.display = 'flex';
  }

  /**
   * Hide item in context menu
   *
   * @param {Number} itemIndex
   * @memberof Breadcrumb
   */
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
        this.checkSpaceAfterWidening();
      } else if (windowWidth < this.data.windowWidth) {
        this.checkSpace();
      }

      this.data.windowWidth = windowWidth;
    });
  }

  setParentItem() {
    const secondLast = 2;
    const parentIndex = this.ui.item.length - secondLast;

    if (this.ui.item[parentIndex]) {
      this.ui.item[parentIndex].classList.add(this.options.stateClasses.parentItem);
    } else {
      this.ui.item[0].classList.add(this.options.stateClasses.parentItem);
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

export default Breadcrumb;
