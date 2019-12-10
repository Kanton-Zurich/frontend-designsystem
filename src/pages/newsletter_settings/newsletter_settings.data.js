const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;
const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.default.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidthLessData.props;
const checkBoxData = require('../../atoms/checkbox/checkbox.data').variants.withHint.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Newsletter Einstellungen',
    jira: 'CZHDEV-1712',
    content: dataHelper.getFileContent('newsletter_settings.hbs'),
    documentation: dataHelper.getDocumentation('newsletter_settings.md'),
  },
  props: {
    header: headerData,
    modules: {
      pageHeader: {
        pageTitle: 'Newsletter verwalten',
        leadText: 'Verwalten Sie hier Ihre Newsletter-Einstellungen',
        breadcrumb: breadcrumbData,
        inverted: true,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: true,
        noButton: true,
      },
      footerData: defFooterData,
      contact: _.merge({}, contactData, {
        contactSubtitle: 'Kanton Zürich',
      }),
      radioRows: [
        {
          id: 'immediately',
          groupName: 'frequency',
          label: 'Sofort',
          isChecked: false,
        },
        {
          id: 'daily',
          groupName: 'frequency',
          label: 'Einmal pro Tag',
          isChecked: false,
        },
        {
          id: 'weekly',
          groupName: 'frequency',
          label: 'Einmal pro Woche',
          isChecked: true,
        },
      ],
      checkRows: [
        [
          _.merge({}, checkBoxData, {
            label: 'Bildung',
            hint: 'Schule, Lehrmittel, Berufsberatung, Berufsschule, Mittelschule',
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Wirtschaft & Unternehmen',
            hint: 'Handelsregister, Fimengründung,  Arbeitsbewilligung, Forschung',
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Freizeit & Kultur',
            hint: 'Sportförderung, Schulsport, Jugendsport, Kulturförderung',
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Raum & Bauen',
            hint: 'Geodaten & Karten, Baulandpreise, Baubewilligungen, Raumplanung',
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Gesundheit',
            hint: 'Krankenversicherung, Prämienverbilligung, Kliniken',
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Steuern',
            hint: 'Steuererklärung, Quellensteuer, Steuerbuch, Steuerberechnung',
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Politik',
            hint: 'Wahlen & Abstimmungen, Wahlen 2019,  Regierungsrat, Kantonsrat',
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Ausländer & Migration',
            hint: 'Einreise, Aufenthaltsbewilligung, internationaler Führerschein, Asyl',
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Umwelt & Tiere',
            hint: 'Betriebsökologie, Abfall, Wasser, Hunde, Tierschutz, Betriebsökologie, Energie',
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Sicherheit & Justiz',
            hint: 'Kantonspolizei, ePolice, Bussen, Gerichte, Gefängnis, Justizvollzug',
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Verkehr',
            hint: 'Führerschein, Fahrzeug, Velo, Autonummern, Verkehrsplanung',
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Über den Kanton Zürich',
            hint: 'Fakten, Informationen für Neuzuzüger, Daten und Statistiken',
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Familie',
            hint: 'Beratung Familie & Kinder, Kinder- und Jugendhilfezentrum kjz',
            id: _.uniqueId('check_'),
          }),
        ],
      ],
    },
  },
});

module.exports = data;
