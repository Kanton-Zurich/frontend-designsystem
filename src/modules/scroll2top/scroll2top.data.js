const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('scroll2top.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Scroll2Top',
    className: 'Scroll2top',
    jira: 'CZHDEV-4245',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    toTopBtn: _.merge({}, buttonDefaultData, {
      isTextVisible: false,
      icon: 'arrow-up',
    }),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
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
