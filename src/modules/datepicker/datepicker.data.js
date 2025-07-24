const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defaultFormInputData = require('../../atoms/form_input/form_input.data').variants.datePicker
  .props;

const template = dataHelper.getFileContent('datepicker.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datepicker',
    className: 'Datepicker',
    jira: 'CZHDEV-849',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('README.md'),
    wrapInForm: true,
  },
  props: {},
});

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standart(Uhrzeit)',
        desc: 'Standart implementation für Uhrzeitauswahl',
      },
      props: {
        datetimeformat: 'time',
        formInputData: _.merge({}, defaultFormInputData, {
          usedCustomIcon: true,
          inputMask: '\\d\\d:[\\d:]\\d\\d',
          maskPlaceholder: 'HH:MM',
          validation: {
            isRequired: true,
            pattern: '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$',
            errorMsg: 'Bitte geben Sie eine korrekte Uhrzeit an.',
          },
        }),
      },
    },
    defaultDate: {
      meta: {
        title: 'Standart(Datum)',
        desc: 'Standart implementation für eine einzelne Datumsauswahl',
      },
      props: {
        datetimeformat: 'date',
        formInputData: _.merge({}, defaultFormInputData, {
          label: 'Datum',
          inputMask: '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-'),
          usedCustomIcon: true,
          validation: {
            pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
            isRequired: true,
            errorMsg: 'Bitte geben Sie eine korrektes Datum an.',
          },
        }),
      },
    },
    minDate: {
      meta: {
        title: 'Datum mit Mindestdatum',
        desc: 'Datum mit Mindestdatum',
      },
      props: {
        datetimeformat: 'date',
        minDate: new Date().toISOString().substring(0, 10),
        formInputData: _.merge({}, defaultFormInputData, {
          label: 'Datum',
          inputMask: '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-'),
          usedCustomIcon: true,
          validation: {
            pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
            isRequired: true,
            errorMsg: 'Bitte geben Sie eine korrektes Datum an.',
          },
        }),
      },
    },
    dateRange: {
      meta: {
        title: 'Datumsauswahl (Zeitspanne)',
        desc: 'Implementation einer Datumsauswahl für eine  Zeitspanne',
      },
      props: {
        datetimeformat: 'date-range',
        formInputData: _.merge({}, defaultFormInputData, {
          inputMask:
            '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d [\\d - ]\\-[\\d- ] [\\d ]\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ - TT.MM.JJJJ',
          label: 'Zeitraum von/bis',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-range-'),
          usedCustomIcon: true,
          validation: {
            pattern: '^\\d{2}.\\d{2}.\\d{4}\\s-\\s\\d{2}.\\d{2}.\\d{4}$',
            isRequired: true,
            errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
          },
        }),
      },
    },
    dateRangenRequired: {
      meta: {
        title: 'Datumsauswahl (Zeitspanne) (kein Pflichtfeld)',
        desc: 'Implementation einer Datumsauswahl für eine  Zeitspanne',
      },
      props: {
        datetimeformat: 'date-range',
        formInputData: _.merge({}, defaultFormInputData, {
          inputMask:
            '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d [\\d - ]\\-[\\d- ] [\\d ]\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ - TT.MM.JJJJ',
          label: 'Zeitraum von/bis',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-range-'),
          usedCustomIcon: true,
          validation: {
            pattern: '^\\d{2}.\\d{2}.\\d{4}\\s-\\s\\d{2}.\\d{2}.\\d{4}$',
            isRequired: false,
            errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
          },
        }),
      },
    },
    dateAndTime: {
      meta: {
        title: 'Datums- und Zeitauswahl',
        desc: 'Implementation einer einzel Datumsauswahl komibniert mit einer Zeitangabe',
      },
      props: {
        datetimeformat: 'date-time',
        formInputData: _.merge({}, defaultFormInputData, {
          inputMask: '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d [\\d ]\\d\\d:[\\d:]\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ HH:MM',
          label: 'Datum/Uhrzeit',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-hour-'),
          usedCustomIcon: true,
          validation: {
            pattern: '^\\d{2}.\\d{2}.\\d{4}\\s([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$',
            isRequired: true,
            errorMsg: 'Bitte geben Sie ein korrektes Datum an.',
          },
        }),
      },
    },
    dateRangeLinkListItem: {
      meta: {
        title: 'Datumsauswahl (Zeitspanne LinkListItem)',
        desc: 'Implementation einer Datumsauswahl für eine  Zeitspanne',
      },
      props: {
        isLinkListItem: true,
        datetimeformat: 'date-range',
        formInputData: _.merge({}, defaultFormInputData, {
          inputMask:
            '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d [\\d - ]\\-[\\d- ] [\\d ]\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ - TT.MM.JJJJ',
          label: 'Zeitraum von/bis',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-range-'),
          usedCustomIcon: true,
        }),
      },
    },
    noFlatPicker: {
      meta: {
        title: 'Datumsauswahl ohne Kalenderblatt (CZHDEV-2981)',
        desc: 'Implementation einer Datumsauswahl ohne Flatpicker/Kalenderbaltt',
      },
      props: {
        noFlatPicker: true,
        datetimeformat: 'date',
        formInputData: _.merge({}, defaultFormInputData, {
          label: 'Datum',
          inputMask: '\\d\\d\\.[\\d.]\\d\\d\\.[\\d.]\\d\\d\\d\\d',
          maskPlaceholder: 'TT.MM.JJJJ',
          iconOnly: { icon: 'calendar' },
          uuid: _.uniqueId('date-'),
          usedCustomIcon: true,
          validation: {
            pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
            isRequired: true,
            errorMsg: 'Bitte geben Sie eine korrektes Datum an.',
          },
        }),
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
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
