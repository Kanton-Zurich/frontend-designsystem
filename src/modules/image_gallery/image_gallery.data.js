const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defImageFigureData = require('../image_figure/image_figure.data').variants.default.props;

const template = dataHelper.getFileContent('image_gallery.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Bildergalerie',
    className: 'ImageGallery',
    jira: 'CZHDEV-113',
    documentation: dataHelper.getDocumentation('image_gallery.md'),
  },
  props: {
    title: 'H2: Bildergalerie',
    highlight: defImageFigureData,
  },
});
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
