const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').props;
const defPageHeaderData = require('../../modules/page_header/page_header.data').props;
const defIframeData = require('../../modules/iframe/iframe.data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Iframeseite',
    jira: 'CZHDEV-533',
    content: dataHelper.getFileContent('iframepage.hbs'),
    documentation: dataHelper.getDocumentation('iframepage.md'),
  },
  props: {
    title: 'IFrame Test',
    text: '',
    defaultColorVariation: 'cv-darkblue',
    header: headerData,
    modules: {
      iframe: defIframeData.variants.fullSize.props,
      pageHeader: _.merge({},defPageHeaderData,{
        pageTitle: 'IFrame Test',
        breadcrumb: defBreadcrumbData,
        inverted: true,
        hasImageTitle: false,
        leadText: '',
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: true,
        noButton: true,
        applicationHeader: true,
      }),
    },
  },
});

module.exports = data;
