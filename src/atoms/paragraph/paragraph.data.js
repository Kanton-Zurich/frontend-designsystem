const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('paragraph.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Paragraph',
    className: 'atm-paragraph',
    jira: 'CZHDEV-741',
    documentation: dataHelper.getDocumentation('README.md'),
    hideFromListing: false,
  },
  props: {
    paragraphText: 'P, Regular Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die'
      + ' Baudirektion hat beim <a href="#" class="atm-text_link">Landesmuseum</a> in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunktfür'
      + ' mobile Geräte eingerichtet – den ersten in der Schweiz.P, Helvetic Roman Interessierte können ab sofort die'
      + ' Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.'
      + ' Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen'
      + ' Kontrollpunktfür mobile Geräte eingerichtet – den ersten in der Schweiz.',
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
    },
    props: {
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
