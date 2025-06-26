const _ = require('lodash');

const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

const fileUploadHBS = dataHelper.getFileContent('../../file_upload/file_upload.hbs');
const fileUploadData = require('../../file_upload/file_upload.data');

const datepickerHBS = dataHelper.getFileContent('../../datepicker/datepicker.hbs');
const datepickerData = require('../../datepicker/datepicker.data');

module.exports = {
  meta: {
    title: 'Duplizierung Upload',
    desc: 'Duplizierung Upload',
  },
  props: {
    groups: [
      {
        isDuplicatable: true,
        maxDuplications: '1',
        duplicateLabels: {
          add: 'Weitere Staatsangehörigkeit hinzufügen',
          remove: 'Staatangehörigkeit wieder entfernen',
        },
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Staatsangehörigkeit',
                      name: 'nationality',
                      uuid: 'nationality',
                      describedBy: 'nationality__description',
                      validation: {
                        isRequired: true,
                      },
                    })
                  ),
                tooltipBefore: true,
                tooltip: {
                  helptext: 'Info',
                  descriptionId: 'nationality__description',
                  buttonRight: true,
                  bubble: {
                    heading: 'Tooltip Ipsum',
                    text: '<p>Ländernamen auf Deutsch eingeben</p>',
                    id: _.uniqueId('form-test'),
                  },
                },
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(fileUploadHBS)(
                    _.merge({}, fileUploadData.variants.default.props, {
                      validation: { isRequired: true },
                    })
                  ),
              },
            ],
          },
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'PLZ',
                      name: 'zip_place_of_birth',
                      uuid: 'zip_place_of_birth',
                      validation: {
                        isRequired: true,
                        pattern: '^[0-9]{4,4}$',
                        errorMsg: 'Bitte geben Sie eine gültige schweizerische Postleizahl an.',
                      },
                      zipCity: {
                        fills: 'place_of_birth',
                        data: JSON.stringify({
                          8000: 'Zürich',
                          8001: 'Zürich',
                          8004: 'Zürich',
                          8310: 'Winterthur',
                          8700: 'Küsnacht ZH',
                          8620: 'Wetzikon',
                          8500: ['Gerlikon', 'Frauenfeld'],
                        }),
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Geburtsort',
                      name: 'place_of_birth',
                      uuid: 'place_of_birth',
                      isZipCityTarget: true,
                      validation: {
                        isRequired: true,
                      },
                    })
                  ),
                tooltip: {
                  buttonLeft: true,
                  bubble: {
                    heading: 'Tooltip Ipsum',
                    text: '<p>Ländernamen auf Deutsch eingeben</p>',
                    id: _.uniqueId('form-test'),
                  },
                },
              },
            ],
          },
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Checkboxen',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Wilde Wälder',
                            groupName: 'checkbox_in_duplication',
                            id: 'checkbox_1',
                            value: 'mrs',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Wasserfälle',
                            groupName: 'checkbox_in_duplication',
                            id: 'checkbox_2',
                            value: 'mr',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Beschauliche alpine Auen',
                            groupName: 'checkbox_in_duplication',
                            id: 'checkbox_3',
                            value: 'no',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Test Test',
                            groupName: 'checkbox_in_duplication',
                            id: 'checkbox_4',
                            value: 'no',
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
                  handlebars.compile(datepickerHBS)(
                    _.merge({}, datepickerData.variants.defaultDate.props, {
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'checkbox_in_duplication',
                              equals: true,
                              value: 'mr',
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
        duplicateButton: 'Weitere Staatsangehörigkeit hinzufügen',
      },
    ],
  },
};
