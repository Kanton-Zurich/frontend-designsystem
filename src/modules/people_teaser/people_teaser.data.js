const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defPersonCardData = require('../person_card/person_card.data.js').variants;

const template = dataHelper.getFileContent('people_teaser.hbs');

const personCardDataDefault = {
  ...defPersonCardData.default.props,
  headingLevel: 4,
};
const personCardDataAlternativeVariant = {
  ...defPersonCardData.alt.props,
  headingLevel: 4,
};
const personCardDataNoImage = {
  ...defPersonCardData.noImageAlt.props,
  headingLevel: 4,
};
const personCardDataNoImageNoButton = {
  ...defPersonCardData.noImage.props,
  headingLevel: 4,
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Personen Teaser',
    className: 'PeopleTeaser',
    jira: 'CZHDEV-178',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Unser Team mit Zwischentiteln',
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
        headingLevel: 2,
        visualHeadingLevel: 2,
        headingBordered: true,
        teaserBlockList: [
          {
            headingText: 'Leitung biz Oerlikon',
            teaserCardList: [personCardDataDefault],
            text: 'Die Sicherheitsdirektion und die darunter liegenden Ämter und Bereiche kümmern sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
          },
          {
            headingText: 'Berater',
            teaserCardList: [personCardDataDefault, personCardDataAlternativeVariant],
            text: 'Die Sicherheitsdirektion und die darunter liegenden Ämter und Bereiche kümmern sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
          },
          {
            headingText: 'Was wir tun',
            teaserCardList: [personCardDataNoImage, personCardDataNoImageNoButton],
            text: 'Die Sicherheitsdirektion und die darunter liegenden Ämter und Bereiche kümmern sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
          },
        ],
      },
    },
    alternativeHeadings: {
      meta: {
        title: 'H3 / H4 Variante',
        desc: '',
      },
      props: {
        headingLevel: 3,
        visualHeadingLevel: 3,
        teaserBlockList: [
          {
            headingText: 'Was wir tun',
            teaserCardList: [
              {
                ...personCardDataNoImage,
                headingLevel: 5,
              },
              {
                ...personCardDataNoImageNoButton,
                headingLevel: 5,
              },
            ],
            text: 'Die Sicherheitsdirektion und die darunter liegenden Ämter und Bereiche kümmern sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
          },
        ],
      },
    },
    decisionTree: {
      meta: {
        title: 'Entscheidungsbaum',
        desc: 'Variante mit weissem Hintergrund für den Entscheidungsbaum',
      },
      props: {
        headingLevel: 3,
        visualHeadingLevel: 3,
        title: '',
        teaserBlockList: [
          {
            headingText: '',
            teaserCardList: [personCardDataDefault, personCardDataNoImage],
            text: '',
          },
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
