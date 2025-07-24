const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data.js').variants.invertedWithUserLoggedIn
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants
  .department.props;
const defLeadSectionData = require('../../modules/lead_section/lead_section.data').variants
  .defaultNoMargin.props;
const defRelatedContentData = require('../../modules/related_content/related_content.data.js');
const defRichtextData = require('../../modules/richtext/richtext.data');
const tableFinance = require('../../modules/table/table.data.js').variants.finance.props;
const defTeaserData = require('../../modules/teaser/teaser.data.js');
const defTableData = require('../../modules/table/table.data.js');
const defImageFigureData = require('../../modules/image_figure/image_figure.data.js');
const videoData = require('../../modules/video/video.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData
  .props;
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js').props;
const defAboutData = require('../../modules/about/about.data.js').props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data.js').variants
  .withoutLinklist.props;
const defFooterData = require('../../modules/footer/footer.data.js').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const decisionTreeData = require('../../modules/decision_tree/decision_tree.data.js').variants
  .default.props;
const iFrameData = require('../../modules/iframe/iframe.data.js').variants.small.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Ämter und Bereiche',
        anchorlinkAdress: 'ourtopics',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'This should not exist',
        anchorlinkAdress: 'thisdoesnotexist',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Schwerpunkte',
        anchorlinkAdress: 'focus',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Über uns',
        anchorlinkAdress: 'aboutus',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Aktuelles Bauprojekt in Dietikon',
        anchorlinkAdress: 'teaser',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Video über die KaPo Zürich',
        anchorlinkAdress: 'video',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Der Kanton in Zahlen',
        anchorlinkAdress: 'table',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: 'news_teaser',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Direktionsseite',
    jira: 'CZHDEV-340',
    content: dataHelper.getFileContent('department.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Direktionsseite',
    skiplinks: skiplinksData,
    header: headerData,
    text: '',
    modules: {
      decisionTreeData,
      iFrameData,
      videoData: _.merge({}, videoData, { anchorNavReference: 'video' }),
      imageFigureData: defImageFigureData.variants.default.props,
      teaserData: _.merge({}, defTeaserData.variants.noImage.props, {
        anchorNavReference: 'teaser',
      }),
      tableData: _.merge({}, defTableData.variants.default.props, { anchorNavReference: 'table' }),
      richtextData: defRichtextData.variants.blue.props,
      pageHeaderData: defPageHeaderData,
      leadSectionData: defLeadSectionData,
      relatedContentData: _.merge({}, defRelatedContentData.variants.amtNavigation.props, {
        anchorNavReference: 'ourtopics',
      }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact_title' }),
      newsTeaserData: defNewsTeaserData,
      footerData: defFooterData,
      backToData,
      tableFinance,
      focusTeaserData: _.merge({}, defFocusTeaserData, {
        anchorNavReference: 'focus',
        focusTeaserHeader: {
          title: 'Schwerpunkte',
          text: 'Die Sicherheitsdirektion kümmert sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
        },
        items: [
          {
            title: 'Sicherheit',
            description:
              'Für die Mitarbeiter der Schicherheitsdirektion ist die Sicherheit der Bevölkerung das oberste Ziel.',
          },
          {
            title: 'Sportlich',
            description:
              'Unsere Aufgabe ist es für den Sport die optimale Rahmenbedingung zu schaffen',
          },
          {
            title: 'Sozial',
            description:
              'Sicherheit bedeutet auch der Schutz vor den Folgen unvorhergesehener Lebensumstände.',
          },
        ],
      }),
      anchorNav: defAnchorNavData,
      about: _.merge({}, defAboutData, {
        anchorNavReference: 'aboutus',
        pText1:
          'Die Sicherheitsdirektion ist eine von sieben Direktionen des Kantons Zürich. Sie beschäftigt rund 4800' +
          ' Mitarbeiterinnen und Mitarbeiter.',
        pText2:
          ' Obwohl die Aufgabenbereiche der Sicherheitsdirektion auf den ersten Blick sehr unterschiedlich scheinen,' +
          ' verfolgen sie ein gemeinsames Ziel: Sie dienen der Gewährleistung von Sicherheit in unserem Kanton –' +
          ' Sicherheit im umfassenden Sinn: Nicht nur als Abwesenheit von Gewalt oder Kriminalität sondern auch als' +
          ' Garantie für ein sicheres soziales Netz.' +
          ' Wir verfolgen eine Sozial- und Ausländerpolitik, die für alle Beteiligten fair ist. Und nicht zuletzt sind' +
          ' weite Bevölkerungskreise sportlich aktiv.',
        topicsData: {
          items: [
            {
              shortTitle: 'Rekursabteilung',
              buzzwords: null,
            },
            {
              shortTitle: 'Forensisches Institut Zürich',
              buzzwords: null,
            },
            {
              shortTitle: 'Veröffentlichungen',
              buzzwords: null,
            },
            {
              shortTitle: 'Organisation',
              buzzwords: null,
            },
            {
              shortTitle: 'Generalsekreteriat',
              buzzwords: null,
            },
          ],
        },
      }),
    },
  },
  defaultColorVariation: 'cv-blue',
});

module.exports = data;
