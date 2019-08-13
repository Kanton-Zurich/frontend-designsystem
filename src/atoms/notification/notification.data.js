const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('notification.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Popup Nachricht',
    className: 'Notification',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('notification.md'),
  },
  props: {
    message: 'Bitte kontrollieren Sie ihre Angaben für folgende Felder: <button>Vorname</button>',
    icon: '#caution',
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
