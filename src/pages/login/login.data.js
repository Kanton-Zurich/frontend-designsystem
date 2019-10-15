const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.singlePathItem.props;
const defLoginFormData = require('../../modules/login_form/login_form.data.js').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidthLessData.props;
const headerData = require('../../modules/header/header.data').variants.userMenu.props;


const data = _.merge({}, defaultData, {
  meta: {
    title: 'Loginseite',
    jira: 'CZHDEV-538',
    content: dataHelper.getFileContent('login.hbs'),
    documentation: dataHelper.getDocumentation('login.md'),
  },
  props: {
    header: _.merge({}, headerData, {
      hasUserMenu: true,
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
      loginFormData: _.merge({}, defLoginFormData),
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      contact: _.merge({}, contactData, {
        contactSubtitle: 'Kanton Zürich',
      }),
    },
  },
});

module.exports = data;
