const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defImageFigureData = require('../image_figure/image_figure.data').variants.default.props;
const defButtonData = require('../../atoms/button/button.data').variants.secondary.props;

const smallGalleryImage = _.merge({}, defImageFigureData, {
  srcsets: [
    {
      image: '/assets/media/image/gallery-small_300.jpeg',
      deviceWidth: 1025,
    },
    {
      image: '/assets/media/image/gallery-small_213.jpeg',
      deviceWidth: 601,
    },
    {
      image: '/assets/media/image/gallery-small_125.jpeg',
      deviceWidth: 1,
    },
  ],
});

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
    loadMore: _.merge({}, defButtonData, {
      text: 'Mehr anzeigen',
      additionalAttribute: 'data-image-gallery="showMore"',
    }),
    highlight: _.merge({}, defImageFigureData, {
      srcsets: [
        {
          image: '/assets/media/image/gallery-big_640.jpg',
          deviceWidth: 1025,
        },
        {
          image: '/assets/media/image/gallery-big_455.jpeg',
          deviceWidth: 601,
        },
        {
          image: '/assets/media/image/gallery-big_267.jpeg',
          deviceWidth: 1,
        },
      ],
    }),
    imagesTeasered: [
      smallGalleryImage,
      smallGalleryImage,
      smallGalleryImage,
      smallGalleryImage,
    ],
    furtherImages: [
      smallGalleryImage,
      smallGalleryImage,
      smallGalleryImage,
    ],
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
