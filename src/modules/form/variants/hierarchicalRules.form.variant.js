const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

module.exports = {
  meta: {
    title: 'Hierarchische Regeln',
    desc: '',
  },
  props: {
    sectionTitle: 'Test',
    groups: [
      {
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Feld 1',
                    requiredMessage: 'Option auswählen.',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Ja',
                            groupName: 'hr1',
                            id: 'hr1_1',
                            value: 'yes',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'No',
                            groupName: 'hr1',
                            id: 'hr1_2',
                            value: 'no',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                    ],
                  }),
              },
            ],
          },
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Feld 2',
                    requiredMessage: 'Option auswählen.',
                    rules: JSON.stringify([
                      {
                        conditions: [
                          {
                            field: 'hr1',
                            equals: true,
                            value: 'yes',
                          },
                        ],
                        action: 'show',
                      },
                    ]),
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Ja',
                            groupName: 'hr2',
                            id: 'hr2_1',
                            value: 'yes',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'No',
                            groupName: 'hr2',
                            id: 'hr2_2',
                            value: 'no',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                    ],
                  }),
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'InputFeld',
                      name: 'inputfeld',
                      uuid: 'inputfeld',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'hr2',
                              equals: true,
                              value: 'yes',
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
