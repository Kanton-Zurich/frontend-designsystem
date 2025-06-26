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
    title: 'Entscheide (Flex data CZHDEV-1234)',
    desc: 'Flex Data Entscheide',
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
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.default.props, {
                      listData: _.merge({}, listDemoData.props, {
                        groupId: 'entscheidungsintanz',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'sicherheitsdirektion', label: 'Sicherheitsdirektion' },
                          { value: 'instanz2', label: 'Instanz2' },
                          { value: 'instanz3', label: 'Instanz3' },
                        ],
                      }),
                      triggerInputData: {
                        label: 'Entscheidungsinstanz',
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
                      label: 'Geschäftsnummer',
                      name: 'geschaeftsnummer',
                      uuid: 'geschaeftsnummer',
                      describedBy: 'geschaeftsnummer__description',
                    })
                  ),
                tooltip: {
                  helptext: 'Beispiel: 2017.2523',
                  descriptionId: 'geschaeftsnummer__description',
                },
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
                        label: 'Entscheidungsdatum von/bis',
                        name: 'entscheidungsdatum',
                        uuid: 'entscheidungsdatum',
                        validation: false,
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.default.props, {
                      listData: _.merge({}, listDemoData.props, {
                        groupId: 'rechtsgebiet',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          {
                            value: 'admin_strassn',
                            label: 'Administrativmassnahmen im Strassenverkehr',
                          },
                          { value: 'sozialhilfe', label: 'Sozialhilfe' },
                          { value: 'auslaender_recht', label: 'Ausländerrecht' },
                        ],
                      }),
                      triggerInputData: {
                        label: 'Rechtsgebiet',
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
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Stichwort',
                      name: 'stichwort',
                      uuid: 'stichwort',
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
