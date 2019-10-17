const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('pagination.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Seiten Navigation',
    className: 'Pagination',
    jira: 'CZHDEV-990',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('pagination.md'),
  },
  props: {
    pageCount: 30,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  fullWidth: {
    meta: {
      title: 'Volle Breite',
      desc: '',
    },
    props: {
      fullWidth: true,
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
