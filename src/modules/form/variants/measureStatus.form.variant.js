const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Status (CZHDEV-3604)',
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
                    label: 'Kein Status',
                    id: 'status-none',
                    groupName: 'measure-status',
                    isChecked: false,
                    value: '',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Abgeschlossen',
                    id: 'status-completed',
                    groupName: 'measure-status',
                    isChecked: false,
                    value: 'Abgeschlossen',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Planmässig',
                    id: 'status-onschedule',
                    groupName: 'measure-status',
                    isChecked: false,
                    value: 'Planmässig',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Verzögert',
                    id: 'status-delayed',
                    groupName: 'measure-status',
                    isChecked: false,
                    value: 'Verzögert',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Sistiert',
                    id: 'status-paused',
                    groupName: 'measure-status',
                    isChecked: false,
                    value: 'Sistiert',
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(checkboxHBS)({
                    label: 'Verzicht',
                    id: 'status-canceled',
                    groupName: 'measure-status',
                    isChecked: false,
                    value: 'Verzicht',
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
