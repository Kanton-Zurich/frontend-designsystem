/*!
 * Accordion
 *
 * @author
 * @copyright
 */

import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

class Accordion extends Module {
  public options: {
    domSelectors: {
      items: string,
      triggers: string,
      panel: string,
      panelContent: string,
      title: string,
    },
    stateClasses: {
      open: string,
    }
  }

  public ui: {
    element: any,
    items: any,
    triggers: any,
  }

  public data: {
    hasOpenItem: Boolean,
    openItems: Array<Number>,
  }

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
      },
      stateClasses: {
        open: 'mdl-accordion__item--open',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    (<any>window).estatico.lineClamper.initLineClamping();

    this.initUi();
    this.initEventListeners();
    this.initWachers();
  }

  /**
   * Toggling the item
   *
   * @param {string} propName in this case always checked
   * @param {Boolean} checkedBefore if the accordion was checked before click
   * @param {Boolean} checkedNow is it checked now
   * @param {Element} element The clicked element
   * @memberof Accordion
   */
  toggleItem(propName, checkedBefore, checkedNow, element) {
    const accordionItem = element.parentElement.parentElement;
    const panel = accordionItem.querySelector(this.options.domSelectors.panel);

    accordionItem.classList.toggle(this.options.stateClasses.open);

    if (checkedNow) {
      panel.style.maxHeight = `${this.calcHeight(accordionItem)}px`;
    } else {
      panel.style.maxHeight = '0px';
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
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(this.checkForOpen.bind(this));
  }

  /**
   * initializing the watchers
   *
   * @memberof Accordion
   */
  initWachers() {
    this.ui.triggers.forEach((trigger) => {
      this.watch(trigger, 'checked', this.toggleItem.bind(this));
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
