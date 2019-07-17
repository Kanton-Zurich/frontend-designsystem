const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('news_teaser.hbs');

const demoImageFigureData = {
  srcsets: [{
    image: '/assets/media/image/news_teaser_208x117_x15.jpeg',
    imageWidth: 666,
  }],
  alt: 'Das ist ein Beispielbild',
  isSmall: false,
  isWide: false,
  hasDownload: false,
  useInCarousel: false,
  noTitle: true,
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Teaser',
    className: 'NewsTeaser',
    jira: 'CZHDEV-502',
    documentation: dataHelper.getDocumentation('news_teaser.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation. News Teaser nur mit Überschrift.',
    },
    props: {

    },
  },
  withImages: {
    meta: {
      title: 'Mit Bild',
      desc: 'News Teaser mit Überschrift, Datum und Bild.',
    },
    props: {
      imageFigure: _.merge({}, demoImageFigureData),
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
