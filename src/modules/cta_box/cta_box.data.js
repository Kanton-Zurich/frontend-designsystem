const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defaultButtonData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('cta_box.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'CTA Box',
    className: 'CTABox',
    jira: 'CZHDEV-550',
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default (Newsletter)',
        desc: 'Default implementation',
      },
      props: {
        title: 'Kanton Zürich Newsletter',
        text: 'Der Newsletter des Kantons informiert Sie rasch über verabschiedete Geschäfte des Regierungsrates und hält Sie per E-Mail über Neuigkeiten aus der kantonalen Verwaltung auf dem Laufenden.',
        buttonData: _.merge({}, defaultButtonData, {
          text: 'Jetzt abbonieren',
          anchorLink: 'newsletter.html',
          isAnchor: true,
          isSmall: true,
          isInverted: true,
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
