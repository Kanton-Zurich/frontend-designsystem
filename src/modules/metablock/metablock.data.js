const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.secondaryWithoutText.props;

const template = dataHelper.getFileContent('metablock.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Metablock',
    className: 'Metablock',
    jira: 'CZHDEV-1234',
    documentation: dataHelper.getDocumentation('README.md'),
    label: 'Liste',
  },
  props: {
    headingLevel: 2,
    rows: [
      {
        columns: [
          {
            label: 'Text',
            text: 'Merkblatt des kantonalen Steueramtes über das Verfahren bei Bestreitung der Steuerhoheit ab Steuerperiode 1999 nach dem neuen Steuergesetz vom 8. Juni 1997',
          },
        ],
      },
      {
        columns: [
          {
            label: 'ZStB-Nummer',
            text: '3.1 ',
          },
          {
            label: 'Erlassdatum',
            text: '24. November 1999',
          },
        ],
      },
      {
        columns: [
          {
            label: 'Themenbereich',
            text: 'Natürliche Personen',
          },
          {
            label: 'Nummer alt',
            text: '11/050',
          },
        ],
      },
      {
        columns: [
          {
            label: 'Gültig ab',
            text: '1. Januar 1999',
          },
          {
            label: 'Stichworte',
            text: 'Steuerpflicht, Steuerhoheit',
          },
        ],
      },
      {
        columns: [
          {
            label: 'Link',
            text: 'http://www.zhlex.zh.ch/Erlass.html?Open&Ordnr=112',
            copyFunction: true,
          },
        ],
      },
    ],
    hasCopyFunction: true,
    copyBtn: _.merge({}, buttonDefaultData, {
      icon: 'link',
      additionalAttribute: 'data-metablock="copy"',
      text: 'Link kopieren',
    }),
    copySuccessNotification: {
      message: 'Der Link wurde in die Zwischenablage kopiert.',
      icon: '#confirm',
      isGreen: true,
      button: {
        label: 'Fertig',
        additionalAttribute: 'data-metablock="done"',
        icon: 'exit',
      },
    },
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  withTitle: {
    meta: {
      title: 'Mit Titel',
      desc: '',
    },
    props: {
      title: 'Steuerbuch Artikel',
      hasTopTitle: true,
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
