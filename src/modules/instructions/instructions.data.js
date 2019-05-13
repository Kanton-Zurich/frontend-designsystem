const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const richtextDemoData = require('../richtext/richtext.data');
const linklistDemoData = require('../linklist/linklist.data');
const videoDemoData = require('../video/video.data');
const imageFigureDemoData = require('../image_figure/image_figure.data');
const carouselDemoData = require('../carousel/carousel.data');
const texthighlightDemoData = require('../texthighlight/texthighlight.data');


const template = dataHelper.getFileContent('instructions.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'instructions',
    className: 'Instructions',
    jira: 'CZHDEV-223',
    documentation: dataHelper.getDocumentation('instructions.md'),
  },
  props: _.merge({
    instructions_title: 'Module Überschrift - Anleitung(H2)',
  }, richtextDemoData.props, linklistDemoData.props, videoDemoData.props,
  imageFigureDemoData.props, carouselDemoData.props, texthighlightDemoData.props),
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Ordered (Default - Black)',
      desc: 'Default implementation with an ordered list',
    },
    props: {},
  },
  unordered: {
    meta: {
      title: 'Unordered (Default - Black)',
      desc: 'Implementation with an unordered list',
    },
    props: {
      isUnordered: true,
    },
  },
  bordeauxOrdered: {
    meta: {
      title: 'Ordered (Bordeaux)',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
    },
  },
  magentaOrdered: {
    meta: {
      title: 'Ordered (Magenta)',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
    },
  },
  violetOrdered: {
    meta: {
      title: 'Ordered (Violett)',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
    },
  },
  blueOrdered: {
    meta: {
      title: 'Ordered (Blau)',
      desc: '',
    },
    props: {
      colorVariation: 'blue',

    },
  },
  darkblueOrdered: {
    meta: {
      title: 'Ordered (Dunkelblau)',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
    },
  },
  turqoiseOrdered: {
    meta: {
      title: 'Ordered (Türkis)',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
    },
  },
  greenOrdered: {
    meta: {
      title: 'Ordered (Grün)',
      desc: '',
    },
    props: {
      colorVariation: 'green',
    },
  },
  bordeauxUnordered: {
    meta: {
      title: 'Unordered (Bordeaux)',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
      isUnordered: true,
    },
  },
  magentaUnordered: {
    meta: {
      title: 'Unordered (Magenta)',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
      isUnordered: true,
    },
  },
  violetUnordered: {
    meta: {
      title: 'Unordered (Violett)',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
      isUnordered: true,
    },
  },
  blueUnordered: {
    meta: {
      title: 'Unordered (Blau)',
      desc: '',
    },
    props: {
      colorVariation: 'blue',
      isUnordered: true,
    },
  },
  darkblueUnordered: {
    meta: {
      title: 'Unordered (Dunkelblau)',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
      isUnordered: true,
    },
  },
  turqoiseUnordered: {
    meta: {
      title: 'Unordered (Türkis)',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
      isUnordered: true,
    },
  },
  greenUnordered: {
    meta: {
      title: 'Unordered (Grün)',
      desc: '',
    },
    props: {
      colorVariation: 'green',
      isUnordered: true,
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
