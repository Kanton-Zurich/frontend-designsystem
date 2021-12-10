const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('figcaption.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Legende',
    className: 'Figcaption',
    jira: 'CZHDEV-191',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    caption: 'Bildlegende Fluss Quelle mit lange Texte in der Legende',
    inverted: false,
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: '',
    },
  },
  inverted: {
    meta: {
      title: 'Invertiert',
      desc: '',
    },
    props: {
      isInverted: true,
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
