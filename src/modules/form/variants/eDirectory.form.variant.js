const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'Behördenverzeichnis',
    desc: 'Suchfeld für Behördenverzeichnis',
  },
  props: {
    sectionTitle: null,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Nach Organisation suchen',
                      name: 'query',
                      uuid: 'edirectory-query',
                    })
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
};
