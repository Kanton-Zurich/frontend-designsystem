const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const demoItems = require('../statistics_search/statistics_search.mock.js').statistics.map(
  (item) => ({ ...item, headingLevel: 3 })
);

const template = dataHelper.getFileContent('statistics_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Statistik-Teaser',
    className: 'StatisticsTeaser',
    jira: 'CZHDEV-3831',
    label: 'Veraltet',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Default implementation',
      },
      props: {
        moduleHeader: {
          title: 'Ähnliche Themen',
          allArticleHref: '#',
          allArticleLabel: 'Alle Beiträge',
          headinglevel: 2,
          visualHeadingLevel: 2,
          isSearchResult: false,
        },
        // eslint-disable-next-line no-magic-numbers
        statisticsTeaserItems: demoItems.slice(0, 3),
      },
    },
    noHeader: {
      meta: {
        title: 'Statistik-Suche Resultate',
      },
      props: {
        isSearchResult: true,
        // eslint-disable-next-line no-magic-numbers
        statisticsTeaserItems: demoItems.slice(0, 9),
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
