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
    srcsets: [{
      image: '/assets/media/image/content_768_x15.jpeg',
      imageWidth: 1152,
    }, {
      image: '/assets/media/image/content_444_x15.jpeg',
      imageWidth: 666,
    }],
    alt: 'Das ist ein Beispielbild',
    caption: _.merge({}, defFigcaptionData, {
      caption: 'Das ist ein Bild, Quelle: Fotograf Andreas Andreasen',
    }),
    isSmall: false,
    isWide: false,
    hasDownload: false,
    useInCarousel: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Inhaltsbild',
      desc: 'Ein Standard Inhaltsbild ist so breit wie der Content, bzw. das Parent-Element',
    },
  },
  full169: {
    meta: {
      title: 'Inhaltsbild, volle Breite 16:9',
      desc: 'Ein Inhaltsbild, welches über die volle Breite geht (Verhältnis 16:9)',
    },
    props: {
      srcsets: [ {
        image: '/assets/media/image/fullwidth_16_9_1440_x15.jpeg',
        imageWidth: 2160,
      },
      {
        image: '/assets/media/image/fullwidth_16_9_1024_x15.jpeg',
        imageWidth: 1536,
      },
      {
        image: '/assets/media/image/fullwidth_16_9_600_x15.jpeg',
        imageWidth: 900,
      }],
      isWide: true,
    },
  },
  full219: {
    meta: {
      title: 'Inhaltsbild, volle Breite 21:9',
      desc: 'Ein Inhaltsbild, welches über die volle Breite geht (Verhältnis 21:9)',
    },
    props: {
      srcsets: [ {
        image: '/assets/media/image/fullwidth_21_9_1440_x15.jpeg',
        imageWidth: 2160,
      },
      {
        image: '/assets/media/image/fullwidth_21_9_1024_x15.jpeg',
        imageWidth: 1536,
      },
      {
        image: '/assets/media/image/fullwidth_21_9_600_x15.jpeg',
        imageWidth: 900,
      }],
      isWide: true,
    },
  },
  small: {
    meta: {
      title: 'Inhaltbild (klein)',
      desc: 'Ein Inhaltsbild, welches "klein" dargestellt wird',
    },
    props: {
      srcsets: [ {
        image: '/assets/media/image/small_368_x15.jpeg',
        imageWidth: 552,
      },
      {
        image: '/assets/media/image/small_260_x15.jpeg',
        imageWidth: 390,
      }],
      isSmall: true,
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
