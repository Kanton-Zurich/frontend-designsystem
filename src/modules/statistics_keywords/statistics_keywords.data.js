const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('statistics_keywords.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Statistik-Schlagworte',
    className: 'StatisticsKeywords',
    jira: 'CZHDEV-3825',
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        title: 'Schlagworte',
        keywords: [
          { text: 'Lernende', url: '#' },
          { text: 'Primarstufe', url: '#' },
          { text: 'Kanton Zürich', url: '#' },
          { text: 'Volksschule', url: '#' },
        ],
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
