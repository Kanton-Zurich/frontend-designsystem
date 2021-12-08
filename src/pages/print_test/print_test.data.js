const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.defaultImage.props;
const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData2.props;
const defLocationsData = require('../../modules/locations/locations.data.js').variants.default.props;
const defTeaserData = require('../../modules/teaser/teaser.data.js');
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withoutLinklist.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defLangSwitchData = require('../../modules/lang_switch/lang_switch.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Inhaltsverzeichnis (Im Print nicht zusehen)',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Unsichtbar Print',
        anchorlinkAdress: 'ourtopics',
        anchorlinkIsActive: true,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Services',
        anchorlinkAdress: 'services',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: 'news_teaser',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Ähnliche Inhalte',
        anchorlinkAdress: 'related_content',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Zuständigkeiten',
        anchorlinkAdress: 'responsibilities',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'PrintTest',
    jira: 'CZHDEV-917',
    content: dataHelper.getFileContent('print_test.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Testseite Druckansicht',
    text: '',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          colored: {
            props: {
              pageTitle: 'Einfach drucken und schauen.',
              leadTitle: 'Alles rund um den Fahrausweis: Sie wollen Auto oder Motorrad fahren lernen? Haben Sie ein «Grünes L?» Müssen Sie ausländischen Führerschein in einen Schweizer Führerausweis umtauschen? Ab wann müssen Sie in die Alterskontrolle? Brauchen Sie für Ihre Ferien einen Internationalen Führerschein? Wie lernen Sie Motorrad fahren? Ausweis verloren?',
              noButton: true,
            },
          },
        },
      }),
      contentNavData: {
        anchorNavReference: 'ourtopics',
        items: [
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Autofahren lernen',
            buzzwords: 'Voraussetzungen, Lernfahrausweis, Theorieprüfung, praktische Führerprüfung ',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Motorradfahren lernen',
            buzzwords: 'Motorrad- oder Mofa-Führerausweis:, Voraussetzungen, Prüfungen',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Weitere Fahrzeuge fahren lernen',
            buzzwords: 'Anhänger, Lastwagen, Bus, Taxi, Traktor, langsame Fahrzeuge und',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Führerausweis auf Probe',
            buzzwords: '«Grüner L»  Führerausweis: WAB-Kursangebote, wichtige Fristen, unbefristeter Ausweis',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Fahren im Alter',
            buzzwords: 'Alterskontrolle, medizinische Anforderungen, anerkannte Ärztinnen und Ärzte finden',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Internationaler Führerschein',
            buzzwords: 'Länderliste, Informationen, Internationalen Führerschein bestellen',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Ausländischen Führerausweis ',
            buzzwords: 'Führerausweis verloren/kaputt',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Führerausweis verloren/kaputt',
            buzzwords: 'Ersatz beantragen',
          }),
        ],
      },
      anchorNav: defAnchorNavData,
      serviceListData: {
        serviceListHeading: {
          title: 'Service',
          anchorNavReference: 'services',
        },
        items: [
          {
            title: 'Lernfahrausweis beantragen',
            buttonTitle: 'Start',
          },
          {
            title: 'Internationalen Führerschein beantragen',
            buttonTitle: 'Start',
          },
          {
            title: 'WAB-Kursanbieter finden',
            buttonTitle: 'Start',
          },
        ],
      },
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      locationsData: _.merge({}, defLocationsData),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact' }),
      teaserData: defTeaserData,
      tagGroupData: _.merge({}, defTagGroupData, { tagGroupdHeading: { anchorNavReference: 'responsibilities' } }),
      newsTeaserData: defNewsTeaserData,
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
      langSwitchData: defLangSwitchData,
    },
    defaultColorVariation: 'cv-blue',
  },
});

module.exports = data;
