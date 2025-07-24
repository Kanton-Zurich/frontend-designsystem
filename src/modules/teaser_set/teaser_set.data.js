const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const reportsItems = require('./teaser_set.mock.js').reports.map((item) => ({
  ...item,
  headingLevel: 3,
}));
const statisticsItems = require('../statistics_search/statistics_search.mock.js').statistics.map(
  (item) => ({ ...item, headingLevel: 3 })
);

const template = dataHelper.getFileContent('teaser_set.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Teaser Set',
    className: 'TeaserSet',
    jira: 'CZHDEV-4320',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Allgemeine Inhaltsübersicht',
      },
      props: {
        moduleHeader: {
          title: 'Inhaltsübersicht',
          headinglevel: 2,
          visualHeadingLevel: 2,
          isSearchResult: false,
        },
        description:
          'Einfühung und Hinweis zu Politikbereichen. Sagen, was in welchem Bereich lief. Inkl. Link auf Legislaturziele. Es ist ein Rückblick zum Jahr',
        teaserSetItems: reportsItems,
      },
    },
    reportsOverview: {
      meta: {
        title: 'Berichte Inhaltsübersicht',
      },
      props: {
        additionalClasses: 'mdl-teaser_set--reports-overview',
        moduleHeader: {
          title: 'Artikelübersicht',
          headinglevel: 2,
          visualHeadingLevel: 2,
          isSearchResult: false,
        },
        teaserSetItems: reportsItems,
      },
    },
    reportsTeaser: {
      meta: {
        title: 'Berichte Inhaltsteaser',
      },
      props: {
        additionalClasses: 'mdl-teaser_set--reports-teaser',
        moduleHeader: {
          title: 'Weitere Artikel - long Title for testing',
          allArticleHref: '#',
          allArticleLabel: 'Alle Artikel',
          headinglevel: 2,
          visualHeadingLevel: 2,
          isSearchResult: false,
        },
        // eslint-disable-next-line no-magic-numbers
        teaserSetItems: reportsItems.slice(0, 3),
      },
    },
    statsticsTeaser: {
      meta: {
        title: 'Statistik-Teaser',
      },
      props: {
        additionalClasses: 'mdl-teaser_set--statistics-teaser',
        moduleHeader: {
          title: 'Ähnliche Themen',
          allArticleHref: '#',
          allArticleLabel: 'Alle Beiträge',
          headinglevel: 2,
          visualHeadingLevel: 2,
          isSearchResult: false,
        },
        // eslint-disable-next-line no-magic-numbers
        teaserSetItems: statisticsItems.slice(0, 3),
      },
    },
    statisticsSearch: {
      meta: {
        title: 'Statistik-Suche Resultate',
      },
      props: {
        isSearchResult: true,
        // eslint-disable-next-line no-magic-numbers
        teaserSetItems: statisticsItems.slice(0, 9),
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
