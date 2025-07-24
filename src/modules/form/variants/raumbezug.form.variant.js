const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Bildungsstatistik Raumbezug (CZHDEV-3837)',
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
                    label: 'Kanton',
                    id: _.uniqueId('kanton'),
                    groupName: 'raumbezug',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/raumbezug/kanton',
                    data: [
                      {
                        key: 'synonyms',
                        value: "['Canton']",
                      },
                    ],
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Bezirke',
                    id: _.uniqueId('bezirke'),
                    groupName: 'raumbezug',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/raumbezug/bezirke',
                    data: [
                      {
                        key: 'synonyms',
                        value: "['Districts']",
                      },
                    ],
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Politische Gemeinden',
                    id: _.uniqueId('politischegemeinden'),
                    groupName: 'raumbezug',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/raumbezug/politischegemeinden',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Schulgemeinden',
                    id: _.uniqueId('schulgemeinden'),
                    groupName: 'raumbezug',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/raumbezug/schulgemeinden',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
