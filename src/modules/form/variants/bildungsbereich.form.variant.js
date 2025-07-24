const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Bildungsstatistik Bildungsbereich (CZHDEV-3837)',
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
                    label: 'Volksschule',
                    id: _.uniqueId('volksschule'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/volksschule',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Heim- und Sonderschulen',
                    id: _.uniqueId('heimundsonderschulen'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/heimundsonderschulen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Schulen mit eigenem Programm',
                    id: _.uniqueId('schulenmiteigenemprogramm'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/schulenmiteigenemprogramm',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Zwischenlösungen',
                    id: _.uniqueId('zwischenlösungen'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/zwischenlösungen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Mittelschulen',
                    id: _.uniqueId('mittelschulen'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/mittelschulen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Berufsschulen',
                    id: _.uniqueId('berufsschulen'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/berufsschulen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Tertiäre Berufsbildung',
                    id: _.uniqueId('tertiäreberufsbildung'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/tertiäreberufsbildung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Fachhochschulen',
                    id: _.uniqueId('fachhochschulen'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/fachhochschulen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Universitäre Hochschulen',
                    id: _.uniqueId('universitärehochschulen'),
                    groupName: 'bildungsbereich',
                    isChecked: false,
                    value: 'katalog:bildungsstatistik/bildungsbereich/universitärehochschulen',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
