class FormGlobalHelper {
  validateField(field) {
    let requiredResult = true;
    let patternResult = true;
    const messages = [];

    if (field.hasAttribute('required')) {
      requiredResult = field.value.length > 0;

      if (!requiredResult) messages.push('required');
    }

    if (field.hasAttribute('data-pattern') && requiredResult) {
      const pattern = new RegExp(field.getAttribute('data-pattern'), 'i');

      patternResult = pattern.test(field.value);

      if (!patternResult) messages.push('pattern');
    }

    return {
      validationResult: requiredResult && patternResult,
      messages,
    };
  }
}

export default FormGlobalHelper;
