const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContactData = require('../../modules/contact/contact.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: '404 Fehlerseite',
    jira: 'CZHDEV-525',
    content: dataHelper.getFileContent('404error.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: '404 Fehlerseite',
    skiplinks: skiplinksData,
    header: headerData.variants.inverted.props,
    modules: {
      pageHeader: defPageHeaderData.variants.error404.props,
      contact: defContactData.variants.fullWidthLessData.props,
    },
  },
});

module.exports = data;
