const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');


const template = dataHelper.getFileContent('form_input.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'FormInput',
    className: 'FormInput',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('form_input.md'),
  },
  props: {
    type: 'text',
    label: 'Placeholder',
    uuid: _.uniqueId('input'),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard (Primary)',
      desc: 'Standard Implementierung ohne Floating Label (nur Placeholder)',
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
