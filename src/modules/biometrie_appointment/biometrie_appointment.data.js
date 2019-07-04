const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defaultButtonData = require('../../atoms/button/button.data').variants.default.props;

const messages = {
  login: {
    beforeParagraph: 'Melden sie sich an um ihren Termin verschieben zu können.',
    head: 'Login',
    inputLabel: 'Token',
    hint: 'Den 16 stelligen Token finden sie auf der Terminbestätigung.',
    loginErrMsg1: 'Invalider oder unvollständiger Token. Der Token ist 16 stellig und besteht ausschließlich aus Buchstaben (ohne Umlaute) und Ziffern.',
    loginErrMsg2: 'Der Token ist Falsch. Bitte überprüfen sie ihre Angaben.',
    loginErrMsg3: 'Der Token ist Falsch. Bitte überprüfen sie ihre Angaben. Wenn sie sich nicht anmelden können, rufen sie uns unter der Telefonnummer 043 259 888 40 an. Öffnungszeiten: Montag - Freitag 10:00 Uhr - 12:00 Uhr.',
  },
};


const template = dataHelper.getFileContent('biometrie_appointment.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Appointment (Biometrie)',
    className: 'BiometrieAppointment',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('biometrie_appointment.md'),
  },
  props: {
    apiBase: 'http://localhost:3000/biometrie/',
    heading: 'Termin verschieben',
    messages: messages,
    loginSubmitBtn: _.merge({}, defaultButtonData, {
      text: 'Anmelden',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="submit"',
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
