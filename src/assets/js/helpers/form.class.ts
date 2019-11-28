import { Delegate } from 'dom-delegate';
import wrist from 'wrist';
import { debounce } from 'lodash';
import DuplicationElement from './duplication.class';
import ZipCity from './zipCity';
import FormRules from './formrules.class';
import FileUpload from '../../../modules/file_upload/file_upload';

import namespace from './namespace';
import Datepicker from '../../../modules/datepicker/datepicker';

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
    domSelectors: {
      floating: string;
    };
    messageSelector: string,
    duplicateSelector: string,
    selectOptionSelector: string,
    inputSelector: string,
    rulesSelector: string,
    padding: number,
    prefixSelector: string,
  }

  private eventDelegate: any;

  constructor(el) {
    this.ui = {
      element: el,
    };

    this.options = {
      validateDelay: 400,
      padding: 16,
      eventEmitters: {
        clearButton: '[data-buttontype="clear"]',
      },
      watchEmitters: {
        input: '[data-validation], [data-hasbutton="true"], [data-floating]',
        datePickerInput: '.flatpickr_input, [data-validation], [data-hasbutton="true"], [data-floating]',
      },
      inputClasses: {
        dirty: 'dirty',
        valid: 'valid',
        invalid: 'invalid',
      },
      domSelectors: {
        floating: '[data-floating]',
      },
      messageSelector: '[data-message]',
      selectOptionSelector: 'data-select-option',
      inputSelector: '[data-input]',
      rulesSelector: '[data-rules]',
      prefixSelector: '.atm-form_input--unitLeft',
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

    // Initialize rules
    this.initRules();

    // Init fields with prefix
    this.initPrefix();

    // set dirty from start
    this.setDirtyFromStart();
  }

  static get events() {
    return {
      clearInput: 'Input.clear',
    };
  }

  addEventListeners() {
    this.eventDelegate.on('click', this.options.eventEmitters.clearButton, this.clearField.bind(this));
    this.eventDelegate.on('keyup', this.options.watchEmitters.input, debounce((event, field) => {
      if (field.type !== 'radio') this.validateField(field);
      if (field.type === 'number' || field.type === 'text') {
        this.checkIfFieldDirty(field);
      }
    }, this.options.validateDelay));
    this.eventDelegate.on('blur', this.options.watchEmitters.input, (event, field) => {
      if (field.type !== 'file' && field.type !== 'radio' && !field.classList.contains('flatpickr-input')) this.validateField(field);
    });
    this.ui.element.querySelectorAll(this.options.watchEmitters.datePickerInput)
      .forEach((input) => {
        input.addEventListener(Datepicker.events.close, (event) => {
          this.validateField(event.target);
        });
      });
    this.ui.element.querySelectorAll(this.options.watchEmitters.input).forEach((input) => {
      input.addEventListener('validateDeferred', (event) => {
        this.validateField(event.detail.field);
      });
    });
    this.eventDelegate.on('validateSection', this.validateSection.bind(this));
    this.eventDelegate.on('showFieldInvalid', (event) => {
      this.setValidClasses(event.detail.field, ['add', 'remove']);
    });
    this.eventDelegate.on(FileUpload.events.duplicated, (event) => {
      this.addWatchers(event.detail);
    });
    this.eventDelegate.on('blur', this.options.domSelectors.floating, (event, field: HTMLInputElement) => {
      this.checkIfFieldDirty(field);
    });
  }

  private checkIfFieldDirty(field: HTMLInputElement): void {
    const dirtyClass = this.options.inputClasses.dirty;
    const { classList } = field;
    if (field.value && field.value.length > 0) {
      if (!classList.contains(dirtyClass)) {
        classList.add(dirtyClass);
      }
    } else {
      classList.remove(dirtyClass);
    }
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
        case 'file':
          wrist.watch(input, 'files', () => {
            this.validateField(input);
          });
          break;
        default:
          wrist.watch(input, 'value', (propName, oldValue, newValue) => {
            // prevent datepicker for being validated as its being validated on a close event
            if (!input.classList.contains('flatpickr-input')) {
              this.onInputValueChange(input, oldValue, newValue);
            }
          });
          break;
      }
    });
  }

  /**
   * Checks if input field already has value and sets the classes accordingly
   *
   * @memberof Form
   */
  setDirtyFromStart() {
    const inputs = this.ui.element.querySelectorAll('input');

    inputs.forEach((input) => {
      if (input.value.length > 0) {
        input.classList.add(this.options.inputClasses.dirty);
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

      this.validateField(domElement);
    } else {
      domElement.classList.remove(this.options.inputClasses.dirty);
      domElement.closest(this.options.inputSelector)
        .classList.remove(this.options.inputClasses.valid);
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
    inputElement.focus();

    inputElement.dispatchEvent(new CustomEvent(Form.events.clearInput));
  }

  validateField(field) {
    const validation = window[namespace].form.validateField(field);
    const fileTimeout = 5;

    
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

      if (validation.files) {
        setTimeout(() => {
          validation.files.forEach((validationResult) => {
            const fileContainer = field.closest(this.options.inputSelector).querySelector(`[data-file-id="${validationResult.id}"]`);

            validationResult.errors.forEach((error) => {
              fileContainer.querySelector(`[data-message="${error}"]`).classList.add('show');
            });
          });
        }, fileTimeout);
      }

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
        if (field.value.length > 0 || field.hasAttribute('required')) {
          errorField.classList[functionArray[0]](this.options.inputClasses.invalid);
          errorField.classList[functionArray[1]](this.options.inputClasses.valid);
        }
    }
  }

  validateSection(event) {
    const formSections = event.detail.sections;

    formSections.forEach((section) => {
      const fieldsInSection = section.querySelectorAll(this.options.watchEmitters.input);

      fieldsInSection.forEach(this.validateField.bind(this));
    });

    const errorsInFields = this.ui.element.querySelectorAll(`.${this.options.inputClasses.invalid}`).length > 0;

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


  initRules() {
    const rulesElements = this.ui.element.querySelectorAll(this.options.rulesSelector);

    rulesElements.forEach(($elementWithARule) => {
      new FormRules($elementWithARule);
    });
  }

  initPrefix() {
    const inputWithPrefix = this.ui.element.querySelectorAll(this.options.prefixSelector);
    const paddingMultiplier = 1.5;

    inputWithPrefix.forEach((prefixedInput) => {
      const unit = prefixedInput.querySelector('.atm-form_input__unit');
      const unitWidth = unit.getBoundingClientRect().width;
      const input = prefixedInput.querySelector('input');

      input.style.paddingLeft = `${unitWidth + this.options.padding * paddingMultiplier}px`;
    });
  }
}

export default Form;
