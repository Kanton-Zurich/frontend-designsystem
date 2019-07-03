const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Home',
    jira: 'CZHDEV-*',
    content: dataHelper.getFileContent('home.hbs'),
    documentation: dataHelper.getDocumentation('home.md'),
  },
  props: {
    title: 'Title',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    modules: {
      pageHeaderData: defPageHeaderData,
    },
  },
});

module.exports = data;
