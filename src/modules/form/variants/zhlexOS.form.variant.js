const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const datepickerHBS = dataHelper.getFileContent('../../datepicker/datepicker.hbs');
const datepickerData = require('../../datepicker/datepicker.data');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'ZH-Lex Offizielle Gesetzessammlung (CZHDEV-1240)',
    desc: 'Flex Data ZH-Lex Suche Offizielle Gesetzessammlung',
  },
  props: {
    sectionTitle: null,
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
                      uuid: _.uniqueId('stichwort'),
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
                      label: 'Erlasstitel',
                      name: 'enactmentTitle',
                      uuid: _.uniqueId('erlasstitel'),
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Ordnungsnummer',
                      name: 'referenceNumber',
                      uuid: _.uniqueId('ordnungsnummer'),
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
                        isSingleSelect: true,
                        groupId: 'volumeNumber',
                        selectOptions: [
                          { value: '76', label: 'Band 76', id: _.uniqueId('volumeNumber') },
                          { value: '75', label: 'Band 75', id: _.uniqueId('volumeNumber') },
                          { value: '74', label: 'Band 74', id: _.uniqueId('volumeNumber') },
                          { value: '73', label: 'Band 73', id: _.uniqueId('volumeNumber') },
                          { value: '...', label: '...', id: _.uniqueId('volumeNumber') },
                          { value: '54', label: 'Band 54', id: _.uniqueId('volumeNumber') },
                          { value: '53', label: 'Band 53', id: _.uniqueId('volumeNumber') },
                          { value: '52', label: 'Band 52', id: _.uniqueId('volumeNumber') },
                          { value: '51', label: 'Band 51', id: _.uniqueId('volumeNumber') },
                        ],
                      }),
                      triggerInputData: {
                        label: 'Bandnummer',
                        uuid: 'bandnummer_os',
                        validation: {
                          isRequired: false,
                        },
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Seitenzahl in OS',
                      name: 'volumePageNumber',
                      uuid: 'seitenzahl_os',
                    })
                  ),
              },
            ],
          },
        ],
      },
      {
        rows: [
          {
            fields: [
              {
                cellContent:
                  '<h3 class="atm-heading mdl-flex-data__extended-subtitle">Einschränken nach Datum von/bis</h3>',
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(datepickerHBS)(
                    _.merge({}, datepickerData.variants.dateRange.props, {
                      formInputData: {
                        label: 'Erlass',
                        name: 'enactmentDate',
                        uuid: 'erlassdatum_os',
                        validation: false,
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(datepickerHBS)(
                    _.merge({}, datepickerData.variants.dateRange.props, {
                      formInputData: {
                        label: 'Inkraftsetzung',
                        name: 'entryIntoForceDate',
                        uuid: 'inkraftsetzungsdatum_os',
                        validation: false,
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
                    _.merge({}, datepickerData.variants.dateRange.props, {
                      formInputData: {
                        label: 'Publikation',
                        name: 'publicationDate',
                        uuid: 'publikationsdatum_os',
                        validation: false,
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(datepickerHBS)(
                    _.merge({}, datepickerData.variants.dateRange.props, {
                      formInputData: {
                        label: 'Aufhebung',
                        name: 'withdrawalDate',
                        uuid: 'aufhebungsdatum_os',
                        validation: false,
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
