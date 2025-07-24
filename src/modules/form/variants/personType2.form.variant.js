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
    title: 'Antrag Form 2',
    desc: 'Testfall Ansässigkeitsbescheinigung 2',
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
                            label: 'Natürliche Person',
                            groupName: 'pType2',
                            id: 'pType2_a',
                            value: 'natural',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Juristische Person',
                            groupName: 'pType2',
                            id: 'pType2_b',
                            value: 'legal',
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
                      label: 'Name Natürliche Person',
                      name: 'name_natural',
                      uuid: 'name_natural',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie einen Namen an',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'pType2',
                              equals: true,
                              value: 'natural',
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
                      name: 'name_legal',
                      uuid: 'name_legal',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie einen Namen an',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'pType2',
                              equals: true,
                              value: 'legal',
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
