/*!
 * NewsFilterMobile
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { debounce } from 'lodash';

class NewsFilterMobile extends Module {
  public ui: {
    element: HTMLDivElement,
    sublevelItems: HTMLDivElement[],
    listItems: HTMLAnchorElement[],
    footer: HTMLDivElement,
    container: HTMLDivElement,
  };

  public options: {
    inputDelay: number,
    visibilityDelay: number,
    focusDelay: number,
    keys: any,
    domSelectors: {},
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
        listItems: '.atm-linklist_item',
        footer: '.mdl-news-filter-mobile__footer',
        footerButton: '.mdl-news-filter-mobile__footer button',
        sublevelFooterButton: '.mdl-news-filter-mobile__sublevel-footer button',
        container: '.mdl-news-filter-mobile__container',
      },
      stateClasses: {
        // activated: 'is-activated'
      },

    };
    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [[], [], []];
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
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
    for (let i = 1; i < this.ui.listItems.length; i += 1) {
      const idx = i - 1;
      this.ui.listItems[i].addEventListener('click', (event) => {
        this.openSublevelItem(this.ui.sublevelItems[idx], this.ui.listItems[i]);

        this.ui.sublevelItems[idx].querySelector('input').value = '';
        this.ui.sublevelItems[idx].querySelectorAll('li').forEach((li) => {
          if (this.filterLists[idx].indexOf(li.querySelector('input').value) < 0) {
            li.classList.remove('selected');
          } else {
            li.classList.add('selected');
          }
        });
        event.preventDefault();
      });
      this.initFilterSelect(this.ui.sublevelItems[idx].querySelector('input'));
      this.ui.sublevelItems[i - 1].querySelector((<any> this.options.domSelectors).sublevelFooterButton).addEventListener('click', () => {
        this.filterLists[idx] = [];
        this.ui.sublevelItems[idx].querySelectorAll('li').forEach((li) => {
          if (li.classList.contains('selected')) {
            this.filterLists[idx].push(li.querySelector('input').value);
          }
        });
        this.closeSublevelItem(this.ui.sublevelItems[idx]);
        this.ui.listItems[i].querySelector('.atm-linklist_item__text-subtitle').innerHTML = this.filterLists[idx].length < 1
          ? ''
          : this.ui.listItems[i]
            .getAttribute('data-subtitle-pattern').replace('%', this.filterLists[idx].length);
      });
      this.ui.sublevelItems[idx].addEventListener('keydown', (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.stopPropagation();
          this.closeSublevelItem(this.ui.sublevelItems[idx]);
        }
      });
      this.ui.sublevelItems[idx].querySelector('.mdl-news-filter-mobile__sublevel-backbutton').addEventListener('click', () => {
        this.closeSublevelItem(this.ui.sublevelItems[idx]);
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
      // ----------------
      // Click event
      li.addEventListener('click', () => {
        li.classList.toggle('selected');
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
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default NewsFilterMobile;
