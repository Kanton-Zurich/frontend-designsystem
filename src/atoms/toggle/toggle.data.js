const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('toggle.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Toggle',
    className: 'Toggle',
    jira: 'CZHDEV-1144',
    documentation: dataHelper.getDocumentation('toggle.md'),
  },
  props: {
    label: 'E-Mail Benachrichtigungen erlauben',
    name: _.uniqueId('allowmailnotification'),
    id: _.uniqueId('allowmailnotification'),
    checked: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard Implementierung ohne Vorauswahl',
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
