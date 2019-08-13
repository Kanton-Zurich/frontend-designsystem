const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('application.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Single Page Applikation',
    className: 'Application',
    jira: 'CZHDEV-792',
    documentation: dataHelper.getDocumentation('application.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      canvas: true,
    },
  },
  fullWidth: {
    meta: {
      title: 'Volle Breite',
      desc: 'Default implementation',
    },
    props: {
      canvas: true,
      fullWidth: true,
    },
  },
  zhApp: {
    meta: {
      title: 'ZHApp Volle Breite',
      desc: '',
    },
    props: {
      zhApp: true,
      fullWidth: true,
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
