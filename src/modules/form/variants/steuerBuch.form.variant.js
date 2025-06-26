const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const drillDownSelectHBS = dataHelper.getFileContent('../../drilldown_select/drilldown_select.hbs');
const drillDownSelectData = require('../../drilldown_select/drilldown_select.data');

module.exports = {
  meta: {
    title: 'Steuerbuch (Flex Data CZHDEV-1234)',
    desc: 'Flex Data Steuerbuch',
  },
  props: {
    sectionTitle: 'Suche im Zürcher Steuerbuch',
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
                      label: 'Stichwort oder ZStB-Nr.',
                      name: 'query_string',
                      uuid: 'query_string',
                    })
                  ),
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(drillDownSelectHBS)(
                    _.merge({}, drillDownSelectData.variants.default.props, {
                      // primary secondary
                      primarySelectData: {
                        listData: {
                          groupId: 'thema',
                        },
                        triggerInputData: {
                          label: 'Thema',
                          name: 'thema',
                          uuid: 'thema',
                        },
                      },
                      secondarySelectData: {
                        listData: {
                          groupId: 'unterthema',
                        },
                        triggerInputData: {
                          label: 'Unterthema',
                          name: 'unterthema',
                          uuid: 'unterthema',
                        },
                      },
                    })
                  ),
              },
            ],
            unwrapped: true,
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.multiSelect.props, {
                      listData: {
                        validation: {
                          isRequired: false,
                        },
                      },
                      triggerInputData: {
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
