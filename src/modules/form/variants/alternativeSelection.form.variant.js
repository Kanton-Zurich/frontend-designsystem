const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'Auswahlalternative',
    desc: 'Eine alternative Eingabe zur Auswahl tätigen',
  },
  props: {
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)({
                    isSingleSelect: true,
                    listData: _.assign(
                      _.merge({}, listDemoData.variants.defaultSingle.props, {
                        setHiddenIndex: true,
                        groupId: 'nationality-x3',
                      }),
                      {
                        selectOptions: [
                          { value: 'schweiz', label: 'Schweiz' },
                          { value: 'lichtenstein', label: 'Lichtenstein' },
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
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Andere Nationalität',
                      name: 'other_nationality',
                      uuid: 'other_nationality',
                      type: 'text',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie ihre Nationalität ein',
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-x3',
                              equals: true,
                              value: 'andere',
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
