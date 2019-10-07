const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const organisationTeaserTemplate = require('../organisation_teaser/organisation_teaser.data').variants.default.meta.code.template;
const organisationTopiclist = require('../topiclist/topiclist.data').variants.organisationNav.props;

const template = dataHelper.getFileContent('organisation_navigation.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'OrganisationNavigation',
    className: 'OrganisationNavigation',
    jira: 'CZHDEV-*',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('organisation_navigation.md'),
  },
  props: {
    organisationTeaserTemplate,
    organisationTopiclist,
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
