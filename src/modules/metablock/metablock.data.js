const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('metablock.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Metablock',
    className: 'Metablock',
    jira: 'CZHDEV-1234',
    documentation: dataHelper.getDocumentation('metablock.md'),
    label: 'Liste',
  },
  props: {
    items: [
      {
        label: 'Text',
        text: 'Merkblatt des kantonalen Steueramtes über das Verfahren bei Bestreitung der Steuerhoheit ab Steuerperiode 1999 nach dem neuen Steuergesetz vom 8. Juni 1997',
        wide: true,
      },
      {
        label: 'ZStB-Nummer',
        text: '3.1 ',
      },
      {
        label: 'Erlassdatum',
        text: '24. November 1999',
      },
      {
        label: 'Themenbereic',
        text: 'Natürliche Personen',
      },
      {
        label: 'Nummer alt',
        text: '11/050',
      },
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
