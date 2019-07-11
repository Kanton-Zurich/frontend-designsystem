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
