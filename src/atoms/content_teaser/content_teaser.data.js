const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('content_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'ContentTeaser',
    className: 'ContentTeaser',
    jira: 'CZHDEV-389',
    documentation: dataHelper.getDocumentation('content_teaser.md'),
  },
  props: {
    shortTitle: 'Topictitle',
    buzzwords: 'Buzzword, Buzzword, Buzzword, Buzzword, Buzzword, Buzzword',
    target: '#',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  withoutBuzzwords: {
    meta: {
      title: 'Ohne Buzzwords',
      desc: 'Ein Content Teaser ohne Buzzwords',
    },
    props: {
      buzzwords: null,
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
