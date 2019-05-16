const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('figcaption.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Figcaption',
    className: 'Figcaption',
    jira: 'CZHDEV-191',
    documentation: dataHelper.getDocumentation('figcaption.md'),
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
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  inverted: {
    meta: {
      title: 'Inverted',
      desc: 'Inverted for image galleries and carousels',
    },
    props: {
      inverted: true,
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
