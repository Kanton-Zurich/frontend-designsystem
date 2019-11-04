/*!
 * Accordion
 *
 * @author
 * @copyright
 */

import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

import { INTERACTION_ELEMENTS_QUERY } from '../../assets/js/helpers/constants';

class Accordion extends Module {
  public options: {
    domSelectors: {
      items: string,
      triggers: string,
      panel: string,
      panelContent: string,
      title: string,
      verticalIcon: string,
      trigger: string,
    },
    stateClasses: {
      open: string,
      transitionEnd: string,
      togglesAll: string,
    }
    transitionTime: number,
  };

  public ui: {
    element: HTMLElement,
    items: any,
    triggers: any,
    panelContent: any,
  };

  public data: {
    hasOpenItem: Boolean,
    openItems: Array<Number>,
  };

  // Flag controlling toggling behaviour. If true only one item is open, as others are closed on toggle.
  private togglesAll: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      hasOpenItem: true,
      openItems: [],
    };
    const defaultOptions = {
      domSelectors: {
        items: '[data-accordion="item"]',
        triggers: '[data-accordion="trigger"]',
        panel: '[data-accordion="panel"]',
        panelContent: '[data-accordion="panel-content"]',
        title: '[data-accordion="title"]',
        verticalIcon: '[data-accordion="verticalIcon"]',
        trigger: '[data-accordion="trigger"]',
      },
      stateClasses: {
        open: 'mdl-accordion__item--open',
        transitionEnd: 'mdl-accordion__item--transition-end',
        togglesAll: 'mdl-accordion--toggleall',
      },
      transitionTime: 100,
    };

    super($element, defaultData, defaultOptions, data, options);

    // (<any>window).estatico.lineClamper.initLineClamping();

    this.initUi(['items', 'triggers', 'panelContent']);
    this.initEventListeners();

    this.initTabindex();

    this.togglesAll = this.ui.element.classList.contains(this.options.stateClasses.togglesAll);
  }

  toggleItem(event, eventDelegate) {
    const panel = eventDelegate.parentElement.nextElementSibling;
    const item = eventDelegate.parentElement.parentElement;
    const ariaExpanded = eventDelegate.getAttribute('aria-expanded') === 'true';
    const verticalIcon = document.documentElement.classList.contains('is-ie') ? item.querySelector(this.options.domSelectors.verticalIcon) : null;

    if (ariaExpanded) {
      this.closeItem(item);
    } else {
      panel.style.maxHeight = `${this.calcHeight(panel)}px`;

      panel.setAttribute('aria-hidden', 'false');

      this.setTabindex([].slice.call(panel.querySelectorAll(INTERACTION_ELEMENTS_QUERY)), null);

      // CZHDEV - 424, if ie add manual transform
      if (verticalIcon) verticalIcon.setAttribute('transform', 'rotate(90)');

      item.classList.add(this.options.stateClasses.open);

      // Adding extra class to set overflow to visible, so dropdowns are seen completely
      setTimeout(() => {
        item.classList.add(this.options.stateClasses.transitionEnd);
      }, this.options.transitionTime);

      // Close others
      if (this.togglesAll) {
        const parent = item.parentElement;
        if (parent) {
          parent.childNodes.forEach((el) => {
            if (el !== item) {
              this.closeItem(el);
            }
          });
        }
      }
      eventDelegate.setAttribute('aria-expanded', true);
    }
  }

  closeItem(item: HTMLElement) {
    if (item.querySelector) {
      const panel = item.querySelector<HTMLElement>(this.options.domSelectors.panel);
      const triggerEl = item.querySelector<HTMLElement>(this.options.domSelectors.trigger);
      if (panel && triggerEl) {
        if (triggerEl.getAttribute('aria-disabled') !== 'true') {
          const verticalIcon = document.documentElement.classList.contains('is-ie') ? item.querySelector(this.options.domSelectors.verticalIcon) : null;

          panel.style.maxHeight = '0px';

          panel.setAttribute('aria-hidden', 'true');

          this.setTabindex([].slice.call(panel.querySelectorAll(INTERACTION_ELEMENTS_QUERY)), '-1');

          if (verticalIcon) verticalIcon.removeAttribute('transform');

          item.classList.remove(this.options.stateClasses.open);
          item.classList.remove(this.options.stateClasses.transitionEnd);

          triggerEl.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }

  /**
   * Calculating the height of the panel to fully display the accordion item
   *
   * @param {Element} item
   * @memberof Accordion
   */
  calcHeight(item) {
    const panelContent = item.querySelector(this.options.domSelectors.panelContent);
    const panelContentChildren = Array.prototype.slice.call(panelContent.children);
    let completeHeight = 0;

    panelContentChildren.forEach((child) => {
      if (typeof child.offsetHeight !== 'undefined') {
        const styles = window.getComputedStyle(child);
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

        completeHeight += Math.ceil(child.offsetHeight + margin);
      }
    });

    return completeHeight;
  }

  /**
   * Iterating through items and recalcing the height of the open ones
   *
   * @memberof Accordion
   */
  checkForOpen() {
    this.ui.items.forEach((item) => {
      if (item.classList.contains(this.options.stateClasses.open)) {
        const panel = item.querySelector(this.options.domSelectors.panel);

        panel.style.maxHeight = `${this.calcHeight(item)}px`;
      }
    });
  }

  /**
   * Catching the event key to preventing default
   *
   * @param {*} event
   * @memberof Accordion
   * @returns {boolean} If the event is allowed to continue its default propagation
   */
  handleKeyOnTrigger(event) {
    if (event.key === 'Enter') {
      event.target.click();

      return false;
    }

    return true;
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(this.checkForOpen.bind(this));

    this.eventDelegate.on('keydown', this.options.domSelectors.trigger, this.handleKeyOnTrigger.bind(this));
    this.eventDelegate.on('click', this.options.domSelectors.trigger, this.toggleItem.bind(this));
  }

  /**
   * Initializing the tabindex for all focusable children of panelContent(s)
   *
   * @memberof Accordion
   */
  initTabindex() {
    this.ui.panelContent.forEach((panelContent) => {
      this.setTabindex([].slice
        .call(panelContent.querySelectorAll(INTERACTION_ELEMENTS_QUERY)), -1);
    });
  }

  /**
   * Setting the tabindex for a list of focusable elements
   *
   * @param {NodeList} focusableElements
   * @param {Number} tabindex -1 or 0
   * @memberof Accordion
   */
  setTabindex(focusableElements, tabindex) {
    focusableElements.forEach((focusable) => {
      if (tabindex) {
        focusable.setAttribute('tabindex', tabindex);
      } else {
        focusable.removeAttribute('tabindex');
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

export default Accordion;
