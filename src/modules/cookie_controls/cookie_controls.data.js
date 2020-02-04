const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('cookie_controls.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Cookie Controls',
    className: 'CookieControls',
    jira: 'CZHDEV-466',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('cookie_controls.md'),
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
      headingLevel: 2,
      heading: 'Datenschutz',
      subHeading: 'Einstellungen zum Datenschutz',
      expiryDays: 60,
      smallerHeadings: true,
      items: [
        {
          cookieName: 'acceptYouTube',
          label: 'Videos von Youtube akzeptieren',
          defaultValue: false,
          description: 'Wenn Sie akzeptieren, kann YouTube auf Seiten mit Videos Ihr Surf-Verhalten mitverfolgen.',
        },
        {
          cookieName: 'acceptAnalytics',
          label: 'Datenerfassung für Analytics akzeptieren',
          defaultValue: true,
          description: 'Wenn Sie akzeptieren, wird Ihr Surf-Verhalten auf der Seite mitverfolgt.',
        },
      ],
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
