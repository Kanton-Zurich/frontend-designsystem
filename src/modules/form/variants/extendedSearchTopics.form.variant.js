const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Themen (CZHDEV-4746)',
    desc: 'Checkbox-Auswahl für Erweiterte Suche: Themen.',
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
                    id: 'topics-security',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Öffentliche Sicherheit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Gesundheit',
                    id: 'topics-health',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Gesundheit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Umwelt & Raumordnung',
                    id: 'topics-ecology',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Umwelt & Raumordnung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Bildung',
                    id: 'topics-education',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Bildung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Soziales',
                    id: 'topics-social',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Soziales',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Familie',
                    id: 'topics-family',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Familie',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Volkswirtschaft',
                    id: 'topics-economy',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Volkswirtschaft',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Kultur und Freizeit',
                    id: 'topics-culture',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Kultur und Freizeit',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Verkehr',
                    id: 'topics-transport',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Verkehr',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Steuern & Finanzen',
                    id: 'topics-finances',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Steuern & Finanzen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Planen & Bauen',
                    id: 'topics-planning',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Planen & Bauen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Politik & Verwaltung',
                    id: 'topics-politics',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Politik & Verwaltung',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Migration & Integration',
                    id: 'topics-migration',
                    groupName: 'extended-search-topics',
                    isChecked: false,
                    value: 'Migration & Integration',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
