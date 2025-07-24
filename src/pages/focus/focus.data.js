const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants
  .topicsImage.props;
const defRelatedContent = require('../../modules/related_content/related_content.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js');
const defVideoData = require('../../modules/video/video.data.js');
const loggedInUserMenu = require('../../modules/user_menu/user_menu.data').variants.loggedIn.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const defRelatedContentProps = _.merge({}, defRelatedContent);
const magicNumber = 3;
defRelatedContentProps.variants.default.props.contentNavData.items =
  defRelatedContentProps.variants.default.props.contentNavData.items.slice(0, magicNumber);

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Schwerpunktseite',
    jira: 'CZHDEV-509',
    content: dataHelper.getFileContent('focus.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: _.merge({}, headerData, {
      hasUserMenu: true,
      userMenu: loggedInUserMenu,
    }),
    title: 'Schwerpunktseite',
    text: '',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Sicherheit',
      }),
      leadSectionData: {
        leadText:
          'Sicherheit zu schaffen gehört zu den zentralen und klassischen Aufgaben des Staates. Zwar sind den finanziellen Möglichkeiten unseres Kantons auch dann Schranken gesetzt, wenn es um mehr Sicherheit geht. Aber wir wollen das Beste machen.',
      },
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
      serviceButtonData: {
        title: 'Service Titel',
        buttonTitle: 'Modal Test',
        serviceLink: '../../modules/service_list/service_page.mock.html',
        href: '../../pages/service/service.html',
        modalData: { modalId: 'service-modal0' },
      },
      footerData: defFooterData,
      backToData,
    },
  },
  defaultColorVariation: 'cv-blue',
});

module.exports = data;
