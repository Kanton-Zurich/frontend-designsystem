const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formInputData = require('../../atoms/form_input/form_input.data');

const mockAssets = {
  emptyResponse: '/assets/mocks/cug/login_empty.json',
  unauthenticatedLogin: '/assets/mocks/cug/login_unauthenticated.json',
  unauthorizedLogin: '/assets/mocks/cug/login_unauthorized.json',
  loginOk: '/assets/mocks/cug/login_ok.json',
};

const tooltipData = {
  helptext: 'Passwort vergessen?',
  asTextLink: true,
  bubble: {
    text: 'Bitte kontaktieren Sie diese <a href="mailto:test@test.com" >Emailaddresse</a> wenn Sie ein neues Passwort benötigen.',
    id: _.uniqueId('aria-anchors'),
  },
};

const loginFailNotificationData = {
  message: 'Bitte kontrollieren Sie Ihre Angaben für die Felder Benutzername und Passwort.',
  icon: '#caution',
};

const unauthNotificationData = {
  message: 'Melden Sie sich ab und verwenden Sie die für diesen Bereich gültigen Login-Angaben.',
  title: 'Ihr Login ist für diesen Bereich nicht gültig.',
  icon: '#caution',
  isLogin: true,
  loginBtn: {
    label: 'Abmelden',
    additionalAttributes: 'data-cug_login="doLogout"',
  },
};

const serviceFailNotificationData = {
  message: 'Grund dafür ist ein technisches Problem. Bitte versuchen Sie es später noch einmal.',
  title: 'Entschuldigung, der Service ist nicht verfügbar.',
  icon: '#caution',
  isLogin: true,
};

const template = dataHelper.getFileContent('cug_login.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'CUG Login',
    className: 'CugLogin',
    jira: 'CZHDEV-538',
    documentation: dataHelper.getDocumentation('cug_login.md'),
  },
  props: {
    successRedirectUrl: 'http://localhost:9000/pages/focus/focus.html',
    endpointDoLogin: mockAssets.unauthenticatedLogin,
    heading: 'Login ZHservices',
    introText: 'Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichte - den ersten in der Schweiz.',
    userNameInput: _.merge({}, formInputData.variants.floatValidate.props, {
      uuid: 'kzh-username',
    }),
    passwordInput: _.merge({}, formInputData.variants.showPasswordButton.props, {
      uuid: 'kzh-password',
    }),
    labelLoginBtn: 'Anmelden',
    tooltip: tooltipData,
    unauthNotificationData,
    loginFailNotificationData,
    serviceFailNotificationData,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      endpointDoLogin: mockAssets.loginOk,
    },
  },
  embedded: {
    meta: {
      title: 'Eingebettet',
      desc: 'Kleinere im Seitenfluss eingebettete Login -Variante',
    },
    props: {
      heading: 'Login',
      introText: 'Um die Informationen dieser Seite zu sehen, müssen Sie sich einloggen. Sollten Sie kein Login besitzen oder Probleme beim Login haben, melden Sie sich bitte beim Strassenverkehrsamt unter folgender Telefonnummer: 012 345 78 96',
      endpointDoLogin: mockAssets.unauthenticatedLogin,
      embedded: true,
    },
  },
  unauth: {
    meta: {
      title: 'Unauth',
      desc: 'View for unauthorized users',
    },
    props: {
      endpointDoLogin: mockAssets.unauthorizedLogin,
    },
  },
  failed: {
    meta: {
      title: 'Failed',
      desc: 'Any Login attempt will fail and show an alert to check username and password.',
    },
    props: {
      endpointDoLogin: mockAssets.unauthenticatedLogin,
    },
  },
  apiFailed: {
    meta: {
      title: 'Connection Fail',
      desc: 'Click Login submit to see the reaction to a failing API or connection errors.',
    },
    props: {
      endpointDoLogin: mockAssets.emptyResponse,
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
