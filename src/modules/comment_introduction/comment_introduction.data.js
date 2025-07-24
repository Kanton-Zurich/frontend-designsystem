const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('comment_introduction.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Kommentar-Einführung',
    className: 'CommentIntroduction',
    jira: 'CZHDEV-3528',
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Mit H2, dargestellt als H3',
      },
      props: {
        heading: {
          title: 'Umsetzung',
        },
        date: '12.03.2027',
        status: {
          modifier: 'completed',
          icon: 'confirm',
          text: 'Abgeschlossen',
        },
      },
    },
    placeholder: {
      meta: {
        title: 'Platzhalter',
        desc: 'Platzhalter',
      },
      props: {
        heading: {
          title: 'Umsetzung',
        },
        placeholder: {
          text: 'Ab dem Geschäftsbericht 2024 sehen Sie hier den aktuellen Stand der Massnahme.',
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
