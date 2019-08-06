const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const loginViewProps = require('./partials/login_view/login_view.data').props;
const detailsViewProps = require('./partials/details_view/details_view.data').props;
const rescheduleViewProps = require('./partials/reschedule_view/reschedule_view.data').props;

const moduleSettings = {
  apiBase: 'https://internet-acc.zh.ch/proxy/migek/',
  attemptsBeforeTelephone: 3,
};
const template = dataHelper.getFileContent('biometrie_appointment.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Appointment (Biometrie)',
    className: 'BiometrieAppointment',
    jira: 'CZBDEV',
    documentation: dataHelper.getDocumentation('biometrie_appointment.md'),
  },
  props: {
    heading: 'Termin zur Erfassung der biometrischen Daten verschieben',
    logoutLinkText: 'Logout & Schliessen',
    apiUnavailableMsg: '<p>Entschuldigung, der Service ist nicht verfügbar. Grund dafür ist ein technisches Problem.</p>Bitte versuchen Sie es später noch einmal.',

    loginViewProps,
    detailsViewProps,
    rescheduleViewProps,

    moduleSettings,
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
