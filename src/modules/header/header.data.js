const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const modalData = require('../modal/modal.data');

const template = dataHelper.getFileContent('header.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Header',
    className: 'Header',
    jira: 'CZHDEV-496',
    documentation: dataHelper.getDocumentation('header.md'),
  },
  props: {
    navItem: [
      {
        title: 'Themen',
        modal: 'flyout-topics',
      },
      {
        title: 'Organisation',
        modal: 'flyout-organisation',
      },
    ],
    modals: [
      _.merge({}, modalData.variants.topicFlyout.props, {
        preview: false,
      }),
      _.merge({}, modalData.variants.organisationFlyout.props, {
        preview: false,
      }),
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
