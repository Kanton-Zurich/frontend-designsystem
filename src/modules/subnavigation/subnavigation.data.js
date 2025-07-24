const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const templateConverter = require('../../../gulp/helpers/templateConverter');

const template = dataHelper.getFileContent('subnavigation.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Subnavigation',
    className: 'Subnavigation',
    jira: 'CZHDEV-*',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Mobilität',
    pageURL: 'pages/topic/topic.html',
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
  },
  (variant) => {
    const variantProps = _.merge({}, data, variant).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.merge({}, data, variant, {
      meta: {
        demo: compiledVariant,

        code: {
          template: templateConverter(template),
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
