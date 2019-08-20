/*!
 * NewsFilterMobile
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

class NewsFilterMobile extends Module {
  public ui: {
    element: HTMLDivElement,
    sublevelItems: HTMLDivElement[],
    listItems: HTMLAnchorElement[],
    footer: HTMLDivElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        sublevelItems: '.mdl-news-filter-mobile__sublevel > div',
        listItems: '.atm-linklist_item',
        footer: '.mdl-news-filter-mobile__footer',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ NewsFilterMobile.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    for (let i = 1; i < this.ui.listItems.length; i += 1) {
      this.ui.listItems[i].addEventListener('click', (event) => {
        this.ui.sublevelItems[i - 1].parentElement.classList.add('visible');
        event.preventDefault();
      });
    }
    this.ui.sublevelItems.forEach((element) => {
      element.querySelector('svg').addEventListener('click', () => {
        element.parentElement.classList.remove('visible');
      });
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

export default NewsFilterMobile;
