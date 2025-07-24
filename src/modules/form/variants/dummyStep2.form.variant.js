const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'Dummy Step 2',
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
                    _.merge({}, formInputData.variants.unitLeftWithFloating.props, {
                      isFloatingLabel: true,
                      label: 'Jahreseinkommen',
                      name: 'income_assets',
                      uuid: 'income_assets',
                      validation: {
                        isRequired: false,
                      },
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
