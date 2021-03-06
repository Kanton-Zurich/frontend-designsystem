const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').variants.default.props;

const defImageFigureData = {
  srcsets: [{
    image: '/assets/media/pngsprite/video_placeholder_600x338.png',
    imageWidth: 600,
  }, {
    image: '/assets/media/pngsprite/video_placeholder_1280x720.png',
    imageWidth: 1280,
  }],
  isSmall: false,
  isWide: false,
  hasDownload: false,
  useInCarousel: false,
  useInGallery: false,
  noTitle: true,
};

const template = dataHelper.getFileContent('video.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Video',
    className: 'Video',
    jira: 'CZHDEV-123',
    label: 'Eingebettet',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    headingLevel: 2,
    expiryDays: 60,
    cookieName: 'acceptYouTube',
    videoId: 'o2UzLWmUoiw',
    caption: _.merge({}, defFigcaptionData, {
      caption: 'Video der Kantonspolizei Zürich; Quelle: KaPo Zürich',
    }),
    video_title: 'Video über die KaPo Zürich',
    alt: 'Das ist ein Alternativ-Text',
    placeholderImage: defImageFigureData,
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
      desc: 'Standardmässige Videoeinbindung mit einem H3 als Titel',
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
      video_title: null,
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
      video_title: null,
      videoId: 'UjU2R87m_gQ',
    },
  },
  header: {
    meta: {
      title: 'Header Video',
      desc: 'Rechts inhaltsabfallend Einbindung ohne Titel',
    },
    props: {
      isHeader: true,
      video_title: null,
      videoId: 'WzInVZXi_FA',
    },
  },
  offlinePage: {
    props: {
      videoId: 'xk0DEe_syF4',
      caption: _.merge({}, defFigcaptionData, {
        caption: 'Imagefilm des Kanton Zürich',
      }),
      video_title: 'Imagefilm des Kanton Zürich',
      alt: 'Imagefilm des Kanton Zürich',
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
