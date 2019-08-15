const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('iframe.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'iFrame',
    className: 'IFrame',
    jira: 'CZHDEV-481',
    documentation: dataHelper.getDocumentation('iframe.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      iframeScreenReaderHeading: {
        title: 'This is the homepage of the Inside Solutions GmbH',
        level: 3,
      },
      iframeSrc: 'https://www.one-inside.com/de/',
      iframeHeight: 600,
      iframeTextLink: {
        icon: 'arrow-right',
        text: 'Inhalt in seperater Seite anzeigen',
        isInverted: false,
        hasLeadingIcon: false,
        hasTrailingIcon: true,
        textLinkSrc: 'https://www.one-inside.com/de/',
        textLinkTargetBlank: true,
      },
    },
  },
  fullSize: {
    meta: {
      title: 'Volle Grösse',
      desc: '',
    },
    props: {
      iframeSrc: 'https://www.one-inside.com/de/',
      iframeFullSize: true
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
