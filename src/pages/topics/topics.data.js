const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js');
const defContactData = require('../../modules/contact/contact.data.js');
const defTeaserData = require('../../modules/teaser/teaser.data.js');
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js');


const data = _.merge({}, defaultData, {
  meta: {
    title: 'Themenseite',
    jira: 'CZHDEV-336',
    documentation: dataHelper.getDocumentation('topics.md'),
    content: dataHelper.getFileContent('topics.hbs'),
  },
  props: {
    title: 'Themenseite',
    text: '',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          colored: {
            props: {
              pageTitle: 'Führerausweis  & Fahren lernen',
              leadTitle: 'Alles rund um den Fahrausweis: Sie wollen Auto oder Motorrad fahren lernen? Haben Sie ein «Grünes L?» Müssen Sie ausländischen Führerschein in einen Schweizer Führerausweis umtauschen? Ab wann müssen Sie in die Alterskontrolle? Brauchen Sie für Ihre Ferien einen Internationalen Führerschein? Wie lernen Sie Motorrad fahren? Ausweis verloren?',
              noButton: true,
            },
          },
        },
      }),
      contentNavData: {
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
        ]
      },
      releatedContentData: defReleatedContentData,
      contactData: defContactData,
      teaserData: defTeaserData,
      tagGroupData: defTagGroupData,
    },
    defaultColorVariation: 'cv-green',
  },
});

module.exports = data;
