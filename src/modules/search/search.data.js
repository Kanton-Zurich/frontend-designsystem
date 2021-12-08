const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const anchorlinkData = require('../../atoms/anchorlink/anchorlink.data').variants.tagTopTags.props;
const contentTeaser = require('../../atoms/content_teaser/content_teaser.data');

const template = dataHelper.getFileContent('search.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'OnSite-Suche',
    className: 'Search',
    jira: 'CZHDEV-805',
    label: 'Suche',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchorlinks: [
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Schulferien 2019',
          anchorlinkAdress: '/pages/search/search.html?q=Schulferien 2019',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Kurse für Hundehalter',
          anchorlinkAdress: '/pages/search/search.html?q=Kurse für Hundehalter',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Quellensteuer',
          anchorlinkAdress: '/pages/search/search.html?q=Quellensteuer',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Handelsregistereintrag',
          anchorlinkAdress: '/pages/search/search.html?q=Handelsregistereintrag',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Velo',
          anchorlinkAdress: '/pages/search/search.html?q=Velo',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'eAutoindex',
          anchorlinkAdress: '/pages/search/search.html?q=eAutoindex',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Schulferien 2019',
          anchorlinkAdress: '/pages/search/search.html?q=Schulferien 2019',
        },
      }),
    ],
    options: JSON.stringify({
      url: '/mocks/modules/search/search.json',
      searchPageUrl: '/pages/search/search.html',
    }),
    searchPageUrl: '/pages/search/search.html',
    autosuggestTemplate: contentTeaser.variants.default.meta.code.template,
    contentNav: {
      items: [],
      selector: 'data-search="autosuggest"',
      additionalClasses: 'mdl-search__autosuggest mdl-content_nav--single-column initially-hidden',
    },
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
