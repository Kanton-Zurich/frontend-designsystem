const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');
const checkboxData = require('../../../atoms/checkbox/checkbox.data');

module.exports = {
  meta: {
    title: 'Berufliche Informationen',
    desc: 'Berufliche Informaitonen',
  },
  props: {
    sectionTitle: 'Berufliche Angaben',
    groups: [
      {
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Auswahl',
                    isVertical: true,
                    requiredMessage: 'Bitte wählen Sie eine Option aus.',
                    options: [
                      () =>
                        handlebars.compile(checkboxHBS)(
                          _.merge({}, checkboxData.variants.default.props, {
                            label: 'Option 1',
                            groupName: 'checkboxgroup',
                            id: 11,
                            value: '1',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                      () =>
                        handlebars.compile(checkboxHBS)(
                          _.merge({}, checkboxData.variants.default.props, {
                            label: 'Option 2',
                            groupName: 'checkboxgroup',
                            id: 12,
                            value: '2',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                      () =>
                        handlebars.compile(checkboxHBS)(
                          _.merge({}, checkboxData.variants.default.props, {
                            label: 'Option 3',
                            groupName: 'checkboxgroup',
                            id: 313,
                            value: '3',
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
                      label: 'Aktuelle Berufsebezichnung',
                      name: 'current_job',
                      uuid: 'current_job',
                      validation: {
                        isRequired: true,
                      },
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
                      label: 'Berufslehre als',
                      name: 'education_origin',
                      uid: 'education_origin',
                      validation: {
                        isRequired: true,
                      },
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
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.unitLeftWithFloating.props, {
                      isFloatingLabel: true,
                      label: 'Vermögen',
                      name: 'assets',
                      uuid: 'assets',
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
