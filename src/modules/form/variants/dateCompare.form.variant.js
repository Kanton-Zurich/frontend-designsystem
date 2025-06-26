const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const datepickerHBS = dataHelper.getFileContent('../../datepicker/datepicker.hbs');
const datepickerData = require('../../datepicker/datepicker.data');

module.exports = {
  meta: {
    title: 'Datumsvergleichsbediung',
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
                  handlebars.compile(datepickerHBS)(
                    _.merge({}, datepickerData.variants.defaultDate.props, {
                      formInputData: {
                        name: 'compare_date',
                        uuid: 'compare_date',
                        liveUpdate: true,
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
                      label: 'Zeitpunkt jünger als 20.02.2021',
                      name: 'compare_date_greater',
                      uuid: 'compare_date_greater',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_date',
                              compare: 'greater',
                              value: '20.02.2021',
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
                      label: 'Zeitpunkt jünger als oder gleich wie 20.02.2021',
                      name: 'compare_date_greater_equal',
                      uuid: 'compare_date_greater_equal',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_date',
                              compare: 'greaterEqual',
                              value: '20.02.2021',
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
                      label: 'Zeitpunkt älter als 20.02.2021',
                      name: 'compare_date_less',
                      uuid: 'compare_date_less',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_date',
                              compare: 'less',
                              value: '20.02.2021',
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
                      label: 'Zeitpunkt älter als oder gleich wie 20.02.2021',
                      name: 'compare_date_less_equal',
                      uuid: 'compare_date_less_equal',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_date',
                              compare: 'lessEqual',
                              value: '20.02.2021',
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
