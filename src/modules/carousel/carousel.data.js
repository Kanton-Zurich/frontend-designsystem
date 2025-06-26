const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const imageDataFile = require('../image_figure/image_figure.data');
const buttonGroupDefaultData = require('../button_group/button_group.data').variants.default.props;
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('carousel.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Slider',
    className: 'Carousel',
    jira: 'CZHDEV-113',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    heading: {
      level: 2,
      visualLevel: 2,
      title: 'Kontrollpunkt für mobile Geräte eingerichtet - den ersten in der Schweiz',
    },
    slides: [
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_1440_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_1024_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_600_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_1440_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_1024_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_600_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_1440_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_1024_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_600_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        lazy: true,
        srcsets: [
          {
            image: '/assets/media/image/carousel_1440_2667_x15.jpeg',
            imageWidth: 2160,
          },
          {
            image: '/assets/media/image/carousel_1024_1612_x15.jpeg',
            imageWidth: 1536,
          },
          {
            image: '/assets/media/image/carousel_600_944_x15.jpeg',
            imageWidth: 900,
          },
        ],
      }),
      _.merge({}, imageDataFile.variants.default.props, {
        hasDownload: true,
        useInCarousel: true,
        lazy: true,
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
          text: 'Vorheriges Bild',
        }),
        _.merge({}, buttonDefaultData, {
          isSecondary: true,
          isTextVisible: false,
          icon: 'angle_right',
          additionalAttribute: 'data-carousel="next"',
          text: 'Nächstes Bild',
        }),
      ],
    }),
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: '',
      },
    },
    alt: {
      meta: {
        title: 'Alternative',
      },
      props: {
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
            lazy: true,
            srcsets: [
              {
                image: '/assets/media/image/carousel_1440_2667_x15.jpeg',
                imageWidth: 2160,
              },
              {
                image: '/assets/media/image/carousel_1024_1612_x15.jpeg',
                imageWidth: 1536,
              },
              {
                image: '/assets/media/image/carousel_600_944_x15.jpeg',
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
