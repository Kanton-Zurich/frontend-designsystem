const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js');
const richtextData = require('../../modules/richtext/richtext.data.js');
const pageHeaderData = require('../../modules/page_header/page_header.data.js');
const linkListData = require('../../modules/linklist/linklist.data.js');
const videoData = require('../../modules/video/video.data.js');
const dataHelper = require('@unic/estatico-data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Barebone Page',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('barebone.md'),
    content: dataHelper.getFileContent('barebone.hbs'),
  },
  props: {
    title: 'Barebone Page',
    text: 'This page is used for minimal CSS creation',
    modules: {
      skiplinks: skiplinksData,
      pageHeaderData: pageHeaderData,
      richtext: richtextData,
      linklistData: linkListData,
      video: videoData.props,
    },
  },
});

module.exports = data;
