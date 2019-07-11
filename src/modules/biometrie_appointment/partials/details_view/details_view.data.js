const _ = require('lodash');
const defaultData = require('../../../../data/default.data.js');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;

const data = _.merge({}, defaultData, {
  props: {
    messages: {
      labelLastName: 'Familienname',
      labelFirstName: 'Vorname',
      labelDateOfBirth: 'Geburtsdatum',
      headingAppointment: 'Ihr Termin',
      labelDate: 'Datum',
      labelTime: 'Uhrzeit',
      fromUntilConjunction: ' bis ',
      calLinksDescr: 'Zu meinem Kalender hinzufügen',
      location: {
        heading: 'Ort',
        paragraphs: [
          'Migrationsamt des Kantons Zürichs<br>Berninastrasse 45<br>8057 Zürich',
          '<strong>Schalter G-R</strong> (bitte Ticket beim <strong>Eingang rechts</strong> ziehen)',
          'Telefonnummer: 043 259 88 40',
          'Montag - Freitag 08:00-12:00Uhr und 13:00-16:30Uhr',
        ],
      },
      additionalInfo: {
        heading: 'Bringen Sie bitte folgende Unterlagen mit',
        contenBlocks: [
          '<ul><li>Terminbestätigung</li>'
          + '<li>Original Ausländerausweis (außer bei erstmaligem Gesuch)</li>'
          + '<li>Original heimatlicher Reisepass</li>'
          + '<li>Geburtsschein (bei Neugeborenen)</li></ul>',
        ],
      },
    },
    rescheduleBtn: _.merge({}, defaultButtonData, {
      text: 'Termin verschieben',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="reschedule"',
    }),
  },
});

module.exports = data;
