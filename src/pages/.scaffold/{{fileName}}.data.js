const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: '{{name}}',
    jira: 'CZHDEV-*',
    content: dataHelper.getFileContent('{{fileName}}.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      // xy: require('../../modules/xy/xy.data.js').props
    },
  },
});

module.exports = data;
