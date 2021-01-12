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
    documentation: dataHelper.getDocumentation('iframe.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'IFrame mit dynamischer Höhe',
    },
    props: {
      iframeScreenReaderHeading: {
        title: 'IFrame with dynamic height',
        level: 3,
      },
      iframeHeight: null,
      iframeSrc: 'iframe_content.mock.html',
      iframeTextLink: {
        icon: 'arrow-right',
        text: 'Inhalt in seperater Seite anzeigen',
        isInverted: false,
        hasLeadingIcon: false,
        hasTrailingIcon: true,
        textLinkSrc: 'https://inside-reality.com/',
        textLinkTargetBlank: true,
      },
      caption: _.merge({}, defFigcaptionData, {
        caption: 'Iframe Titel <a class="atm-text_link" href="#">Quelle</a>',
      }),
    },
  },
  default2: {
    meta: {
      title: 'Alternative',
      desc: '',
    },
    props: {
      heading: {
        level: 2,
        title: 'Small Iframe',
      },
      iframeHeight: 600,
      iframeSrc: 'https://www.one-inside.com/de/',
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
      iframeSrc: 'https://www.one-inside.com/de/',
      iframeFullSize: true,
    },
  },
  small: {
    meta: {
      title: 'Schmal / Klein',
      desc: '',
    },
    props: {
      iframeSrc: 'https://www.one-inside.com/de/',
      iframeFullSize: false,
      iframeSmall: true,
      iframeHeight: 600,
      heading: {
        level: 2,
        title: 'Small Iframe',
      },
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
