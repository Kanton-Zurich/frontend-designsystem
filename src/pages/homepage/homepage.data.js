const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Home Page',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('homepage.md'),
    content: dataHelper.getFileContent('homepage.hbs'),
  },
  props: {
    title: 'Home Page',
    text: 'This page demonstrates the inclusion of a module.',
    modules: {
    },
  },
});

module.exports = data;
