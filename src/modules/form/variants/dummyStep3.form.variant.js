const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'Dummy Step 3',
    desc: 'Dummy Schritt für mehrere Formularschritte',
  },
  props: {
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
                      label: 'Feld 3',
                      name: 'dummy_3',
                      uuid: 'dummy_3',
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
