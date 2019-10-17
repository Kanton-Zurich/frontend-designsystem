/*!
 * Search
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Autosuggest from '../../assets/js/helpers/autosuggest';

import Modal from '../modal/modal';

class Search extends Module {
  public options: {
    url: string,
    domSelectors: any,
    stateClasses: any,
  }

  public data: {
    suggestions: Array<string>,
  }

  public ui: {
    element: HTMLDivElement,
    input: HTMLInputElement,
    template: HTMLScriptElement,
    autosuggest: HTMLDivElement,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      suggestions: [],
    };
    const defaultOptions = {
      domSelectors: {
        input: '[data-search="input"]',
        template: '[data-search="autosuggestTemplate"]',
        autosuggest: '[data-search="autosuggest"]',
      },
      stateClasses: {
        noTags: 'mdl-search--hide-tags',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Search.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.element.addEventListener(Modal.events.display, async () => {
      new Autosuggest({
        input: this.ui.input,
        parent: this.ui.element,
        template: this.ui.template.innerHTML,
        target: this.ui.autosuggest,
        url: this.options.url,
      }, {});
    });

    // When the Autosuggest is used hide the tags
    this.ui.element.addEventListener(Autosuggest.events.filtered, () => {
      this.ui.element.classList.add(this.options.stateClasses.noTags);
    });

    // When the Autosuggest is reset show the tags again
    this.ui.element.addEventListener(Autosuggest.events.reset, () => {
      this.ui.element.classList.remove(this.options.stateClasses.noTags);
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

export default Search;
