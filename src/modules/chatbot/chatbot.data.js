const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonProps = require('../../atoms/button/button.data.js');
const dialog = require('../dialog/dialog.data.js').variants.chatbot.props;

const template = dataHelper.getFileContent('chatbot.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Chatbot',
    className: 'Chatbot',
    jira: 'CZHDEV-4096',
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
        title: 'Haben Sie eine Frage zur Rechnung?',
        // tokenUrl: 'https://webchat-mockbot.azurewebsites.net/directline/token',
        // apiUrl: 'https://webchat-mockbot.azurewebsites.net/directline/',
        tokenUrl: 'https://europe.directline.botframework.com/v3/directline/tokens/generate',
        apiUrl: 'https://europe.directline.botframework.com/v3/directline',
        placeholder: 'Ihre Eingabe',
        botname: 'Handelsregister',
        modules: {
          chatbotBtn: {
            ...buttonProps.variants.primaryInverted.props,
            additionalClasses: 'mdl-chatbot__button',
            text: 'Ja',
          },
          dialog: {
            ...dialog,
            additionalClasses: 'mdl-chatbot__dialog',
            preview: false,
          },
        },
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
