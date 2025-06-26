const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defTabsData = require('../tabs/tabs.data').variants.zhlex.props;

const template = dataHelper.getFileContent('zhlex.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'ZH-Lex',
    className: 'ZhLex',
    jira: 'CZHDEV-1240',
    label: 'Applikation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    id: 'zhlex_search',
    title: 'Suche',
    tabs: defTabsData,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Standard-Implementation',
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
