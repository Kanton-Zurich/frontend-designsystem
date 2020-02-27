const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const loginViewProps = require('./partials/login_view/login_view.data').props;
const detailsViewProps = require('./partials/details_view/details_view.data').props;
const rescheduleViewProps = require('./partials/reschedule_view/reschedule_view.data').props;
const buttonGroupDefaultData = require('../../modules/button_group/button_group.data').variants.default.props;
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;
const mapViewDefaultData = require('../../modules/map_view/map_view.data').variants.default.props;

const moduleSettings = {
  apiBase: 'https://internet-acc.zh.ch/proxy/migek/',
  attemptsBeforeTelephone: 3,
  calendarLinkProperties: {
    title: 'Kanton Zürich - Erfassung biometrischer Daten',
    location: 'Migrationsamt des Kantons Zürich',
    description: 'Migrationsamt des Kantons Zürich \\nBerninastrasse 45 \\n8057 Zürich \\n \\n'
      + '*Schalter G-S* (bitte Ticket beim *Eingang rechts* ziehen) \\n \\n'
      + 'Montag - Freitag 08:00-12:00 Uhr und 13:00-16:30Uhr \\n'
      + ' \\n \\n \\n'
      + 'Bringen Sie bitte folgende Unterlagen mit \\n'
      + ' - Terminbestätigung \\n'
      + ' - Original Ausländerausweis (ausser bei erstmaligem Gesuch) \\n'
      + ' - Original heimatlicher Reisepass \\n'
      + ' - Geburtsschein (bei Neugeborenen) \\n \\n \\n',
    htmlDescription: '<h3>Ort</h3> <p>Migrationsamt des Kantons Zürich<br>Berninastrasse 45<br>80'
      + '57 Zürich</p> <p><strong>Schalter G-S</strong> (bitte Ticket beim <strong>Eingang rechts</'
      + 'strong> ziehen)</p><p>Montag - Freitag 08:00-12:00 Uhr'
      + ' und 13:00-16:30 Uhr</p> <h3>Bringen Sie bitte folgende Unterlagen mit</h3> <ul> <li>Termin'
      + 'bestätigung</li> <li>Original Ausländerausweis (ausser bei erstmaligem Gesuch)</li> <li>Ori'
      + 'ginal heimatlicher Reisepass</li> <li>Geburtsschein (bei Neugeborenen)</li> </ul>',
  },
};

const contactData = {
  fullWidth: true,
  contactTitle: 'Ort',
  contactSubtitle: 'Migrationsamt des Kantons Zürichs',
  contactSubtitleMoreInfo: {
    href: '#',
    label: 'Mehr erfahren',
  },
  contactAddress: {
    street: 'Berninastrasse 45',
    zip: '8057',
    city: 'Zürich',
    additionalInfo: 'Schalter G-S (bitte beim Eingang rechts ziehen)',
  },
  contactPhone: [
    {
      anchorLabel: '+ 41 43 259 88 00',
      phoneNumer: '+ 41432598800',
      additionalInfo: 'Allgemeine Fragen',
      additionalInfoSpaced: 'Montag - Freitag 08:00 - 12:00 und 13:00 - 16:30Uhr',
    },
  ],
  mapData: _.merge({}, mapViewDefaultData, {
    mapId: 'contact-map',
    withUserLocate: false,
    mapMarker: [
      { lat: 47.380467, lng: 8.548396 },
    ],
    directions: {
      enabled: true,
    },
  }),
};

const unavailableNotificationData = {
  message: 'Grund dafür ist ein technisches Problem. Bitte versuchen Sie es später noch einmal.',
  title: 'Entschuldigung, der Service ist nicht verfügbar.',
  icon: '#caution',
  isDialog: true,
  button: {
    label: 'Erneut versuchen',
    isSmall: true,
    additionalAttributes: 'data-biometrie_appointment="retryConnect"',
  },
};

const logoutLink = {
  icon: 'logout-user',
  text: 'Logout',
  isInverted: false,
  hasLeadingIcon: true,
  hasTrailingIcon: false,
  additionalAttribute: 'data-biometrie_appointment="logout"',
};
const backLink = {
  icon: 'arrow-left',
  text: 'Zurück',
  isInverted: false,
  hasLeadingIcon: true,
  hasTrailingIcon: false,
  additionalAttribute: 'data-biometrie_appointment="rescheduleBack"',
};

const template = dataHelper.getFileContent('biometrie_appointment.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Appointment (Biometrie)',
    className: 'BiometrieAppointment',
    jira: 'CZBDEV',
    label: 'Applikation',
    documentation: dataHelper.getDocumentation('biometrie_appointment.md'),
  },
  props: {
    heading: 'Termin verschieben',
    beforeBlock: {
      heading: 'Dokumente vorbereiten',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
      checkpoints: [
        'Brief mit der Terminbestätigung',
      ],
    },
    mainBlock: {
      heading: 'Termin verschieben',
      description: 'Wie möchten sie Ihren Termin verschieben?',
      buttonGroup: _.assign({}, buttonGroupDefaultData, {
        buttons: [
          _.merge({}, buttonDefaultData, {
            isSecondary: true,
            additionalAttribute: 'data-biometrie_appointment="showContactBtn"',
            text: 'Vor Ort',
          }),
          _.merge({}, buttonDefaultData, {
            text: 'Online',
            additionalAttribute: 'data-biometrie_appointment="showOnlineBtn"',
          }),
          _.merge({}, buttonDefaultData, {
            isSecondary: true,
            additionalAttribute: 'data-biometrie_appointment="showContactBtn"',
            text: 'Telefonisch',
          }),
        ],
      }),
    },
    backLink,
    logoutLink,

    unavailableNotificationData,

    contactData,

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
