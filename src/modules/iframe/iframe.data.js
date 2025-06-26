const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').props;

const template = dataHelper.getFileContent('iframe.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'iFrame',
    className: 'IFrame',
    jira: 'CZHDEV-481',
    label: 'Eingebettet',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'IFrame mit dynamischer Höhe',
      },
      props: {
        iframeScreenReaderHeading: {
          title: 'iFrame ohne sichtbaren Titel',
          level: 3,
          visualLevel: 3,
        },
        iframeHeight: null,
        iframeSrc: 'iframe_content.mock.html',
        iframeTextLink: {
          icon: 'arrow-right',
          text: 'Inhalt in separater Seite anzeigen',
          isInverted: false,
          hasLeadingIcon: false,
          hasTrailingIcon: true,
          textLinkSrc: 'https://zeix.com/',
          textLinkTargetBlank: true,
        },
        iframeCaptionId: _.uniqueId('mdl-iframe__caption'),
        caption: _.merge({}, defFigcaptionData, {
          caption:
            'Iframe Titel, der gleichzeitig Legende als auch Alternativtext ist. <a class="atm-text_link" href="#">Quelle</a>',
        }),
      },
    },
    default2: {
      meta: {
        title: 'iFrame mit H2',
        desc: '',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'iFrame mit H2',
        },
        iframeHeight: 600,
        iframeSrc: 'https://www.zeix.com/',
        iframeCaptionId: _.uniqueId('mdl-iframe__caption'),
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Iframe Titel <a class="atm-text_link" href="#">Quelle</a>',
        }),
      },
    },
    fullSize: {
      meta: {
        title: 'Volle Grösse',
        desc: '',
      },
      props: {
        iframeSrc: 'https://www.zeix.com/',
        iframeFullSize: true,
        iframeCaptionId: _.uniqueId('mdl-iframe__caption'),
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Iframe Titel <a class="atm-text_link" href="#">Quelle</a>',
        }),
      },
    },
    small: {
      meta: {
        title: 'Schmal / Klein',
        desc: 'Kleines iFrame mit H3 Style',
      },
      props: {
        iframeSrc: 'https://www.zeix.com/',
        iframeFullSize: false,
        iframeSmall: true,
        iframeHeight: 600,
        heading: {
          level: 2,
          visualLevel: 3,
          title: 'Kleines iFrame mit H3 Style',
        },
        iframeCaptionId: _.uniqueId('mdl-iframe__caption'),
        caption: _.merge({}, defFigcaptionData, {
          caption: 'Iframe Titel <a class="atm-text_link" href="#">Quelle</a>',
        }),
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
