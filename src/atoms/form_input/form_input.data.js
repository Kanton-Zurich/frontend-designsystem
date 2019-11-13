const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('form_input.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Form Input',
    className: 'FormInput',
    jira: 'CZHDEV-844',
    documentation: dataHelper.getDocumentation('form_input.md'),
    wrapInForm: true,
  },
  props: {
    type: 'text',
    label: 'Placeholder',
    isInput: true,
    uuid: _.uniqueId('input'),
    name: 'input_name',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard Input',
      desc: 'Standard Implementierung ohne Floating Label (nur Placeholder)',
    },
  },
  textarea: {
    meta: {
      title: 'Standard Textfeld',
      desc: 'Standard Implementierung ohne Floating Label (nur Placeholder)',
    },
    props: {
      isTextarea: true,
      isInput: false,
      isFloatingLabel: true,
      label: 'Placeholder',
      uuid: _.uniqueId('textarea'),
      name: 'input_name',
    },
  },
  disabled: {
    meta: {
      title: 'Input(disabled)',
      desc: 'Standard Implementierung disabled (nicht editierbar).',
    },
    props: {
      disabled: true,
      uuid: _.uniqueId('float_input_disabled'),
      inputContent: 'Dieser Text kann nicht bearbeitet werden und wird nicht übertragen.',
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
        pattern: '^([a-zA-Z]){3,6}$',
        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
        errorMsg: 'Hier mindestens 3 und maximal 6 Buchstaben eingeben!',
        isRequired: true,
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
        pattern: '^([a-zA-Z]){3,6}$',
        errorMsg: 'Hier mindestens 3 und maximal 6 Buchstaben eingeben!',
        isRequired: true,
      },
      isFloatingLabel: true,
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    },
  },
  clearButtonWithIcon: {
    meta: {
      title: 'Textfeld mit löschen (und zusätzlichem Icon)',
      desc: 'Input mit floating Label, validierung und zurücksetzen funktionalität und zusätzlichem Icon.',
    },
    props: {
      type: 'text',
      label: 'Filter',
      isFloatingLabel: true,
      iconOnly: {
        icon: 'search',
      },
      uuid: _.uniqueId('float_input_clear'),
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    },
  },
  clearButtonSmallWithIcon: {
    meta: {
      title: 'Kleines Textfeld mit löschen (und zusätzlichem Icon)',
      desc: 'Input mit floating Label, validierung und zurücksetzen funktionalität und zusätzlichem Icon.',
    },
    props: {
      type: 'text',
      label: 'Filter',
      isSmall: true,
      iconOnly: {
        icon: 'search',
      },
      uuid: _.uniqueId('float_input_clear'),
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
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
        pattern: '^([a-zA-Z]){3,6}$',
        errorMsg: 'Hier mindestens 3 und maximal 6 Buchstaben eingeben!',
        isRequired: true,
      },
      isFloatingLabel: true,
      autocompleteOff: true,
      additionalFunctionality: {
        icon: 'hide',
        buttontype: 'password',
        ariaText: 'Zeige bzw verstecke Passwort',
      },
    },
  },
  unitLeft: {
    meta: {
      title: 'Nummereingabe mit Einheitsangabe (links)',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {
      uuid: _.uniqueId('float_input_unitLeft'),
      unitLeft: true,
      unitLeftLabel: 'CHF',
      type: 'number',
      inputContent: '0.00',
      label: '0.00',
      step: 0.01,
    },
  },
  unitRight: {
    meta: {
      title: 'Nummereingabe mit Einheitsangabe (rechts)',
      desc: 'Input mit floating Label, validierung und mit zeige/verstecke Passwort funktionalität.',
    },
    props: {
      uuid: _.uniqueId('float_input_unitRight'),
      unitLeftLabel: 'cm',
      type: 'number',
      unitRight: true,
      inputContent: '100',
      label: '100',
      step: 1,
    },
  },
  small: {
    meta: {
      title: 'Input-Klein (ThemenList)',
      desc: 'Eine kleine Variante des Inputs für die Themenlist(home)',
    },
    props: {
      isSmall: true,
      uuid: _.uniqueId('float_input_smallTopic'),
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    },
  },
  smallWithIcon: {
    meta: {
      title: 'Input-Klein-Icon (Select mit Filter)',
      desc: 'Eine kleine Variante des Inputs mit Icon rechts',
    },
    props: {
      isSmall: true,
      uuid: _.uniqueId('float_input_smallTopic'),
      iconOnly: {
        icon: 'search',
      },
    },
  },
  triggerDefault: {
    meta: {
      title: 'Select Trigger(default)',
      desc: 'Input mit floating Label',
    },
    props: {
      type: 'text',
      isSelectTrigger: true,
      isFloatingLabel: true,
      isInput: false,
      icon: 'angle_drop_down',
      label: 'Select Float Label',
      uuid: _.uniqueId('float_button-'),
      validation: {
        isRequired: true,
      },
    },
  },
  triggerPhone: {
    meta: {
      title: 'Select Trigger(phone)',
      desc: '',
    },
    props: {
      type: 'text',
      isSelectTrigger: true,
      isTriggerWithInput: true,
      isInput: false,
      label: 'Select Float Label',
      icon: 'angle_drop_down',
      demoTel: true,
      uuid: _.uniqueId('float_button-'),
      validation: {
        isRequired: true,
      },
    },
  },
  datePicker: {
    meta: {
      title: 'Datepicker',
      desc: 'Input mit floating Label',
    },
    props: {
      type: 'text',
      isFloatingLabel: true,
      isInput: true,
      iconOnly: {
        icon: 'time',
      },
      label: 'Uhrzeit',
      uuid: _.uniqueId('datepicker-'),
    },
  },
  search: {
    meta: {
      title: 'Suchfeld',
      desc: 'Suchfeld mit grosser Schrift',
    },
    props: {
      label: 'Suche',
      isSearch: true,
      name: 'input_search',
      uuid: 'input_search',
      disableAutocomplete: true,
      autocompleteOff: true,
      dataSelector: 'data-search_page="input"',
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
