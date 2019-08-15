const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formVariants = require('../form/form.data').variants;
const notification = require('../../atoms/notification/notification.data').variants;

console.log(formVariants.careerInfo.props.rows[1]);

const template = dataHelper.getFileContent('stepper.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Formularschritte',
    className: 'Stepper',
    jira: 'CZHDEV-850',
    documentation: dataHelper.getDocumentation('stepper.md'),
  },
  props: {
    title: 'Formular mit Schritten',
    steps: [
      formVariants.default.props,
      formVariants.careerInfo.props,
    ],
    action: '/mocks/modules/form/form.json',
    confirmation: notification.formConfirmation.props,
    navigation: {
      steps: ['Persönliche Angaben', 'Berufliche Informationen', 'Bestätigung'],
    },
    notificationTemplate: notification.default.meta.code.template,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  withoutNavigation: {
    meta: {
      title: 'Ohne Navigation',
      desc: 'Implementierung der Formularschritte',
    },
    props: {
      navigation: false,
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
