const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

module.exports = {
  meta: {
    title: 'Checkboxes für Stepper mit Logik (CZHDEV-1630)',
    desc: '',
  },
  props: {
    sectionTitle: 'Staatsangehörigkeit (mit Logik-Weiche)',
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Staatsangehörigkeit',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Schweiz',
                            groupName: 'nationality-100',
                            id: 4444,
                            value: 'CH',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Nicht Schweiz',
                            groupName: 'nationality-100',
                            id: 4455,
                            value: 'none',
                          })
                        ),
                    ],
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
