const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedIn
  .props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;
const defLoginData = require('../../modules/cug_login/cug_login.data.js').props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidthLessData.props;
const notLoggedInUserMenu = require('../../modules/user_menu/user_menu.data').variants.loggedOut
  .props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Loginseite',
    jira: 'CZHDEV-538',
    content: dataHelper.getFileContent('login.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: _.merge({}, headerData, {
      hasUserMenu: true,
      userMenu: notLoggedInUserMenu,
    }),
    title: 'ZHservices',
    text: 'Mit diesem Benutzerkonto haben Sie Zugang zu allen Angeboten von ZHservices.',
    defaultColorVariation: 'cv-blue',
    modules: {
      pageHeader: {
        pageTitle: 'ZHservices',
        leadText: 'Mit diesem Benutzerkonto haben Sie Zugang zu allen Angeboten von ZHservices.',
        breadcrumb: breadcrumbData,
        inverted: true,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: true,
        noButton: true,
      },
      cugLoginData: _.merge({}, defLoginData, {
        devMode: true,
      }),
      releatedContentData: _.merge({}, defReleatedContentData, {
        anchorNavReference: 'related_content',
      }),
      contact: _.merge({}, contactData, {
        contactSubtitle: 'Kanton Zürich',
      }),
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
