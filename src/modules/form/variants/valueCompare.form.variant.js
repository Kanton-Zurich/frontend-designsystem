const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'Vergleichsbediungen',
    desc: '',
  },
  props: {
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.unitLeftWithFloating.props, {
                      isFloatingLabel: true,
                      label: 'Zahleneingabe',
                      name: 'compare_text',
                      uuid: 'compare_text',
                      type: 'text',
                      liveUpdate: true,
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte gültigen Wert eingeben',
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
                      label: 'Vergleichswert grösser als 100',
                      name: 'compare_greater',
                      uuid: 'compare_greater',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_text',
                              compare: 'greater',
                              value: '100',
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
                      label: 'Vergleichswert grösser-gleich 100',
                      name: 'compare_greater_equal',
                      uuid: 'compare_greater_equal',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_text',
                              compare: 'greaterEqual',
                              value: '100',
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
                      label: 'Vergleichswert kleiner als 100',
                      name: 'compare_less',
                      uuid: 'compare_less',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_text',
                              compare: 'less',
                              value: '100',
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
                      label: 'Vergleichswert kleiner-gleich 100',
                      name: 'compare_less_equal',
                      uuid: 'compare_less_equal',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_text',
                              compare: 'lessEqual',
                              value: '100',
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
                      label: 'Vergleichswert genau 100.01',
                      name: 'compare_equal',
                      uuid: 'compare_equal',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_text',
                              equals: true,
                              value: '100.01',
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
