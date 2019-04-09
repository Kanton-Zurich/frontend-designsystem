const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').variants.default;

const template = dataHelper.getFileContent('image_figure.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Bild',
    className: 'ImageFigure',
    jira: 'CZHDEV-192',
    documentation: dataHelper.getDocumentation('image_figure.md'),
  },
  props: {
    srcsets: [ {
      width: 1024,
      image: '/assets/media/image/image_ktzh_example.jpg',
      deviceWidth: 1024,
    }, {
      width: 768,
      image: '/assets/media/image/image_ktzh_example_full.png',
      deviceWidth: 0,
    }],
    alt: 'Das ist ein Beispielbild',
    caption: _.merge({}, defFigcaptionData, {
      caption: 'Das ist ein Bild, Quelle: unbekannt',
    }),
    isSmall: false,
    isWide: false,
    hasDownload: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Inhaltsbild',
      desc: 'Ein Standard Inhaltsbild ist so breit wie der Content, bzw. das Parent-Element',
    },
  },
  small: {
    meta: {
      title: 'kleines Inhaltsbild',
      desc: 'Ein kleines Inhaltsbild, halb so breit wie der Content, bzw. das Parent-Element',
    },
    props: {
      srcsets: [{
        width: 320,
        image: '/assets/media/image/image_ktzh_example_small.jpg',
        deviceWidth: 0,
      }],
      isSmall: true,
    },
  },
  full: {
    meta: {
      title: 'Inhaltsbild, volle Breite',
      desc: 'Ein Inhaltsbild, welches über die volle Breite geht',
    },
    props: {
      srcsets: [{
        width: 320,
        image: '/assets/media/image/image_ktzh_example_full.png',
        deviceWidth: 0,
      }],
      isWide: true,
    },
  },
  withDownload: {
    meta: {
      title: 'Inhaltsbild, mit Download',
      desc: 'Ein Inhaltsbild, welches über einen Button heruntergeladen werden kann.',
    },
    props: {
      hasDownload: true,
    },
  },
}, (variant) => {
  // eslint-disable-next-line consistent-return
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'srcsets') {
      return variantValue;
    }
  }).props;

  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.mergeWith({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  // eslint-disable-next-line consistent-return
  }, (dataValue, variantValue, key) => {
    if (key === 'srcsets') {
      return variantValue;
    }
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
