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
    }
  }

  public ui: {
    element: any,
    items: any,
    triggers: any,
    panelContent: any,
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
        verticalIcon: '[data-accordion="verticalIcon"]',
        trigger: '[data-accordion="trigger"]',
      },
      stateClasses: {
        open: 'mdl-accordion__item--open',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    // (<any>window).estatico.lineClamper.initLineClamping();

    this.initUi(true);
    this.initEventListeners();

    this.initTabindex();
  }

  toggleItem(event, eventDelegate) {
    const panel = eventDelegate.nextElementSibling;
    const item = eventDelegate.parentElement;
    const ariaExpanded = eventDelegate.getAttribute('aria-expanded') === 'true';

    if (ariaExpanded) {
      panel.style.maxHeight = '0px';
    } else {
      panel.style.maxHeight = `${this.calcHeight(panel)}px`;
    }

    eventDelegate.setAttribute('aria-expanded', !ariaExpanded);
    item.classList.toggle(this.options.stateClasses.open);
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
      this.setTabindex(panelContent.querySelectorAll(INTERACTION_ELEMENTS_QUERY), -1);
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
      focusable.setAttribute('tabindex', tabindex);
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
