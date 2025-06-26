const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defImageFigureData = require('../image_figure/image_figure.data.js');
const defVideoData = require('../video/video.data.js');
const defPersonCardData = require('../person_card/person_card.data.js').variants.default.props;

const template = dataHelper.getFileContent('key_visual.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Key Visual',
    className: 'KeyVisual',
    jira: 'CZHDEV-*',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    image: {
      meta: {
        title: 'Bild',
        desc: 'Key Visual mit Bild',
      },
      props: {
        imageData: defImageFigureData.variants.headerNoTitle.props,
      },
    },
    video: {
      meta: {
        title: 'Video',
        desc: 'Key Visual mit Video',
      },
      props: {
        videoData: defVideoData.variants.header.props,
      },
    },
    personCard: {
      meta: {
        title: 'Personenteaser',
        desc: 'Key Visual mit Personenteaser',
      },
      props: {
        personCardData: defPersonCardData,
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
