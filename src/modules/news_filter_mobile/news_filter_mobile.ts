/*!
 * NewsFilterMobile
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { debounce } from 'lodash';
import Datepicker from '../datepicker/datepicker';

class NewsFilterMobile extends Module {
  public ui: {
    element: HTMLDivElement,
    sublevelItems: HTMLDivElement[],
    listItems: HTMLAnchorElement[],
    footer: HTMLDivElement,
    footerButton: HTMLButtonElement,
    container: HTMLDivElement,
    datePicker: HTMLDivElement,
  };

  public options: {
    inputDelay: number,
    visibilityDelay: number,
    focusDelay: number,
    keys: any,
    domSelectors: any,
    stateClasses: {};
  };

  public filterLists: any[];
  private visibleSublevelItem: HTMLDivElement;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      inputDelay: 250,
      visibilityDelay: 50,
      focusDelay: 300,
      domSelectors: {
        sublevelItems: '.mdl-news-filter-mobile__sublevel > div',
        listItems: '.atm-linklist_item[data-multiselect]',
        footer: '.mdl-news-filter-mobile__footer',
        footerButton: '.mdl-news-filter-mobile__footer button',
        sublevelFooterButton: '.mdl-news-filter-mobile__sublevel-footer button',
        container: '.mdl-news-filter-mobile__container',
        datePicker: '.mdl-datepicker',
      },
      stateClasses: {
        // activated: 'is-activated'
      },

    };
    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [];
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      setSelectedFilterItems: 'NewsFilterMobile.setSelectedItems',
      setDate: 'NewsFilterMobile.setDate', // external change
      dateSet: 'NewsFilterMobile.dateSet', // internal change
      clearDate: 'NewsFilterMobile.clearDate',
      confirm: 'NewsFilterMobile.confirm',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // ----------------
    // Select data events
    this.eventDelegate
      .on(NewsFilterMobile.events.setSelectedFilterItems, this.onSetSelectedFilterItems.bind(this))
      .on(NewsFilterMobile.events.setDate, this.onSetDate.bind(this))
      .on(NewsFilterMobile.events.clearDate, () => {
        this.ui.datePicker.dispatchEvent(new CustomEvent(Datepicker.events.clear));
      });
    // catch events from nested modules
    this.ui.datePicker.addEventListener(Datepicker.events.dateSet, this.emitDateSet.bind(this));
    this.ui.footerButton.addEventListener('click', () => {
      this.ui.element.dispatchEvent(new CustomEvent(NewsFilterMobile.events.confirm));
    });
    // ----------------
    // initialize focus handling
    this.ui.listItems.forEach((linkListItem) => {
      linkListItem.addEventListener('keydown', (evt) => {
        if (evt.key === 'ArrowDown') {
          const next = <HTMLElement>(<HTMLElement>evt.target).nextElementSibling;
          if (next) {
            next.focus();
          }
        }
        if (evt.key === 'ArrowUp') {
          const next = <HTMLElement>(<HTMLElement>evt.target).previousElementSibling;
          if (next) {
            next.focus();
          }
        }
      });
    });
    // -----------------------
    // initialize multiselects
    for (let i = 0; i < this.ui.listItems.length; i += 1) {
      this.filterLists.push([]);
      this.ui.listItems[i].addEventListener('click', (event) => {
        this.openSublevelItem(this.ui.sublevelItems[i], this.ui.listItems[i]);
        this.ui.sublevelItems[i].querySelector('input').value = '';
        this.ui.sublevelItems[i].querySelectorAll('li ').forEach((li) => {
          li.querySelector('input').checked = this.filterLists[i]
            .indexOf(li.querySelector('input').value) >= 0;
        });
        event.preventDefault();
      });
      this.initFilterSelect(this.ui.sublevelItems[i].querySelector('input'));
      this.ui.sublevelItems[i]
        .querySelector((<any> this.options.domSelectors).sublevelFooterButton)
        .addEventListener('click', () => {
          this.updateFilterList(i);
          this.closeSublevelItem(this.ui.sublevelItems[i]);
        });

      this.ui.sublevelItems[i].addEventListener('keydown', (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.stopPropagation();
          this.closeSublevelItem(this.ui.sublevelItems[i]);
        }
      });
      this.ui.sublevelItems[i].addEventListener('resize', () => {
        this.ui.sublevelItems[i].style.height = `${window.innerHeight}px`;
      });
      this.ui.sublevelItems[i]
        .querySelector('.mdl-news-filter-mobile__sublevel-backbutton')
        .addEventListener('click', () => {
          this.updateFilterList(i);
          this.closeSublevelItem(this.ui.sublevelItems[i]);
        });
      // Watch checkboxes and change style
      this.ui.sublevelItems[i].querySelectorAll('li').forEach((li) => {
        this.watch(li.querySelector('input'), 'checked', (key, before, after) => {
          if (after) {
            li.classList.add('selected');
          } else {
            li.classList.remove('selected');
          }
        });
      });
    }
  }

  /**
   * Open drilldown overlay
   * @param element
   * @param sender
   */
  openSublevelItem(element, sender) {
    this.visibleSublevelItem = sender;
    this.ui.container.classList.add('hidden');
    this.ui.container.setAttribute('aria-hidden', 'true');
    this.ui.footer.classList.add('hidden');
    this.ui.footer.setAttribute('aria-hidden', 'true');
    element.parentElement.classList.add('visible');
    element.setAttribute('aria-hidden', false);
    element.style.height = `${window.innerHeight}px`;
    setTimeout(() => {
      element.classList.add('visible');
      setTimeout(() => element.querySelector('a').focus(), this.options.focusDelay);
    }, this.options.visibilityDelay);
  }

  /**
   * Close a drill down overlay
   * @param element
   */
  closeSublevelItem(element) {
    this.ui.container.classList.remove('hidden');
    this.ui.container.removeAttribute('aria-hidden');
    this.ui.footer.classList.remove('hidden');
    this.ui.footer.removeAttribute('aria-hidden');
    element.classList.remove('visible');
    element.setAttribute('aria-hidden', true);
    this.visibleSublevelItem.focus();
    setTimeout(() => {
      element.parentElement.classList.remove('visible');
    }, this.options.visibilityDelay);
  }

  /**
   * Initialize multiselect filters
   * @param element
   */
  initFilterSelect(element) {
    const listElement = document.querySelector(`#${element.getAttribute('aria-controls')}`);
    const listItems = listElement.querySelectorAll('li');
    listItems.forEach((li) => {
      // ----------------
      // Handle key down events
      li.querySelector('input').addEventListener('keydown', (evt) => {
        const pressed = evt.key;
        let newTarget = <any>evt.target;
        if (pressed === 'ArrowUp' || pressed === 'ArrowDown'
          || pressed === 'Home' || pressed === 'End'
          || pressed === 'Tab') {
          if (pressed === 'ArrowUp' || pressed === 'ArrowDown') {
            let nextFocusable = pressed === 'ArrowUp'
              ? li.previousElementSibling
              : li.nextElementSibling;
            while (nextFocusable) {
              if (!nextFocusable.classList.contains('hidden')) {
                newTarget = nextFocusable.querySelector('input');
                break;
              }
              nextFocusable = pressed === 'ArrowUp'
                ? nextFocusable.previousElementSibling
                : nextFocusable.nextElementSibling;
            }
            newTarget.focus();
          }
          if (pressed === 'Home' || pressed === 'End') {
            const visibleElements = listElement.querySelectorAll('li:not(.hidden)');
            newTarget = (pressed === 'Home' ? visibleElements[0] : visibleElements[visibleElements.length - 1])
              .querySelector('input');
            newTarget.focus();
          }
          if (pressed === 'Tab') {
            if (evt.shiftKey) {
              element.focus();
            } else {
              li.parentElement.parentElement.nextElementSibling.querySelector('button').focus();
            }
          }
          evt.stopPropagation();
          evt.preventDefault();
        }
      });
    });

    // -------------------------------
    // Observe inputs and update values
    this.watch(element, 'value', debounce((key, before, after) => { // eslint-disable-line
      listItems.forEach((li) => {
        const regex = new RegExp(after, 'i');
        if (regex.test(li.querySelector('input').placeholder)) {
          li.classList.remove('hidden');
        } else {
          li.classList.add('hidden');
        }
      });
    }, this.options.inputDelay));
  }

  /**
   * Update a filter item
   * @param index
   */
  updateFilterList(index) {
    this.filterLists[index] = [];
    this.ui.sublevelItems[index].querySelectorAll('li').forEach((li) => {
      if (li.classList.contains('selected')) {
        this.filterLists[index].push(li.querySelector('input').value);
      }
    });
    this.emitSetSelectedFilterItems();
  }

  /**
   * Emit list change event
   */
  emitSetSelectedFilterItems() {
    this.ui.element.dispatchEvent(new CustomEvent(NewsFilterMobile.events.setSelectedFilterItems,
      {
        detail: {
          filterLists: this.filterLists,
        },
      }));
  }

  /**
   * Emit date change event
   */
  emitDateSet(event) {
    this.ui.element.dispatchEvent(new CustomEvent(NewsFilterMobile.events.dateSet,
      event));
  }

  /**
   * Emitted when items change
   * @param event
   */
  onSetSelectedFilterItems(event) {
    this.filterLists = event.detail.filterLists;

    // Update value text
    for (let i = 0; i < this.ui.listItems.length; i += 1) {
      this.ui.listItems[i].querySelector('.atm-linklist_item__text-subtitle')
        .innerHTML = this.filterLists[i].length < 1
          ? ''
          : this.ui.listItems[i]
            .getAttribute('data-subtitle-pattern')
            .replace('%', this.filterLists[i].length);
      this.ui.sublevelItems[i].querySelectorAll('li input')
        .forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = this.filterLists[i].indexOf(checkbox.value) >= 0;
        });
    }
  }

  /**
   * On date change event from outside
   * @param event
   */
  onSetDate(event) {
    (<HTMLInputElement> this.ui.datePicker
      .querySelector('.atm-form_input__input')).value = event.detail.dateString;
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default NewsFilterMobile;
