class FormGlobalHelper {
  validateField(field) {
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
      default:
        return this.validateTextField(field);
    }
  }

  validateTextField(field) {
    let requiredResult = true;
    let patternResult = true;
    const messages = [];
    const fieldType = field.getAttribute('type');

    if (field.hasAttribute('required')) {
      requiredResult = field.value.length > 0;

      if (!requiredResult) messages.push('required');
    }

    if (field.value.length > 0) {
      if ((field.hasAttribute('data-pattern') || fieldType === 'email' || fieldType === 'url') && requiredResult) {
        let pattern = null;

        switch (fieldType) {
          case 'email':
            pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            break;
          case 'url':
            pattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'); //eslint-disable-line
            break;
          default:
            pattern = new RegExp(field.getAttribute('data-pattern'), 'i');
            break;
        }

        patternResult = pattern.test(field.value);

        if (!patternResult) messages.push('pattern');
      }
    }


    return {
      validationResult: requiredResult && patternResult,
      messages,
    };
  }

  validateOptionField(field) {
    const fieldName = field.getAttribute('name');

    if (field.hasAttribute('required')) {
      const allOptionsWithSameName = Array.prototype.slice.call(document.querySelectorAll(`[name="${fieldName}"]`));
      const result = allOptionsWithSameName.filter(checkbox => checkbox.checked).length > 0;

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
   * Retrieves input data from a form and returns it as a JSON object.
   * @param  {HTMLFormControlsCollection} elements  the form elements
   * @return {Object}                               form data as an object literal
   */
  formToJSON(elements) {
    /**
     * Checks that an element has a non-empty `name` and `value` property.
     * @param  {Element} element  the element to check
     * @return {Bool}             true if the element is an input, false if not
     */
    const isValidElement = element => element.name && element.value;

    /**
     * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the value should be added, false if not
     */
    const isValidValue = element => (!['checkbox', 'radio'].includes(element.type) || element.checked);

    /**
     * Checks if an input is a checkbox, because checkboxes allow multiple values.
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the element is a checkbox, false if not
     */
    const isCheckbox = element => element.type === 'checkbox';
    /**
     * Checks if an input is a `select` with the `multiple` attribute.
     * @param  {Element} element  the element to check
     * @return {Boolean}          true if the element is a multiselect, false if not
     */
    const isMultiSelect = element => element.options && element.multiple;

    /**
     * Retrieves the selected options from a multi-select as an array.
     * @param  {HTMLOptionsCollection} options  the options for the select
     * @return {Array}                          an array of selected option values
     */
    const getSelectValues = options => []
      .reduce.call(options, (values, option) => { return option.selected ? values // eslint-disable-line
        .concat(option.value) : values; }, []); // eslint-disable-line

    return [].reduce.call(elements, (data, element) => {
      // Make sure the element has the required properties and should be added.
      if (isValidElement(element) && isValidValue(element)) {
      /*
       * Some fields allow for more than one value, so we need to check if this
       * is one of those fields and, if so, store the values as an array.
       */
        if (isCheckbox(element)) {
          data[element.name] = (data[element.name] || []).concat(element.value);
        } else if (isMultiSelect(element)) {
          data[element.name] = getSelectValues(element);
        } else {
          data[element.name] = element.value;
        }
      }
      return data;
    }, {});
  }
}

export default FormGlobalHelper;
