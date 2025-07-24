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
    title: 'Antrag Form 1',
    desc: 'Testfall Ansässigkeitsbescheinigung',
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
                            label: 'Privatperson',
                            groupName: 'pType',
                            id: 'pType_a',
                            value: 'privat',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Juristische Person',
                            groupName: 'pType',
                            id: 'pType_b',
                            value: 'juristisch',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Drittperson',
                            groupName: 'pType',
                            id: 'pType_c',
                            value: 'dritt',
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
                      label: 'Name Privatperson',
                      name: 'name_privat',
                      uuid: 'name_privat',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie einen Namen an',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'pType',
                              equals: true,
                              value: 'privat',
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
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Name juristische Person',
                      name: 'name_juristisch',
                      uuid: 'name_juristisch',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie einen Namen an',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'pType',
                              equals: true,
                              value: 'juristisch',
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
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Name Drittperson',
                      name: 'name_dritt',
                      uuid: 'name_dritt',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie einen Namen an',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'pType',
                              equals: true,
                              value: 'dritt',
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
