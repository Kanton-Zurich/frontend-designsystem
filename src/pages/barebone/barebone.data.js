const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const richtextData = require('../../modules/richtext/richtext.data.js');
const pageHeaderData = require('../../modules/page_header/page_header.data.js');
const linkListData = require('../../modules/linklist/linklist.data.js');
const videoData = require('../../modules/video/video.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Barebone Page',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('README.md'),
    content: dataHelper.getFileContent('barebone.hbs'),
  },
  props: {
    title: 'Barebone Page',
    skiplinks: skiplinksData,
    header: headerData,
    text: 'This page is used for minimal CSS creation',
    modules: {
      pageHeader: pageHeaderData,
      richtext: richtextData,
      linklistData: linkListData,
      video: videoData.props,
    },
  },
});

module.exports = data;
