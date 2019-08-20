const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('news_filter_mobile.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Filter Mobile',
    className: 'NewsFilterMobile',
    jira: 'CZHDEV-990',
    documentation: dataHelper.getDocumentation('news_filter_mobile.md'),
  },
  props: {
    modalId: 'testFilter',
    dateDropDown: {
      linkListItemTitle: 'Zeitraum',
      linkListItemHref: '',
      subtitle: '20.08.2019 - 30.08.2019',
      noColor: true,
      chevron: true,
    },
    topicFilter: {
      linkListItemTitle: 'Themen',
      linkListItemHref: '',
      subtitle: '2 gewählt',
      noColor: true,
    },
    organisationFilter: {
      linkListItemTitle: 'Organisation',
      linkListItemHref: '',
      subtitle: '',
      noColor: true,
    },
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
    }
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
