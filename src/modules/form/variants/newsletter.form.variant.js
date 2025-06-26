const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'Newsletter anmelden',
    desc: 'Newsletter anmelden',
  },
  props: {
    sectionTitle: null,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Anrede',
                    requiredMessage: 'Bitte geben Sie eine Anrede an.',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Frau',
                            groupName: 'salutation',
                            id: 1,
                            value: 'mrs',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Herr',
                            groupName: 'salutation',
                            id: 2,
                            value: 'mr',
                            validation: {
                              isRequired: true,
                            },
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Keine Angabe',
                            groupName: 'salutation',
                            id: 3,
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
                      label: 'Vorname',
                      name: 'prename',
                      uuid: 'prename',
                      validation: {
                        isRequired: true,
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Nachname',
                      name: 'surname',
                      uuid: 'surname',
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
                      label: 'E-Mail',
                      name: 'emailaddr',
                      uuid: 'emailaddr',
                      type: 'email',
                      validation: {
                        errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
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
                      label: 'Organisation',
                      name: 'organisation',
                      uuid: 'organisation',
                    })
                  ),
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)({
                    isSingleSelect: true,
                    maxItems: 3,
                    listData: _.assign(
                      _.merge({}, listDemoData.variants.defaultSingle.props, {
                        setHiddenIndex: true,
                        groupId: 'nationality-x3',
                      }),
                      {
                        selectOptions: [
                          { value: 'schweiz', label: 'Schweiz' },
                          { value: 'lichtenstein', label: 'Lichtenstein' },
                          { value: 'test1', label: 'Test 1' },
                          { value: 'test2', label: 'Test 2' },
                          { value: 'andere', label: 'Andere' },
                        ],
                      }
                    ),
                    triggerInputData: {
                      type: 'text',
                      isSelectTrigger: true,
                      isFloatingLabel: true,
                      isInput: false,
                      icon: 'angle_drop_down',
                      label: 'Staatsangehörigkeit',
                      validation: {
                        isRequired: true,
                      },
                    },
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
