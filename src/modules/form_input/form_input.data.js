const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('form_input.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Form Input',
    className: 'FormInput',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('form_input.md'),
  },
  props: {
    type: 'text',
    label: 'Placeholder',
    uuid: _.uniqueId('input'),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard Input',
      desc: 'Standard Implementierung ohne Floating Label (nur Placeholder)',
    },
  },
  readOnly: {
    meta: {
      title: 'Standard Input(read only)',
      desc: 'Standard Implementierung ohne Floating Label (nur Placeholder) nicht editierbar.',
    },
    props: {
      isReadOnly: true,
      uuid: _.uniqueId('float_input_readonly'),
      inputContent: 'Dieser Text kann nicht bearbeitet werden',
    },
  },
  float: {
    meta: {
      title: 'Float Input',
      desc: 'Input mit floating Label',
    },
    props: {
      type: 'text',
      label: 'Floating Label',
      uuid: _.uniqueId('float_input_float'),
      isFloatingLabel: true,
      isRequired: true,
    },
  },
  floatValidate: {
    meta: {
      title: 'Text Float Input Validation',
      desc: 'Input mit floating Label und validierung',
    },
    props: {
      type: 'text',
      label: 'Validation',
      validation: {
        pattern: '[A-Za-z]{3,6}',
        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
        errorMsg: 'Hier mindestens 3 und maximal 6 Buchstaben eingeben!',
      },
      uuid: _.uniqueId('float_input_valid'),
      isFloatingLabel: true,
      isRequired: true,
    },
  },
  clearButton: {
    meta: {
      title: 'Text löschen',
      desc: 'Input mit floating Label, validierung und zurücksetzen funktionalität.',
    },
    props: {
      type: 'text',
      label: 'Validation',
      uuid: _.uniqueId('float_input_clear'),
      validation: {
        pattern: '[A-Za-z]{3,6}',
        errorMsg: 'Hier mindestens 3 und maximal 6 Buchstaben eingeben!',
      },
      isFloatingLabel: true,
      isRequired: true,
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'text',
        ariaText: 'Lösche Eingabe',
      },
    },
  },
  showPasswordButton: {
    meta: {
      title: 'Passwort zeigen/verstecken',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {
      type: 'password',
      label: 'Password',
      uuid: _.uniqueId('float_input_password'),
      validation: {
        pattern: '[A-Za-z]{3,6}',
        errorMsg: 'Hier mindestens 3 und maximal 6 Buchstaben eingeben!',
      },
      isFloatingLabel: true,
      isRequired: true,
      additionalFunctionality: {
        icon: 'hide',
        buttontype: 'password',
        ariaText: 'Zeige bzw verstecke Passwort',
      },
    },
  },
  unitLeft: {
    meta: {
      title: 'Eingabe mit Einheitsangabe (links)',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {
      unitLeft: true,
    },
  },
  unitRight: {
    meta: {
      title: 'Eingabe mit Einheitsangabe (rechts)',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {

    },
  },
  dateFromTo: {
    meta: {
      title: 'Eingabe für von-bis Datum',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {

    },
  },
  plainDropDown: {
    meta: {
      title: 'Eingabe für ein standart Dropdown',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {

    },
  },
  telDropDown: {
    meta: {
      title: 'Eingabe für Vorwahl-Dropdown',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {

    },
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
