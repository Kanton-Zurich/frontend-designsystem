/*!
 * Search
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Autosuggest from '../../assets/js/helpers/autosuggest';
import Form from '../../assets/js/helpers/form.class';

import Modal from '../modal/modal';

class Search extends Module {
  public options: {
    url: string;
    domSelectors: any;
    stateClasses: any;
    searchPageUrl: string;
    minInputLength: number;
  };

  public data: {
    suggestions: Array<string>;
  };

  public ui: {
    element: HTMLDivElement;
    input: HTMLInputElement;
    template: HTMLScriptElement;
    autosuggest: HTMLDivElement;
    form: HTMLFormElement;
    clearButton: HTMLButtonElement;
    searchButton: HTMLButtonElement;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      suggestions: [],
    };
    const defaultOptions = {
      minInputLength: 3,
      domSelectors: {
        input: '[data-search="input"]',
        template: '[data-search="autosuggestTemplate"]',
        autosuggest: '[data-search="autosuggest"]',
        form: '[data-search="form"]',
        clearButton: '.mdl-search__clear',
        searchButton: '.mdl-search__button',
      },
      stateClasses: {
        noTags: 'mdl-search--hide-most-searched',
        dirty: 'dirty',
        disabled: 'atm-button--disabled',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.updateButtonStates();
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
      new Autosuggest(
        {
          input: this.ui.input,
          parent: this.ui.element,
          template: this.ui.template.innerHTML,
          target: this.ui.autosuggest,
          url: this.options.url,
          searchPageUrl: this.options.searchPageUrl,
          autoHide: true,
        },
        {}
      );
    });

    this.ui.clearButton.addEventListener('click', () => {
      this.clearInput();
    });

    // Show clear button when we search
    this.ui.input.addEventListener('input', () => {
      this.updateButtonStates();
    });

    this.ui.element.addEventListener(Modal.events.opened, () => {
      this.ui.input.focus();
    });

    // When the Autosuggest is used hide the tags
    this.ui.element.addEventListener(Autosuggest.events.filtered, () => {
      this.ui.element.classList.add(this.options.stateClasses.noTags);
    });

    // When the Autosuggest is reset show the tags again
    this.ui.element.addEventListener(Autosuggest.events.reset, () => {
      this.ui.element.classList.remove(this.options.stateClasses.noTags);
    });

    // Autosuggest search on enter
    this.ui.element.addEventListener(Autosuggest.events.termSelected, () => {
      this.ui.form.dispatchEvent(new Event('submit', { cancelable: true }));
    });

    // override default submit
    if (this.ui.form) {
      this.ui.form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.ui.input.value.length >= this.options.minInputLength) {
          window.location.href = `${this.options.searchPageUrl}?q=${encodeURIComponent(
            this.ui.input.value
          )}`;
        }
      });
    }
  }

  /**
   * Update button states based on input value
   */
  updateButtonStates() {
    const inputLength = this.ui.input.value.length;
    this.ui.clearButton.classList.toggle(this.options.stateClasses.dirty, !!inputLength);
    const isDisabled = inputLength < this.options.minInputLength;
    this.ui.searchButton.disabled = isDisabled;
    this.ui.searchButton.classList.toggle(this.options.stateClasses.disabled, isDisabled);
  }

  /**
   * Clear input field using the form helper
   */
  clearInput() {
    this.ui.input.value = '';
    this.updateButtonStates();
    this.ui.input.dispatchEvent(new CustomEvent(Form.events.clearInput));
    this.ui.input.focus();
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
