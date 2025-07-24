const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('logo.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Logo',
    className: 'Logo',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    inverted: false,
    homelink: null,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Logo positiv',
      },
    },
    inverted: {
      meta: {
        title: 'Invertiert',
        desc: 'logo negativ',
      },
      props: {
        isInverted: true,
      },
    },
    linked: {
      meta: {
        title: 'Verlinkt',
        desc: '',
      },
      props: {
        homelink: 'https://zh.ch/',
      },
    },
    invertedLinked: {
      meta: {
        title: 'Invertiert verlinkt',
        desc: '',
      },
      props: {
        homelink: 'https://zh.ch/',
        isInverted: true,
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
          data: dataHelper.getFormattedJson(variantProps),
          html: dataHelper.getFormattedHtml(compiledVariant()),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
