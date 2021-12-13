const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defSelectData = require('../select/select.data.js').variants.history.props;

const template = dataHelper.getFileContent('result_header.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Suchresultate Header',
    className: 'ResultHeader',
    jira: 'CZHDEV-3030',
    label: 'Applikation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    headingTitle: 'Details',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Implementation eines Suchresultate-Headers mit einer einfachen Überschrift',
    },
  },
  defaultWithSelect: {
    meta: {
      title: 'Mit Auswahlfeld',
      desc: 'Implementation eines Suchresultate-Headers mit einer einfachen Überschrift und Auswahlfeld',
    },
    props: {
      selectData: _.merge({}, defSelectData, {
        floatRight: false,
      }),
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
