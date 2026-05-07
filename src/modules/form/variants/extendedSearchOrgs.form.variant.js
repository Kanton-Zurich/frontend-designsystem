const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Organisationen (CZHDEV-4746)',
    desc: 'Checkbox-Auswahl für Erweiterte Suche: Organisationen.',
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
                    label: 'Direktion der Justiz und des Innern',
                    id: 'orgs-justice',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Direktion der Justiz und des Innern',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Sicherheitsdirektion',
                    id: 'orgs-security',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Sicherheitsdirektion',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Baudirektion',
                    id: 'orgs-construction',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Baudirektion',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Finanzdirektion',
                    id: 'orgs-finance',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Finanzdirektion',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Volkswirtschaftsdirektion',
                    id: 'orgs-economy',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Volkswirtschaftsdirektion',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Staatskanzlei',
                    id: 'orgs-state-chancellery',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Staatskanzlei',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Bildungsdirektion',
                    id: 'orgs-education',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Bildungsdirektion',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Gesundheitsdirektion',
                    id: 'orgs-health',
                    groupName: 'extended-search-orgs',
                    isChecked: false,
                    value: 'Gesundheitsdirektion',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
