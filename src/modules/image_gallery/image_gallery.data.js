const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defImageFigureData = require('../image_figure/image_figure.data').variants.default.props;
const defButtonData = require('../../atoms/button/button.data').variants.secondarySmall.props;
const defCarouselData = require('../carousel/carousel.data').variants.default.props;

const smallGalleryImage = _.merge({}, defImageFigureData, {
  srcsets: [
    {
      image: '/assets/media/image/gallery-small_300.jpeg',
      imageWidth: 450,
      useInGallery: true,
    },
    {
      image: '/assets/media/image/gallery-small_213.jpeg',
      imageWidth: 320,
      useInGallery: true,
    },
    {
      image: '/assets/media/image/gallery-small_125.jpeg',
      imageWidth: 188,
      useInGallery: true,
    },
  ],
  hasDownload: true,
  useInCarousel: true,
  caption: {
    caption: 'Das ist ein Bild mit grauem Hintergrund und den Dimensionen des Bildes, Quelle: Max Mustermann',
  },
});

const slideImage = _.merge({}, defImageFigureData, {
  hasDownload: true,
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
  useInCarousel: true,
});

const template = dataHelper.getFileContent('image_gallery.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Bildergalerie',
    className: 'ImageGallery',
    jira: 'CZHDEV-113',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'H2: Bildergalerie',
    loadMore: _.merge({}, defButtonData, {
      text: 'Mehr <span class="visuallyhidden">Bilder</span> anzeigen',
      additionalAttribute: 'data-image-gallery="showMore"',
    }),
    highlight: _.merge({}, defImageFigureData, {
      srcsets: [
        {
          image: '/assets/media/image/gallery-big_640.jpg',
          imageWidth: 960,
          useInGallery: true,
        },
        {
          image: '/assets/media/image/gallery-big_455.jpeg',
          imageWidth: 682,
          useInGallery: true,
        },
        {
          image: '/assets/media/image/gallery-big_267.jpeg',
          imageWidth: 400,
          useInGallery: true,
        },
      ],
      useInCarousel: true,
      hasDownload: true,
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
    carousel: _.merge({}, defCarouselData, {
      title: null,
      slides: [
        slideImage,
        slideImage,
        slideImage,
        slideImage,
        slideImage,
        slideImage,
        slideImage,
        slideImage,
      ],
    }),
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
}, (variant) => {
  const variantProps = _.mergeWith({}, data, variant).props;
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
