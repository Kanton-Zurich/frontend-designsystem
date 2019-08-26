const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const listDemoData = require('../../atoms/list/list.data');
const inputDemoData = require('../../atoms/form_input/form_input.data');

const template = dataHelper.getFileContent('select.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Auswahlfeld',
    className: 'Select',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('select.md'),
  },
  props: {

  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Einzelauswahl(Default)',
      desc: 'Default implementation einer Einzelauswahl',
    },
    props: {
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, { setHiddenIndex: true }),
      selectInputData: inputDemoData.variants.triggerDefault.props,
      filterInputDtat: inputDemoData.variants.smallWithIcon.props,
    },
  },
  selectPhone: {
    meta: {
      title: 'Phone',
      desc: 'Einzelauswahl mit Filter',
    },
    props: {
      hasFilter: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, { setHiddenIndex: true }),
      selectInputData: inputDemoData.variants.triggerPhone.props,
      filterInputDtat: inputDemoData.variants.smallWithIcon.props,
    },
  },
  defaultMultiPreSelect: {
    meta: {
      title: 'Mehrfachauswahl(Default)',
      desc: 'Default implementation einer Mehrfachauswahl (mit Vorauswahl)',
    },
    props: {
      isMultiSelect: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
        setHiddenIndex: true,
        isMultiSelect: true,
        isSingleSelect: false,
        selectOptions: [
          { value: 'mig', label: 'Migration & Integration', id: _.uniqueId('option-item') },
          { value: 'mo', label: 'Mobilität', id: _.uniqueId('option-item') },
          { value: 'sich', label: 'Sicherheit & Justiz', id: _.uniqueId('option-item') },
          {
            value: 'so', label: 'Soziales', id: _.uniqueId('option-item'),
          },
          {
            value: 'st', label: 'Steuern', id: _.uniqueId('option-item'),
          },
          { value: 'umte', label: 'Umwelt & Tier', id: _.uniqueId('option-item') },
          { value: 'ge', label: 'Gemeinschaften', id: _.uniqueId('option-item') },
          { value: 'scer', label: 'Schulen & Erziehung', id: _.uniqueId('option-item'), preSelected: true, },
        ],
      }),
      selectInputData: inputDemoData.variants.triggerDefault.props,
      filterInputDtat: inputDemoData.variants.smallWithIcon.props,
    },
  },
  multiSelect: {
    meta: {
      title: 'multiSelect',
      desc: 'Default implementation',
    },
    props: {
      isMultiSelect: true,
      hasFilter: true,
      hasFilterAndButton: true,
      listData: _.merge({}, listDemoData.variants.iconLeft.props, {
        setHiddenIndex: true,
        isMultiSelect: true,
        isSingleSelect: false,
      }),
      selectInputData: inputDemoData.variants.triggerDefault.props,
      filterInputDtat: inputDemoData.variants.smallWithIcon.props,
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
