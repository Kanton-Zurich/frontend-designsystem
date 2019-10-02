const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('range.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Range',
    className: 'Range',
    jira: 'CZHDEV-845',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('range.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default Range',
      desc: 'Default implementation',
    },
    props: {
      rangelabel: 'Ihr Brutto-Jahresgehalt',
      rangeMinValue: '0',
      rangeMaxValue: '200000',
      rangeHandlePosOne: '0',
      rangeSlideSteps: '1000',
      rangeTooltip: {
        decimals: '0',
        suffix: ' CHF',
        thousand: '‘',
      },
    },
  },
  rangeFromTo: {
    meta: {
      title: 'Range(Von/bis)',
      desc: 'Default implementation',
    },
    props: {
      withLabels: true,
      rangelabel: 'Ihr Wunschgehalt in CHF',
      rangeMinValue: '0',
      rangeMaxValue: '200000',
      rangeSteps: '',
      rangeHandlePosOne: '0',
      rangeHandlePosTwo: '100',
      rangeTooltip: {
        decimals: '0',
        thousand: '‘',
      },
      rangeTickmark: {
        mode: 'positions',
        values: '0 100',
        density: '25',
      },
    },
  },
  rangeWithTickmarks: {
    meta: {
      title: 'Range(mit Tickmarks)',
      desc: 'Default implementation',
    },
    props: {
      withTickmarks: true,
      rangelabel: 'Ergebnisse im Umkreis',
      rangeMinValue: '10',
      rangeMaxValue: '100',
      rangeSteps: '5',
      rangeHandlePosOne: '0',
      rangeTooltip: {
        decimals: '0',
        thousand: '',
        suffix: ' km',
      },
      rangeTickmark: {
        mode: 'positions',
        values: '0 100',
        density: '25',
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
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
