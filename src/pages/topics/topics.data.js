const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants.default.props;
const accordionDefaultData = require('../../modules/accordion/accordion.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidth.props;
const defTeaserData = require('../../modules/teaser/teaser.data.js');
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withoutLinklist.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defLangSwitchData = require('../../modules/lang_switch/lang_switch.data').variants.default.props;
const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Inhaltsverzeichnis',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Themen',
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
        anchorlinkText: '??hnliche Inhalte',
        anchorlinkAdress: 'related_content',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Zust??ndigkeiten',
        anchorlinkAdress: 'responsibilities',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
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
              pageTitle: 'F??hrerausweis & Fahren lernen',
              leadTitle: 'Alles rund um den Fahrausweis: Sie wollen Auto oder Motorrad fahren lernen? Haben Sie ein ??Gr??nes L??? M??ssen Sie ausl??ndischen F??hrerschein in einen Schweizer F??hrerausweis umtauschen? Ab wann m??ssen Sie in die Alterskontrolle? Brauchen Sie f??r Ihre Ferien einen Internationalen F??hrerschein? Wie lernen Sie Motorrad fahren? Ausweis verloren?',
              breadcrumb: {
                contextMenu: _.merge({}, contextMenuProps, {
                  lists: [
                    {
                      items: [
                        _.merge({}, contextMenuItemDef, { text: 'Kanton Z??rich', iconAfter: false, iconBefore: false }),
                        _.merge({}, contextMenuItemDef, { text: 'Mobilit??t', iconAfter: false, iconBefore: false }),
                        _.merge({}, contextMenuItemDef, { text: 'F??hrerausweis', iconAfter: false, iconBefore: false }),
                      ],
                    },
                  ],
                }),
                path: [
                  {
                    title: 'Kanton Z??rich',
                    href: '#',
                  },
                  {
                    title: 'Mobilit??t',
                    href: '#',
                  },
                  {
                    title: 'F??hrerausweis',
                    href: '#',
                  },
                ],
              },
            },
          },
        },
      }),
      contentNavData: {
        anchorNavReference: 'ourtopics',
        items: [
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Autofahren lernen',
            buzzwords: 'Voraussetzungen, Lernfahrausweis, Theoriepr??fung, praktische F??hrerpr??fung ',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Motorradfahren lernen',
            buzzwords: 'Motorrad- oder Mofa-F??hrerausweis:, Voraussetzungen, Pr??fungen',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Weitere Fahrzeuge fahren lernen',
            buzzwords: 'Anh??nger, Lastwagen, Bus, Taxi, Traktor, langsame Fahrzeuge und',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'F??hrerausweis auf Probe',
            buzzwords: '??Gr??ner L??  F??hrerausweis: WAB-Kursangebote, wichtige Fristen, unbefristeter Ausweis',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Fahren im Alter',
            buzzwords: 'Alterskontrolle, medizinische Anforderungen, anerkannte ??rztinnen und ??rzte finden',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Internationaler F??hrerschein',
            buzzwords: 'L??nderliste, Informationen, Internationalen F??hrerschein bestellen',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'Ausl??ndischen F??hrerausweis ',
            buzzwords: 'F??hrerausweis verloren/kaputt',
          }),
          _.merge({}, contentTeaserDefaultData, {
            shortTitle: 'F??hrerausweis verloren/kaputt',
            buzzwords: 'Ersatz beantragen',
          }),
        ],
      },
      accordionData: accordionDefaultData,
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
            title: 'Internationalen F??hrerschein beantragen',
            buttonTitle: 'Start',
          },
          {
            title: 'WAB-Kursanbieter finden',
            buttonTitle: 'Start',
          },
        ],
      },
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact' }),
      teaserData: defTeaserData,
      tagGroupData: _.merge({}, defTagGroupData, { tagGroupdHeading: { anchorNavReference: 'responsibilities' } }),
      newsTeaserData: defNewsTeaserData,
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
      langSwitchData: defLangSwitchData,
      banner: {
        fetchURL: '../../modules/banner/banner.conference2.mock.html',
      },
    },
    defaultColorVariation: 'cv-green',
  },
});

module.exports = data;
