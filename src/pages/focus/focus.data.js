const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defRelatedContent = require('../../modules/related_content/related_content.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js');
const defVideoData = require('../../modules/video/video.data.js');
const headerData = require('../../modules/header/header.data').props;


const defRelatedContentProps = _.merge({}, defRelatedContent);
const magicNumber = 3;
defRelatedContentProps.variants.default.props.contentNavData.items = defRelatedContentProps
  .variants.default.props.contentNavData.items.slice(0, magicNumber);

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Schwerpunktseite',
    jira: 'CZHDEV-509',
    content: dataHelper.getFileContent('focus.hbs'),
    documentation: dataHelper.getDocumentation('focus.md'),
  },
  props: {
    header: headerData,
    title: 'Schwerpunktseite',
    text: '',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          coloredImage: {
            props: {
              pageTitle: 'Sicherheit',
              leadText: 'Sicherheit zu schaffen gehört zu den zentralen und klassischen Aufgaben des Staates. Zwar sind den finanziellen Möglichkeiten unseres Kantons auch dann Schranken gesetzt, wenn es um mehr Sicherheit geht. Aber wir wollen das Beste machen.',
              breadcrumb: false,
            },
          },
        },
      }),
      relatedContentData: defRelatedContentProps.variants.default.props,
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
