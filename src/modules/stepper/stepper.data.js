const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formVariants = require('../form/form.data').variants;
const notification = require('../../atoms/notification/notification.data').variants;

const template = dataHelper.getFileContent('stepper.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Formularschritte',
    className: 'Stepper',
    jira: 'CZHDEV-850',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('stepper.md'),
  },
  props: {
    title: 'Formular mit Schritten',
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
    props: {
      remark: false,
      steps: [
        formVariants.default.props,
        formVariants.careerInfo.props,
      ],
    },
  },
  withoutNavigation: {
    meta: {
      title: 'Ohne Navigation',
      desc: 'Implementierung der Formularschritte',
    },
    props: {
      navigation: false,
      remark: 'Ihre Daten werden ausschliesslich für den hier ersichtlichen Zweck verwendet. Siehe <a class="atm-text_link" href="#">Datenschutzerklärung</a> und <a class="atm-text_link" href="#">Nutzungsbedingungen</a>.',
      steps: [
        formVariants.defaultDuplicate.props,
      ],
    },
  },
  serviceForm: {
    meta: {
      title: 'Service Form (CZHDEV-775)',
      desc: '',
    },
    props: {
      title: null,
      navigation: false,
      overlayId: 'serviceOverlay1',
      steps: [
        _.merge({}, formVariants.defaultDuplicate.props, { sectionTitle: null }),
      ],
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
