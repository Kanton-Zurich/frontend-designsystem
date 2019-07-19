const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.colored.props;
const topicListData = require('../../modules/topiclist/topiclist.data').props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidth.props;
const teaserData = require('../../modules/teaser/teaser.data').variants.inverted.props;
const defAboutData = require('../../modules/about/about.data').props;
const headerData = require('../../modules/header/header.data').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Amtsseite',
    jira: 'CZHDEV-342',
    content: dataHelper.getFileContent('department.hbs'),
    documentation: dataHelper.getDocumentation('department.md'),
  },
  props: {
    header: headerData,
    title: 'Amtsseite',
    text: '',
    modules: {
      pageHeader: _.merge({}, defPageHeaderData, {
        noButton: true,
      }),
      topiclist: topicListData,
      contact: contactData,
      teaser: teaserData,
      about: defAboutData,
    },
  },
});

module.exports = data;
