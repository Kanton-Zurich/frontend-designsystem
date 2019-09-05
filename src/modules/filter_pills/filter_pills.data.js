const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defButtonData = require('../../atoms/button/button.data.js');

const template = dataHelper.getFileContent('filter_pills.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Filter Tags',
    className: 'FilterPills',
    jira: 'CZHDEV-1138',
    documentation: dataHelper.getDocumentation('filter_pills.md'),
  },
  props: {
    preview: true,
    buttonData: _.merge({}, defButtonData.variants.tagEdit.props, {
      text: 'Zurücksetzen',
      icon: 'undo',
      additionalAttribute: 'data-clear',
    }),
    filterItems: [
      {
        text: 'Mobilität',
      },
      {
        text: 'Soziales',
      },
      {
        text: '10.04.2019 - 20.11.2018',
      },
      {
        text: 'Amt für Energie',
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
