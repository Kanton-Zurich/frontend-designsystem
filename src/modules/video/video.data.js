const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').variants.default.props;

const defImageFigureDataSpokenLanguage = {
  srcsets: [
    {
      image: '/assets/media/pngsprite/video_placeholder_600x338.png',
      imageWidth: 600,
    },
    {
      image: '/assets/media/pngsprite/video_placeholder_1280x720.png',
      imageWidth: 1280,
    },
  ],
  isSmall: false,
  isWide: false,
  hasDownload: false,
  useInCarousel: false,
  useInGallery: false,
  noTitle: true,
};

const defImageFigureDataSignLanguage = {
  srcsets: [
    {
      image: '/assets/media/pngsprite/video_placeholder_signlanguage_600x338.png',
      imageWidth: 600,
    },
    {
      image: '/assets/media/pngsprite/video_placeholder_signlanguage_1280x720.png',
      imageWidth: 1280,
    },
  ],
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
    visualHeadingLevel: 2,
    expiryDays: 60,
    cookieName: 'acceptYouTube',
    video_title: 'Video über die KaPo Zürich',
    videoVariant: {
      spokenLanguage: {
        videoId: 'X6v66XvVo_Q',
        placeholderImage: defImageFigureDataSpokenLanguage,
        alt: 'Das ist ein Alternativ-Text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Video der Kantonspolizei Zürich; Quelle: KaPo Zürich',
        }),
      },
    },
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard, mit H2',
        desc: 'Standardmässige Videoeinbindung mit einem H2 als Titel',
      },
    },
    defaultWithSignlanguage: {
      meta: {
        title: 'Standard, mit H2 und Gebärdensprache',
        desc: 'Standardmässige Videoeinbindung mit einem H2 als Titel und Gebärdensprache',
      },
      props: {
        toggle: {
          label: 'Gebärdensprache',
          id: 'X6v66XvVo_Q',
          labelLeft: true,
        },
        videoVariant: {
          spokenLanguage: {
            videoId: 'X6v66XvVo_Q',
            placeholderImage: defImageFigureDataSpokenLanguage,
            alt: 'Das ist ein Alternativ-Text',
            caption: _.merge({}, defFigcaptionData, {
              caption: 'Video der Kantonspolizei Zürich; Quelle: KaPo Zürich',
            }),
          },
          signLanguage: {
            videoId: 'xk0DEe_syF4',
            placeholderImage: defImageFigureDataSignLanguage,
            alt: 'Das ist ein Alternativ-Text für Gebärdensprache',
            caption: _.merge({}, defFigcaptionData, {
              caption: 'Video der Kantonspolizei Zürich in Gebärdensprache; Quelle: KaPo Zürich',
            }),
          },
        },
      },
    },
    h3: {
      meta: {
        title: 'Standard, mit H3',
        desc: 'Standardmässige Videoeinbindung mit einem H3 als Titel',
      },
      props: {
        headingLevel: 3,
        visualHeadingLevel: 3,
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
        visualHeadingLevel: 4,
      },
    },
    withoutTitle: {
      meta: {
        title: 'Standard, ohne Titel',
        desc: 'Standardmässige Videoeinbindung ohne Titel',
      },
      props: {
        video_title: null,
      },
    },
    fullwidthH2: {
      meta: {
        title: 'Volle Breite, mit H2',
        desc: 'Randabfallende Einbindung mit H2 als Titel',
      },
      props: {
        isFullwidth: true,
      },
    },
    fullwidthH2Signlanguage: {
      meta: {
        title: 'Volle Breite, mit H2 und Gebärdensprache',
        desc: 'Randabfallende Einbindung mit H2 als Titel und Gebärdensprache',
      },
      props: {
        isFullwidth: true,
        toggle: {
          label: 'Gebärdensprache',
          id: 'X6v66XvVo_Q',
          labelLeft: true,
        },
        videoVariant: {
          spokenLanguage: {
            videoId: 'X6v66XvVo_Q',
            placeholderImage: defImageFigureDataSpokenLanguage,
            alt: 'Das ist ein Alternativ-Text',
            caption: _.merge({}, defFigcaptionData, {
              caption: 'Video der Kantonspolizei Zürich; Quelle: KaPo Zürich',
            }),
          },
          signLanguage: {
            videoId: 'xk0DEe_syF4',
            placeholderImage: defImageFigureDataSignLanguage,
            alt: 'Das ist ein Alternativ-Text für Gebärdensprache',
            caption: _.merge({}, defFigcaptionData, {
              caption: 'Video der Kantonspolizei Zürich in Gebärdensprache; Quelle: KaPo Zürich',
            }),
          },
        },
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
        visualHeadingLevel: 3,
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
        visualHeadingLevel: 4,
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
      },
    },
    offlinePage: {
      meta: {
        title: 'Offline Page Video',
        desc: 'Variante für die offline Seite mit unabhängigem inline Script',
      },
      props: {
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Imagefilm des Kanton Zürich',
        }),
        video_title: 'Imagefilm des Kanton Zürich',
        alt: 'Imagefilm des Kanton Zürich',
        videoVariant: {
          spokenLanguage: {
            videoId: 'T2QET3e1Z4k',
            placeholderImage: defImageFigureDataSpokenLanguage,
          },
        },
        offlinePage: true,
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
