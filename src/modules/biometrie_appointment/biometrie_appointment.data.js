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
  calendarLinkProperties: {
    title: 'Kanton Zürich - Erfassung biometrischer Daten',
    location: 'Migrationsamt des Kantons Zürich',
    description: 'Migrationsamt des Kantons Zürichs \\nBerninastrasse 45 \\n8057 Zürich \\n \\n'
      + '*Schalter G-S* (bitte Ticket beim *Eingang rechts* ziehen) \\n \\n'
      + 'Montag - Freitag 08:00-12:00Uhr und 13:00-16:30Uhr \\n'
      + ' \\n \\n \\n'
      + 'Bringen Sie bitte folgende Unterlagen mit \\n'
      + ' - Terminbestätigung \\n'
      + ' - Original Ausländerausweis (außer bei erstmaligem Gesuch) \\n'
      + ' - Original heimatlicher Reisepass \\n'
      + ' - Geburtsschein (bei Neugeborenen) \\n \\n \\n',
    htmlDescription: ' <h3>Ort</h3> <p>Migrationsamt des Kantons Zürichs<br>Berninastrasse 45<br>80'
      + '57 Zürich</p> <p><strong>Schalter G-R</strong> (bitte Ticket beim <strong>Eingang rechts</'
      + 'strong> ziehen)</p><p>Montag - Freitag 08:00-12:00Uhr'
      + ' und 13:00-16:30Uhr</p> <h3>Bringen Sie bitte folgende Unterlagen mit</h3> <ul> <li>Termin'
      + 'bestätigung</li> <li>Original Ausländerausweis (außer bei erstmaligem Gesuch)</li> <li>Ori'
      + 'ginal heimatlicher Reisepass</li> <li>Geburtsschein (bei Neugeborenen)</li> </ul>',
  },
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
    heading: 'Termin verschieben',
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
