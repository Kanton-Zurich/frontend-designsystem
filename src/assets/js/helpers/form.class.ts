import { Delegate } from 'dom-delegate';
import wrist from 'wrist';
import { debounce } from 'lodash';
import DuplicationElement from './duplication.class';
import ZipCity from './zipCity';

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
    duplicateSelector: string,
    selectOptionSelector: string,
    inputSelector: string,
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
      selectOptionSelector: 'data-select-option',
      inputSelector: '[data-input]',
      messageClasses: {
        show: 'show',
      },
      duplicateSelector: '[data-form="duplicatable"]',
    };

    this.eventDelegate = new Delegate(el);

    // Buttons are listened to
    this.addEventListeners();

    // Inputs will be watched
    this.addWatchers();

    // Initialize duplication elements
    this.initDuplicationElements();
    this.initZipCity();
  }

  addEventListeners() {
    this.eventDelegate.on('click', this.options.eventEmitters.clearButton, this.clearField.bind(this));
    this.eventDelegate.on('keyup', this.options.watchEmitters.input, debounce((event, field) => {
      this.validateField(field);
    }, this.options.validateDelay));
    this.eventDelegate.on('blur', this.options.watchEmitters.input, (event, field) => {
      this.validateField(field);
    });
    this.eventDelegate.on('validateSection', this.validateSection.bind(this));
    this.eventDelegate.on('showFieldInvalid', (event) => {
      this.setValidClasses(event.detail.field, ['add', 'remove']);
    });
  }

  addWatchers(targetElement = this.ui.element) {
    const watchableInputs = targetElement.querySelectorAll(this.options.watchEmitters.input);

    watchableInputs.forEach((input) => {
      const inputType = input.getAttribute('type');

      switch (inputType) {
        case 'radio':
        case 'checkbox':
          wrist.watch(input, 'checked', () => {
            this.validateField(input);
          });
          break;
        default:
          wrist.watch(input, 'value', (propName, oldValue, newValue) => {
            this.onInputValueChange(input, oldValue, newValue);
          });
          break;
      }
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

  validateField(field) {
    const validation = window[namespace].form.validateField(field);

    field.closest(this.options.inputSelector).querySelectorAll(this.options.messageSelector)
      .forEach((message) => {
        message.classList.remove(this.options.messageClasses.show);
      });

    if (validation.validationResult) {
      this.setValidClasses(field);
    } else {
      this.setValidClasses(field, ['add', 'remove']);

      validation.messages.forEach((messageID) => {
        const message = field.closest(this.options.inputSelector).querySelector(`[data-message="${messageID}"]`);

        if (message) {
          message.classList.add('show');
        }
      });

      this.ui.element.setAttribute('form-has-errors', 'true');
    }
  }

  setValidClasses(field, functionArray: Array<string> = ['remove', 'add']) {
    let fieldType = field.getAttribute('type');
    const errorField = field.closest(this.options.inputSelector);

    if (field.hasAttribute(this.options.selectOptionSelector)) {
      fieldType = 'selectOption';
    }

    switch (fieldType) {
      case 'radio':
      case 'checkbox':
        errorField.classList[functionArray[0]](this.options.inputClasses.invalid);
        errorField.classList[functionArray[1]](this.options.inputClasses.valid);
        break;
      case 'selectOption':
        errorField.classList[functionArray[0]](this.options.inputClasses.invalid);
        errorField.classList[functionArray[1]](this.options.inputClasses.valid);
        break;
      default:
        errorField.classList[functionArray[0]](this.options.inputClasses.invalid);
        errorField.classList[functionArray[1]](this.options.inputClasses.valid);
    }
  }

  validateSection(event) {
    const formSection = event.detail.section;
    const fieldsInSection = formSection.querySelectorAll(this.options.watchEmitters.input);

    fieldsInSection.forEach(this.validateField.bind(this));

    const errorsInFields = formSection.querySelectorAll(`.${this.options.inputClasses.invalid}`).length > 0;

    if (errorsInFields) {
      this.ui.element.setAttribute('form-has-errors', 'true');
    } else {
      this.ui.element.removeAttribute('form-has-errors');
    }
  }

  initDuplicationElements() {
    const duplicationElements = this.ui.element.querySelectorAll(this.options.duplicateSelector);

    duplicationElements.forEach((duplicatableElement) => {
      new DuplicationElement(duplicatableElement);

      duplicatableElement.addEventListener(DuplicationElement.events.domReParsed, (event) => {
        this.addWatchers((<any>event).detail);
      });
    });
  }

  initZipCity() {
    const zipFields = this.ui.element.querySelectorAll('[data-fills-city]');

    zipFields.forEach(($zipField) => {
      const fillName = $zipField.getAttribute('data-fills-city');
      const $cityField = this.ui.element.querySelector(`[name="${fillName}"]`);

      new ZipCity($zipField, $cityField);
    });
  }
}

export default Form;
