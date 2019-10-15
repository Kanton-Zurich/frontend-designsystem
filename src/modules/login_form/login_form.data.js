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

const template = dataHelper.getFileContent('login_form.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Login Form',
    className: 'LoginForm',
    jira: 'CZHDEV-538',
    documentation: dataHelper.getDocumentation('login_form.md'),
  },
  props: {
    heading: 'Login ZHservices',
    introText: 'Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichte - den ersten in der Schweiz.',
    userNameInput: formInputData.variants.floatValidate.props,
    passwordInput: formInputData.variants.showPasswordButton.props,
    labelLoginBtn: 'Anmelden',
    tooltip: tooltipData,
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
