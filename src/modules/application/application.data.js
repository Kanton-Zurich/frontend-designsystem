const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').props;
const dataDownloadVariants = require('../data_download/data_download.data').variants;

const template = dataHelper.getFileContent('application.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Single Page Applikation',
    className: 'Application',
    jira: 'CZHDEV-792',
    label: 'Eingebettet',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Volle Breite',
        desc: 'Applikation, die die Layout-Breite nutzt',
      },
      props: {
        windowWidth: false,
        contentWidth: false,
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Single Page Application',
        },
        altText: 'Alt text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Canvas Titel <a class="atm-text_link" href="#">Quelle</a>',
          altCaptionId: _.uniqueId('mdl-application__caption'),
        }),
        mock: 'canvas',
      },
    },
    narrow: {
      meta: {
        title: 'Inhaltsbreite',
        desc: 'Applikation, die die Inhaltsbreite nutzt',
      },
      props: {
        windowWidth: false,
        contentWidth: true,
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Single Page Application',
        },
        altText: 'Alt text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Canvas Titel <a class="atm-text_link" href="#">Quelle</a>',
          altCaptionId: _.uniqueId('mdl-application__caption'),
        }),
        mock: 'statistik',
      },
    },
    narrowEncapsulated: {
      meta: {
        title: 'Inhaltsbreite (gekapselt)',
        desc: 'Gekapselte Applikation, die die Inhaltsbreite nutzt',
      },
      props: {
        encapsulated: true,
        windowWidth: false,
        contentWidth: true,
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Single Page Application',
        },
        altText: 'Alt text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Canvas Titel <a class="atm-text_link" href="#">Quelle</a>',
          altCaptionId: _.uniqueId('mdl-application__caption'),
        }),
        mock: 'steuerfuss',
      },
    },
    wide: {
      meta: {
        title: 'Fenster-Breite',
        desc: 'Applikation, die die gesamte Fenster-Breite nutzt',
      },
      props: {
        windowWidth: true,
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Single Page Application',
        },
        altText: 'Alt text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Canvas Titel <a class="atm-text_link" href="#">Quelle</a>',
          altCaptionId: _.uniqueId('mdl-application__caption'),
        }),
        mock: 'canvas',
      },
    },
    fullWidth: {
      meta: {
        title: 'Fenster-Breite in Modal',
        desc: 'Applikation, die die gesamte Fenster-Breite nutzt für Darstellung in Modal (kein Titel, keine Caption)',
      },
      props: {
        windowWidth: true,
        mock: 'canvas',
        altText: 'Alt text',
      },
    },
    zhApp: {
      meta: {
        title: 'ZHApp Fenster-Breite in Modal',
        desc: 'Applikation, die die gesamte Fenster-Breite nutzt für Darstellung in Modal (kein Titel, keine Caption)',
      },
      props: {
        windowWidth: true,
        mock: 'wahlen',
        altText: 'Alt text',
      },
    },
    notFound: {
      meta: {
        title: 'Ladefehler',
        desc: 'HTML-Snippet wurde nicht gefunden',
      },
      props: {
        mock: 'not-found',
        windowWidth: false,
        contentWidth: true,
        altText: 'Alt text',
      },
    },
    singleDownload: {
      meta: {
        title: 'Single Download H3 Style',
        desc: 'Für SPA mit einem Download',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 3,
          title: 'Single Page Application',
        },
        description: 'Grafik Beschreibung',
        altText: 'Alt text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Canvas Titel <a class="atm-text_link" href="#">Quelle</a>',
          altCaptionId: _.uniqueId('mdl-application__caption'),
        }),
        dataDownload: dataDownloadVariants.singleLink.props,
        mock: 'canvas',
      },
    },
    multiDownload: {
      meta: {
        title: 'Multi Download',
        desc: 'Für SPA mit mehreren Downloads',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Single Page Application',
        },
        description: 'Grafik Beschreibung',
        altText: 'Alt text',
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Canvas Titel <a class="atm-text_link" href="#">Quelle</a>',
          altCaptionId: _.uniqueId('mdl-application__caption'),
        }),
        dataDownload: dataDownloadVariants.multi2.props,
        mock: 'canvas',
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
