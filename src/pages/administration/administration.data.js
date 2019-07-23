const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defRelatedContentData = require('../../modules/related_content/related_content.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js');
const headerData = require('../../modules/header/header.data').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Direktionsseite',
    jira: 'CZHDEV-340',
    content: dataHelper.getFileContent('administration.hbs'),
    documentation: dataHelper.getDocumentation('administration.md'),
  },
  props: {
    header: headerData,
    title: 'Direktionsseite',
    text: '',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          colored: {
            props: {
              pageTitle: 'Sicherheitsdirektion',
              leadText: 'Sicher, sozial, sportlich. Wir sorgen für die öffentliche Sicherheit. Wir verfolgen eine Sozial- und Ausländerpolitik, die für alle Beteiligten fair ist. Und nicht zuletzt setzen wir uns dafür ein, dass sich möglichst viele Zürcherinnen und Zürcher sportlich aktiv betätigen.',
              noButton: true,
            },
          },
        },
      }),
      relatedContentData: defRelatedContentData,
      contactData: defContactData,
      focusTeaserData: defFocusTeaserData,
    },
  },
  defaultColorVariation: 'cv-blue',
});

module.exports = data;
