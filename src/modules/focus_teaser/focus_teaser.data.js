const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('focus_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Schwerpunkt Teaser',
    className: 'FocusTeaser',
    jira: 'CZHDEV-445',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    items: [
      {
        srcsets: [
          {
            image: '/assets/media/image/focuscard_268_x15.png',
          },
        ],
        title: 'Teaser Titel 1',
        description: 'Unsere Aufgabe ist es für Alle die optimale Rahmenbedingungen zu schaffen.',
        arrowLink: 'Mehr erfahren',
      },
      {
        srcsets: [
          {
            image: '/assets/media/image/focuscard_268_x15.png',
          },
        ],
        title: 'Sozial',
        description:
          'Sicherheit bedeutet auch der Schutz vor den Folgen unvorhergesehener Lebensumstände.',
        arrowLink: 'Mehr erfahren',
      },
      {
        srcsets: [
          {
            image: '/assets/media/image/focuscard_268_x15.png',
          },
        ],
        title: 'Sicherheit',
        description:
          'Sicherheit ist die Voraussetzung der Freiheit. Nur wer sich sicher fühlt, kann frei sein.',
        arrowLink: 'Mehr erfahren',
      },
    ],
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
    },
    header: {
      meta: {
        title: 'Mit Header',
        desc: '',
      },
      props: {
        hasHeader: true,
        focusTeaserHeader: {
          title: 'Das könnte Sie auch interessieren',
          text: 'Die Sicherheitsdirektion kümmert sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
        },
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
