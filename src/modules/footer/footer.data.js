const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const socialLinksDemoData = require('../social_media_links/social_media_links.data').variants.default.props;

const template = dataHelper.getFileContent('footer.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Footer',
    className: 'Footer',
    jira: 'CZHDEV-490',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('footer.md'),
  },
  props: {
    modules: {
      socialLinks: _.merge({}, socialLinksDemoData, { socialMediaLinksHeading: { title: 'Folgen Sie dem Kanton auf', level: 3 } }),
    },
    copyrightYear: new Date().getFullYear(),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation des Footers',
    },
    props: {},
  },
  maintenance: {
    meta: {
      title: 'Wartungsarbeiten',
      desc: 'Reduzierter Footer für Wartungsarbeiten',
    },
    props: {
      maintenance: true,
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
