const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.inverted.props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.singleItemErrorPage.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidthLessData.props;
const defServiceButtonData = require('../../modules/service_button/service_button.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Newsletter Abmeldung',
    jira: 'CZHDEV-1711',
    content: dataHelper.getFileContent('newsletter_unsubscribe.hbs'),
    documentation: dataHelper.getDocumentation('newsletter_unsubscribe.md'),
  },
  props: {
    title: 'Title',
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeader: {
        pageTitle: 'Auf wiedersehen!',
        leadText: 'Wir bedauern, dass Sie unseren Newsletter-Service nicht länger nutzen möchten. Ihre Abmeldung wurde bereits bearbeitet.',
        breadcrumb: breadcrumbData,
        inverted: false,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: true,
        noButton: true,
        buttonData: _.merge({}, defServiceButtonData, {
          buttonTitle: 'Zur Startseite',
        }),
      },
      contact: _.merge({}, contactData, {
        contactSubtitle: 'Kanton Zürich',
      }),
      footerData: defFooterData,
    },
  },
});

module.exports = data;
