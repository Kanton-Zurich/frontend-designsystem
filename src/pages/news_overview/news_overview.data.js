const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.facts
  .props;
const defNewsOverviewData = require('../../modules/news_overview/news_overview.data');
const defNewsletterFormData = require('../../modules/newsletter_form/newsletter_form.data');
const defContactData = require('../../modules/contact/contact.data');
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').variants.parentOnly
  .props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Übersicht',
    jira: 'CZHDEV-550',
    content: dataHelper.getFileContent('news_overview.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData.variants.defaultWithUserLoggedOut.props,
    modules: {
      pageHeader: _.merge({}, defPageHeaderData, {
        homelink: '#',
        pageTitle: 'News Übersicht',
        noText: true,
        buttonData: false,
        breadcrumb: defBreadcrumbData,
      }),
      newsOverview: defNewsOverviewData.props,
      newsletterFormData: defNewsletterFormData.variants.default.props,
      contactData: defContactData.variants.fullWidthLessData.props,
      backToData,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
