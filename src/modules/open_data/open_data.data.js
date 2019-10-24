const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('open_data.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datenkomponente',
    className: 'OpenData',
    jira: 'CZHDEV-486',
    documentation: dataHelper.getDocumentation('open_data.md'),
    category: 'Liste',
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: '',
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
