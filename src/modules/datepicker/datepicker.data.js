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
  },
  props: {

  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standart(Uhrzeit)',
      desc: 'Standart implementation für Uhrzeitauswahl',
    },
    props: {
      datetimeformat: 'time',
      formInputData: _.merge({}, defaultFormInputData),
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
        iconOnly: { icon: 'calendar' },
        uuid: _.uniqueId('date-'),
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
        label: 'Zeitraum von/bis',
        iconOnly: { icon: 'calendar' },
        uuid: _.uniqueId('date-range-'),
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
        label: 'Datum/Uhrzeit',
        iconOnly: { icon: 'calendar' },
        uuid: _.uniqueId('date-hour-'),
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
