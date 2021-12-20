const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'E-Mail-Bestätigung',
    jira: 'CZHDEV-1349',
    content: dataHelper.getFileContent('mail.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Ihre Angaben wurden an das Strassenverkehrsamt übermittelt. Wir werden sie schnellst möglich bearbeiten.',
    needtoknow: {
      subtitle: 'Was Sie nun wissen müssen',
      paragraph: 'Wir werden Ihnen den internationalen Führerausweis per Post zustellen. Sobald Sie ihn erhalten haben, müssen Sie folgendes beachten:',
      list: [
        'Unterschreiben Sie den Führerausweis',
        'Führen Sie immer Ihren normalen Führerausweis zusätzlich mit sich. Der internaltionale Führerausweis ist alleine nicht gültig.',
      ],
    },
    questions: {
      subtitle: 'Bei Fragen',
      paragraph: 'Sollte es Fragen zu Ihrem Antrag haben, dann melden Sie sich beim Volksschulamt unter:',
      contact: {
        label: 'Tel.',
        link: 'tel:+41444894589',
        text: '+41 44 489 45 89',
      },
    },
    userdata: [
      {
        subtitle: 'Persönliche Angaben',
        properties: [
          {
            label: 'Vorname',
            value: 'Hans',
          },
          {
            label: 'Nachname',
            value: 'Mustermann',
          },
          {
            label: 'Geburtsdatum',
            value: '21.02.1970',
          },
          {
            label: 'E-Mail',
            value: 'hans.mustermann@zh.ch',
          },
          {
            label: 'Kind',
            block: [
              {
                label: 'Vorname',
                value: 'Hansi',
              },
              {
                label: 'Nachname',
                value: 'Musterkind',
              },
              {
                label: 'Geburtsdatum',
                value: '21.02.2010',
              },
            ],
          },
          {
            label: 'Weiteres Kind',
            block: [
              {
                label: 'Vorname',
                value: 'Martina',
              },
              {
                label: 'Nachname',
                value: 'Musterkind',
              },
              {
                label: 'Geburtsdatum',
                value: '21.02.2012',
              },
            ],
          },
          {
            label: 'Dokumente',
            block: [
              {
                label: '011220_Steuerbescheid',
                value: 'PDF | 3.2 MB',
                file: true,
              },
              {
                label: '011220_Erbschein',
                value: 'PDF | 866 KB',
                file: true,
              },
            ],
          },
        ],
      },
      {
        subtitle: 'Berufliche Informationen',
        properties: [
          {
            label: 'Firma',
            value: 'Zeix AG',
          },
          {
            label: 'Berufsbezeichnung',
            value: 'UX Architect',
          },
        ],
      },
    ],
  },
});

module.exports = data;
