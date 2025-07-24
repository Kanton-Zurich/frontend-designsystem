class FormGlobalHelper {
  async validateField(field) {
    const fieldType = field.getAttribute('type');

    if (field.closest('.form__element--hidden-by-rule') !== null) {
      return {
        validationResult: true,
        messages: [],
      };
    }

    switch (fieldType) {
      case 'checkbox':
      case 'radio':
        return this.validateOptionField(field);
      case 'file':
        return this.validateFileField(field);
      case 'number':
        return await this.validateNumberField(field); // eslint-disable-line
      default:
        return await this.validateTextField(field); // eslint-disable-line
    }
  }

  async validateTextField(field) {
    let requiredResult = true;
    let patternResult = true;
    const messages = [];
    const fieldType = field.getAttribute('type');

    if (field.hasAttribute('required')) {
      requiredResult = field.value.length > 0;

      if (!requiredResult) messages.push('required');
    }

    if (field.value.length > 0) {
      if (
        (field.hasAttribute('data-pattern') || fieldType === 'email' || fieldType === 'url') &&
        requiredResult
      ) {
        let pattern = null;

        switch (fieldType) {
          case 'email': // see https://github.com/phoenixdevio/safe-regex-patterns
            pattern = /^[\w-.]{1,50}@[\w-.]{1,50}\.[\w-.]{1,50}$/gi;
            break;
          case 'url':
            pattern =
              /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g; //eslint-disable-line
            break;
          default:
            pattern = new RegExp(field.getAttribute('data-pattern'));
            break;
        }
        patternResult = pattern.test(field.value);

        if (
          field.hasAttribute('data-input-mask') &&
          field.getAttribute('data-input-mask').startsWith('currency')
        ) {
          let inBounds = true;
          const value = FormGlobalHelper.CurrencyToNumber(field.value);
          if (field.hasAttribute('data-max-amount')) {
            const maxAmount = parseFloat(field.getAttribute('data-max-amount'));
            inBounds = inBounds && value <= maxAmount;
          }
          if (field.hasAttribute('data-min-amount')) {
            const minAmount = parseFloat(field.getAttribute('data-min-amount'));
            inBounds = inBounds && value >= minAmount;
          }
          if (!inBounds) {
            messages.push('outofbounds');
            patternResult = false;
          } else if (!patternResult) messages.push('pattern');
        } else if (!patternResult) messages.push('pattern');
      }
    }

    let rangeValidationResult = true;

    if (requiredResult && patternResult) {
      rangeValidationResult = await this.validateDataRange(field);
      if (!rangeValidationResult) {
        messages.push('range');
      }
    }

    return {
      validationResult: requiredResult && patternResult && rangeValidationResult,
      messages,
    };
  }

  async validateNumberField(field: HTMLInputElement) {
    let requiredResult = true;
    let inBounds = true;
    const messages = [];

    if (field.hasAttribute('required')) {
      requiredResult = field.value.length > 0;

      if (!requiredResult) messages.push('required');
    }

    if (field.value.length > 0) {
      const val = field.valueAsNumber;
      const min = Number.parseFloat(field.min);
      const max = Number.parseFloat(field.max);
      if (!isNaN(min)) {
        // eslint-disable-line
        inBounds = inBounds && val >= min;
      }

      if (!isNaN(max)) {
        // eslint-disable-line
        inBounds = inBounds && val <= max;
      }

      if (!inBounds) messages.push('outofbounds');
    }

    let rangeValidationResult = true;
    if (requiredResult && inBounds) {
      rangeValidationResult = await this.validateDataRange(field);
      if (!rangeValidationResult) {
        messages.push('range');
      }
    }

    return {
      validationResult: requiredResult && inBounds && rangeValidationResult,
      messages,
    };
  }

  validateOptionField(field) {
    const fieldName = field.getAttribute('name');

    if (field.hasAttribute('required')) {
      const allOptionsWithSameName = Array.prototype.slice.call(
        document.querySelectorAll(`[name="${fieldName}"]`)
      );
      const result = allOptionsWithSameName.filter((checkbox) => checkbox.checked).length > 0;

      return {
        validationResult: result,
        messages: ['required'],
      };
    }

    return {
      validationResult: true,
      messages: [],
    };
  }

  validateFileField(field) {
    let requiredResult = true;
    let fileResult = true;
    const messages = [];
    const amountOfFiles = field.files.length;
    const files = [];

    if (field.hasAttribute('required') && field.value === '') {
      requiredResult = false;
      messages.push('required');
    }

    if (amountOfFiles > 0) {
      const checkSize = field.hasAttribute('data-max-size');
      const checkType = field.hasAttribute('data-file-types');
      const allowedTypes = checkType ? field.getAttribute('data-file-types').split(', ') : null;
      const maxSize = checkSize ? parseInt(field.getAttribute('data-max-size'), 10) : 0;

      for (let i = 0; i < amountOfFiles; i += 1) {
        const validationForFile = {
          id: i,
          errors: [],
        };
        const file = field.files.item(i);

        if (checkSize) {
          if (file.size > maxSize) validationForFile.errors.push('size');
        }

        if (checkType) {
          if (allowedTypes.indexOf(file.type) === -1) validationForFile.errors.push('type');
        }

        if (validationForFile.errors.length > 0) {
          files.push(validationForFile);
          fileResult = false;
        }
      }
    }

    return {
      validationResult: requiredResult && fileResult,
      messages,
      files,
    };
  }

  /**
   * Validate against a range of values
   * @param field
   */
  async validateDataRange(field) {
    if (field.hasAttribute('data-validate-range') && field.value !== '') {
      const url = field.getAttribute('data-validate-range').replace('{value}', field.value);
      if (url === field.getAttribute('data-validation-range-last-url')) {
        return field.getAttribute('data-validation-range-result') === 'true';
      }
      const response = await fetch(url);
      // eslint-disable-next-line
      if (response.status !== 200) {
        return true;
      }
      const result = await response.json();
      field.setAttribute('data-validation-range-result', result.validation);
      field.setAttribute('data-validation-range-last-url', url);
      return result.validation;
    }

    return true;
  }

  /**
   * Transform a date to an URL Param
   * @param date
   */
  dateToUrlParam(date) {
    const dateValue = date.replace(' ', '').split('.');
    // eslint-disable-next-line
    if (dateValue.length === 3) {
      return `${dateValue[2]}-${dateValue[1]}-${dateValue[0]}`; // eslint-disable-line
    }
    return '';
  }

  /**
   * Transform a date range to URL Param
   * @param dateRange
   */
  dateRangeToUrlParam(dateRange) {
    const dateValues = dateRange.replace(' ', '').split('-');
    // eslint-disable-next-line
    if (dateValues.length === 2) {
      const from = this.dateToUrlParam(dateValues[0]);
      const to = this.dateToUrlParam(dateValues[1]);
      if (from.length > 0 && to.length > 0) {
        return `${from}_${to}`;
      }
    }
    return '';
  }

  /**
   * Transform a date from URL Param
   * @param date
   */
  dateFromUrlParam(date) {
    const dateValue = decodeURIComponent(date).split('-');
    // eslint-disable-next-line
    if (dateValue.length === 3) {
      return `${dateValue[2]}.${dateValue[1]}.${dateValue[0]}`; // eslint-disable-line
    }
    return '';
  }

  /**
   * Transform a date range from URL Param
   * @param dateRange
   */
  dateRangeFromUrlParam(dateRange) {
    const dateValues = decodeURIComponent(dateRange).split('_');
    // eslint-disable-next-line
    if (dateValues.length === 2) {
      const from = this.dateFromUrlParam(dateValues[0]);
      const to = this.dateFromUrlParam(dateValues[1]);
      if (from.length > 0 && to.length > 0) {
        return `${from} - ${to}`;
      }
    }
    return '';
  }

  /**
   * Retrieves input data from a form and returns it as a JSON object.
   * @param  {HTMLFormControlsCollection} elements  the form elements
   * @param  { boolean } checkboxesAsSingleValue  flag indicating how to interpret checkbox values.
   * @return {Object}                               form data as an object literal
   */
  formToJSON(elements, checkboxesAsSingleValue = false, numberDefaultToZero = false) {
    /**
     * Checks that an element has a non-empty `name` and `value` property.
     * @param  {Element} element  the element to check
     * @return {Bool}             true if the element is an input, false if not
     */
    const isValidElement = (element) => element.name && element.value;

    /**
     * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the value should be added, false if not
     */
    const isValidValue = (element) =>
      !['checkbox', 'radio'].includes(element.type) || element.checked;

    /**
     * Checks if an input is a checkbox, because checkboxes allow multiple values.
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the element is a checkbox, false if not
     */
    const isCheckbox = (element) => element.type === 'checkbox';
    /**
     * Checks if an input is a `select` with the `multiple` attribute.
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the element is a multiselect, false if not
     */
    const isMultiSelect = (element) => element.options && element.multiple;
    /**
     * Checks if an input is a `text` field with a currency
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the element is a currency text field
     */
    const isCurrencyTextField = (element) =>
      element.hasAttribute('data-input-mask') &&
      element.getAttribute('data-input-mask').startsWith('currency');

    /**
     * Retrieves the selected options from a multi-select as an array.
     * @param  {HTMLOptionsCollection} options  the options for the select
     * @return {Array}                          an array of selected option values
     */
    const getSelectValues = (options) =>
      [].reduce.call(
        options,
        (values, option) => {
          return option.selected
            ? values // eslint-disable-line
                .concat(option.value)
            : values;
        },
        []
      ); // eslint-disable-line

    return [].reduce.call(
      elements,
      (data, element) => {
        // Make sure the element has the required properties and should be added.
        if (isValidElement(element) && isValidValue(element)) {
          /*
           * Some fields allow for more than one value, so we need to check if this
           * is one of those fields and, if so, store the values as an array.
           */
          if (isCheckbox(element)) {
            if (checkboxesAsSingleValue) {
              data[element.name] = element.checked;
            } else {
              data[element.name] = (data[element.name] || []).concat(element.value);
            }
          } else if (isMultiSelect(element)) {
            data[element.name] = getSelectValues(element);
          } else if (isCurrencyTextField(element)) {
            data[element.name] = FormGlobalHelper.CurrencyToNumber(element.value);
          } else if (element.classList.contains('flatpickr-input')) {
            const dateRange = this.dateRangeToUrlParam(element.value);
            data[element.name] = dateRange !== '' ? dateRange : this.dateToUrlParam(element.value);
          } else {
            data[element.name] = element.value;
          }
        } else if (element.type === 'number' && numberDefaultToZero) {
          data[element.name] = 0;
        }
        return data;
      },
      {}
    );
  }

  // eslint-disable-next-line no-magic-numbers
  static FormatCurrency(numberValue, decimalPoints = 2) {
    let value = numberValue.replace(/\D+/g, '');
    const formatValue = (inputValue, formattedValue = '', index = -1) => {
      const idx = index < 0 ? inputValue.length - 1 : index;
      formattedValue += inputValue[inputValue.length - 1 - idx]; // eslint-disable-line
      // eslint-disable-next-line
      if (idx > decimalPoints + 1 && (idx - decimalPoints) % 3 === 0) {
        formattedValue += "'"; // eslint-disable-line
      }
      if (idx > 0) {
        return formatValue(inputValue, formattedValue, idx - 1);
      }
      if (decimalPoints > 0 && formattedValue.length > decimalPoints) {
        return [
          formattedValue.slice(0, formattedValue.length - decimalPoints),
          '.',
          formattedValue.slice(formattedValue.length - decimalPoints),
        ].join('');
      }
      return formattedValue;
    };

    while (value[0] === '0') {
      value = value.substring(1);
    }
    while (value.length < decimalPoints + 1) {
      value = `0${value}`;
    }
    return formatValue(value);
  }

  static CurrencyToNumber(currency) {
    const decimals = currency.split('.');
    let number = decimals[0].split("'").join('');

    if (decimals.length > 1) {
      number += `.${decimals[1]}`;
    }

    return parseFloat(number);
  }

  static ParseDateTimeString(dateTime) {
    const parts = dateTime.split(' ');
    // try date
    const dateParts = parts && parts.length > 0 ? parts[0].split('.') : null;
    // try time
    const timeParts = parts && parts.length > 1 ? parts[1].split(':') : null;
    let parseString = '';

    // eslint-disable-next-line
    if (dateParts && dateParts.length > 2) {
      parseString += `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    if (timeParts && timeParts.length > 1) {
      parseString += `T${timeParts[0]}:${timeParts[1]}:00`;
    } else {
      parseString += 'T00:00:00';
    }
    return Date.parse(parseString);
  }

  static CurrentDateAgeDifference(age) {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    const ageDate = new Date(dt.setFullYear(dt.getFullYear() - age));

    return ageDate.getTime();
  }
}

export default FormGlobalHelper;
