const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Zuständigkeit (CZHDEV-3604)',
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
                    label: 'Strassenverkehrsamt',
                    id: 'responsible-body-strassenverkehrsamt',
                    groupName: 'measure-responsible-body',
                    isChecked: false,
                    value: 'Strassenverkehrsamt',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Tiefbauamt',
                    id: 'responsible-body-tiefbauamt',
                    groupName: 'measure-responsible-body',
                    isChecked: false,
                    value: 'Tiefbauamt',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
