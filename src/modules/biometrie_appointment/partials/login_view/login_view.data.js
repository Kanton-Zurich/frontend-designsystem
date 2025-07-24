const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('login_view.hbs');
const loginErrNotification1 = {
  message:
    'Invalider oder unvollständiger Token. Der Token ist 16-stellig und besteht ausschliesslich aus Buchstaben (ohne Umlaute) und Ziffern.',
  icon: '#caution',
};
const loginErrNotification2 = {
  message: 'Der Token ist Falsch. Bitte überprüfen Sie Ihre Angaben.',
  icon: '#caution',
};
const loginErrNotification3 = {
  message:
    'Der Token ist Falsch. Bitte überprüfen Sie Ihre Angaben. Wenn Sie sich nicht anmelden können, rufen Sie uns von Montag – Freitag von 09:00 – 11:00 Uhr auf die Telefonnr. 043 259 88 40 an.',
  icon: '#caution',
};

const data = _.merge({}, defaultData, {
  props: {
    messages: {
      head: 'Login',
      inputLabel: 'Token',
      hint: 'Den 16-stelligen Token finden Sie auf der Terminbestätigung',
      loginErrMsg1:
        'Invalider oder unvollständiger Token. Der Token ist 16-stellig und besteht ausschliesslich aus Buchstaben (ohne Umlaute) und Ziffern.',
      loginErrMsg2: 'Der Token ist Falsch. Bitte überprüfen Sie Ihre Angaben.',
      loginErrMsg3:
        'Der Token ist Falsch. Bitte überprüfen Sie Ihre Angaben. Wenn Sie sich nicht anmelden können, rufen Sie uns von Montag – Freitag von 09:00 – 11:00 Uhr auf die Telefonnr. 043 259 88 40 an.',
    },
    loginSubmitBtn: _.merge({}, defaultButtonData, {
      text: 'Anmelden',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="submit"',
    }),
    loginErrNotification1,
    loginErrNotification2,
    loginErrNotification3,
  },
});

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
    },
    alertIncomplete: {
      meta: {
        title: 'DEMO unvollständiger Token',
        desc: 'Zeigt die Warnung für unvollständige Token.',
      },
      props: {
        demoAlert: true,
        demoAlertMsg1: true,
        demoAlertMsg2: false,
        demoAlertMsg3: false,
      },
    },
    alertInvalid: {
      meta: {
        title: 'DEMO invalider Token',
        desc: 'Zeigt die Warnung für invalide Token.',
      },
      props: {
        demoAlert: true,
        demoAlertMsg1: false,
        demoAlertMsg2: true,
        demoAlertMsg3: false,
      },
    },
    alertPhone: {
      meta: {
        title: 'DEMO mit Telefonnummer',
        desc: 'Zeigt die Warnung für invalide Token mit Telefonnummer.',
      },
      props: {
        demoAlert: true,
        demoAlertMsg1: false,
        demoAlertMsg2: false,
        demoAlertMsg3: true,
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
