const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.topics
  .props;
const defLeadSectionData = require('../../modules/lead_section/lead_section.data').variants.service
  .props;
const accordionDefaultData = require('../../modules/accordion/accordion.data').variants.default
  .props;
const carouselDefaultData = require('../../modules/carousel/carousel.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidth.props;
const defTeaserData = require('../../modules/teaser/teaser.data.js');
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants
  .withoutLinklist.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const defLangSwitchData = require('../../modules/lang_switch/lang_switch.data').variants.default
  .props;
const defChatbotData = require('../../modules/chatbot/chatbot.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Services',
        anchorlinkAdress: 'services',
        anchorlinkIsActive: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
        anchorlinkIsActive: false,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: 'news_teaser',
        anchorlinkIsActive: false,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Ähnliche Inhalte',
        anchorlinkAdress: 'related_content',
        anchorlinkIsActive: false,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Zuständigkeiten',
        anchorlinkAdress: 'responsibilities',
        anchorlinkIsActive: false,
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Themenseite',
    jira: 'CZHDEV-336',
    documentation: dataHelper.getDocumentation('README.md'),
    content: dataHelper.getFileContent('topics.hbs'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Themenseite',
    text: '',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          colored: {
            props: {
              pageTitle: 'Führerausweis & Fahren lernen',
              leadTitle:
                'Alles rund um den Fahrausweis: Sie wollen Auto oder Motorrad fahren lernen? Haben Sie ein «Grünes L?» Müssen Sie ausländischen Führerschein in einen Schweizer Führerausweis umtauschen? Ab wann müssen Sie in die Alterskontrolle? Brauchen Sie für Ihre Ferien einen Internationalen Führerschein? Wie lernen Sie Motorrad fahren? Ausweis verloren?',
            },
          },
        },
      }),
      leadSectionData: defLeadSectionData,
      accordionData: accordionDefaultData,
      carouselData: carouselDefaultData,
      anchorNav: defAnchorNavData,
      serviceListData: {
        anchorNavReference: 'services',
        heading: {
          title: 'Service',
        },
        items: [
          {
            title: 'Lernfahrausweis beantragen',
            buttonTitle: 'Start',
            serviceLink: '../../modules/service_list/service_page.mock.html',
            href: '../service/service.html',
            modalData: { modalId: 'service-modal0' },
          },
          {
            title: 'Internationalen Führerschein beantragen',
            buttonTitle: 'Start',
            serviceLink: '../../modules/service_list/service_page.mock.html',
            href: '../service/service.html',
            modalData: { modalId: 'service-modal1' },
          },
          {
            title: 'WAB-Kursanbieter finden',
            buttonTitle: 'Start',
            serviceLink: '../../modules/service_list/service_page.mock.html',
            href: '../service/service.html',
            modalData: { modalId: 'service-modal2' },
          },
        ],
      },
      chatbot: defChatbotData,
      releatedContentData: _.merge({}, defReleatedContentData, {
        anchorNavReference: 'related_content',
      }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact_title' }),
      teaserData: defTeaserData,
      tagGroupData: _.merge({}, defTagGroupData, { anchorNavReference: 'responsibilities' }),
      newsTeaserData: defNewsTeaserData,
      footerData: defFooterData,
      backToData,
      langSwitchData: defLangSwitchData,
      banner: {
        fetchURL: '../../modules/banner/banner.conference2.mock.html',
      },
    },
    defaultColorVariation: 'cv-green',
  },
});

module.exports = data;
