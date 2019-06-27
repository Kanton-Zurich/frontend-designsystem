const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants.default.props;
const contentTeaserDataWithoutBuzzwords = require('../../atoms/content_teaser/content_teaser.data').variants.withoutBuzzwords.props;

const template = dataHelper.getFileContent('content_nav.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Themenliste/ContentNav',
    className: 'ContentNav',
    jira: 'CZHDEV-389',
    documentation: dataHelper.getDocumentation('content_nav.md'),
  },
  props: {
    contentNavTitle: {
      level: 2,
      title: 'Themen',
      isHidden: true,
    },
    items: [
      contentTeaserDefaultData,
      _.merge({}, contentTeaserDefaultData, {
        shortTitle: 'Bildung',
        buzzwords: 'Schule, Lehrmittel, Berufsberatung, Berufsschule, Mittelschule',
      }),
      _.merge({}, contentTeaserDefaultData, {
        shortTitle: 'Gesundheit',
        buzzwords: 'Krankenversicherung, Prämienverbilligung, Kliniken',
      }),
      _.merge({}, contentTeaserDefaultData, {
        shortTitle: 'Freizeit & Kultur',
        buzzwords: 'Sportförderung, Schulsport, Jugendsport, Kulturförderung',
      }),
      _.merge({}, contentTeaserDefaultData, {
        shortTitle: 'Freizeit & Kultur',
        buzzwords: 'Sportförderung, Schulsport, Jugendsport, Kulturförderung',
      }),
      _.merge({}, contentTeaserDefaultData, {
        shortTitle: 'Ohne Buzzwords',
        buzzwords: null,
      }),
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
  oneItem: {
    meta: {
      title: 'Nur 1 Element',
      desc: 'Content-Navigation mit nur einem Element',
    },
    props: {
      items: [
        contentTeaserDefaultData,
      ],
    },
  },
  twoItems: {
    meta: {
      title: 'Nur 2 bis 4 Elemente',
      desc: 'Content-Navigation mit zwei Elementen',
    },
    props: {
      items: [
        contentTeaserDefaultData,
        contentTeaserDefaultData,
        contentTeaserDefaultData,
      ],
    },
  },
  relatedContent: {
    meta: {
      title: 'Verwandte Inhalte (CZHDEV-397)',
      desc: 'Verwandte Inhalte ist eine Variante der Content-Navigation',
    },
    props: {
      contentNavTitle: {
        isHidden: false,
        title: 'Das könnte Sie auch interessieren',
      },
    },
  },
  themeList: {
    meta: {
      title: 'Themenliste (CZHDEV-505)',
      desc: 'Themenliste ist eine Variante der Content-Navigation mit Titel, Intro, einer Liste mit einzelnen Buzzwords und einem "Alle anzeigen" Knopf',
    },
    props: {
      contentNavTitle: {
        isHidden: false,
        title: 'Unsere Themen',
        lead: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore '
        + 'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. '
        + 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit '
        + 'amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam '
        + 'erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, '
        + 'no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      },
      items: [
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Führerausweis',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Fahrzeug',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Autonummern',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Führerausweis',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Velo',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Ausweis oder Schild verloren',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Ausweisentzug & Verwarnung',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Schiffahrt',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Spezielle Bewilligungen',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Velo',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Velo',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Ausweis oder Schild verloren',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Fahren im Alter',
        }),
      ],
      showMoreButtonText: 'Alle anzeigen',
    },
  },
}, (variant) => {
  // eslint-disable-next-line consistent-return
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'items') {
      return variantValue;
    }
  }).props;

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
