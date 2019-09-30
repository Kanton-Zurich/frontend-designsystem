const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defInstructionData = require('../instructions/instructions.data');

const template = dataHelper.getFileContent('service_wrapper.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Service Wrapper',
    className: 'ServiceWrapper',
    jira: 'CZHDEV-775',
    label: 'Container',
    documentation: dataHelper.getDocumentation('service_wrapper.md'),
  },
  props: {
    serviceWrapperId: 'serviceOverlay1',
    instructions: defInstructionData.variants.serviceDemo.props,
    listItem1: 'Unterschreiben Sie den Führerausweis',
    listItem2: 'Führen Sie immer Ihren normalen Führerausweis zusätzlich mit sich. Der internaltionale Führerausweis ist alleine nicht gültig.',
    listItem3: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
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
