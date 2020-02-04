const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Generische Fehlerseite',
    jira: 'CZHDEV-528',
    content: dataHelper.getFileContent('genericerror.hbs'),
    documentation: dataHelper.getDocumentation('genericerror.md'),
  },
  props: {
    title: 'Generische Fehlerseite',
    skiplinks: skiplinksData,
    header: headerData.variants.inverted.props,
    modules: {
      pageHeader: defPageHeaderData.variants.error403.props,
      contact: defContactData.variants.fullWidthLessData.props,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
