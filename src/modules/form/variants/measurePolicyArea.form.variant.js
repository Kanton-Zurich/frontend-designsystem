const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Politikbereich (CZHDEV-3604)',
    desc: 'Checkbox-Auswahl für Massnahmensuche.',
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
                    label: 'Öffentliche Sicherheit',
                    id: 'policy-area-security',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Öffentliche Sicherheit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Gesundheit',
                    id: 'policy-area-health',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Gesundheit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Umwelt & Raumordnung',
                    id: 'policy-area-ecology',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Umwelt & Raumordnung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Allgemeine Verwaltung',
                    id: 'policy-area-government',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Allgemeine Verwaltung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Bildung',
                    id: 'policy-area-education',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Bildung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Gesellschaft & soziale Sicherheit',
                    id: 'policy-area-society',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Gesellschaft & soziale Sicherheit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Volkswirtschaft',
                    id: 'policy-area-economy',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Volkswirtschaft',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Kultur und Freizeit',
                    id: 'policy-area-culture',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Kultur und Freizeit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Verkehr',
                    id: 'policy-area-transport',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Verkehr',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Finanzen und Steuern',
                    id: 'policy-area-finances',
                    groupName: 'measure-policy-area',
                    isChecked: false,
                    value: 'Finanzen und Steuern',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
