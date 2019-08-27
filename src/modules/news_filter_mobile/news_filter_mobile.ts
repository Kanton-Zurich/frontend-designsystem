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
    footerButton: HTMLButtonElement,
    topicFilterInput: HTMLInputElement,
    organisationFilterInput: HTMLInputElement,
  };

  public options: {
    inputDelay: number,
    visibilityDelay: number,
    keys: any,
    domSelectors: {},
    stateClasses: {};
  };

  public filterLists: any[];

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      inputDelay: 250,
      visibilityDelay: 50,
      domSelectors: {
        sublevelItems: '.mdl-news-filter-mobile__sublevel > div',
        listItems: '.atm-linklist_item',
        footer: '.mdl-news-filter-mobile__footer',
        topicFilterInput: '[data-topiclist="input"]',
        topicList: '[data-topilist="list"]',
        organisationFilterInput: '[data-organisationlist="input"]',
        footerButton: '.mdl-news-filter-mobile__footer',
      },
      stateClasses: {
        // activated: 'is-activated'
      },

    };
    super($element, defaultData, defaultOptions, data, options);
    this.filterLists = [[], []];
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
    // initialize multiselects
    for (let i = 1; i < this.ui.listItems.length; i += 1) {
      const idx = i - 1;
      this.ui.listItems[i].addEventListener('click', (event) => {
        this.openSublevelItem(this.ui.sublevelItems[idx]);

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
      this.ui.sublevelItems[i - 1].querySelector((<any> this.options.domSelectors).footerButton).addEventListener('click', () => {
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
      this.ui.sublevelItems[idx].addEventListener('keyup', (event) => {
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

  closeSublevelItem(element) {
    element.classList.remove('visible');
    setTimeout(() => {
      element.parentElement.classList.remove('visible');
    }, this.options.visibilityDelay);
  }

  openSublevelItem(element) {
    element.parentElement.classList.add('visible');
    element.querySelector('a').focus();
    setTimeout(() => {
      element.classList.add('visible');
    }, this.options.visibilityDelay);
  }

  initFilterSelect(element) {
    const listElement = document.querySelector(`#${element.getAttribute('aria-controls')}`);
    const listItems = listElement.querySelectorAll('li');
    listItems.forEach((li) => {
      li.querySelector('input').addEventListener('keydown', (evt) => {
        const pressed = evt.key;
        let newTarget = <any>evt.target;
        if (pressed === 'ArrowUp' || pressed === 'ArrowDown' || pressed === 'Home' || pressed === 'End') {
          listItems.forEach((item) => {
            item.classList.remove('focused');
          });
          if (pressed === 'ArrowUp' || pressed === 'ArrowDown') {
            let nextFocusable = pressed === 'ArrowUp'
              ? li.previousElementSibling
              : li.nextElementSibling;
            while (nextFocusable) {
              if (!nextFocusable.classList.contains('hidden')) {
                newTarget = nextFocusable.querySelector('input');
                break;
              }
              nextFocusable = pressed === this.options.keys.up
                ? nextFocusable.previousElementSibling
                : nextFocusable.nextElementSibling;
            }
          }
          if (pressed === 'Home' || pressed === 'End') {
            const visibleElements = listElement.querySelectorAll('li:not(.hidden)');
            newTarget = (pressed === 'Home' ? visibleElements[0] : visibleElements[visibleElements.length - 1])
              .querySelector('input');
          }
          newTarget.focus();
          newTarget.parentElement.classList.add('focused');
          evt.stopPropagation();
          evt.preventDefault();
        }
        if (pressed === 'Tab') {
          if (evt.shiftKey) {
            element.focus();
          } else {
            li.parentElement.parentElement.nextElementSibling.querySelector('button').focus();
          }
          evt.stopPropagation();
          evt.preventDefault();
        }
      });
      li.querySelector('input').addEventListener('keyup', (evt) => {
        const pressed = evt.key;
        if (pressed === 'ArrowUp' || pressed === 'ArrowDown' || pressed === 'Tab') {
          evt.stopPropagation();
          evt.preventDefault();
        }
      });
      li.addEventListener('click', () => {
        li.classList.toggle('selected');
      });
    });
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
