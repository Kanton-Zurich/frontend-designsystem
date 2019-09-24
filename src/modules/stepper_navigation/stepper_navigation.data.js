const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('stepper_navigation.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Formular-Navigation',
    className: 'StepperNavigation',
    jira: 'CZHDEV-850',
    documentation: dataHelper.getDocumentation('stepper_navigation.md'),
    hideFromListing: true,
  },
  props: {
    steps: [
      'Persönliche Angaben',
      'Berufliche Informationen',
      'Bestätigung',
    ],
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
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
