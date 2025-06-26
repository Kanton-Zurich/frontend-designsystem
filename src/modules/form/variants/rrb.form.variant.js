const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'RRB (Flex data CZHDEV-1236)',
    desc: 'Flex Data Regierungsratsbeschlüsse',
  },
  props: {
    sectionTitle: 'Suche',
    headingLevel: 2,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Stichwort',
                      name: 'fullText',
                      uuid: 'fullText',
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
                      label: 'RRB-Nr.',
                      name: 'decisionNumber',
                      uuid: 'decisionNumber',
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.default.props, {
                      listData: _.merge({}, listDemoData.props, {
                        groupId: 'year',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: '2019', label: '2019' },
                          { value: '2018', label: '2018' },
                          { value: '2017', label: '2017' },
                          { value: '2016', label: '2016' },
                          { value: '2015', label: '2015' },
                          { value: '2014', label: '2014' },
                          { value: '2013', label: '2013' },
                          { value: '2012', label: '2012' },
                        ],
                        validation: {
                          isRequired: false,
                        },
                      }),
                      triggerInputData: {
                        label: 'Jahr',
                        validation: {
                          isRequired: false,
                        },
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
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.default.props, {
                      listData: _.merge({}, listDemoData.props, {
                        groupId: 'department',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'mig', label: 'Migration & Integration' },
                          { value: 'mo', label: 'Mobilität' },
                          { value: 'sich', label: 'Sicherheit & Justiz' },
                          { value: 'so', label: 'Soziales' },
                          { value: 'st', label: 'Steuern' },
                          { value: 'umte', label: 'Umwelt & Tier' },
                          { value: 'ge', label: 'Gemeinschaften' },
                          { value: 'scer', label: 'Schulen & Erziehung' },
                        ],
                        validation: {
                          isRequired: false,
                        },
                      }),
                      triggerInputData: {
                        label: 'Direktion',
                        validation: {
                          isRequired: false,
                        },
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
