import { Delegate } from 'dom-delegate';
import wrist from 'wrist';
import { debounce } from 'lodash';

import namespace from './namespace';

class Form {
  private ui: {
    element: HTMLElement,
  }

  private options: {
    watchEmitters: any,
    eventEmitters: any,
    inputClasses: any,
    validateDelay: number,
    messageClasses: any,
    messageSelector: string,
  }

  private eventDelegate: any;

  constructor(el) {
    this.ui = {
      element: el,
    };

    this.options = {
      validateDelay: 400,
      eventEmitters: {
        clearButton: '[data-buttontype="clear"]',
      },
      watchEmitters: {
        input: '[data-validation], [data-hasbutton="true"], [data-floating]',
      },
      inputClasses: {
        dirty: 'dirty',
        valid: 'valid',
        invalid: 'invalid',
      },
      messageSelector: '[data-message]',
      messageClasses: {
        show: 'show',
      },
    };

    this.eventDelegate = new Delegate(el);

    // Buttons are listened to
    this.addEventListeners();

    // Inputs will be watched
    this.addWatchers();
  }

  addEventListeners() {
    this.eventDelegate.on('click', this.options.eventEmitters.clearButton, this.clearField.bind(this));
    this.eventDelegate.on('keyup', this.options.watchEmitters.input, debounce(this.validateField.bind(this), this.options.validateDelay));
    this.eventDelegate.on('blur', this.options.watchEmitters.input, this.validateField.bind(this));
  }

  addWatchers() {
    const watchableInputs = this.ui.element.querySelectorAll(this.options.watchEmitters.input);

    watchableInputs.forEach((input) => {
      wrist.watch(input, 'value', (propName, oldValue, newValue) => {
        this.onInputValueChange(input, oldValue, newValue);
      });
    });
  }

  /**
   * Listener to on Inputs value change
   * @param domElement the input element which was modified
   * @param oldValue the value beforehand the change
   * @param newValue the value after the change a.k.a the current value
   */
  onInputValueChange(domElement, oldValue, newValue) {
    if (newValue.length !== 0) {
      domElement.classList.add(this.options.inputClasses.dirty);
    } else {
      domElement.classList.remove(this.options.inputClasses.dirty);
    }
  }

  /**
   * Clear the field
   * @param event event object
   * @param delegate the clear button, as it is event delegate
   */
  clearField(event, delegate) {
    const inputElement = delegate.parentElement.firstElementChild;
    inputElement.value = '';
  }

  validateField(event, delegate) {
    const validation = window[namespace].form.validateField(delegate);

    delegate.parentElement.querySelectorAll(this.options.messageSelector).forEach((message) => {
      message.classList.remove(this.options.messageClasses.show);
    });

    if (validation.validationResult) {
      delegate.classList.add(this.options.inputClasses.valid);
      delegate.classList.remove(this.options.inputClasses.invalid);
    } else {
      delegate.classList.add(this.options.inputClasses.invalid);
      delegate.classList.remove(this.options.inputClasses.valid);

      validation.messages.forEach((messageID) => {
        delegate.parentElement.querySelector(`[data-message="${messageID}"]`).classList.add('show');
      });
    }
  }
}

export default Form;