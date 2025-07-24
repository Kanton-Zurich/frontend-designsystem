const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('lead.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Lead',
    className: 'atm-lead',
    jira: 'CZHDEV-111',
    documentation: dataHelper.getDocumentation('README.md'),
    hideFromListing: false,
  },
  props: {
    leadText:
      'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.',
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
      },
      props: {},
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
