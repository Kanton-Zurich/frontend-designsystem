const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defRelatedContentData = require('../../modules/related_content/related_content.data.js');
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const defFocusTeaserData = require('../../modules/focus_teaser/focus_teaser.data.js').props;
const defAboutData = require('../../modules/about/about.data').props;
const headerData = require('../../modules/header/header.data').props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Inhaltsverzeichnis',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Ämter und Bereiche',
        anchorlinkAdress: '#ourtopics',
        anchorlinkIsActive: true,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Schwerpunkte',
        anchorlinkAdress: '#focus',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Über uns',
        anchorlinkAdress: '#aboutus',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: '#newsTODO',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: '#contact',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
  ],
};

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
      relatedContentData: _.merge({}, defRelatedContentData.variants.amtNavigation.props, { relatedContentHeading: { anchorNavReference: 'ourtopics' } }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact' }),
      focusTeaserData: _.merge({}, defFocusTeaserData, {
        focusTeaserHeader: {
          title: 'Schwerpunkte',
          text: 'Die Sicherheitsdirektion kümmert sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
          anchorNavReference: 'focus',
        },
        items: [
          {
            title: 'Sicherheit',
            description: 'Für die Mitarbeiter der Schicherheitsdirektion ist die Sicherheit der Bevölkerung das oberste Ziel.',
          },
          {
            title: 'Sportlich',
            description: 'Unsere Aufgabe ist es für den Sport die optimale Rahmenbedingung zu schaffen',
          },
          {
            title: 'Sozial',
            description: 'Sicherheit bedeutet auch der Schutz vor den Folgen unvorhergesehener Lebensumstände.',
          },
        ],
      }),
      anchorNav: defAnchorNavData,
      about: _.merge({}, defAboutData, {
        anchorNavReference: 'aboutus',
        pText1: 'Die Sicherheitsdirektion ist eine von sieben Direktionen des Kantons Zürich. Sie beschäftigt rund 4800'
        + ' Mitarbeiterinnen und Mitarbeiter.'
        + ' Obwohl die Aufgabenbereiche der Sicherheitsdirektion auf den ersten Blick sehr unterschiedlich scheinen,'
        + ' verfolgen sie ein gemeinsames Ziel: Sie dienen der Gewährleistung von Sicherheit in unserem Kanton –'
        + ' Sicherheit im umfassenden Sinn: Nicht nur als Abwesenheit von Gewalt oder Kriminalität sondern auch als'
        + ' Garantie für ein sicheres soziales Netz.'
        + ' Wir verfolgen eine Sozial- und Ausländerpolitik, die für alle Beteiligten fair ist. Und nicht zuletzt sind'
        + ' weite Bevölkerungskreise sportlich aktiv.',
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
