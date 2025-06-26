const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const factRowData = require('../facts_row/facts_row.data.js').variants;

const template = dataHelper.getFileContent('facts_section.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Facts Section',
    className: 'FactsSection',
    jira: 'CZHDEV-4316',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Zahlen und Fakten',
        },
        factRows: [
          factRowData.defaultTwoTiles.props,
          factRowData.default.props,
          factRowData.defaultVariantTwo.props,
        ],
      },
    },
    defaultVariantOne: {
      meta: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Layout Test',
        },
        desc: 'Default implementation',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Zahlen und Fakten',
        },
        factRows: [
          factRowData.defaultTwoTiles.props,
          factRowData.defaultVariantOne.props,
          factRowData.defaultOneTile.props,
          factRowData.defaultTwoTiles.props,
          factRowData.defaultVariantThree.props,
          factRowData.defaultVariantFour.props,
        ],
      },
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
