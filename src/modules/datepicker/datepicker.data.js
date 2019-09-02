const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defaultFormInputData = require('../../atoms/form_input/form_input.data').variants.datePicker.props;

const template = dataHelper.getFileContent('datepicker.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datepicker',
    className: 'Datepicker',
    jira: 'CZHDEV-849',
    documentation: dataHelper.getDocumentation('datepicker.md'),
    wrapInForm: true,
  },
  props: {

  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default(Time)',
      desc: 'Default implementation',
    },
    props: {
      datetimeformat: 'time',
      formInputData: _.merge({}, defaultFormInputData, {
        usedCustomIcon: true,
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
      title: 'Default(Date)',
      desc: 'Default implementation',
    },
    props: {
      datetimeformat: 'date',
      formInputData: _.merge({}, defaultFormInputData, {
        label: 'Datum',
        iconOnly: { icon: 'calendar' },
        uuid: _.uniqueId('date-'),
        usedCustomIcon: true,
        validation: {
          pattern: '^\\d{2}[./-]\\d{2}[./-]\\20d{2}$',
          isRequired: true,
          errorMsg: 'Bitte geben Sie eine korrektes Datum an.',
        },
      }),
    },
  },
  dateRange: {
    meta: {
      title: 'Date (Range)',
      desc: 'Default implementation',
    },
    props: {
      datetimeformat: 'date-range',
      formInputData: _.merge({}, defaultFormInputData, {
        label: 'Zeitraum von/bis',
        iconOnly: { icon: 'calendar' },
        uuid: _.uniqueId('date-range-'),
        usedCustomIcon: true,
        validation: {
          pattern: '^\\d{2}[./-]\\d{2}[./-]\\d{4}\\s-\\s\\d{2}[./-]\\d{2}[./-]\\d{4}$',
          isRequired: true,
          errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
        },
      }),
    },
  },
  dateAndTime: {
    meta: {
      title: 'Date and Time',
      desc: 'Default implementation',
    },
    props: {
      datetimeformat: 'date-time',
      formInputData: _.merge({}, defaultFormInputData, {
        label: 'Datum/Uhrzeit',
        iconOnly: { icon: 'calendar' },
        uuid: _.uniqueId('date-hour-'),
        usedCustomIcon: true,
        validation: {
          pattern: '^\\d{2}[./-]\\d{2}[./-]\\d{4}\\s\\d{2}[./-]\\d{2}[./-]\\d{4}$',
          isRequired: true,
        },
      }),
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
