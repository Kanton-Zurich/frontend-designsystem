const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('statistics_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Statistik-Card',
    className: 'StatisticsCard',
    jira: 'CZHDEV-3831',
    label: 'Veraltet',
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
        link: '#',
        publicationType: 'Medienmitteilung',
        teaserImage: '../../assets/media/image/news_teaser_316x178_x15.jpeg',
        title: 'Prognosezahlen öffentliche Volksschule',
        headingLevel: 3,
      },
    },
    noImageNoType: {
      meta: {
        title: 'No Image and No Type',
      },
      props: {
        link: '#',
        title: 'Prognosezahlen öffentliche Volksschule',
        text:
          'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum ' +
          'Strassenverkehrsamt Hinwil genügend Zeit ein',
        headingLevel: 3,
      },
    },
    noImage: {
      meta: {
        title: 'No Image',
      },
      props: {
        link: '#',
        publicationType: 'Medienmitteilung',
        title: 'Prognosezahlen öffentliche Volksschule',
        text:
          'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum ' +
          'Strassenverkehrsamt Hinwil genügend Zeit ein',
        headingLevel: 3,
      },
    },
    noType: {
      meta: {
        title: 'No Type',
      },
      props: {
        link: '#',
        title: 'Prognosezahlen öffentliche Volksschule',
        teaserImage: '../../assets/media/image/news_teaser_316x178_x15.jpeg',
        headingLevel: 3,
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
