const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

module.exports = {
  meta: {
    title: 'Telefon',
    desc: 'Berufliche Informaitonen',
  },
  props: {
    sectionTitle: 'Kontaktangaben',
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.selectPhone.props, {})
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
};
