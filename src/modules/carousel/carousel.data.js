const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const imageDataFile = require('../../modules/image_figure/image_figure.data');
const buttonGroupDefaultData = require('../../modules/button_group/button_group.data').variants.default.props;
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('carousel.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Slider / Carousel (Bildergalerie)',
    className: 'Carousel',
    jira: 'CZHDEV-113',
    documentation: dataHelper.getDocumentation('carousel.md'),
  },
  props: {
    title: {
      level: 2,
      text: 'Kontrollpunkt für mobile Geräte eingerichtet - den ersten in der Schweiz',
    },
    slides: [
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
    ],
    controlButtons: _.assign({}, buttonGroupDefaultData, {
      buttons: [
        _.merge({}, buttonDefaultData, {
          isSecondary: true,
          isTextVisible: false,
          icon: 'angle_left',
          additionalAttribute: 'data-carousel="prev"',
        }),
        _.merge({}, buttonDefaultData, {
          isSecondary: true,
          isTextVisible: false,
          icon: 'angle_right',
          additionalAttribute: 'data-carousel="next"',
        }),
      ],
    }),
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
