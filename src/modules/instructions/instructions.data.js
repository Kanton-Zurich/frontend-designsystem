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
  props: _.merge({ instructions_title: 'Module Überschrift - Anleitung(H2)' },
    richtextDemoData.props, linklistDemoData.props, videoDemoData.props, { headingLevel: 4 },
    imageFigureDemoData.props, carouselDemoData.props, { title: { level: 4 } },
    texthighlightDemoData.props),
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Anleitungsliste (Default - Black)',
      desc: 'Standart Implementation mit einer nummerierten Liste',
    },
    props: {
      videoId: 'QHCHVcU3_w4',
    },
  },
  unordered: {
    meta: {
      title: 'Checkpunktliste (Default - Black)',
      desc: 'Standart Implementation mit einer unnummerierten Liste',
    },
    props: {
      isUnordered: true,
      videoId: 'xk0DEe_syF4',
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
      videoId: 'X6v66XvVo_Q',
    },
  },
  violetOrdered: {
    meta: {
      title: 'Anleitungsliste (Violett)',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
      videoId: 'bFfn2pkzAew',
    },
  },
  blueOrdered: {
    meta: {
      title: 'Anleitungsliste (Blau)',
      desc: '',
    },
    props: {
      colorVariation: 'blue',
      videoId: 'p_KzDh9yan4',
    },
  },
  darkblueOrdered: {
    meta: {
      title: 'Anleitungsliste (Dunkelblau)',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
      videoId: 'c2beBLA8z-E',
    },
  },
  turqoiseOrdered: {
    meta: {
      title: 'Anleitungsliste (Türkis)',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
      videoId: 'TUBPWKf9gVs',
    },
  },
  greenOrdered: {
    meta: {
      title: 'Anleitungsliste (Grün)',
      desc: '',
    },
    props: {
      colorVariation: 'green',
      videoId: 'UjU2R87m_gQ',
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
      videoId: '3auDhuR-P4M',
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
      videoId: 'XYZNskmNhY8',
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
      videoId: 'Jclove2NkTI',
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
      videoId: 'vKDBTl9_agI',
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
      videoId: 'EcyunmYIkIA',
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
      videoId: '3I0MLVZx2Pg',
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
      videoId: 'MAyiReJzRTU',
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
