const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defSelectData = require('../select/select.data.js');

const template = dataHelper.getFileContent('drilldown_select.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Abhängige Auswahlfelder',
    className: 'DrilldownSelect',
    jira: 'CZHDEV-1234',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('drilldown_select.md'),
  },
  props: {
    primarySelectData: _.merge({}, defSelectData.variants.default.props, { additionalAttributes: 'data-filter-attribute="data-filter-id"' }),
    secondarySelectData: _.merge({}, defSelectData.variants.default.props, { additionalAttributes: 'data-filter-attribute="data-filter-id" disabled' }),
    preview: true,
  },
});


data.props.primarySelectData.listData.selectOptions = [
  { value: '', label: '', filterId: 'bla' },
  { value: 'mig', label: 'Mogration & Integration', filterId: 'bla' },
  { value: 'mo', label: 'Mobilität', filterId: 'bla' },
  { value: 'sich', label: 'Sicherheit & Justiz', filterId: 'bla' },
  { value: 'so', label: 'Soziales', filterId: 'bla' },
  { value: 'st', label: 'Steuern', filterId: 'bla' },
  { value: 'umte', label: 'Umwelt & Tier', filterId: 'blub' },
  { value: 'ge', label: 'Gemeinschaften', filterId: 'blub' },
  { value: 'scer', label: 'Schulen & Erziehung', filterId: 'blub' },
];

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
