const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');
const checkboxData = require('../../../atoms/checkbox/checkbox.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const datepickerHBS = dataHelper.getFileContent('../../datepicker/datepicker.hbs');
const datepickerData = require('../../datepicker/datepicker.data');

module.exports = {
  meta: {
    title: 'ZH-Lex Loseblattsammlung (CZHDEV-1240)',
    desc: 'Flex Data ZH-Lex Suche Loseblattsammlung',
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
                  handlebars.compile(selectHBS)(_.merge({}, selectData.variants.table.props, {})),
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
                        uuid: 'erlassdatum_ls',
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
                        label: 'Inkraftsetzung',
                        name: 'entryIntoForceDate',
                        uuid: 'inkraftsetzungsdatum_ls',
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
                        label: 'Publikation',
                        name: 'publicationDate',
                        uuid: 'publikationsdatum_ls',
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
                  handlebars.compile(checkboxHBS)(
                    _.merge({}, checkboxData.variants.default.props, {
                      label: 'Auch aufgehobene Erlasse suchen',
                      groupName: 'includeRepealedEnactments',
                      id: 410,
                      value: 'true',
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
