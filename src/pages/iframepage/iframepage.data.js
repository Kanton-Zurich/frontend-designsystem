const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.fullsize.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data').variants.application
  .props;
const defIframeData = require('../../modules/iframe/iframe.data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Iframeseite',
    jira: 'CZHDEV-533',
    content: dataHelper.getFileContent('iframepage.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'IFrame Test',
    text: '',
    defaultColorVariation: 'cv-darkblue',
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      iframe: defIframeData.variants.fullSize.props,
      pageHeader: _.merge({}, defPageHeaderData, {
        pageTitle: 'IFrame Test',
      }),
    },
  },
});

module.exports = data;
