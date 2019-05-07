const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js');
const richtextData = require('../../modules/richtext/richtext.data.js');
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
      skiplinks: skiplinksData.props,
      richtext: richtextData.props,
    },
  },
});

module.exports = data;
