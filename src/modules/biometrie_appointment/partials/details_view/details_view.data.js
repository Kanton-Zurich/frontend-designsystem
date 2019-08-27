const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('details_view.hbs');
const data = _.merge({}, defaultData, {
  props: {
    messages: {
      labelLastName: 'Familienname',
      labelFirstName: 'Vorname',
      labelDateOfBirth: 'Geburtsdatum',
      headingAppointment: 'Termin Details',
      labelDate: 'Datum',
      labelTime: 'Uhrzeit',
      fromUntilConjunction: ' bis ',
      calLinksDescr: 'Zu meinem Kalender hinzufügen',
      calIcsFileName: 'biometrie_appointment.ics',
      addinfo: {
        blocks: [
          {
            label: 'Ort',
            content: 'Migrationsamt des Kantons Zürichs<br>Berninastrasse 45, 8057 Zürich<br>'
              + '<br>Schalter G-S (bitte beim Eingang rechts ziehen)<br><br><a href="#" '
              + 'target="_blank">Route anzeigen</a>',
          },
          {
            label: 'Telefon',
            content: '+ 41 43 259 88 00<br>Montag - Freitag 08:00 - 12:00 und 13:00 - 16:30Uhr',
          },
        ],
      },
      checkList: {
        heading: 'Bringen Sie bitte folgende Unterlagen mit',
        items: [
          'Terminbestätigung',
          'Original Ausländerausweis (außer bei erstmaligem Gesuch)',
          'Original heimatlicher Reisepass',
          'Geburtsschein (bei Neugeborenen)',
        ],
      },
      rescheduleSuccessHead: 'Ihr Termin wurde verschoben',
      confirmationHead: 'Bitte beachten',
      confirmationIntroParagraph: 'Drucken Sie die neue Terminbestätigung aus und nehmen Sie diese mit an den Termin.',
    },
    rescheduleBtn: _.merge({}, defaultButtonData, {
      text: 'Termin verschieben',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="reschedule"',
    }),
    printConfirmationBtn: _.merge({}, defaultButtonData, {
      icon: 'download',
      text: 'Bestätigung herunterladen',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="printConfirmation"',
    }),
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  withMockData: {
    meta: {
      title: 'mit Dummy Daten',
      desc: 'Ansicht gefüllt mit Dummy Daten',
    },
    props: {
      withMockData: true,
      withConfirmation: false,
    },
  },
  confirmed: {
    meta: {
      title: 'mit Bestätigungsmeldung',
      desc: 'Ansicht gefüllt mit Dummy Daten und Bestätigungsmeldung',
    },
    props: {
      withMockData: true,
      withConfirmation: true,
    },
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  return _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });
});

data.variants = variants;

module.exports = data;
