const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants.default.props;
const contentTeaserPromoData = require('../../atoms/content_teaser/content_teaser.data').variants.promotopic.props;

const template = dataHelper.getFileContent('content_nav.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'ContentNav',
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
  withPromotopic: {
    meta: {
      Title: 'mit einem Promotopic',
      desc: 'Diese Variante verfügt über eine Promotopic',
    },
    props: {
      promotopic: contentTeaserPromoData,
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
