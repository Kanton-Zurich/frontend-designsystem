const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'PrivacyNotice',
    jira: 'CZHDEV-*',
    content: dataHelper.getFileContent('privacy_notice.hbs'),
    documentation: dataHelper.getDocumentation('privacy_notice.md'),
  },
  props: {
    title: 'Title',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    header: headerData,
    modules: {
      // xy: require('../../modules/xy/xy.data.js').props
    },
  },
});

module.exports = data;
