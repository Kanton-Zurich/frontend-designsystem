const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const contactBlock = require('../contact_block/contact_block.data');
const table = require('../table/table.data');
const linklist = require('../linklist/linklist.data');

const template = dataHelper.getFileContent('edirectory_details.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Behördenverzeichnis Details',
    className: 'EdirectoryDetails',
    jira: 'CZHDEV-4463',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    contactOrganization: contactBlock.variants.organisationSpa.props,
    contactLeaders: contactBlock.variants.leadersSpa.props,
    table: table.variants.eDirectoryMemberSpa.props,
    linklist: linklist.variants.eDirectorySpa.props,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
