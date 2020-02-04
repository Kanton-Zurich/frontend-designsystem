const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('descriptionlist.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Gelabelte Liste',
    className: 'Descriptionlist',
    jira: 'CZHDEV-*',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('descriptionlist.md'),
  },
  props: {
    descriptionListItems: [
      {
        item: {
          term: 'Label 1',
          description: 'Value 1',
        },
      },
      {
        item: {
          term: 'Label 2',
          description: 'Value 2',
        },
      },
      {
        item: {
          term: 'Label 3',
          description: 'Value 3',
        },
      },
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard-Implementation',
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
