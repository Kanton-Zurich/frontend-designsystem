const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('focus_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Schwerpunkt Card',
    className: 'FocusCard',
    jira: 'CZHDEV-445',
    documentation: dataHelper.getDocumentation('focus_card.md'),
  },
  props: {
    srcsets: [{
      image: '/assets/media/image/focuscard_268_x15.png',
    }],
    title: 'Teaser Titel',
    description: 'Unsere Aufgabe ist es für Alle die optimale Rahmenbedingungen zu schaffen.',
    arrowLink: 'Mehr erfahren',
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
