const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const focusCardData = require('../../modules/focus_card/focus_card.data');

const template = dataHelper.getFileContent('focus_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Schwerpunkt Teaser',
    className: 'FocusTeaser',
    jira: 'CZHDEV-445',
    documentation: dataHelper.getDocumentation('focus_teaser.md'),
  },
  props: {
    items: [
      {
        srcsets: [{
          image: '/assets/media/image/focuscard_268_x15.png',
        }],
        title: 'Teaser Titel 1',
        description: 'Unsere Aufgabe ist es für Alle die optimale Rahmenbedingungen zu schaffen.',
        arrowLink: 'Mehr erfahren',
      },
      {
        srcsets: [{
          image: '/assets/media/image/focuscard_268_x15.png',
        }],
        title: 'Sozial',
        description: 'Sicherheit bedeutet auch der Schutz vor den Folgen unvorhergesehener Lebensumstände.',
        arrowLink: 'Mehr erfahren',
      },
      {
        srcsets: [{
          image: '/assets/media/image/focuscard_268_x15.png',
        }],
        title: 'Sicherheit',
        description: 'Sicherheit ist die Voraussetzung der Freiheit. Nur wer sich sicher fühlt, kann frei sein.',
        arrowLink: 'Mehr erfahren',
      },
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
