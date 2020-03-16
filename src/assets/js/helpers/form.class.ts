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
  };

  private options: {
    watchEmitters: any,
    eventEmitters: any,
    inputClasses: any,
    validateDelay: number,
    messageClasses: any,
    domSelectors: {
      floating: string;
      datepicker: string;
      backdrop: string;
    };
    messageSelector: string,
    duplicateSelector: string,
    selectOptionSelector: string,
    inputSelector: string,
    rulesSelector: string,
    padding: number,
    prefixSelector: string,
  };

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
        datepicker: '[data-init="datepicker"]',
        backdrop: '.atm-form_input__backdrop',
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
    // Initialize Datepickers when not happened yet
    this.initDatepickers();

    // set dirty from start
    this.setDirtyFromStart();
  }

  static get events() {
    return {
      clearInput: 'Input.clear',
      initInput: 'Input.initialize',
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
    this.eventDelegate.on(Form.events.initInput, (event) => {
      const { input } = event.detail;
      this.addInputElementWatchers(input);
    });
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
      this.addInputElementWatchers(input);
    });
  }

  addInputElementWatchers(input) {
    const inputType = input.getAttribute('type');
    switch (inputType) {
      case 'radio':
      case 'checkbox':
        wrist.watch(input, 'checked', () => {
          this.validateField(input);
        });
        break;
      case 'file':
        input.addEventListener('change', () => {
          this.validateField(input);
        });
        break;
      default:

        wrist.watch(input, 'value', (propName, oldValue, newValue) => {
          // prevent datepicker for being validated as its being validated on a close event
          this.onInputValueChange(input, oldValue, newValue, input.classList.contains('flatpickr-input') === false);
        });
        if (input.hasAttribute('data-input-mask')) {
          this.onInputMask(input, '', input.value);
        }
        break;
    }
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
  onInputValueChange(domElement, oldValue, newValue, revalidate = true) {
    if (revalidate) {
      if (newValue.length !== 0) {
        domElement.classList.add(this.options.inputClasses.dirty);
        this.validateField(domElement);
      } else {
        domElement.classList.remove(this.options.inputClasses.dirty);
        domElement.closest(this.options.inputSelector)
          .classList.remove(this.options.inputClasses.valid);
      }
    }
    this.onInputMask(domElement, oldValue, newValue);
  }

  /**
   * Prepare and process input mask
   * @param domElement
   * @param oldValue
   * @param newValue
   */
  onInputMask(domElement, oldValue, newValue) {
    /* Backdrop mask */
    const maskPlaceholder = domElement.getAttribute('data-mask-placeholder');
    let backdrop = domElement.parentElement.querySelector(this.options.domSelectors.backdrop);
    if (domElement.parentElement.classList.contains('flatpickr-wrapper')) {
      backdrop = domElement.parentElement
        .parentElement.querySelector(this.options.domSelectors.backdrop);
    }
    if (maskPlaceholder && backdrop) {
      backdrop.innerHTML = `<i>${newValue}</i>${maskPlaceholder.substring(newValue.length)}`;
    }
    if (domElement.hasAttribute('data-input-mask')) {
      this.handleInputMask(domElement, oldValue, newValue);
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
    const inputWrapper = field.closest(this.options.inputSelector);

    // Only Do something about validation when there is a parent with data-input is present
    if (inputWrapper) {
      field.closest(this.options.inputSelector).querySelectorAll(this.options.messageSelector)
        .forEach((message) => {
          message.classList.remove(this.options.messageClasses.show);
        });

      if (validation.validationResult) {
        this.setValidClasses(field);
      } else {
        this.setValidClasses(field, ['add', 'remove']);
        let messageElementID: string;

        validation.messages.forEach((messageID) => {
          const message = field.closest(this.options.inputSelector).querySelector(`[data-message="${messageID}"]`);

          if (message) {
            if ((field.getAttribute('type') === 'radio') || (field.hasAttribute(this.options.selectOptionSelector))) {
              messageElementID = `${field.getAttribute('name')}__${messageID}-error`;
            } else {
              messageElementID = `${field.id}__${messageID}-error`;
            }
            message.classList.add('show');
            message.setAttribute('id', messageElementID);
            field.setAttribute('aria-describledby', messageElementID);
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
      case 'selectOption':
      case 'file':
        errorField.classList[functionArray[0]](this.options.inputClasses.invalid);
        errorField.classList[functionArray[1]](this.options.inputClasses.valid);
        break;
      default:
        if (field.value.length > 0 || field.hasAttribute('required')) {
          errorField.classList[functionArray[0]](this.options.inputClasses.invalid);
          errorField.classList[functionArray[1]](this.options.inputClasses.valid);
        } else {
          errorField.classList.remove(this.options.inputClasses.invalid);
          errorField.classList.add(this.options.inputClasses.valid);
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

  handleInputMask(domElement, oldValue, newValue) {
    if (domElement.hasAttribute('data-mask-locked')) {
      domElement.removeAttribute('data-mask-locked');
      return;
    }

    const maskType = domElement.getAttribute('data-input-mask');
    switch (maskType) {
      case 'currency':
        // handle CHF formatting
        domElement.value = this.formatCurrency(newValue, 2); // eslint-disable-line
        break;
      case 'currency_flat':
        // handle CHF formatting
        domElement.value = this.formatCurrency(newValue, 0);
        break;
      default:
        // handle mask
        const parseSub = (input, maskPartial) => {  // eslint-disable-line
          const symbol = input[0];
          let idx = 1;
          let regex;
          if (symbol === '\\') {
            regex = new RegExp(input.substring(0, 2)); // eslint-disable-line
            idx += 1;
          } else {
            regex = new RegExp(input[0]);
          }
          maskPartial.autoFill = regex;
          maskPartial.autoFillValue = input.substring(idx);
          return maskPartial;
        };

        const findNext = (input, index, symbol) => {  // eslint-disable-line
          if (input[index] === symbol) {
            return index;
          }
          if (index < input.length - 1) {
            return findNext(input, index + 1, symbol);
          }
          return -1;
        };

        const parse = (input, index, maskPattern) => { // eslint-disable-line
          const symbol = input[index];
          let idx = index;
          let regex;
          if (symbol !== '[') {
            if (symbol === '\\') {
              regex = new RegExp(input.substring(index, index + 2)); // eslint-disable-line
              idx += 2; // eslint-disable-line
            } else {
              regex = new RegExp(input[index]);
              idx += 1;
            }
            maskPattern.push({ regex });
          } else if (symbol === '[') {
            const nextIndex = findNext(input, index, ']');
            const subSection = input.substring(index + 1, nextIndex);
            idx = idx + (nextIndex - index) + 1;
            parseSub(subSection, maskPattern[maskPattern.length - 1]);
          }
          if (idx < input.length - 1 && index !== idx) {
            return parse(input, idx, maskPattern);
          }
          return maskPattern;
        };

        const parsedMask = parse(maskType, 0, []); // eslint-disable-line
        if (parsedMask) {
          const maskedValue = this.maskGeneric(domElement, oldValue, newValue, parsedMask);
          if (maskedValue !== newValue) {
            domElement.setAttribute('data-mask-locked', null);
            domElement.value = maskedValue;
          }
        }
        break;
    }
  }

  maskGeneric(domElement, oldValue, newValue, maskParts) {
    if (newValue.length - oldValue.length === 1) {
      const index = oldValue.length;
      if (index < maskParts.length) {
        if (newValue[index].match(maskParts[index].regex)) {
          return newValue;
        } else if (maskParts[index] && maskParts[index].autoFill && newValue[index].match(maskParts[index].autoFill)) { // eslint-disable-line
          return `${oldValue}${maskParts[index].autoFillValue}${newValue[index]}`;
        }
      }
      return oldValue;
    }
    return newValue;
  }

  formatCurrency(numberValue, decimalPoints = 2) { // eslint-disable-line
    let value = numberValue.replace(/\D+/g, '');
    const formatValue = (inputValue, formattedValue = '', index = -1) => {
      const idx = index < 0 ? inputValue.length - 1 : index;
      formattedValue += inputValue[inputValue.length - 1 - idx]; // eslint-disable-line
      if (idx > (decimalPoints + 1) && (idx - decimalPoints) % 3 === 0) { // eslint-disable-line
        formattedValue += '\''; // eslint-disable-line
      }
      if (idx > 0) {
        return formatValue(inputValue, formattedValue, idx - 1);
      }
      if (decimalPoints > 0 && formattedValue.length > decimalPoints) {
        return [formattedValue.slice(0, formattedValue.length - decimalPoints), '.', formattedValue.slice(formattedValue.length - decimalPoints)].join('');
      }
      return formattedValue;
    };

    while (value[0] === '0') {
      value = value.substring(1);
    }
    while (value.length < (decimalPoints + 1)) {
      value = `0${value}`;
    }
    return formatValue(value);
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

  initDatepickers() {
    const datepickers = this.ui.element.querySelectorAll(this.options.domSelectors.datepicker);

    datepickers.forEach((picker) => {
      if (!(<HTMLElement>picker).dataset.initialised) {
        const { parentNode } = picker;

        (<any>window).estatico.helpers.app.registerModulesInElement(parentNode);
        (<any>window).estatico.helpers.app.initModulesInElement(parentNode);
      }
    });
  }
}

export default Form;
