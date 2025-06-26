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
    documentation: dataHelper.getDocumentation('README.md'),
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
const variants = _.mapValues(
  {
    numberValidation: {
      meta: {
        title: 'Nummereingabe mit Validierung',
        desc: 'Input mit floating Label, validierung.',
      },
      props: {
        uuid: _.uniqueId('float_input_numbervalid'),
        type: 'number',
        label: 'Reingewinn',
        step: 1,
        isFloatingLabel: true,
        validation: {
          min: 0,
          max: 10000000,
          isRequired: true,
        },
      },
    },
    floatValidateHint: {
      meta: {
        title: 'Hinweis danach (CZHDEV-1238)',
        desc: 'Input mit Floating Label und Validierung und Hinweis nach dem Feld',
      },
      props: {
        type: 'text',
        label: 'pflichtig von',
        inputMask: '\\d\\d\\.[\\d.]\\d\\d[\\d.]\\.',
        maskPlaceholder: 'TT.MM.',
        validation: {
          pattern: '^\\d{2}\\.\\d{2}\\.$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Datum bitte im Format TT.MM. eingeben!',
          isRequired: true,
        },
        hint: 'Bitte im Format TT.MM. eingeben',
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
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
        desc: 'Standard Implementierung eines mehrzeiligen Textfelds mit Input-limite und nach oben gleitenden Beschriftung (floating Label)',
      },
      props: {
        isTextarea: true,
        isInput: false,
        inputLengthRestriction: 600,
        isFloatingLabel: true,
        label: 'Placeholder',
        uuid: _.uniqueId('textarea'),
        name: 'input_name',
        validation: {
          isRequired: true,
        },
      },
    },
    textarea_alt: {
      meta: {
        title: 'Standard Textfeld (2)',
        desc: 'Standard Implementierung eines mehrzeiligen Textfelds mit Input-limite und nach oben gleitenden Beschriftung (floating Label)',
      },
      props: {
        isTextarea: true,
        isInput: false,
        isFloatingLabel: true,
        label: 'Placeholder',
        uuid: _.uniqueId('textarea'),
        name: 'input_name',
        validation: {
          isRequired: true,
        },
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
          errorMsg:
            'Dieses Eingabefeld erlaubt nur Zahlen. Es benötigt mindestens 1 und maximal 2 Zahlen im Eingabefeld!',
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
          isRequired: false,
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
          errorMsg:
            'Dieses Eingabefeld erlaubt nur Buchstaben. Es benötigt mindestens 3 und maximal 6 Buchstaben!',
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
          icon: 'inspect',
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
          icon: 'inspect',
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
    phoneWithMask: {
      meta: {
        title: 'Telefonnummer mit Maske',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'Telefonnummer',
        inputMask:
          '\\+[\\d+41 ]4[\\d41 ]1[\\d1 ]\\s[\\d ]\\d\\d\\s[\\d ]\\d\\d\\d\\s[\\d ]\\d\\d\\s[\\d ]\\d\\d\\',
        maskPlaceholder: '+41 __ ___ __ __',
        inputContent: '',
        validation: {
          pattern: '\\+41\\s\\d{2,}\\s\\d{3,}\\s\\d{2,}\\s\\d{2,}$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Eingabe bitte im Format +41 XX XXX XX XX eingeben!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
    mwst: {
      meta: {
        title: 'Mehrwertsteuer mit Maske',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'Mehrwertsteuer',
        inputMask:
          '\\C[\\dCHE-]H[\\dHE-]E[\\dE-]-[\\d-]\\d\\d\\d\\.[\\d.]\\d\\d\\d\\.[\\d.]\\d\\d\\d\\s[\\M ]\\MWS\\T',
        maskPlaceholder: 'CHE-___.___.___ MWST',
        inputContent: '',
        validation: {
          pattern: '\\C\\H\\E\\-\\d{3,}\\.\\d{3,}\\.\\d{3,}\\s\\MWS\\T$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Eingabe bitte im Format CHE-XXX.XXX.XXX MWST eingeben!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
    UID: {
      meta: {
        title: 'UID mit Maske',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'UID',
        inputMask:
          '\\C[\\dCHE-]H[\\dHE-]E[\\dE-]-[\\d-]\\d\\d\\d\\.[\\d.]\\d\\d\\d\\.[\\d.]\\d\\d\\d',
        maskPlaceholder: 'CHE-___.___.___',
        inputContent: '',
        validation: {
          pattern: '\\C\\H\\E\\-\\d{3,}\\.\\d{3,}\\.\\d{3,}$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Eingabe bitte im Format CHE-XXX.XXX.XXX eingeben!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
    AHV: {
      meta: {
        title: 'AHV Nummer mit Maske',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'AHV-Nummer',
        inputMask: '\\d\\d\\d\\.[\\d.]\\d\\d\\d\\d\\.[\\d.]\\d\\d\\d\\d\\.[\\d.]\\d\\d',
        maskPlaceholder: '___.____.____.__',
        inputContent: '',
        validation: {
          pattern: '\\d{3,}\\.\\d{4,}\\.\\d{4,}\\.\\d{2,}$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Eingabe bitte im Format XXX.XXXX.XXXX.XX eingeben!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
    BUR: {
      meta: {
        title: 'BUR Nummer mit Maske',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'BUR-Nummer',
        inputMask: '\\d\\d\\d\\d\\d\\d\\d\\d',
        maskPlaceholder: 'XXXXXXXX',
        inputContent: '',
        validation: {
          pattern: '\\d{8,}$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Bitte im Format mit 8 Ziffern!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
    kvg: {
      meta: {
        title: 'KVG Nummer',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'KVG-Nummer',
        inputContent: '',
        validation: {
          pattern: '^[0-9]{1,6}\\-[0-9]{4}$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Bitte im Format 1-6 Ziffern gefolgt von einem "-" und weiteren 4 Ziffern!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
      },
    },
    zemis: {
      meta: {
        title: 'Zemis Nummer',
        desc: 'Input mit floating Label und validierung und Hinweis',
      },
      props: {
        type: 'text',
        label: 'Zemis-Nummer',
        inputContent: '',
        validation: {
          pattern: '^[0-9]{6,11}\\.[0-9]$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg:
            'Bitte im Format mit 6 bis 11 Ziffern gefolgt von einem "." und einer weiteren Ziffer!',
          isRequired: false,
        },
        uuid: _.uniqueId('float_input_valid'),
        isFloatingLabel: true,
        isRequired: true,
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
        type: 'text',
        inputContent: '0',
        label: '0',
        inputMask: 'currency_flat',
        validation: {
          pattern: "^[+-]?((\\.\\d+)|([\\d']+(\\.\\d+)?))$",
          errorMsg: 'Hier muss eine Ganzzahl oder eine Gleitkommazahl eingegeben werden!',
          isRequired: true,
        },
      },
    },
    unitLeftWithFloating: {
      meta: {
        title: 'Nummereingabefeld mit Einheitsangabe (links) und Floating Label',
        desc: 'Nummereingabefeld mit validierung und Einheitsangabe (links).',
      },
      props: {
        uuid: _.uniqueId('float_input_unitLeftFloating'),
        unitLeft: true,
        unitLeftLabel: 'CHF',
        type: 'text',
        label: 'Ihr Wunschgehalt',
        isFloatingLabel: true,
        inputMask: 'currency',
        validation: {
          pattern: "^[+-]?((\\.\\d+)|([\\d']+(\\.\\d+)?))$",
          errorMsg: 'Hier muss eine Ganzzahl oder eine Gleitkommazahl eingegeben werden!',
          isRequired: true,
        },
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
        title: 'Input-Klein (Themenliste)',
        desc: 'Eine kleine Variante des Inputs für die Themenliste (Home)',
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
          icon: 'inspect',
        },
      },
    },
    triggerDefault: {
      meta: {
        title: 'Select Trigger',
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
        title: 'Select Trigger (Telefon)',
        desc: '',
      },
      props: {
        inputMask: 'phone',
        maskPlaceholder: '__ ____ __ __',
        type: 'text',
        isSelectTrigger: true,
        isTriggerWithInput: true,
        isFloatingLabel: true,
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
    triggerHistory: {
      meta: {
        title: 'Select Trigger (Historie)',
        desc: '',
      },
      props: {
        type: 'text',
        isSelectTrigger: true,
        isFloatingLabel: false,
        isInput: false,
        isReduced: true,
        label: 'Historie Nachtrags-Nr.:',
        icon: 'angle_drop_down',
        uuid: _.uniqueId('select-trigger-history'),
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
    datePickerNoIcon: {
      meta: {
        title: 'Datepicker mit Eingabemaske ohne Icon',
        desc: 'Datepicker mit floating Label und Eingabemaske aber ohne Icon',
      },
      props: {
        type: 'text',
        isFloatingLabel: true,
        isInput: true,
        inputMask: '\\d\\d\\.[\\d.]\\d\\d[\\d.]\\.[\\d.]\\d\\d\\d\\d[\\d.]',
        maskPlaceholder: 'TT.MM.YYYY',
        label: 'Publikationsdatum',
        uuid: _.uniqueId('datepicker-'),
        validation: {
          pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
          ariaTextValid: 'Eingabe entspricht den Vorgaben.',
          ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
          errorMsg: 'Datum bitte im Format TT.MM.YYYY eingeben!',
          isRequired: false,
        },
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
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
