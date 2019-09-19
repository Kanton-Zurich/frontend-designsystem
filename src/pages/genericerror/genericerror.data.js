const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContactData = require('../../modules/contact/contact.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Generische Fehlerseite',
    jira: 'CZHDEV-528',
    content: dataHelper.getFileContent('genericerror.hbs'),
    documentation: dataHelper.getDocumentation('genericerror.md'),
  },
  props: {
    title: 'Generische Fehlerseite',
    header: headerData.variants.inverted.props,
    modules: {
      pageHeader: defPageHeaderData.variants.error403Ext.props,
      contact: defContactData.variants.fullWidthLessData.props,
    },
  },
});

module.exports = data;
