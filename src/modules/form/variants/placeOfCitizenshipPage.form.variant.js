const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'Einzelnes Feld für Stepper mit Logik',
    desc: '',
  },
  props: {
    sectionTitle: 'Bürgerort',
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.props, {
                      isFloatingLabel: true,
                      label: 'Bürgerort',
                      name: 'place_of_citizenship2',
                      uuid: _.uniqueId('place_of_citizenship'),
                      validation: {
                        isRequired: true,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'singleSelect',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'show',
                        },
                        {
                          conditions: [
                            {
                              field: 'singleSelect',
                              equals: true,
                              value: 'DE',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
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
