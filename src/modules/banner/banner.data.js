const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('banner.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Header Banner',
    className: 'Banner',
    jira: 'CZHDEV-493',
    label: 'Teaser',
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
        fetchURL: '/modules/banner/banner.mock.html',
      },
    },
    withSubtitle: {
      meta: {
        title: 'Mit Subtitle',
        desc: 'Standard mit einem zusätzlichen Titel',
      },
      props: {
        fetchURL: '/modules/banner/banner.subtitle.mock.html',
      },
    },
    referendum: {
      meta: {
        title: 'anstehende Volksabstimmung',
        desc: 'Grünes Vote-Icon',
      },
      props: {
        fetchURL: '/modules/banner/banner.vote.mock.html',
      },
    },
    liveStream: {
      meta: {
        title: 'Medienkonferenz (ohne Portrait)',
      },
      props: {
        fetchURL: '/modules/banner/banner.conference1.mock.html',
      },
    },
    liveStreamWithPicture: {
      meta: {
        title: 'Medienkonferenz (mit Portrait)',
      },
      props: {
        fetchURL: '/modules/banner/banner.conference2.mock.html',
      },
    },
    warning: {
      meta: {
        title: 'Warnung',
      },
      props: {
        fetchURL: '/modules/banner/banner.warning.mock.html',
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
