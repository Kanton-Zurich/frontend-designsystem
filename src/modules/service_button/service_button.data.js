const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('service_button.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Service Button',
    className: 'ServiceButton',
    jira: 'CZHDEV-892',
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Service Titel',
    buttonTitle: 'Start',
    serviceLink: '../service_list/service_page.mock.html',
    href: '../../pages/service/service.html',
    modalData: { modalId: 'service-modal0' },
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
