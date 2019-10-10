const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFormData = require('../form/form.data');

const template = dataHelper.getFileContent('flex_data.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Flexdaten (Gesetzesbeschlüsse, Steuerbuch)',
    className: 'FlexData',
    jira: 'CZHDEV-1234',
    label: 'Applikation',
    documentation: dataHelper.getDocumentation('flex_data.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Steuerbuch',
      desc: 'Default implementation',
    },
    props: {
      flexFormData: _.merge({}, defFormData.variants.steuerBuch.props),
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
