const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defImageFigureData = require('../image_figure/image_figure.data');

const template = dataHelper.getFileContent('closing_image.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Abschlussbild',
    className: 'ClosingImage',
    jira: 'CZHDEV-3508',
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    imageData: defImageFigureData.variants.moodImage.props,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Stimmungsbild',
        desc: 'Volle Breite, Mobile 4:3, Desktop 21:9',
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
