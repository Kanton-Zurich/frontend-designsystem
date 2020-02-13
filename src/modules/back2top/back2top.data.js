const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('back2top.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Back2Top',
    className: 'Back2top',
    jira: 'CZHDEV-499',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('back2top.md'),
  },
  props: {
    toTopBtn: _.merge({}, buttonDefaultData, {
      isTextVisible: false,
      icon: 'arrow-up',
    }),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      develop: false,
      preserveLangSwitch: false,
    },
  },
  develop: {
    meta: {
      title: 'Dev',
      desc: 'Develop implementation (additional spacing, link to topics page)',
    },
    props: {
      develop: true,
      preserveLangSwitch: true,
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
