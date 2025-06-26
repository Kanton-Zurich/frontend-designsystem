const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const datepickerHBS = dataHelper.getFileContent('../../datepicker/datepicker.hbs');
const datepickerData = require('../../datepicker/datepicker.data');

module.exports = {
  meta: {
    title: 'Altersvergleich',
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
                    _.merge({}, datepickerData.variants.dateAndTime.props, {
                      formInputData: {
                        name: 'compare_age',
                        uuid: 'compare_age',
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
                      label: 'Älter oder mindestens 18 Jahre',
                      name: 'compare_age_older_equal_18',
                      uuid: 'compare_age_older_equal_18',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_age',
                              compare: 'lessEqual',
                              compareAge: true,
                              value: '18',
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
                      label: 'Älter 18 Jahre',
                      name: 'compare_age_older_18',
                      uuid: 'compare_age_older_18',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_age',
                              compare: 'less',
                              compareAge: true,
                              value: '18',
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
                      label: 'Jünger 18 Jahre',
                      name: 'compare_younger_18',
                      uuid: 'compare_younger_18',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_age',
                              compare: 'greater',
                              compareAge: true,
                              value: '18',
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
                      label: 'Jünger oder genau 18 Jahre',
                      name: 'compare_younger_equal_18',
                      uuid: 'compare_younger_equal_18',
                      type: 'text',
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'compare_age',
                              compare: 'greaterEqual',
                              compareAge: true,
                              value: '18',
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
