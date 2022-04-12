const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('feedback.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Feedback',
    className: 'Feedback',
    jira: 'CZHDEV-3129',
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Bitte geben Sie uns Feedback',
    steps: [
      {
        outerTitle: 'War diese Seite hilfreich für Sie?',
        buttons: [
          {
            title: 'Ja',
            value: 'yes',
          },
          {
            title: 'Nein',
            value: 'no',
          },
        ],
        target: './',
      },
      {
        innerTitle: 'Vielen Dank für Ihr Feedback!',
        icon: 'like',
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
