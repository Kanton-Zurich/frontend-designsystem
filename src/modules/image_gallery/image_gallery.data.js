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
      imageWidth: 300,
      useInGallery: true,
    },
    {
      image: '/assets/media/image/gallery-small_213.jpeg',
      imageWidth: 213,
      useInGallery: true,
    },
    {
      image: '/assets/media/image/gallery-small_125.jpeg',
      imageWidth: 125,
      useInGallery: true,
    },
  ],
  hasDownload: true,
  useInCarousel: true,
  caption: {
    caption:
      'Das ist ein Bild mit grauem Hintergrund und den Dimensionen des Bildes, Quelle: Max Mustermann',
  },
});

const slideImage = _.merge({}, defImageFigureData, {
  hasDownload: true,
  srcsets: [
    {
      image: '/assets/media/image/carousel_1440_x15.jpeg',
      imageWidth: 1440,
    },
    {
      image: '/assets/media/image/carousel_1024_x15.jpeg',
      imageWidth: 1024,
    },
    {
      image: '/assets/media/image/carousel_600_x15.jpeg',
      imageWidth: 600,
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
  props: {},
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: '',
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
              imageWidth: 640,
              useInGallery: true,
            },
            {
              image: '/assets/media/image/gallery-big_455.jpeg',
              imageWidth: 455,
              useInGallery: true,
            },
            {
              image: '/assets/media/image/gallery-big_267.jpeg',
              imageWidth: 267,
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
        furtherImages: [smallGalleryImage, smallGalleryImage, smallGalleryImage],
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
    },
    aspectRatios: {
      meta: {
        title: 'diverse Bildverhältnisse',
        desc: 'diverse Bildverhältnisse im Carousel',
      },
      props: {
        title: 'Bildergalerie, diverse Bildverhältnisse',
        loadMore: _.merge({}, defButtonData, {
          text: 'Mehr <span class="visuallyhidden">Bilder</span> anzeigen',
          additionalAttribute: 'data-image-gallery="showMore"',
        }),
        highlight: defImageFigureData,
        imagesTeasered: [smallGalleryImage, smallGalleryImage],
        furtherImages: [smallGalleryImage],
        carousel: {
          ...defCarouselData,
          slides: [
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_1024_1024_x15.jpeg', useInGallery: true },
              ],
              caption: {
                caption:
                  'Das hier ist eine unnötig lange Caption, damit man gucken was beim überlaufen passiert. Das hier ist eine unnötig lange Caption, damit man gucken was beim überlaufen passiert. Das hier ist eine unnötig lange Caption, damit man gucken was beim überlaufen passiert.',
              },
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_1024_x15.jpeg', useInGallery: true },
              ],
              caption: { caption: 'Das hier ist eine normale Caption.' },
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_1440_2667_x15.jpeg', useInGallery: true },
              ],
              caption: { caption: 'Das hier ist eine normale Caption.' },
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_600_600_x15.jpeg', useInGallery: true },
              ],
              caption: { caption: 'Das hier ist eine normale Caption.' },
            },
            {
              useInCarousel: true,
              srcsets: [{ image: '/assets/media/image/carousel_600_x15.jpeg', useInGallery: true }],
              caption: { caption: 'Das hier ist eine normale Caption.' },
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_1024_1612_x15.jpeg', useInGallery: true },
              ],
              caption: { caption: 'Das hier ist eine normale Caption.' },
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_1440_1440_x15.jpeg', useInGallery: true },
              ],
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_1440_x15.jpeg', useInGallery: true },
              ],
            },
            {
              useInCarousel: true,
              srcsets: [
                { image: '/assets/media/image/carousel_600_944_x15.jpeg', useInGallery: true },
              ],
            },
          ],
        },
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
