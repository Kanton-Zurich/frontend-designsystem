const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data.js').variants.invertedWithUserLoggedIn
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.office
  .props;
const defLeadSectionData = require('../../modules/lead_section/lead_section.data').variants.default
  .props;
const topicListData = require('../../modules/topiclist/topiclist.data.js').variants.sectioned.props;
const contactData = require('../../modules/contact/contact.data.js').variants.fullWidth.props;
const teaserData = require('../../modules/teaser/teaser.data.js').variants.inverted.props;
const defAboutData = require('../../modules/about/about.data.js').props;
const iFrameData = require('../../modules/iframe/iframe.data.js').variants.default.props;
const newsTeaserData = require('../../modules/news_teaser/news_teaser.data.js').variants
  .withProminentTeaser.props;
const defFooterData = require('../../modules/footer/footer.data.js').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Themen',
        anchorlinkAdress: 'ourtopics',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Unser Amt',
        anchorlinkAdress: '-853478237', // intentially negative number as reference to simulate ids from AEM
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: 'news_teaser',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Amtsseite',
    jira: 'CZHDEV-342',
    content: dataHelper.getFileContent('office.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Amtsseite',
    text: '',
    modules: {
      pageHeader: defPageHeaderData,
      leadSectionData: defLeadSectionData,
      anchorNav: defAnchorNavData,
      newsTeaser: newsTeaserData,
      topiclist: _.merge({}, topicListData, { anchorNavReference: 'ourtopics' }),
      contact: _.merge({}, contactData, { anchorNavReference: 'contact_title' }),
      teaser: _.merge({}, teaserData, { anchorNavReference: 'office_teaser' }),
      about: _.merge({}, defAboutData, { anchorNavReference: '-853478237' }), // intentially negative number as reference to simulate ids from AEM
      iFrame: _.merge({}, iFrameData, {
        iframeSrc: 'https://ajb.trainingplus.ch/de/page/elternbildung',
      }),
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
