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
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    buttonData: _.merge({}, defButtonData.variants.tagEdit.props, {
      text: 'Zurücksetzen',
      icon: 'undo',
      additionalAttribute: 'data-clear',
      additionalClasses: 'mdl-filter-pills__hidden-control',
    }),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      preview: true,
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
