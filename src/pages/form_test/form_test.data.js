const _ = require('lodash');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.inverted.props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defFormData = require('../../modules/form/form.data').variants;
const defStepperData = require('../../modules/stepper/stepper.data').props;


const formInputHBS = dataHelper.getFileContent('../../atoms/form_input/form_input.hbs');
const formInputData = require('../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('../../modules/form/_form.fieldset.hbs');

const checkboxHBS = dataHelper.getFileContent('../../atoms/checkbox/checkbox.hbs');
const checkboxData = require('../../atoms/checkbox/checkbox.data');

const selectHBS = dataHelper.getFileContent('../../modules/select/select.hbs');
const selectData = require('../../modules/select/select.data');

const listDemoData = require('../../atoms/list/list.data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Form Test',
    jira: 'CZHDEV-',
    content: dataHelper.getFileContent('form_test.hbs'),
    documentation: dataHelper.getDocumentation('form_test.md'),
  },
  props: {
    header: headerData,
    skiplinks: skiplinksData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData.variants.rrbDetail.props, {
        pageTitle: 'Form Test',
        breadcrumb: {
          path: [{
            title: 'Zurück zur Übersicht',
            href: '#',
          }],
        },
      }),
      formSection: {
        sectionTitle: 'Angaben',
        groups: [{
          rows: [
            {
              fields: [
                {
                  isSmall: true,
                  cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                    selectData.variants.default.props,
                    {
                      listData: {
                        groupId: 'showhide',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'show', label: 'Show', id: _.uniqueId('showhide') },
                          { value: 'hide', label: 'Hide', id: _.uniqueId('showhide') },
                        ],
                      },
                    })),
                },
              ],
            },
            {
              fields: [
                {
                  isSmall: true,
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    rules: JSON.stringify([
                      {
                        conditions: [
                          {
                            field: 'showhide',
                            equals: true,
                            value: 'hide',
                          },
                        ],
                        action: 'hide',
                      },
                    ]),
                    fieldsetTitle: 'Auswahl',
                    isVertical: true,
                    requiredMessage: 'Bitte wählen Sie eine Option aus.',
                    options: [
                      () => handlebars.compile(checkboxHBS)(_.merge({},
                        checkboxData.variants.default.props,
                        {
                          label: 'Option 1',
                          groupName: 'opt_check',
                          id: 'op1',
                          value: '1',
                        })),
                      () => handlebars.compile(checkboxHBS)(_.merge({},
                        checkboxData.variants.default.props,
                        {
                          label: 'Option 2',
                          groupName: 'opt_check',
                          id: 'op2',
                          value: '2',
                        })),
                      () => handlebars.compile(checkboxHBS)(_.merge({},
                        checkboxData.variants.default.props,
                        {
                          label: 'Option 3',
                          groupName: 'opt_check',
                          id: 'op3',
                          value: '3',
                        })),
                    ],
                  }),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                    formInputData.variants.default.props,
                    {
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'opt_check',
                              equals: true,
                              value: '3',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
                      isFloatingLabel: true,
                      label: 'Aktuelle Berufsebezichnung',
                      name: 'current_job',
                      uuid: 'current_job',
                      validation: {
                        isRequired: true,
                      },
                    })),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                    formInputData.variants.default.props,
                    {
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'opt_check',
                              equals: true,
                              value: '2',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
                      isFloatingLabel: true,
                      label: 'Alter',
                      name: 'age',
                      uuid: 'age',
                      validation: {
                        isRequired: true,
                      },
                    })),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                    formInputData.variants.default.props,
                    {
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'age',
                              compare: 'greater',
                              value: '20',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
                      isFloatingLabel: true,
                      label: 'Sub Alter',
                      name: 'subAge',
                      uuid: 'subAge',
                      validation: {
                        isRequired: true,
                      },
                    })),
                },
              ],
            },
          ],
        },
        ],
      },
      stepper: _.merge({}, defStepperData, {
        steps: [
          defFormData.dummyStep1.props,
          {
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'dummy_1',
                    compare: 'greaterEqual',
                    value: '20',
                  },
                ],
                action: 'disable',
              },
            ]),
            groups: [
              {
                rows: [
                  {
                    fields: [
                      {
                        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                          formInputData.variants.unitLeftWithFloating.props,
                          {
                            isFloatingLabel: true,
                            label: 'Jahreseinkommen',
                            name: 'income_assets',
                            uuid: 'income_assets',
                            validation: {
                              isRequired: false,
                            },
                          })),
                      },
                    ],
                  },
                  {
                    fields: [
                      {
                        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                          formInputData.variants.unitLeftWithFloating.props,
                          {
                            rules: JSON.stringify([
                              {
                                conditions: [
                                  {
                                    field: 'dummy_1',
                                    compare: 'greaterEqual',
                                    value: '5',
                                  },
                                ],
                                action: 'show',
                              },
                            ]),
                            isFloatingLabel: true,
                            label: 'Conditional Field',
                            name: 'alt_input',
                            uuid: 'alt_input',
                            validation: {
                              isRequired: false,
                            },
                          })),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          defFormData.dummyStep3.props,
        ],
        navigation: {
          steps: ['Schritt 1', 'Schritt 2', 'Schritt 3', 'Bestätigung'],
        },
      }),
      footerData: defFooterData,
    },
  },
});

module.exports = data;
