const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const factRowData = require('../facts_row/facts_row.data.js').variants;
const factTileData = require('../fact_tile/fact_tile.data.js').variants;

const template = dataHelper.getFileContent('facts_block.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Facts Block',
    className: 'FactsBlock',
    jira: 'CZHDEV-4316',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});
const variants = _.mapValues(
  {
    stacked: {
      meta: {
        title: 'Stacked Tiles',
        desc: 'Block with Stacked Tiles',
      },
      props: {
        title: 'Zahlen und Fakten',
        factRows: [
          factRowData.oneStackedTile.props,
          factRowData.twoStackedTilesVariantFour.props,
          factRowData.twoStackedTiles.props,
        ],
      },
    },
    default: {
      meta: {
        title: 'Default Tiles',
        desc: 'Block with default Tiles',
      },
      props: {
        title: 'Zahlen und Fakten',
        factRows: [factRowData.defaultTwoTiles.props, factRowData.twoTilesVariantOne.props],
      },
    },
    stackedVariantOne: {
      meta: {
        title: 'Test Block with various Tiles',
        desc: 'Block mit verschiedene Tile-Kombinationen für Layout-Test',
      },
      props: {
        title: 'Zahlen und Fakten',
        factRows: [
          factRowData.oneStackedTile.props,
          factRowData.twoStackedTilesVariantFour.props,
          factRowData.defaultTwoTiles.props,
          factRowData.twoTilesVariantOne.props,
          factRowData.oneStackedTile.props,
          factRowData.twoStackedTilesVariantThree.props,
          factRowData.twoStackedTilesVariantTwo.props,
          factRowData.twoStackedTilesVariantOne.props,
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
