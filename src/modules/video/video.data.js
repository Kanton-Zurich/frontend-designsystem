const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').variants.default.props;

const template = dataHelper.getFileContent('video.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Video',
    className: 'Video',
    jira: 'CZHDEV-123',
    documentation: dataHelper.getDocumentation('video.md'),
  },
  props: {
    headingLevel: 2,
    videoId: 'o2UzLWmUoiw',
    caption: _.merge({}, defFigcaptionData, {
      caption: 'Video der Kantonspolizei Zürich; Quelle: KaPo Zürich',
    }),
    title: 'Video über die KaPo Zürich',
    alt: 'Das ist ein Alternativ-Text',
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard, mit H2',
      desc: 'Standardmässige Videoeinbindung mit einem H2 als Titel',
    },
  },
  h3: {
    meta: {
      title: 'Standard, mit H3',
      desc: 'Standardmässige Videoeinbindung mit einem h3 als Titel',
    },
    props: {
      headingLevel: 3,
      videoId: 'xk0DEe_syF4',
    },
  },
  h4: {
    meta: {
      title: 'Standard, mit H4',
      desc: 'Standardmässige Videoeinbindung mit einem H4 als Titel',
    },
    props: {
      headingLevel: 4,
      videoId: 'X6v66XvVo_Q',
    },
  },
  withoutTitle: {
    meta: {
      title: 'Standard, ohne Titel',
      desc: 'Standardmässige Videoeinbindung ohne Titel',
    },
    props: {
      title: null,
      videoId: 'bFfn2pkzAew',
    },
  },
  fullwidthH2: {
    meta: {
      title: 'Volle Breite, mit H2',
      desc: 'Randabfallende Einbindung mit H2 als Titel',
    },
    props: {
      isFullwidth: true,
      videoId: 'p_KzDh9yan4',
    },
  },
  fullwidthH3: {
    meta: {
      title: 'Volle Breite, mit H3',
      desc: 'Randabfallende Einbindung mit H3 als Titel',
    },
    props: {
      isFullwidth: true,
      headingLevel: 3,
      videoId: 'c2beBLA8z-E',
    },
  },
  fullwidthH4: {
    meta: {
      title: 'Volle Breite, mit H4',
      desc: 'Randabfallende Einbindung mit H4 als Titel',
    },
    props: {
      isFullwidth: true,
      headingLevel: 4,
      videoId: 'TUBPWKf9gVs',
    },
  },
  fullwidthWithoutTitle: {
    meta: {
      title: 'Volle Breite, ohne Titel',
      desc: 'Randabfallende Einbindung ohne Titel',
    },
    props: {
      isFullwidth: true,
      title: null,
      videoId: 'UjU2R87m_gQ',
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
