const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentNavDataDef = require('../content_nav/content_nav.data').variants.default.props;
const contentTeaserDataWithoutBuzzwords = require('../../atoms/content_teaser/content_teaser.data').variants.withoutBuzzwords.props;

const template = dataHelper.getFileContent('topiclist.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Themenliste',
    className: 'Topiclist',
    jira: 'CZHDEV-505',
    documentation: dataHelper.getDocumentation('topiclist.md'),
  },
  props: {},
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default Themenliste (CZHDEV-505 )',
      desc: 'Default implementation bzw. reguläre Themenliste. Title mit Fliesstext sowie einer Content-Navigation nur'
      + ' mit buzzwords und einem "Alle anzeigen" Button sowie versteckten Items ab einer Anzahl von mehr als 12.',
    },
    props: {
      topiclistHeading: {
        level: 2,
        title: 'Unsere Themen',
      },
      topiclistLead: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore '
      + 'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. '
      + 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit '
      + 'amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam '
      + 'erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, '
      + 'no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      topiclistButtonLabel: 'Alle anzeigen',
      topiclistInputPlaceholder: '',
      contentNavData: _.merge({}, contentNavDataDef, {
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
            shortTitle: 'Fahren im Alter1',
          }),
          _.merge({}, contentTeaserDataWithoutBuzzwords, {
            shortTitle: 'Fahren im Alter2',
          }),
          _.merge({}, contentTeaserDataWithoutBuzzwords, {
            shortTitle: 'Fahren im Alter3',
          }),
          _.merge({}, contentTeaserDataWithoutBuzzwords, {
            shortTitle: 'Fahren im Alter4',
          }),
          _.merge({}, contentTeaserDataWithoutBuzzwords, {
            shortTitle: 'Fahren im Alter5',
          }),
        ],
      }),
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
