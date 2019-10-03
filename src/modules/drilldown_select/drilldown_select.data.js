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
    wrapInForm: true,
  },
  props: {
    primarySelectData: _.merge({}, defSelectData.variants.default.props, { additionalAttributes: 'data-filter-attribute="data-filter-id"' }),
    secondarySelectData: _.merge({}, defSelectData.variants.default.props, { additionalAttributes: 'data-filter-attribute="data-filter-id"' }),
    preview: true,
  },
});

data.props.primarySelectData.listData.selectOptions = [
  { value: 'allg', label: 'Allgemeines' },
  { value: 'nat', label: 'Natürliche Personen' },
  { value: 'jur', label: 'Juristische Personen' },
  { value: 'quel', label: 'Quellensteuer' },
  { value: 'verf', label: 'Verfahrensrecht' },
];
data.props.primarySelectData.triggerInputData.label = 'Thema';

data.props.secondarySelectData.listData.selectOptions = [
  { value: 'allg_erl', label: 'Erlasse &amp; Merkblätter', filterId: 'allg' },
  { value: 'quel_erl', label: 'Erlasse &amp; Merkblätter', filterId: 'quel' },
  { value: 'verf_erl', label: 'Erlasse &amp; Merkblätter', filterId: 'verf' },
  { value: 'strpf_nat', label: 'Steuerpflicht', filterId: 'nat' },
  { value: 'ausgl_nat', label: 'Ausgleich kalte Progression', filterId: 'nat' },
  { value: 'einkstr_nat', label: 'Einkommenssteuer', filterId: 'nat' },
  { value: 'zeitbl_nat', label: 'Zeitliche Bemessung', filterId: 'nat' },
  { value: 'verm_nat', label: 'Vermögenssteuer', filterId: 'nat' },
  { value: 'strpf_jur', label: 'Steuerpflicht', filterId: 'jur' },
  { value: 'zeitbl_jur', label: 'Zeitliche Bemessung', filterId: 'jur' },
  { value: 'gew_jur', label: 'Gewinnsteuer', filterId: 'jur' },
];
data.props.secondarySelectData.triggerInputData.label = 'Unterthema';

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
