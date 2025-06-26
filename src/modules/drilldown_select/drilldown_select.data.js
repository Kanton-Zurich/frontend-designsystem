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
    documentation: dataHelper.getDocumentation('README.md'),
    wrapInForm: true,
  },
  props: {
    primarySelectData: _.merge({}, defSelectData.variants.default.props, {
      additionalAttributes: 'data-filter-attribute="data-filter-id" data-drilldown-primary',
    }),
    secondarySelectData: _.merge({}, defSelectData.variants.default.props, {
      additionalAttributes: 'data-filter-attribute="data-filter-id" data-drilldown-secondary',
      triggerInputData: {
        disabled: true,
      },
    }),
    preview: true,
  },
});

data.props.primarySelectData.listData.selectOptions = [
  { value: 'allg', label: 'Allgemeines', id: _.uniqueId('option-item') },
  { value: 'natü person', label: 'Natürliche Personen', id: _.uniqueId('option-item') },
  { value: 'jur', label: 'Juristische Personen', id: _.uniqueId('option-item') },
  { value: 'quel', label: 'Quellensteuer', id: _.uniqueId('option-item') },
  { value: 'verf', label: 'Verfahrensrecht', id: _.uniqueId('option-item') },
  { value: 'qwe', label: 'LeerTest', id: _.uniqueId('option-item') },
];
data.props.primarySelectData.listData.groupId = 'thema';
data.props.primarySelectData.triggerInputData.label = 'Thema';

data.props.secondarySelectData.listData.selectOptions = [
  {
    value: 'allg_erl',
    label: 'Erlasse &amp; Merkblätter',
    filterId: 'allg',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'quel_erl',
    label: 'Erlasse &amp; Merkblätter',
    filterId: 'quel',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'verf_erl',
    label: 'Erlasse &amp; Merkblätter',
    filterId: 'verf',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'strpf_nat',
    label: 'Steuerpflicht',
    filterId: 'natü person',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'ausgl_nat',
    label: 'Ausgleich kalte Progression',
    filterId: 'natü person',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'einkstr_nat',
    label: 'Einkommenssteuer',
    filterId: 'natü person',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'zeitbl_nat',
    label: 'Zeitliche Bemessung',
    filterId: 'natü person',
    id: _.uniqueId('option-item'),
  },
  {
    value: 'verm_nat',
    label: 'Vermögenssteuer',
    filterId: 'natü person',
    id: _.uniqueId('option-item'),
  },
  { value: 'strpf_jur', label: 'Steuerpflicht', filterId: 'jur', id: _.uniqueId('option-item') },
  {
    value: 'zeitbl_jur',
    label: 'Zeitliche Bemessung',
    filterId: 'jur',
    id: _.uniqueId('option-item'),
  },
  { value: 'gew_jur', label: 'Gewinnsteuer', filterId: 'jur', id: _.uniqueId('option-item') },
];
data.props.secondarySelectData.listData.groupId = 'unterthema';
data.props.secondarySelectData.triggerInputData.label = 'Unterthema';

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        primarySelectData: {
          listData: {
            validation: {
              isRequired: false,
            },
          },
        },
        secondarySelectData: {
          listData: {
            validation: {
              isRequired: false,
            },
          },
        },
      },
    },
    required: {
      meta: {
        title: 'Required',
        desc: '',
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
