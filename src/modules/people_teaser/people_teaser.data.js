const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defPersonCardData = require('../person_card/person_card.data.js').variants;

const template = dataHelper.getFileContent('people_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Personen Teaser',
    className: 'PeopleTeaser',
    jira: 'CZHDEV-178',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('people_teaser.md'),
  },
  props: {
    personCardData0: defPersonCardData.default.props,
    personCardData1: defPersonCardData.alt.props,
    personCardData2: defPersonCardData.noImageAlt.props,
    personCardData3: defPersonCardData.noImage.props,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      headingLevel: 2,
      headingBordered: true,
      personCardData0: { headingLevel: 4 },
      personCardData1: { headingLevel: 4 },
      personCardData2: { headingLevel: 4 },
      personCardData3: { headingLevel: 4 },
    },
  },
  alternativeHeadings: {
    meta: {
      title: 'H3 / H4 Variante',
      desc: '',
    },
    props: {
      headingLevel: 3,
      personCardData0: { headingLevel: 5 },
      personCardData1: { headingLevel: 5 },
      personCardData2: { headingLevel: 5 },
      personCardData3: { headingLevel: 5 },
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
