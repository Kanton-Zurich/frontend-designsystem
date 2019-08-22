const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const listDemoData = require('../../atoms/list/list.data');
const inputDemoData = require('../../atoms/form_input/form_input.data');

const template = dataHelper.getFileContent('select.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Select',
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
      title: 'Default',
      desc: 'Default implementation',
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
      desc: 'Default implementation',
    },
    props: {
      hasFilter: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, { setHiddenIndex: true }),
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
      hasFilter: true,
      hasFilterAndButton: true,
      listData: _.merge({}, listDemoData.variants.iconLeft.props, { setHiddenIndex: true }),
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
