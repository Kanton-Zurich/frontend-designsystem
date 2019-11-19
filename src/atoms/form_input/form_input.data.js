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
      title: 'Standard Eingabefeld',
      desc: 'Standard Implementierung ohne Floating Label (Verwendung in Themenliste als Filterfeld)',
    },
  },
  defaultForForms: {
    meta: {
      title: 'Standard Eingabefeld für Formulare',
      desc: 'Standard Implementierung mit Floating Label (Verwendung in Formularen)',
    },
    props: {
      isFloatingLabel: true,
    },
  },
  textarea: {
    meta: {
      title: 'Standard Textfeld',
      desc: 'Standard Implementierung eines mehrzeiligen Textfelds mit nach oben gleitenden Beschriftung (floating Label)',
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
      title: 'Eingabefeld deaktiviert',
      desc: 'Standard Implementierung eines gesperrten Eingabefeldes (nicht editierbar).',
    },
    props: {
      disabled: true,
      uuid: _.uniqueId('float_input_disabled'),
      inputContent: 'Dieser Text kann nicht bearbeitet werden und wird nicht übertragen.',
    },
  },
  floatValidateNumber: {
    meta: {
      title: 'Eingabefeld für Zahlen',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe und Validierung für Zahlen',
    },
    props: {
      type: 'text',
      label: 'Validation(Zahlen)',
      uuid: _.uniqueId('float_input_float'),
      isFloatingLabel: true,
      validation: {
        pattern: '^([0-9]){1,2}$',
        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
        errorMsg: 'Dieses Eingabefeld erlaubt nur Zahlen. Es benötigt mindestens 1 und maximal 2 Zahlen im Eingabefeld!',
        isRequired: true,
      },
    },
  },
  floatValidateUrl: {
    meta: {
      title: 'Eingabefeld für URLs',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe und Validierung für URLs',
    },
    props: {
      type: 'url',
      label: 'Validation(URL)',
      uuid: _.uniqueId('float_input_float'),
      isFloatingLabel: true,
      validation: {
        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
        errorMsg: 'Die Eingabe entspricht nicht den Vorgaben für die URL.',
        isRequired: true,
      },
    },
  },
  floatValidateEmail: {
    meta: {
      title: 'Eingabefeld für Emails',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe und Validierung für Emails',
    },
    props: {
      type: 'email',
      label: 'Validation(Email)',
      uuid: _.uniqueId('float_input_float'),
      isFloatingLabel: true,
      validation: {
        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
        errorMsg: 'Die Eingabe entspricht nicht den Vorgaben für eine Email.',
        isRequired: true,
      },
    },
  },
  floatValidate: {
    meta: {
      title: 'Eingabefeld für Buchstaben',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe und Validierung für Buchstaben bzw ein Wort mit mindestens 3 und maximal 6 Buchstaben.',
    },
    props: {
      type: 'text',
      label: 'Validation(Buchstaben/Wort)',
      uuid: _.uniqueId('float_input_valid'),
      isFloatingLabel: true,
      isRequired: true,
      validation: {
        pattern: '^([a-zA-Z]){3,6}$',
        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
        errorMsg: 'Dieses Eingabefeld erlaubt nur Buchstaben. Es benötigt mindestens 3 und maximal 6 Buchstaben!',
        isRequired: true,
      },
    },
  },
  clearButton: {
    meta: {
      title: 'Eingabefeld mit löschen-Funktion',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe, Validierung für Buchstaben bzw ein Wort mit mindestens 3 und maximal 6 Buchstaben und einem Knopf zum zurücksetzen bzw löschen der Eingabe.',
    },
    props: {
      type: 'text',
      label: 'Label',
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
      title: 'Eingabefeld mit löschen Function (und zusätzlichem Icon)',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe, einem Knopf zum zurücksetzen bzw löschen der Eingabe und zusätzlichem Icon.',
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
      title: 'Kleines Eingabefeld mit löschen Function (und zusätzlichem Icon)',
      desc: 'Kleines Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe, einem Knopf zum zurücksetzen bzw löschen der Eingabe und zusätzlichem Icon.',
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
      title: 'Passwort-Eingabefeld mit zeigen/verstecken Function',
      desc: 'Eingabefeld mit einer nach oben gleitenden Beschriftung (floating Label) bei Eingabe, validierung und einem Knopf zum zeigen bzw verstecken der Eingabe.',
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
      title: 'Nummereingabefeld mit Einheitsangabe (links)',
      desc: 'Nummereingabefeld mit validierung und Einheitsangabe (links).',
    },
    props: {
      uuid: _.uniqueId('float_input_unitLeft'),
      unitLeft: true,
      unitLeftLabel: 'CHF',
      type: 'number',
      inputContent: '0.00',
      label: '0.00',
      validation: {
        pattern: '^[+-]?((\\.\\d+)|(\\d+(\\.\\d+)?))$',
        errorMsg: 'Hier muss eine Ganzzahl oder eine Gleitkommazahl eingegeben werden!',
        isRequired: true,
      },
      step: 0.01,
    },
  },
  unitRight: {
    meta: {
      title: 'Nummereingabe mit Einheitsangabe (rechts)',
      desc: 'Nummereingabefeld mit validierung und Einheitsangabe (rechts).',
    },
    props: {
      uuid: _.uniqueId('float_input_unitRight'),
      unitLeftLabel: 'cm',
      type: 'number',
      unitRight: true,
      inputContent: '100',
      label: '100',
      validation: {
        pattern: '^\\d+$',
        errorMsg: 'Hier muss eine Ganzzahl eingegeben werden!',
        isRequired: true,
        ariaTextValid: 'Eingabe korrekt',
        ariaTextInvalid: 'Eingabe inkorrekt',
      },
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
      title: 'Select Trigger(Telefon)',
      desc: '',
    },
    props: {
      type: 'text',
      isSelectTrigger: true,
      isTriggerWithInput: true,
      isInput: false,
      label: 'Telefonnummer',
      icon: 'angle_drop_down',
      demoTel: true,
      uuid: _.uniqueId('float_button-'),
      validation: {
        isRequired: true,
        pattern: '^[()\\- \\d]+$',
        errorMsg: 'Die Eingabe entspricht nicht den Vorgaben für eine Telefonnummer.',
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
