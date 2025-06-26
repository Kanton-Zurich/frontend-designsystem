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
    title: 'Testfall mehrere Abhängigkeiten',
    desc: 'Testfall für verschiedene Szenarien der KVG-Abhängigkeiten',
  },
  props: {
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: '1',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'A',
                            groupName: 'compl_test1',
                            id: 'compl_test1_A',
                            value: 'A',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'B',
                            groupName: 'compl_test1',
                            id: 'compl_test1_B',
                            value: 'B',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'C',
                            groupName: 'compl_test1',
                            id: 'compl_test1_C',
                            value: 'C',
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
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: '2',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'A',
                            groupName: 'compl_test2',
                            id: 'compl_test2_A',
                            value: 'A',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'B',
                            groupName: 'compl_test2',
                            id: 'compl_test2_B',
                            value: 'B',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'C',
                            groupName: 'compl_test2',
                            id: 'compl_test2_C',
                            value: 'C',
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
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: '3',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'A',
                            groupName: 'compl_test3',
                            id: 'compl_test3_A',
                            value: 'A',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'B',
                            groupName: 'compl_test3',
                            id: 'compl_test3_B',
                            value: 'B',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'C',
                            groupName: 'compl_test3',
                            id: 'compl_test3_C',
                            value: 'C',
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
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: '4',
                    rules: JSON.stringify([
                      {
                        conditions: [
                          {
                            field: 'compl_test3',
                            equals: true,
                            value: 'A',
                          },
                        ],
                        action: 'show',
                      },
                    ]),
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'A',
                            groupName: 'compl_test4',
                            id: 'compl_test4_A',
                            value: 'A',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'B',
                            groupName: 'compl_test4',
                            id: 'compl_test4_B',
                            value: 'B',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'C',
                            groupName: 'compl_test4',
                            id: 'compl_test4_C',
                            value: 'C',
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
                      label: 'Hallo',
                      name: 'compl_test5',
                      uuid: 'compl_test5',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compl_test1',
                              equals: true,
                              value: 'A',
                            },
                            {
                              field: 'compl_test2',
                              equals: true,
                              value: 'A',
                            },
                          ],
                          action: 'show',
                        },
                        {
                          conditions: [
                            {
                              field: 'compl_test3',
                              equals: true,
                              value: 'A',
                            },
                            {
                              field: 'compl_test4',
                              equals: true,
                              value: 'B',
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
