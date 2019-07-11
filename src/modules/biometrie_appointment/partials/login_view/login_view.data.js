const _ = require('lodash');
const defaultData = require('../../../../data/default.data.js');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;

const data = _.merge({}, defaultData, {
  props: {
    messages: {
      beforeParagraphs: [
        'Melden sie sich an, um ihren Termin verschieben zu können.',
        'Den dazu notwendigen <em>Token</em> finden Sie auf der Terminbestätigung',
      ],
      head: 'Login',
      inputLabel: 'Token',
      hint: 'Den 16 stelligen Token finden sie auf der Terminbestätigung.',
      loginErrMsg1: 'Invalider oder unvollständiger Token. Der Token ist 16 stellig und besteht ausschließlich aus Buchstaben (ohne Umlaute) und Ziffern.',
      loginErrMsg2: 'Der Token ist Falsch. Bitte überprüfen sie ihre Angaben.',
      loginErrMsg3: 'Der Token ist Falsch. Bitte überprüfen sie ihre Angaben. Wenn sie sich nicht anmelden können, rufen sie uns unter der Telefonnummer 043 259 888 40 an. Öffnungszeiten: Montag - Freitag 10:00 Uhr - 12:00 Uhr.',
    },
    loginSubmitBtn: _.merge({}, defaultButtonData, {
      text: 'Anmelden',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="submit"',
    }),
  },
});

module.exports = data;
