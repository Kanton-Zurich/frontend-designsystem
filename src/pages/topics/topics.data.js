const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContentNavData = require('../../modules/content_nav/content_nav.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Themenseite',
    jira: 'CZHDEV-336',
    documentation: dataHelper.getDocumentation('topics.md'),
    content: dataHelper.getFileContent('topics.hbs'),
  },
  props: {
    title: 'Themenseite',
    text: '',
    modules: {
      pageHeaderData: defPageHeaderData,
      contentNavData: defContentNavData,
      contactData: defContactData,
      tagGroupData: defTagGroupData,
    },
    defaultColorVariation: 'cv-green',
  },
});

module.exports = data;
