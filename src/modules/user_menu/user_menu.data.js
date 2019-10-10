const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contextMenuDownload = require('../context_menu/context_menu.data').variants.download.props;

const template = dataHelper.getFileContent('user_menu.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'User Menu',
    className: 'UserMenu',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('user_menu.md'),
  },
  props: {
    contextMenu: _.merge({}, contextMenuDownload, {}),
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
