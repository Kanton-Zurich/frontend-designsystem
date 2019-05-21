const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('text_link.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'TextLink',
    className: 'TextLink',
    jira: 'CZHDEV-298',
    documentation: dataHelper.getDocumentation('text_link.md'),
  },
  props: {
    icon: null,
    text: 'Text Link',
    isInverted: false,
    hasLeadingIcon: false,
    hasTrailingIcon: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Normaler Textlink',
    },
  },
  inverted: {
    meta: {
      title: 'Invertiert',
      desc: 'Normaler Textlink auf dunklem Grund',
    },
    props: {
      isInverted: true,
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
