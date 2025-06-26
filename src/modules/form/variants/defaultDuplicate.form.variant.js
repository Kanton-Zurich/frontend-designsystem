const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const hCaptchaHBS = dataHelper.getFileContent('../../../atoms/hcaptcha/hcaptcha.hbs');
const hCaptchaData = require('../../../atoms/hcaptcha/hcaptcha.data');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const datepickerHBS = dataHelper.getFileContent('../../datepicker/datepicker.hbs');
const datepickerData = require('../../datepicker/datepicker.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const formFieldsetHBS = dataHelper.getFileContent('../_form.fieldset.hbs');
const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

const duplicateGroup2 = {
  isDuplicatable: true,
  maxDuplications: '3',
  duplicateLabels: {
    add: 'Weitere Gruppe hinzufügen',
    remove: 'Gruppe wieder entfernen',
  },
  rows: [
    {
      fields: [
        {
          cellContent: () =>
            handlebars.compile(formInputHBS)(
              _.merge({}, formInputData.variants.default.props, {
                isFloatingLabel: true,
                label: 'Text',
                name: 'group2_text',
                uuid: 'group2_text',
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
            handlebars.compile(datepickerHBS)(
              _.merge({}, datepickerData.variants.defaultDate.props, {
                formInputData: _.merge({}, formInputData.variants.default.props, {
                  label: 'Datum',
                  uuid: _.uniqueId('date-in-group2'),
                  validation: {
                    pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
                    isRequired: true,
                    errorMsg: 'Bitte geben Sie eine korrektes Datum an.',
                  },
                }),
              })
            ),
        },
        {
          cellContent: () =>
            handlebars.compile(selectHBS)(
              _.merge({}, selectData.variants.default.props, {
                triggerInputData: _.merge({}, formInputData.variants.triggerDefault.props, {
                  uuid: _.uniqueId('dropdown-in-group2'),
                  label: 'Dropdown',
                }),
              })
            ),
        },
      ],
    },
    {
      fields: [
        {
          cellContent: () =>
            handlebars.compile(selectHBS)(
              _.merge({}, selectData.variants.default.props, {
                triggerInputData: _.merge({}, formInputData.variants.triggerDefault.props, {
                  uuid: _.uniqueId('dropdown-in-group2'),
                  label: 'Dropdown 2',
                }),
              })
            ),
        },
      ],
    },
  ],
};

module.exports = {
  meta: {
    title: 'Default mit anderen IDs und hCaptcha',
    desc: 'Beispiel mit hCaptcha',
  },
  props: {
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
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Frau',
                            groupName: 'salutation2',
                            id: 6,
                            value: 'mrs',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Herr',
                            groupName: 'salutation2',
                            id: 7,
                            value: 'mr',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Keine Angabe',
                            groupName: 'salutation2',
                            id: 8,
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
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Vorname',
                      name: 'prename',
                      uuid: 'prename2',
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
                      uuid: 'surname2',
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
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'PLZ',
                      name: 'zip2',
                      uuid: 'zip2',
                      validation: {
                        isRequired: true,
                        pattern: '^[0-9]{4,4}$',
                        errorMsg: 'Bitte geben Sie eine gültige schweizerische Postleizahl an.',
                      },
                      zipCity: {
                        fills: 'city2',
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
                      label: 'Ort',
                      name: 'city2',
                      uuid: 'city2',
                      isZipCityTarget: true,
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
                      name: 'e_mail',
                      uuid: 'e_mail',
                      type: 'email',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
                      },
                    })
                  ),
              },
            ],
          },
        ],
      },
      duplicateGroup2,
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(hCaptchaHBS)(
                    _.merge({}, hCaptchaData.variants.default.props, {})
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
};
