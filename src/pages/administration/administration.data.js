const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defContentNavData = require('../../modules/content_nav/content_nav.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js');
const defVideoData = require('../../modules/video/video.data.js');

defContentNavData.variants.relatedContent.props.items = defContentNavData
  .variants.relatedContent.props.items.slice(0, 3);

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Direktionsseite',
    jira: 'CZHDEV-340',
    content: dataHelper.getFileContent('administration.hbs'),
    documentation: dataHelper.getDocumentation('administration.md'),
  },
  props: {
    title: 'Direktionssseite',
    text: '',
    modules: {
      pageHeaderData: _.merge(defPageHeaderData,{}, { variants: { coloredImageOnly: { props: { pageTitle: 'Sicherheitsdirektion' }}}}),
      contentNavData: defContentNavData.variants.relatedContent.props,
      contactData: defContactData,
      focusTeaserData: defFocusTeaserData,
      videoData: defVideoData,
      linklist: {
        list1: {
          links: [
            {
              linkListItemTitle: 'Amt für Militär und Zivilschutz',
              linkListItemHref: '/',
            },
          ],
        },
      },
    },
  },
  defaultColorVariation: 'cv-blue',
});

module.exports = data;
