const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Bildungsstatistik Bildungsbereich Mittelschulen (CZHDEV-3837)',
    desc: 'Checkbox-Auswahl für Bildungsstatistiksuche.',
  },
  props: {
    sectionTitle: false,
    groups: [
      {
        rows: [
          {
            fields: [
              'Langzeitgymnasium',
              '  Untergymnasium',
              '  Nach Profilwahl',
              'Kurzzeitgymnasium',
              'Nicht gymnasiale Mittelschulen',
              '  Handelsmittelschule HMS',
              '  Informatik Mittelschule IMS',
              '  Fachmittelschule FMS',
            ].map((label) => ({
              cellContent: () =>
                handlebars.compile(checkboxHBS)({
                  label,
                  id: _.uniqueId(label),
                  groupName: 'bildungsbereichMittelschulen',
                  isChecked: false,
                  value: label,
                }),
            })),
          },
        ],
      },
    ],
  },
};
