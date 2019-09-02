class FormGlobalHelper {
  validateField(field) {
    const fieldType = field.getAttribute('type');

    switch (fieldType) {
      case 'checkbox':
      case 'radio':
        return this.validateOptionField(field);
      default:
        return this.validateTextField(field);
    }
  }

  validateTextField(field) {
    let requiredResult = true;
    let patternResult = true;
    const messages = [];

    if (field.hasAttribute('required')) {
      requiredResult = field.value.length > 0;

      if (!requiredResult) messages.push('required');
    }

    if (field.hasAttribute('data-pattern') && requiredResult) {
      console.log('if in fomr.ts');
      console.log(field);

      const pattern = new RegExp(field.getAttribute('data-pattern'), 'i');

      patternResult = pattern.test(field.value);

      if (!patternResult) messages.push('pattern');
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
}

export default FormGlobalHelper;
