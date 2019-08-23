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
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('datepicker.md'),
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
      formInputData: defaultFormInputData,
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
