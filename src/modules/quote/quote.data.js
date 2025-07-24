const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('quote.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Zitat',
    className: 'Quote',
    jira: 'CZHDEV-171',
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    quoteText:
      '«Das richtige Paradigma von Projektmanagementerfolg stützt sich nicht auf die Einhaltung von' +
      ' Rahmenbedingungen, sondern orientiert sich am tieferen Sinn der Aufgabe: Das Transformieren von Ressourcen in' +
      ' Resultate, welche dem Unternehmen einen Nutzen stiften.»',
    quoteAuthor:
      'Claudia Pletscher, Leiterin Entwicklung Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolor',
    srcsets: [
      {
        image: '/assets/media/image/square_260_x15.png',
        deviceWidth: 1024,
      },
      {
        image: '/assets/media/image/square_240_x15.png',
        deviceWidth: 1,
      },
    ],
    alt: 'Das ist ein Beispielbild',
  },
});

const variants = _.mapValues(
  {
    blue: {
      meta: {
        title: 'Standard',
        desc: '',
      },
      props: {},
    },
    darkblue: {
      meta: {
        title: 'Mit Bild',
        desc: '',
      },
      props: {
        hasImage: true,
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
          data: dataHelper.getFormattedJson(variantProps),
          html: dataHelper.getFormattedHtml(compiledVariant()),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
