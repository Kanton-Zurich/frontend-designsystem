const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.colored.props;
const topicListData = require('../../modules/topiclist/topiclist.data').props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidth.props;
const teaserData = require('../../modules/teaser/teaser.data').variants.inverted.props;
const defAboutData = require('../../modules/about/about.data').props;
const headerData = require('../../modules/header/header.data').props;
const newsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withProminentTeaser.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Inhaltsverzeichnis',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Themen',
        anchorlinkAdress: '#ourtopics',
        anchorlinkIsActive: true,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Unser Amt',
        anchorlinkAdress: '#aboutus',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: '#news_teaser',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: '#contact',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
  ],
};

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
      anchorNav: defAnchorNavData,
      newsTeaser: newsTeaserData,
      topiclist: _.merge({}, topicListData, { topiclistHeading: { anchorNavReference: 'ourtopics' } }),
      contact: _.merge({}, contactData, { anchorNavReference: 'contact' }),
      teaser: _.merge({}, teaserData, { anchorNavReference: 'department_teaser' }),
      about: _.merge({}, defAboutData, { anchorNavReference: 'aboutus' }),
    },
  },
});

module.exports = data;
