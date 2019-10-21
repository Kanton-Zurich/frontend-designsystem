const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('tax_calc.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'tax_calc',
    className: 'TaxCalc',
    jira: 'CZHDEV-1238',
    documentation: dataHelper.getDocumentation('tax_calc.md'),
  },
  props: {
    beforeBenefitItems: [
      'Die berechneten Werte sind nicht rechtsverbindlich.',
      'In einzelnen Gemeinden können allenfalls abweichende Steuerfüsse zur Anwendung kommen. Für die Steuerzahlung ist einzig der Betrag auf der Steuerrechnung massgebend.',
      'Die Übermittlung der Daten erfolgt verschlüsselt und die Daten werden unmittelbar nach der Berechnung wieder gelöscht.',
      'Die Daten werden für keine weiteren Auswertungen verwendet.',
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
