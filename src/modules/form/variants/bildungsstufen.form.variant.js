const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Bildungsstatistik Bildungsstufen (CZHDEV-3837)',
    desc: 'Checkbox-Auswahl für Bildungsstatistiksuche.',
  },
  props: {
    sectionTitle: false,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Primarstufe',
                    id: _.uniqueId('primarstufe'),
                    groupName: 'bildungsstufen',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/primarstufe/primarstufe',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Primarstufe 1-2 (Kindergarten)',
                    id: _.uniqueId('kindergarten'),
                    groupName: 'bildungsstufen',
                    /* isChecked: true,
                isDisabled: true, */
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/primarstufe/kindergarten',
                    data: [
                      {
                        key: 'synonyms',
                        value: "['Klasse 1', 'erst Klasse', 'Zwergenland']",
                      },
                    ],
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Primarstufe 3-8 (Primarschule)',
                    id: _.uniqueId('primarschule'),
                    groupName: 'bildungsstufen',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/primarstufe/primarschule',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Primarstufe 3-5 (Unterstufe)',
                    id: _.uniqueId('unterstufe'),
                    groupName: 'bildungsstufen',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/primarstufe/unterstufe',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Primarstufe 6-8 (Mittelstufe)',
                    id: _.uniqueId('mittelstufe'),
                    groupName: 'bildungsstufen',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/primarstufe/mittelstufe',
                  }),
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Sekundarstufe I',
                    id: _.uniqueId('sekundarstufe1'),
                    groupName: 'bildungsstufen1',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/sekundarstufe1/sekundarstufe1',
                  }),
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Sekundarstufe II',
                    id: _.uniqueId('sekundarstufe2'),
                    groupName: 'bildungsstufen2',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsstufen/sekundarstufe2/sekundarstufe2',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Allgemeinbildung',
                    id: _.uniqueId('allgemeinbildung'),
                    groupName: 'bildungsstufen2',
                    isChecked: false,
                    value:
                      'katalog:bildungsstatistik/bildungsstufen/sekundarstufe2/allgemeinbildung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Berufliche Grundbildung',
                    id: _.uniqueId('berufliche-grundbildung'),
                    groupName: 'bildungsstufen2',
                    isChecked: false,
                    value:
                      'katalog:bildungsstatistik/bildungsstufen/sekundarstufe2/berufliche-grundbildung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Brückenangebote',
                    id: _.uniqueId('brückenangebote'),
                    groupName: 'bildungsstufen2',
                    isChecked: false,
                    value:
                      'katalog:bildungsstatistik/bildungsstufen/sekundarstufe2/brueckenangebote',
                  }),
              },
            ],
          },
        ],
      },
      /* {
        rows: [{
          fields: [
            '  Tertiärstufe',
            '    Höhere Berufsbildung',
            '    Hochschulen',
          ]
            .map((label) => ({
              cellContent: () => handlebars.compile(checkboxHBS)({
                label,
                id: _.uniqueId(label),
                groupName: 'bildungsstufen3',
                isChecked: false,
                value: label,
              }),
            })),
        }],
      }, */
    ],
  },
};
