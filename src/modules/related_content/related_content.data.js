const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentNavDataDef = require('../content_nav/content_nav.data').variants.default.props;

const template = dataHelper.getFileContent('related_content.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Verwandte Inhalte',
    className: 'RelatedContent',
    jira: 'CZHDEV-397',
    documentation: dataHelper.getDocumentation('related_content.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      relatedContentHeading: {
        title: 'Das könnte Sie auch interessieren',
        level: 2,
      },
      contentNavData: contentNavDataDef,
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
