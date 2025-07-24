import Module from '../../assets/js/helpers/module';

class Accordion extends Module {
  public options: {
    domSelectors: {
      items: string;
      triggers: string;
      panel: string;
      panelContent: string;
      title: string;
      verticalIcon: string;
      trigger: string;
    };
    stateClasses: {
      open: string;
      transitionEnd: string;
      togglesAll: string;
    };
    transitionTime: number;
  };

  public ui: {
    element: HTMLElement;
    items: any;
    triggers: any;
    panelContent: any;
  };

  public data: {
    hasOpenItem: boolean;
    openItems: Array<string>;
    idTriggers: Array<any>;
    resizeObserver: ResizeObserver;
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
    this.initUi(['items', 'triggers', 'panelContent']);
    this.initEventListeners();

    // Check for ids in case an url parameter matches
    this.ui.triggers.forEach((trigger) => {
      if (trigger.id) {
        this.data.idTriggers.push({
          item: trigger,
          id: trigger.id,
        });
      }
    });

    // check panelcontent for ids, open item if id is in url
    this.ui.items.forEach((item) => {
      const panelContent = item.querySelector(defaultOptions.domSelectors.panelContent);
      const trigger = item.querySelector(defaultOptions.domSelectors.trigger);
      if (panelContent && trigger) {
        const ids = panelContent.innerHTML.match(/id="([^"]*)(?=")/g);
        if (ids) {
          ids.forEach((id) => {
            // loop over each id and add an idTrigger for each of it.
            const cleanId = id.replace('id="', '');
            this.data.idTriggers.push({
              item: trigger,
              id: cleanId,
              target: document.getElementById(cleanId),
            });
          });
        }
      }
    });

    // toggle items with the this.options.stateClasses.open class
    this.ui.items.forEach((item) => {
      if (item.classList.contains(this.options.stateClasses.open)) {
        this.data.hasOpenItem = true;
        this.toggleItem(null, item.querySelector(defaultOptions.domSelectors.trigger), false);
      }
    });

    // add ResizeObserver with callback
    this.data.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const panel = entry.target.parentElement as HTMLDivElement;

        panel.style.maxHeight = `${this.calcHeight(panel)}px`;
      });
    });

    // observe panelContent with resize observer
    this.ui.items.forEach((item) => {
      const panel = item.querySelector(defaultOptions.domSelectors.panel);

      if (panel) {
        const panelContent = panel.querySelector(this.options.domSelectors.panelContent);

        this.data.resizeObserver.observe(panelContent);
      }
    });

    this.checkURL();
    this.togglesAll = this.ui.element.classList.contains(this.options.stateClasses.togglesAll);
  }

  static get events() {
    return {
      clearSubheads: 'Accordion.clearSubheads',
      updateSubheads: 'Accordion.updateSubheads',
      resizeHeight: 'Accordion.resizeHeight',
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
      }
    });
  }

  toggleItem(event, eventDelegate, reflectURL = true) {
    const panel = eventDelegate.parentElement.nextElementSibling;
    const item = eventDelegate.parentElement.parentElement;
    const ariaExpanded = eventDelegate.getAttribute('aria-expanded') === 'true';

    if (ariaExpanded) {
      this.closeItem(item);
    } else {
      // URL reflection
      if (eventDelegate.id && eventDelegate.id.length > 0 && reflectURL) {
        const url = new URL(window.location.href);
        url.hash = eventDelegate.id;
        window.history.replaceState({ accordionZH: eventDelegate.id }, '', url);
      }

      panel.style.display = 'block';
      panel.style.maxHeight = `${this.calcHeight(panel)}px`;
      item.classList.add(this.options.stateClasses.open);

      // Adding extra class to set overflow to visible, so dropdowns are seen completely
      setTimeout(() => {
        item.classList.add(this.options.stateClasses.transitionEnd);
        if (panel.offsetWidth || panel.offsetHeight || panel.getClientRects().length) {
          panel.style.maxHeight = `${this.calcHeight(panel)}px`;
        }
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
          panel.style.maxHeight = '0px';

          const subHead = triggerEl.querySelector<HTMLElement>('.mdl-accordion__subhead');
          if (subHead) {
            this.updateSubhead(panel, subHead);
          }

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
    const itemId = eventDelegate
      .closest(this.options.domSelectors.items)
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
          const selectEl = inEl
            .closest('.mdl-select')
            .querySelector('.atm-form_input__trigger-label');
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

    return panelContent.offsetHeight;
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

    window.addEventListener(
      'hashchange',
      () => {
        this.checkURL();
      },
      false
    );

    this.eventDelegate.on(
      'keydown',
      this.options.domSelectors.trigger,
      this.handleKeyOnTrigger.bind(this)
    );
    this.eventDelegate.on('click', this.options.domSelectors.trigger, this.toggleItem.bind(this));
    this.eventDelegate.on(Accordion.events.clearSubheads, this.clearSubheads.bind(this));
    this.eventDelegate.on(Accordion.events.updateSubheads, this.updateSubheads.bind(this));
    this.eventDelegate.on(
      'transitionend',
      this.options.domSelectors.panel,
      this.itemTransitionEnd.bind(this)
    );
  }

  updateFlyingFocus() {
    (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
    this.data.resizeObserver.disconnect();
  }
}

export default Accordion;
