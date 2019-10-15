const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formInputData = require('../../atoms/form_input/form_input.data');

const tooltipData = {
  helptext: 'Passwort vergessen?',
  asTextLink: true,
  bubble: {
    text: 'Bitte kontaktieren Sie diese <a href="mailto:test@test.com" >Emailaddresse</a> wenn Sie ein neues Passwort benötigen.',
    id: _.uniqueId('aria-anchors'),
  },
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
    heading: 'Login ZHservices',
    introText: 'Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichte - den ersten in der Schweiz.',
    userNameInput: formInputData.variants.floatValidate.props,
    passwordInput: formInputData.variants.showPasswordButton.props,
    labelLoginBtn: 'Anmelden',
    tooltip: tooltipData,
    unauthNotificationData,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  unauth: {
    meta: {
      title: 'Unauth',
      desc: 'View for unauthorized users',
    },
    props: {
      unauthorized: true,
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
