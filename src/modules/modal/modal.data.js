const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('modal.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'modal',
    className: 'Modal',
    jira: 'CZHDEV-517',
    documentation: dataHelper.getDocumentation('modal.md'),
  },
  props: {
    modalId: 'service-modal-01',
    modules: {
      servicePageHeaderData: {
        pageTitle: 'Führerausweis bestellen',
        inverted: true,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: false,
        noButton: true,
        noText: true,
        hasCloseButton: true,
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
