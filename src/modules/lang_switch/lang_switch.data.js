const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const selectDemoData = require('../select/select.data');

selectDemoData.variants.defaultUpwards.props.triggerInputData.label = 'Weitere Sprachen';

const template = dataHelper.getFileContent('lang_switch.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Sprachwechsel',
    className: 'LangSwitch',
    jira: 'CZHDEV-802',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('lang_switch.md'),
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
      selectData: selectDemoData.variants.defaultUpwards.props,
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
