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
      title: 'Anleitungsliste (Default - Black)',
      desc: 'Standart Implementation mit einer nummerierten Liste',
    },
    props: {},
  },
  unordered: {
    meta: {
      title: 'Checkpunktliste (Default - Black)',
      desc: 'Standart Implementation mit einer unnummerierten Liste',
    },
    props: {
      isUnordered: true,
    },
  },
  bordeauxOrdered: {
    meta: {
      title: 'Anleitungsliste (Bordeaux)',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
    },
  },
  magentaOrdered: {
    meta: {
      title: 'Anleitungsliste (Magenta)',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
    },
  },
  violetOrdered: {
    meta: {
      title: 'Anleitungsliste (Violett)',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
    },
  },
  blueOrdered: {
    meta: {
      title: 'Anleitungsliste (Blau)',
      desc: '',
    },
    props: {
      colorVariation: 'blue',

    },
  },
  darkblueOrdered: {
    meta: {
      title: 'Anleitungsliste (Dunkelblau)',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
    },
  },
  turqoiseOrdered: {
    meta: {
      title: 'Anleitungsliste (Türkis)',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
    },
  },
  greenOrdered: {
    meta: {
      title: 'Anleitungsliste (Grün)',
      desc: '',
    },
    props: {
      colorVariation: 'green',
    },
  },
  bordeauxUnordered: {
    meta: {
      title: 'Checkpunktliste (Bordeaux)',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
      isUnordered: true,
    },
  },
  magentaUnordered: {
    meta: {
      title: 'Checkpunktliste (Magenta)',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
      isUnordered: true,
    },
  },
  violetUnordered: {
    meta: {
      title: 'Checkpunktliste (Violett)',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
      isUnordered: true,
    },
  },
  blueUnordered: {
    meta: {
      title: 'Checkpunktliste (Blau)',
      desc: '',
    },
    props: {
      colorVariation: 'blue',
      isUnordered: true,
    },
  },
  darkblueUnordered: {
    meta: {
      title: 'Checkpunktliste (Dunkelblau)',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
      isUnordered: true,
    },
  },
  turqoiseUnordered: {
    meta: {
      title: 'Checkpunktliste (Türkis)',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
      isUnordered: true,
    },
  },
  greenUnordered: {
    meta: {
      title: 'Checkpunktliste (Grün)',
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
