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
    hasOpenItem: boolean,
    openItems: Array<string>,
    idTriggers: Array<any>,
  };

  // Flag controlling toggling behaviour.
  // If true only one item is open, as others are closed on toggle.
  private togglesAll: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      hasOpenItem: true,
      openItems: [],
      idTriggers: [],
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

    // Check for ids in case an url parameter matches
    this.ui.triggers.forEach((trigger) => {
      if (typeof trigger.id !== 'undefined' && trigger.id.length > 0) {
        this.data.idTriggers.push({
          item: trigger,
          id: trigger.id,
        });
      }
    });

    this.checkURL();

    this.togglesAll = this.ui.element.classList.contains(this.options.stateClasses.togglesAll);
  }

  static get events() {
    return {
      clearSubheads: 'Accordion.clearSubheads',
      updateSubheads: 'Accordion.updateSubheads',
    };
  }

  /**
   * Checks on initialization if the URL contains an panel-trigger-id as hash
   * and if so open it via triggering a click on the trigger
   */
  checkURL() {
    const urlParameter = window.location.href.split('#')[1];

    this.data.idTriggers.forEach((trigger) => {
      if (urlParameter === trigger.id && trigger.item.getAttribute('aria-expanded') === 'false') {
        trigger.item.click();

        trigger.item.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  }

  toggleItem(event, eventDelegate) {
    const panel = eventDelegate.parentElement.nextElementSibling;
    const item = eventDelegate.parentElement.parentElement;
    const ariaExpanded = eventDelegate.getAttribute('aria-expanded') === 'true';
    const verticalIcon = document.documentElement.classList.contains('is-ie') ? item.querySelector(this.options.domSelectors.verticalIcon) : null;

    if (ariaExpanded) {
      this.closeItem(item);
    } else {
      // URL reflection
      if (eventDelegate.id && eventDelegate.id.length > 0) {
        window.history.pushState({ accordionZH: eventDelegate.id }, '', `#${eventDelegate.id}`);
      }
      panel.style.display = 'block';
      panel.style.maxHeight = `${this.calcHeight(panel)}px`;

      // CZHDEV - 424, if ie add manual transform
      if (verticalIcon) verticalIcon.setAttribute('transform', 'rotate(90)');

      item.classList.add(this.options.stateClasses.open);

      // Adding extra class to set overflow to visible, so dropdowns are seen completely
      setTimeout(() => {
        item.classList.add(this.options.stateClasses.transitionEnd);
        this.updateFlyingFocus();
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
      this.data.openItems.push(eventDelegate.id);
    }
    this.dispatchVerticalResizeEvent(this.options.transitionTime);
  }

  closeItem(item: HTMLElement) {
    if (item.querySelector) {
      const panel = item.querySelector<HTMLElement>(this.options.domSelectors.panel);
      const triggerEl = item.querySelector<HTMLElement>(this.options.domSelectors.trigger);
      if (panel && triggerEl) {
        if (triggerEl.getAttribute('aria-disabled') !== 'true') {
          const verticalIcon = document.documentElement.classList.contains('is-ie') ? item.querySelector(this.options.domSelectors.verticalIcon) : null;

          panel.style.maxHeight = '0px';

          const subHead = triggerEl.querySelector<HTMLElement>('.mdl-accordion__subhead');
          if (subHead) {
            this.updateSubhead(panel, subHead);
          }

          if (verticalIcon) verticalIcon.removeAttribute('transform');

          item.classList.remove(this.options.stateClasses.open);
          item.classList.remove(this.options.stateClasses.transitionEnd);

          triggerEl.setAttribute('aria-expanded', 'false');
          this.data.openItems.splice(this.data.openItems.indexOf(triggerEl.id), 1);
        }
      }
    }
  }

  /**
   * Ends the transition of a panelItem in setting it's display style to 'none'.
   * @param event
   * @param eventDelegate
   */
  itemTransitionEnd(event, eventDelegate) {
    const itemId = eventDelegate.closest(this.options.domSelectors.items)
      .querySelector(this.options.domSelectors.trigger).id;
    if (!this.data.openItems.includes(itemId)) {
      eventDelegate.style.display = 'none';
    }
  }

  updateSubhead(panel: HTMLElement, subHead: HTMLElement) {
    const inputElements = panel.querySelectorAll<HTMLInputElement>('input');
    if (inputElements.length) {
      const sectionVals: string[] = [];
      inputElements.forEach((inEl) => {
        // select option
        if (inEl.hasAttribute('data-select-option') && inEl.checked) {
          const selectEl = inEl.closest('.mdl-select').querySelector('.atm-form_input__trigger-label');
          const labelEl = panel.querySelector<HTMLLabelElement>(`label[for=${inEl.id}]`);
          const valStr = `${selectEl.childNodes[0].nodeValue}: ${labelEl.childNodes[0].nodeValue}`;
          sectionVals.push(valStr.trim());

        // radio button or checkbox
        } else if ((inEl.type === 'radio' || inEl.type === 'checkbox') && inEl.checked) {
          const labelEl = panel.querySelector<HTMLLabelElement>(`label[for=${inEl.id}]`);
          sectionVals.push(labelEl.childNodes[0].nodeValue.trim());

        // text or datepicker
        } else if (inEl.type === 'text') {
          if (inEl.value) {
            sectionVals.push(`${inEl.placeholder}: ${inEl.value}`.trim());
          }
        }
      });
      subHead.innerText = sectionVals.join(', ');
    }
  }

  updateSubheads() {
    for (let i = 0; i < this.ui.items.length; i += 1) {
      if (!this.ui.items[i].classList.contains(this.options.stateClasses.open)) {
        const panel = this.ui.items[i].querySelector(this.options.domSelectors.panel);
        const subHead = this.ui.items[i].querySelector('.mdl-accordion__subhead');

        if (subHead) {
          this.updateSubhead(panel, subHead);
        }
      }
    }
  }

  clearSubheads() {
    const subheads = this.ui.element.querySelectorAll('.mdl-accordion__subhead');

    for (let i = 0; i < subheads.length; i += 1) {
      (<HTMLElement>subheads[i]).innerText = '';
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
    if (this.ui.element.hasAttribute('data-accordion-store-origin')) {
      this.eventDelegate.on('click', `${this.options.domSelectors.panelContent} a`, () => {
        window.sessionStorage.setItem('origin', window.location.href);
      });
    }

    (<any>WindowEventListener).addDebouncedResizeListener(this.checkForOpen.bind(this));
    window.addEventListener('hashchange', () => {
      this.checkURL();
    }, false);

    this.eventDelegate.on('keydown', this.options.domSelectors.trigger, this.handleKeyOnTrigger.bind(this));
    this.eventDelegate.on('click', this.options.domSelectors.trigger, this.toggleItem.bind(this));
    this.eventDelegate.on(Accordion.events.clearSubheads, this.clearSubheads.bind(this));
    this.eventDelegate.on(Accordion.events.updateSubheads, this.updateSubheads.bind(this));
    this.eventDelegate.on('transitionend', this.options.domSelectors.panel, this.itemTransitionEnd.bind(this));
  }


  updateFlyingFocus() {
    (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
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
