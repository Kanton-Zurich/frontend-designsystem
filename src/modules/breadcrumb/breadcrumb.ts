/*!
 * Breadcrumb
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';

import WindowEventListener from '../../assets/js/helpers/events';
import type { NodeLink } from '../edirectory/edirectory';
import Modal from '../modal/modal';

class Breadcrumb extends Module {
  public ui: {
    element: HTMLOListElement;
    ellipsis: HTMLLIElement;
    showContext: HTMLButtonElement;
    contextMenu: HTMLDivElement;
    templateLink: HTMLTemplateElement;
    templateActive: HTMLTemplateElement;
    templateContext: HTMLTemplateElement;
  };

  public data: {
    itemsWiderThanElement: boolean;
    hiddenItems: Array<number>;
    windowWidth: number;
    mobileBreakpoint: number;
    isBackOnly: boolean;
  };

  public options: {
    hasContextMenu: boolean;
    internalReferrerLink: string;
    domSelectors: {
      item: string;
      ellipsis: string;
      showContext: string;
      contextMenu: string;
      contextMenuItem: string;
      templateLink: string;
      templateActive: string;
      templateContext: string;
    };
    stateClasses: {
      visible: string;
      hidden: string;
      backOnly: string;
      parentOnly: string;
      parentItem: string;
    };
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
        templateLink: '[data-breadcrumb="template-link"]',
        templateActive: '[data-breadcrumb="template-active"]',
        templateContext: '[data-breadcrumb="template-context"]',
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

    if (this.ui.element.classList.contains('mdl-breadcrumb--backlink')) {
      let actualReferrer = null;

      if (this.ui.element.hasAttribute('data-storage')) {
        actualReferrer = window.sessionStorage.getItem(
          this.ui.element.getAttribute('data-storage')
        );
      }
      const backlink = this.ui.element.querySelector('a');
      const referrer = document.createElement('a');
      referrer.href = document.referrer;

      if (actualReferrer) {
        backlink.href = actualReferrer;
      } else if (
        document.referrer &&
        document.referrer.length > 0 &&
        backlink.hostname === referrer.hostname
      ) {
        backlink.href = document.referrer;
      }
    } else {
      this.initEventListeners();
    }
  }

  setData(data: { title: string; breadcrumbs: NodeLink[] }) {
    const { breadcrumbs, title } = data;
    if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) return;

    // Clear breadcrumb items from the breadcrumb list
    Array.from(this.ui.element.children)
      .filter((el: HTMLElement) => el.tagName === 'LI' && el.dataset.breadcrumb !== 'ellipsis')
      .forEach((el: HTMLLIElement) => el.remove());
    this.data.hiddenItems = [];

    // Clear context menu items from the context menu
    const ellipsis = this.ui.element.querySelector(this.options.domSelectors.ellipsis);
    this.ui.contextMenu = this.ui.element.querySelector(this.options.domSelectors.contextMenu);
    this.ui.contextMenu.querySelector('.mdl-context_menu__list').textContent = '';

    // Insert breadcrumb items into the breadcrumb list
    breadcrumbs.forEach((breadcrumb, i) => {
      const temp = this.ui.templateLink.content.firstElementChild.cloneNode(true) as HTMLElement;
      const link = temp.querySelector('a');
      if (link) {
        link.textContent = breadcrumb.title;
        if (i === 0) {
          temp.querySelector('svg').toggleAttribute('hidden', true);
          link.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.ui.element
              .closest('.mdl-modal')
              .dispatchEvent(new CustomEvent(Modal.events.closeModal));
          });
        } else {
          link.href = `#${breadcrumb.id}`;
          if (i === breadcrumbs.length - 1)
            temp.classList.add(this.options.stateClasses.parentItem);

          // Insert context menu item for breadcrumb items except the last one
          if (i < breadcrumbs.length) {
            const contextMenuItem = this.ui.templateContext.content.firstElementChild.cloneNode(
              true
            ) as HTMLLIElement;
            const menuItemLink = contextMenuItem.querySelector('a');
            menuItemLink.href = `#${breadcrumb.id}`;
            const menuItemLabel = contextMenuItem.querySelector('span');
            menuItemLabel.textContent = breadcrumb.title;
            this.ui.contextMenu
              .querySelector('.mdl-context_menu__list')
              .appendChild(contextMenuItem);
          }
        }
      }
      this.ui.element.insertBefore(temp, ellipsis);
    });

    // Append active item to the breadcrumb list
    const active = this.ui.templateActive.content.firstElementChild.cloneNode(true) as HTMLElement;
    active.querySelector('span').textContent = title;
    this.ui.element.insertBefore(active, ellipsis);

    // Initialize context menu
    this.options.hasContextMenu = true;
    this.data.windowWidth = document.documentElement.clientWidth;

    this.checkSpace();
    this.moveEllipsis();
    this.initContextMenu();
  }

  /** Check if space is available for Breadcrumb */
  checkSpace() {
    const hasOverflow = () => {
      const { scrollWidth, clientWidth } = this.ui.element;
      return scrollWidth > clientWidth;
    };

    const setBackOnly = (force: boolean) => {
      const method = force ? 'add' : 'remove';
      this.ui.element.classList[method](this.options.stateClasses.backOnly);
      this.ui.element.classList[method](this.options.stateClasses.parentOnly);
      this.data.isBackOnly = force;
    };

    const toggleItem = (itemIndex: number, force: boolean) => {
      let method = force ? 'remove' : 'add';
      this.ui.element
        .querySelectorAll(this.options.domSelectors.item)
        [itemIndex].classList[method](this.options.stateClasses.hidden);
      force
        ? this.data.hiddenItems.splice(itemIndex - 1, 1)
        : this.data.hiddenItems.push(itemIndex);
      this.ui.contextMenu
        .querySelector(`li:nth-child(${itemIndex})`)
        .toggleAttribute('hidden', force);
    };

    if (this.data.isBackOnly) setBackOnly(false);
    if (hasOverflow()) {
      let item = this.data.hiddenItems.length + 1;

      const lastHideableItem =
        this.ui.element.querySelectorAll(this.options.domSelectors.item).length - 2; // eslint-disable-line no-magic-numbers
      while (hasOverflow() && item <= lastHideableItem) {
        toggleItem(item, false);
        item += 1;
      }
      const windowWidth = window.innerWidth;
      if (hasOverflow() || windowWidth < this.data.mobileBreakpoint) setBackOnly(true);
    } else {
      if (this.data.isBackOnly) setBackOnly(false);
      let item = this.data.hiddenItems.length;
      let notTooWide = true;
      while (item > 0 && notTooWide) {
        toggleItem(item, true);
        if (hasOverflow()) {
          this.checkSpace();
          notTooWide = false;
        }
        item -= 1;
      }
    }
    const method = this.data.hiddenItems.length ? 'add' : 'remove';
    this.ui.ellipsis.classList[method](this.options.stateClasses.visible);
  }

  /**
   * Moving the ellipsis to its correct position
   */
  moveEllipsis() {
    const ellipsis = this.ui.ellipsis.cloneNode(true) as HTMLLIElement;
    this.ui.element.insertBefore(
      ellipsis,
      Array.from(this.ui.element.querySelectorAll(this.options.domSelectors.item))[1]
    );
    this.ui.ellipsis.remove();
    this.ui.ellipsis = ellipsis;
    this.ui.showContext = ellipsis.querySelector(this.options.domSelectors.showContext);
  }

  initContextMenu() {
    const { ellipsis, showContext, contextMenu } = this.ui;
    new ContextMenu(
      contextMenu,
      {},
      {
        attachTo: ellipsis,
        trigger: showContext,
      }
    );
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      this.data.windowWidth = document.documentElement.clientWidth;
      this.checkSpace();
    });

    this.ui.element.addEventListener('Component.setData', (event: CustomEvent) => {
      this.setData(event.detail);
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
