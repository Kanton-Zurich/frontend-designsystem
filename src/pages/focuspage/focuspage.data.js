const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContentNavData = require('../../modules/content_nav/content_nav.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Schwerpunktseite',
    jira: 'CZHDEV-340',
    content: dataHelper.getFileContent('focuspage.hbs'),
    documentation: dataHelper.getDocumentation('focuspage.md'),
  },
  props: {
    title: 'Schwerpunktseite',
    text: '',
    modules: {
      pageHeaderData: _.merge(defPageHeaderData,{}, { variants: { colored: { props: { pageTitle: 'Sicherheitsdirektion' }}}}),
      contentNavData: defContentNavData,
      contactData: defContactData,
      focusTeaserData: defFocusTeaserData,
    },
  },
  defaultColorVariation: 'cv-blue',
});

module.exports = data;
