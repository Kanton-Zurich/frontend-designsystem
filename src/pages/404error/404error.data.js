const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContactData = require('../../modules/contact/contact.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: '404 Fehlerseite',
    jira: 'CZHDEV-525',
    content: dataHelper.getFileContent('404error.hbs'),
    documentation: dataHelper.getDocumentation('404error.md'),
  },
  props: {
    title: '404 Fehlerseite',
    header: headerData.variants.forced.props,
    modules: {
      pageHeader: defPageHeaderData.variants.error404.props,
      contact: defContactData.variants.fullWidthLessData.props,
    },
  },
});

module.exports = data;
