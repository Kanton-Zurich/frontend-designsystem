const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defTabsData = require('../tabs/tabs.data');

const template = dataHelper.getFileContent('service_box.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Service Box',
    className: 'ServiceBox',
    jira: 'CZHDEV-473',
    documentation: dataHelper.getDocumentation('service_box.md'),
  },
  props: {
    tabs: defTabsData.props.tabs,
    linklist: {
      list1: {
        links: [
          {
            linkListItemTitle: 'Stellungsnahme des Direktors', linkListItemHref: '/',
          },
        ],
      },
    },
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
