const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const templateConverter = require('../../../gulp/helpers/templateConverter');

const template = dataHelper.getFileContent('notification.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Popup Nachricht',
    className: 'Notification',
    jira: 'CZHDEV-850',
    documentation: dataHelper.getDocumentation('notification.md'),
  },
  props: {
    message: 'Bitte kontrollieren Sie ihre Angaben für folgende Felder: <button>Vorname</button>',
    icon: '#caution',
    isGreen: false,
    isBig: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Formular-Fehler',
      desc: 'Die Nachricht die angezeigt wird wenn im Formular ein Fehler auftaucht',
    },
  },
  formConfirmation: {
    meta: {
      title: 'Formular-Bestätigung',
      desc: 'Die Nachricht die angezeigt wird bei erfolgreicher Übermittlung eines Formulars',
    },
    props: {
      message: 'Ihr Daten wurden an das Strassenverkehrsamt übermittelt, man wird sich mit Ihnen in Verbindung setzen.',
      title: 'Vielen Dank',
      icon: '#confirm',
      isGreen: true,
      isBig: true,
    },
  },
  closeUserGroup: {
    meta: {
      title: 'Hinweis für geschütze Bereiche',
      desc: 'Der Hinweis wird angezeigt falls der User auf einer Seite landet die ein Login erfordert',
    },
    props: {
      message: 'Melden Sie sich ab und verwenden Sie die für diesen Bereich gültigen.',
      title: 'Ihr Login ist für diesen Bereich nicht gültig',
      icon: '#caution',
      isLogin: true,
    },
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        template: templateConverter(template, false),
        handlebars: dataHelper.getFormattedHandlebars(template),
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
