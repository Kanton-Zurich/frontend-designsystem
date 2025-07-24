const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const factTileData = require('../fact_tile/fact_tile.data.js').variants;

const template = dataHelper.getFileContent('facts_row.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Facts Row',
    className: 'FactsRow',
    jira: 'CZHDEV-4316',
    label: 'Container',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: '3 Tiles',
        desc: 'Reihe mit 3 Tiles',
      },
      props: {
        factTiles: [
          factTileData.default.props,
          factTileData.defaultWithLongContent.props,
          factTileData.defaultWithLongLink.props,
        ],
      },
    },
    defaultVariantOne: {
      meta: {
        title: '3 Tiles, Variante 1',
        desc: 'Reihe mit 3 Tiles. Erste Tile ohne Beschreibung. Letzte Tile ohne Titel',
      },
      props: {
        factTiles: [
          factTileData.defaultWithoutDescription.props,
          factTileData.defaultWithLongContent.props,
          factTileData.defaultWithoutTitle.props,
        ],
      },
    },
    defaultVariantTwo: {
      meta: {
        title: '3 Tiles, Variante 2',
        desc: 'Reihe mit 3 Tiles. Alle Tiles ohne Titel. Erste Grid-Row ist collapsed.',
      },
      props: {
        factTiles: [
          factTileData.defaultWithoutTitle.props,
          factTileData.defaultWithoutTitle.props,
          factTileData.defaultWithoutTitle.props,
        ],
      },
    },
    defaultVariantThree: {
      meta: {
        title: '3 Tiles, Variante 3',
        desc: 'Reihe mit 3 Tiles. Alle Tiles ohne Titel. Erste Grid-Row ist collapsed.',
      },
      props: {
        factTiles: [
          factTileData.defaultWithoutTitle.props,
          factTileData.defaultWithoutLink.props,
          factTileData.defaultWithoutLinkDescription.props,
        ],
      },
    },
    defaultVariantFour: {
      meta: {
        title: '3 Tiles, Variante 4',
        desc: 'Reihe mit 3 Tiles. Eine Tile ohne Einheit',
      },
      props: {
        factTiles: [
          factTileData.default.props,
          factTileData.defaultWithoutUnit.props,
          factTileData.default.props,
        ],
      },
    },
    defaultTwoTiles: {
      meta: {
        title: '2 Tiles',
        desc: 'Reihe mit 2 Tiles',
      },
      props: {
        factTiles: [factTileData.default.props, factTileData.default.props],
      },
    },
    twoTilesVariantOne: {
      meta: {
        title: '2 Tiles, Variante 1',
        desc: 'Reihe mit 2 Tiles. ',
      },
      props: {
        factTiles: [factTileData.default.props, factTileData.defaultWithLongContent.props],
      },
    },
    defaultOneTile: {
      meta: {
        title: '1 Tiles',
        desc: 'Reihe mit 1 Tiles',
      },
      props: {
        factTiles: [factTileData.default.props],
      },
    },
    defaultStackedTile: {
      meta: {
        title: '3 stacked Tiles',
        desc: 'Reihe mit 3 stacked Tiles.',
      },
      props: {
        factTiles: [
          factTileData.stacked.props,
          factTileData.stacked.props,
          ,
          factTileData.stacked.props,
        ],
      },
    },
    twoStackedTiles: {
      meta: {
        title: '2 stacked Tiles',
        desc: 'Reihe mit 2 stacked Tiles',
      },
      props: {
        factTiles: [factTileData.stacked.props, factTileData.stacked.props],
      },
    },
    twoStackedTilesVariantOne: {
      meta: {
        title: '2 stacked Tiles, Variante 1',
        desc: 'Reihe mit 2 stacked Tiles. Beide Tiles haben keinen Titel. Erste Grid-Row ist collapsed.',
      },
      props: {
        factTiles: [factTileData.stackedWithoutTitle.props, factTileData.stackedWithoutTitle.props],
      },
    },
    twoStackedTilesVariantTwo: {
      meta: {
        title: '2 stacked Tiles, Variante 2',
        desc: 'Reihe mit 2 stacked Tiles. Erste Tile hat keinen Titel.',
      },
      props: {
        factTiles: [factTileData.stackedWithoutTitle.props, factTileData.stackedWithoutUnit.props],
      },
    },
    twoStackedTilesVariantThree: {
      meta: {
        title: '2 stacked Tiles, Variante 3',
        desc: 'Reihe mit 2 stacked Tiles. Erste Tile hat keinen Titel.',
      },
      props: {
        factTiles: [
          factTileData.stackedWithoutUnit.props,
          factTileData.stackedWithoutDescription.props,
        ],
      },
    },
    twoStackedTilesVariantFour: {
      meta: {
        title: '2 stacked Tiles, Variante 4',
        desc: 'Reihe mit 2 stacked Tiles. Erste Tile mir langem Inhalt.',
      },
      props: {
        factTiles: [
          factTileData.stackedWithLongContent.props,
          factTileData.stackedWithLongLink.props,
        ],
      },
    },
    oneStackedTile: {
      meta: {
        title: '1 stacked Tiles',
        desc: 'Reihe mit 1 stacked Tiles.',
      },
      props: {
        factTiles: [factTileData.stacked.props],
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
