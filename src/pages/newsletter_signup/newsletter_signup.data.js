const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.default.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidthLessData.props;
const checkBoxData = require('../../atoms/checkbox/checkbox.data').variants.withHint.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defFormInputData = require('../../atoms/form_input/form_input.data').variants.floatValidateEmail.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Newsletter Anmeldung',
    jira: 'CZHDEV-1713',
    content: dataHelper.getFileContent('newsletter_signup.hbs'),
    documentation: dataHelper.getDocumentation('newsletter_signup.md'),
  },
  props: {
    skiplinks: skiplinksData,
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
      mailInput: defFormInputData,
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
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Wirtschaft & Unternehmen',
            hint: 'Handelsregister, Fimengründung,  Arbeitsbewilligung, Forschung',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Freizeit & Kultur',
            hint: 'Sportförderung, Schulsport, Jugendsport, Kulturförderung',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Raum & Bauen',
            hint: 'Geodaten & Karten, Baulandpreise, Baubewilligungen, Raumplanung',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Gesundheit',
            hint: 'Krankenversicherung, Prämienverbilligung, Kliniken',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Steuern',
            hint: 'Steuererklärung, Quellensteuer, Steuerbuch, Steuerberechnung',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Politik',
            hint: 'Wahlen & Abstimmungen, Wahlen 2019,  Regierungsrat, Kantonsrat',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Ausländer & Migration',
            hint: 'Einreise, Aufenthaltsbewilligung, internationaler Führerschein, Asyl',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Umwelt & Tiere',
            hint: 'Betriebsökologie, Abfall, Wasser, Hunde, Tierschutz, Betriebsökologie, Energie',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Sicherheit & Justiz',
            hint: 'Kantonspolizei, ePolice, Bussen, Gerichte, Gefängnis, Justizvollzug',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Verkehr',
            hint: 'Führerschein, Fahrzeug, Velo, Autonummern, Verkehrsplanung',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
          _.merge({}, checkBoxData, {
            label: 'Über den Kanton Zürich',
            hint: 'Fakten, Informationen für Neuzuzüger, Daten und Statistiken',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
        [
          _.merge({}, checkBoxData, {
            label: 'Familie',
            hint: 'Beratung Familie & Kinder, Kinder- und Jugendhilfezentrum kjz',
            strongTitle: true,
            id: _.uniqueId('check_'),
          }),
        ],
      ],
    },
  },
});

module.exports = data;
