const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('teaser_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Teaser Card',
    className: 'TeaserCard',
    jira: 'CZHDEV-4320',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title:
      'Prognosezahlen öffentliche Volksschule: Aktuelle Entwicklungen und Trends im Bildungssystem. Analyse der Schülerzahlen, Klassengrößen und Ressourcenverteilung. Auswirkungen auf Lehrpersonal, Infrastruktur und Bildungsqualität. Herausforderungen und Chancen für die Zukunft des öffentlichen Schulwesens. Empfehlungen für eine nachhaltige und effektive Bildungsplanung.',
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
        headingLevel: 3,
      },
    },
    shortTitle: {
      meta: {
        title: 'Short Title',
        desc: 'Variant with a shorter title',
      },
      props: {
        title: 'Prognosezahlen öffentliche Volksschule',
        link: '#',
        publicationType: 'Medienmitteilung',
        teaserImage: '../../assets/media/image/news_teaser_316x178_x15.jpeg',
        headingLevel: 3,
      },
    },
    noImageNoType: {
      meta: {
        title: 'No Image and No Type',
      },
      props: {
        link: '#',
        title:
          'Prognosezahlen öffentliche Volksschule: Aktuelle Entwicklungen und Trends im Bildungssystem. Analyse der Schülerzahlen, Klassengrößen und Ressourcenverteilung. Auswirkungen auf Lehrpersonal, Infrastruktur und Bildungsqualität. Herausforderungen und Chancen für die Zukunft des öffentlichen Schulwesens. Empfehlungen für eine nachhaltige und effektive Bildungsplanung.',
        text: 'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum Strassenverkehrsamt Hinwil genügend Zeit ein. Die Bauarbeiten können zu Verzögerungen führen und erfordern möglicherweise alternative Routen. Es wird empfohlen, sich vor der Fahrt über die aktuelle Verkehrslage zu informieren und gegebenenfalls mehr Zeit einzuplanen. Die Behörden arbeiten daran, die Beeinträchtigungen so gering wie möglich zu halten, bitten aber um Verständnis für mögliche Unannehmlichkeiten während der Bauphase.',
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
        publicationDate: '14.12.2022',
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
