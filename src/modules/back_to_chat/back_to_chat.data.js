const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('back_to_chat.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Back to Chat',
    className: 'Back to Chat',
    jira: 'CZHDEV-4245',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    forceVisible: false,
    chatBtn: {
      ...buttonDefaultData,
      isAnchor: true,
      additionalClasses: 'mdl-backToChat__button',
      isSmall: true,
      isTextVisible: true,
      text: 'Öffnen',
      icon: 'launch',
    },
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
