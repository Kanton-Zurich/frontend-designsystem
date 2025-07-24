const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');

module.exports = {
  meta: {
    title: 'Bildungsstatistik Auswertungen (CZHDEV-3837)',
    desc: 'Checkbox-Auswahl für Bildungsstatistiksuche.',
  },
  props: {
    sectionTitle: false,
    groups: [
      {
        rows: [
          {
            fields: ['  Staatsangehörigkeit', '  Erstsprache', '  Privatschulen'].map((label) => ({
              cellContent: () =>
                handlebars.compile(checkboxHBS)({
                  label,
                  id: _.uniqueId(label),
                  groupName: 'auswertungen',
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
