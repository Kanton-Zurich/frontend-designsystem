class FormGlobalHelper {
  validateField(field) {
    const fieldType = field.getAttribute('type');

    if (field.offsetParent === null) {
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
}

export default FormGlobalHelper;
