// eslint-disable no-magic-numbers

const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formInputHBS = dataHelper.getFileContent('../../atoms/form_input/form_input.hbs');
const formInputData = require('../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('./_form.fieldset.hbs');

const checkboxHBS = dataHelper.getFileContent('../../atoms/checkbox/checkbox.hbs');
const checkboxData = require('../../atoms/checkbox/checkbox.data');

const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../atoms/radiobutton/radiobutton.data');

const selectHBS = dataHelper.getFileContent('../select/select.hbs');
const selectData = require('../select/select.data');

const drillDownSelectHBS = dataHelper.getFileContent('../drilldown_select/drilldown_select.hbs');
const drillDownSelectData = require('../drilldown_select/drilldown_select.data');

const fileUploadHBS = dataHelper.getFileContent('../file_upload/file_upload.hbs');
const fileUploadData = require('../file_upload/file_upload.data');

const datepickerHBS = dataHelper.getFileContent('../datepicker/datepicker.hbs');
const datepickerData = require('../datepicker/datepicker.data');

const listDemoData = require('../../atoms/list/list.data');

const duplicateGroup = {
  isDuplicatable: true,
  maxDuplications: '1',
  duplicateLabels: {
    add: 'Weitere Staatsangehörigkeit hinzufügen',
    remove: 'Staatangehörigkeit wieder entfernen',
  },
  rows: [{
    fields: [{
      cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
        formInputData.variants.default.props,
        {
          isFloatingLabel: true,
          label: 'Staatsangehörigkeit',
          name: 'nationality',
          uuid: 'nationality',
          validation: {
            isRequired: true,
          },
        })),
      tooltip: {
        helptext: 'Info',
        buttonRight: true,
        bubble: {
          heading: 'Tooltip Ipsum',
          text: 'Ländernamen auf Deutsch eingeben',
          id: _.uniqueId('form-test'),
        },
      },
    },
    {
      cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
        formInputData.variants.default.props,
        {
          isFloatingLabel: true,
          label: 'Geburtsort',
          name: 'place_of_birth',
          uuid: 'place_of_birth',
          validation: {
            isRequired: true,
          },
        })),
      tooltip: {
        buttonLeft: true,
        bubble: {
          heading: 'Tooltip Ipsum',
          text: 'Ländernamen auf Deutsch eingeben',
          id: _.uniqueId('form-test'),
        },
      },
    }],
  },
  {
    fields: [{
      isSmall: true,
      cellContent: () => handlebars.compile(formFieldsetHBS)({
        fieldsetTitle: 'Checkboxen',
        options: [
          () => handlebars.compile(radioHBS)(_.merge({},
            radioData.variants.default.props,
            {
              label: 'Test 1',
              groupName: 'checkbox_in_duplication',
              id: 'checkbox_1',
              value: 'mrs',
            })),
          () => handlebars.compile(radioHBS)(_.merge({},
            radioData.variants.default.props,
            {
              label: 'Test 2',
              groupName: 'checkbox_in_duplication',
              id: 'checkbox_2',
              value: 'mr',
            })),
          () => handlebars.compile(radioHBS)(_.merge({},
            radioData.variants.default.props,
            {
              label: 'Test 3',
              groupName: 'checkbox_in_duplication',
              id: 'checkbox_3',
              value: 'no',
            })),
        ],
      }),
    }],
  },
  {
    fields: [
      {
        cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
          datepickerData.variants.defaultDate.props,
          {})),
      },
    ],
  }],
  duplicateButton: 'Weitere Staatsangehörigkeit hinzufügen',
};

const duplicateRow = {
  isDuplicatable: true,
  duplicateLabels: {
    add: 'Kind hinzufügen',
    remove: 'Kind wieder entfernen',
  },
  fields: [{
    cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
      formInputData.variants.default.props,
      {
        isFloatingLabel: true,
        label: 'Vorname Kind',
        name: _.uniqueId('vornameKind'),
        uuid: _.uniqueId('vornameKind'),
      })),
  }],
};

const template = dataHelper.getFileContent('form.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'FormSection',
    className: 'FormSection',
    jira: 'CZHDEV-850',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('form.md'),
    wrapInForm: true,
  },
  props: {
    sectionTitle: 'Persönliche Angaben',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Persönliche Angaben',
      desc: 'Persönliche Angaben',
    },
    props: {
      groups: [
        {
          rows: [
            {
              fields: [
                {
                  isSmall: true,
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Anrede',
                    requiredMessage: 'Bitte geben Sie eine Anrede an.',
                    options: [
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Frau',
                          groupName: 'salutation',
                          id: 1,
                          value: 'mrs',
                          validation: {
                            isRequired: true,
                          },
                        })),
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Herr',
                          groupName: 'salutation',
                          id: 2,
                          value: 'mr',
                          validation: {
                            isRequired: true,
                          },
                        })),
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Keine Angabe',
                          groupName: 'salutation',
                          id: 3,
                          value: 'no',
                          validation: {
                            isRequired: true,
                          },
                        })),
                    ],
                  }),
                },
              ],
            },
            {
              fields: [{
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'Vorname',
                    name: 'prename',
                    uuid: 'prename',
                    validation: {
                      isRequired: true,
                    },
                  })),
              },
              {
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'Nachname',
                    name: 'surname',
                    uuid: 'surname',
                    validation: {
                      isRequired: true,
                    },
                  })),
              }],
            },
            {
              fields: [{
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'E-Mail',
                    name: 'emailaddr',
                    uuid: 'emailaddr',
                    type: 'email',
                    validation: {
                      errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
                    },
                  })),
              },
              {
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'URL',
                    name: 'url_input',
                    uuid: 'url_input',
                    type: 'url',
                    validation: {
                      errorMsg: 'Bitte geben Sie eine gültige URL an.',
                    },
                  })),
              }],
            },
            {
              fields: [{
                isSmall: true,
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'PLZ',
                    name: 'zip',
                    uuid: 'zip',
                    validation: {
                      isRequired: true,
                      pattern: '^[0-9]{4,4}$',
                      errorMsg: 'Bitte geben Sie eine gültige schweizerische Postleizahl an.',
                    },
                    zipCity: {
                      fills: 'city',
                      data: JSON.stringify({
                        8000: 'Zürich',
                        8001: 'Zürich',
                        8004: 'Zürich',
                        8310: 'Winterthur',
                        8700: 'Küsnacht ZH',
                        8620: 'Wetzikon',
                      }),
                    },
                  })),
              },
              {
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'Ort',
                    name: 'city',
                    uuid: 'city',
                    validation: {
                      isRequired: true,
                    },
                  })),
              }],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                    selectData.variants.multiSelect.props,
                    {})),
                },
                {
                  cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
                    datepickerData.variants.dateRange.props,
                    {})),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                    selectData.variants.selectPhone.props,
                    {})),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
                    datepickerData.variants.dateAndTime.props,
                    {})),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
                    datepickerData.variants.dateAndTime.props,
                    {})),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
                    datepickerData.variants.dateRange.props,
                    {})),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                    formInputData.variants.default.props,
                    {
                      isFloatingLabel: true,
                      label: 'Alternative E-Mail',
                      name: 'altemailaddr',
                      uuid: 'altemailaddr',
                      type: 'email',
                      validation: {
                        isRequired: true,
                        errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
                      },
                    })),
                },
              ],
            },
            duplicateRow,
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(fileUploadHBS)(_.merge({},
                    fileUploadData.variants.multiple.props,
                    {
                      validation: {
                        maxSize: 26214400,
                        fileTypes: 'text/csv, image/gif, text/html, image/jpeg, application/pdf, image/png, image/tiff, application/rtf, image/svg+xml, text/plain, application/xml',
                        isRequired: true,
                      },
                    })),
                },
              ],
            },
          ],
        },
        duplicateGroup,
      ],
    },
  },
  taxEntity: {
    meta: {
      title: 'Tax Entity (CZHDEV-1238)',
      desc: 'Radiobutton Auswahl für Steuerrechner (modules/tax_calc).',
    },
    props: {
      sectionTitle: false,
      groups: [{
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () => handlebars.compile(formFieldsetHBS)({
                  fieldsetTitle: false,
                  isVertical: true,
                  requiredMessage: 'Bitte wählen Sie eine Option aus.',
                  options: [
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        id: 'privatperson',
                        groupName: 'taxEntity',
                        label: 'Privatperson',
                        descr: 'Berechnen von Bundes-, Staats- und Gemeindesteuerbetrag, Steuerbetrag auf Kapitalleistungen aus Vorsorge sowie Erbschafts- und Schenkungssteuer (Natürliche Personen)',
                        isChecked: false,
                        additionalAttribute: 'data-tax_calc="inputEntity"',
                      })),
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        id: 'legal_iterative',
                        groupName: 'taxEntity',
                        label: 'Steuerrückstellung juristische Personen',
                        descr: 'Berechnen der Steuern, ausgehend von Gewinn und Kapital vor Steuern, mit dem Zweck der Vornahme der Steuerrückstellung.',
                        additionalAttribute: 'data-tax_calc="inputTaxTypeInc"',
                      })),
                  ],
                }),
              },
            ],
          },
        ],
      },
      ],
    },
  },
  careerInfo: {
    meta: {
      title: 'Berufliche Informationen',
      desc: 'Berufliche Informaitonen',
    },
    props: {
      sectionTitle: 'Berufliche Angaben',
      groups: [{
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () => handlebars.compile(formFieldsetHBS)({
                  fieldsetTitle: 'Auswahl',
                  isVertical: true,
                  requiredMessage: 'Bitte wählen Sie eine Option aus.',
                  options: [
                    () => handlebars.compile(checkboxHBS)(_.merge({},
                      checkboxData.variants.default.props,
                      {
                        label: 'Option 1',
                        groupName: 'checkboxgroup',
                        id: 11,
                        value: '1',
                        validation: {
                          isRequired: true,
                        },
                      })),
                    () => handlebars.compile(checkboxHBS)(_.merge({},
                      checkboxData.variants.default.props,
                      {
                        label: 'Option 2',
                        groupName: 'checkboxgroup',
                        id: 12,
                        value: '2',
                        validation: {
                          isRequired: true,
                        },
                      })),
                    () => handlebars.compile(checkboxHBS)(_.merge({},
                      checkboxData.variants.default.props,
                      {
                        label: 'Option 2',
                        groupName: 'checkboxgroup',
                        id: 313,
                        value: '3',
                        validation: {
                          isRequired: true,
                        },
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
            fields: [{
              cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                formInputData.variants.default.props,
                {
                  isFloatingLabel: true,
                  label: 'Berufslehre als',
                  name: 'education_origin',
                  uid: 'education_origin',
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
  },
  defaultDuplicate: {
    meta: {
      title: 'Default mit anderen IDs',
      desc: '',
    },
    props: {
      groups: [{
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () => handlebars.compile(formFieldsetHBS)({
                  fieldsetTitle: 'Anrede',
                  options: [
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'Frau',
                        groupName: 'salutation2',
                        id: 6,
                        value: 'mrs',
                      })),
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'Herr',
                        groupName: 'salutation2',
                        id: 7,
                        value: 'mr',
                      })),
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'Keine Angabe',
                        groupName: 'salutation2',
                        id: 8,
                        value: 'no',
                      })),
                  ],
                }),
              },
            ],
          },
          {
            fields: [{
              cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                formInputData.variants.default.props,
                {
                  isFloatingLabel: true,
                  label: 'Vorname',
                  name: 'prename',
                  uuid: 'prename2',
                  validation: {
                    isRequired: true,
                  },
                })),
            },
            {
              cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                formInputData.variants.default.props,
                {
                  isFloatingLabel: true,
                  label: 'Nachname',
                  name: 'surname',
                  uuid: 'surname2',
                  validation: {
                    isRequired: true,
                  },
                })),
            }],
          },
          {
            fields: [{
              isSmall: true,
              cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                formInputData.variants.default.props,
                {
                  isFloatingLabel: true,
                  label: 'PLZ',
                  name: 'zip',
                  uuid: 'zip2',
                  validation: {
                    isRequired: true,
                    pattern: '^[0-9]{4,4}$',
                    errorMsg: 'Bitte geben Sie eine gültige schweizerische Postleizahl an.',
                  },
                })),
            },
            {
              cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                formInputData.variants.default.props,
                {
                  isFloatingLabel: true,
                  label: 'Ort',
                  name: 'city',
                  uuid: 'city2',
                  validation: {
                    isRequired: true,
                  },
                })),
            }],
          },
        ],
      }],
    },
  },
  withRules: {
    meta: {
      title: 'Formular mit Logik (CZHDEV-1180)',
      desc: 'Formular in dem Felder in gewissen Abhängigkeiten zu einander stehen',
    },
    props: {
      groups: [
        {
          rows: [
            {
              fields: [
                {
                  isSmall: true,
                  cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                    selectData.variants.default.props,
                    {
                      listData: _.merge({}, listDemoData.props, {
                        groupId: 'nationality-f2',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'BE', label: 'Belgien', id: _.uniqueId('nationalityx') },
                          { value: 'DE', label: 'Deutschland', id: _.uniqueId('nationalityx') },
                          { value: 'FR', label: 'Frankreich', id: _.uniqueId('nationalityx') },
                          { value: 'LU', label: 'Luxemburg', id: _.uniqueId('nationalityx') },
                          { value: 'NL', label: 'Niederlande', id: _.uniqueId('nationalityx') },
                          { value: 'SWE', label: 'Schweden', id: _.uniqueId('nationalityx') },
                          { value: 'CH', label: 'Schweiz', id: _.uniqueId('nationalityx') },
                          { value: 'UK', label: 'Vereinigtes Königreich', id: _.uniqueId('nationalityx') },
                          { value: 'US', label: 'Vereinigte Staaten', id: _.uniqueId('nationalityx') },
                        ],
                      }),
                    })),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(fileUploadHBS)(_.merge({},
                    fileUploadData.variants.default.props,
                    {
                      input: {
                        name: 'fileupload_XX',
                        id: 'fileupload_XX',
                      },
                      validation: {
                        maxSize: 26214400,
                        fileTypes: 'text/csv, image/gif, text/html, image/jpeg, application/pdf, image/png, image/tiff, application/rtf, image/svg+xml, text/plain, application/xml',
                        isRequired: true,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-f2',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'show',
                        },
                        {
                          conditions: [
                            {
                              field: 'nationality-f2',
                              equals: true,
                              value: 'DE',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
                    })),
                },
              ],
            },
            {
              fields: [
                {
                  isSmall: true,
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () => handlebars.compile(checkboxHBS)(_.merge({},
                        checkboxData.variants.default.props,
                        {
                          label: 'Sind sie Ausländer/in?',
                          groupName: 'nationality-3',
                          id: 200,
                          value: 'CH',
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
                    formInputData.props,
                    {
                      isFloatingLabel: true,
                      label: 'Bürgerort',
                      name: 'place_of_citizenship',
                      uuid: 'place_of_citizenship',
                      validation: {
                        isRequired: true,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-3',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'hide',
                        },
                      ]),
                    })),
                },
              ],
            },
          ],
        },
      ],
    },
  },
  checkboxesNationality: {
    meta: {
      title: 'Checkboxes für Stepper mit Logik',
      desc: '',
    },
    props: {
      sectionTitle: 'Staatsangehörigkeit',
      groups: [
        {
          rows: [
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                    selectData.variants.default.props,
                    {
                      listData: _.merge({}, listDemoData.props, {
                        groupPostfix: 'nationality-x2',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'BE', label: 'Belgien', id: _.uniqueId('nationalityx') },
                          { value: 'DE', label: 'Deutschland', id: _.uniqueId('nationalityx') },
                          { value: 'FR', label: 'Frankreich', id: _.uniqueId('nationalityx') },
                          { value: 'LU', label: 'Luxemburg', id: _.uniqueId('nationalityx') },
                          { value: 'NL', label: 'Niederlande', id: _.uniqueId('nationalityx') },
                          { value: 'SWE', label: 'Schweden', id: _.uniqueId('nationalityx') },
                          { value: 'CH', label: 'Schweiz', id: _.uniqueId('nationalityx') },
                          { value: 'UK', label: 'Vereinigtes Königreich', id: _.uniqueId('nationalityx') },
                          { value: 'US', label: 'Vereinigte Staaten', id: _.uniqueId('nationalityx') },
                        ],
                      }),
                    })),
                },
              ],
            },
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Schweiz',
                          groupName: 'nationality-5',
                          id: 333,
                          value: 'CH',
                        })),
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Nicht Schweiz',
                          groupName: 'nationality-5',
                          id: 334,
                          value: 'none',
                        })),
                    ],
                  }),
                },
              ],
            },
            {
              fields: [
                {
                  isSmall: true,
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () => handlebars.compile(checkboxHBS)(_.merge({},
                        checkboxData.variants.default.props,
                        {
                          label: 'Sind sie Ausländer/in?',
                          groupName: 'nationality-33',
                          id: 808,
                          value: 'CH',
                        })),
                    ],
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
  },
  checkboxesNationality2: {
    meta: {
      title: 'Checkboxes für Stepper mit Logik (Für CZHDEV-1427)',
      desc: '',
    },
    props: {
      sectionTitle: 'Staatsangehörigkeit',
      groups: [
        {
          rows: [
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Schweiz',
                          groupName: 'nationality-50',
                          id: 444,
                          value: 'CH',
                        })),
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Nicht Schweiz',
                          groupName: 'nationality-50',
                          id: 445,
                          value: 'none',
                        })),
                    ],
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
  },
  placeOfCitizenshipPage: {
    meta: {
      title: 'Einzelnes Feld für Stepper mit Logik',
      desc: '',
    },
    props: {
      sectionTitle: 'Bürgerort',
      groups: [
        {
          rows: [
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                    formInputData.props,
                    {
                      isFloatingLabel: true,
                      label: 'Bürgerort',
                      name: 'place_of_citizenship2',
                      uuid: _.uniqueId('place_of_citizenship'),
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
  },
  placeOfCitizenshipPage2: {
    meta: {
      title: 'Einzelnes Feld für Stepper mit Logik',
      desc: '',
    },
    props: {
      sectionTitle: 'Bürgerort',
      groups: [
        {
          rows: [
            {
              fields: [
                {
                  cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                    formInputData.props,
                    {
                      isFloatingLabel: true,
                      label: 'Bürgerort',
                      name: 'place_of_citizenship10',
                      uuid: _.uniqueId('place_of_citizenship'),
                      validation: {
                        isRequired: true,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-50',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
                    })),
                },
              ],
            },
          ],
        },
      ],
    },
  },
  steuerBuch: {
    meta: {
      title: 'Steuerbuch (Flex Data CZHDEV-1234)',
      desc: 'Flex Data Steuerbuch',
    },
    props: {
      sectionTitle: 'Suche im Zürcher Steuerbuch',
      groups: [{
        rows: [
          {
            fields: [
              {
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'Stichwort oder ZStB-Nr.',
                    name: 'query_string',
                    uuid: 'query_string',
                  })),
              },
            ],
          },
          {
            fields: [{
              cellContent: () => handlebars.compile(drillDownSelectHBS)(_.merge({},
                drillDownSelectData.variants.default.props, {
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
                })),
            }],
            unwrapped: true,
          },
        ],
      },
      ],
    },
  },
  zhlex: {
    meta: {
      title: 'ZH-Lex (CZHDEV-1240)',
      desc: 'Flex Data ZH-Lex',
    },
    props: {
      sectionTitle: 'Suche',
      groups: [{
        rows: [{
          fields: [{
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Erlasstitel',
                name: 'erlasstitel',
                uuid: 'erlasstitel',
              })),
          }],
        }, {
          fields: [{
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Ordnungsnummer',
                name: 'ordnungsnummer',
                uuid: 'ordnungsnummer',
              })),
          }, {
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Stichwort',
                name: 'stichwort',
                uuid: 'stichwort',
              })),
          }],
        }],
      }],
    },
  },
  zhlexExtended: {
    meta: {
      title: 'ZH-Lex Loseblattsammlung (CZHDEV-1240)',
      desc: 'Flex Data ZH-Lex Erweiterte Suche Loseblattsammlung',
    },
    props: {
      sectionTitle: null,
      groups: [{
        rows: [{
          fields: [{
            cellContent: () => handlebars.compile(selectHBS)(_.merge({},
              selectData.variants.table.props,
              {})),
          }],
        }, {
          fields: [{
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Nachtrags-Nummer (LS)',
                name: 'nachtragsnummer',
                uuid: 'nachtragsnummer',
              })),
          }, {
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Publikationsnummer',
                name: 'publikationsnummer',
                uuid: 'publikationsnummer',
              })),
          }],
        }],
      }, {
        rows: [{
          fields: [{
            cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
              datepickerData.variants.dateRange.props,
              {
                label: 'Erlass',
                name: 'erlassdatum',
                uuid: 'erlassdatum',
                validation: {
                  pattern: '^\\d{2}.\\d{2}.\\d{4}\\s-\\s\\d{2}.\\d{2}.\\d{4}$',
                  isRequired: false,
                  errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
                },
              })),
          }, {
            cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
              datepickerData.variants.dateRange.props,
              {
                label: 'Inkraftsetzung',
                name: 'inkraftsetzungsdatum',
                uuid: 'inkraftsetzungsdatum',
                validation: {
                  pattern: '^\\d{2}.\\d{2}.\\d{4}\\s-\\s\\d{2}.\\d{2}.\\d{4}$',
                  isRequired: false,
                  errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
                },
              })),
          }],
        }, {
          fields: [{
            cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
              datepickerData.variants.dateRange.props,
              {
                label: 'Publikation',
                name: 'publikationsdatum',
                uuid: 'publikationsdatum',
                validation: {
                  pattern: '^\\d{2}.\\d{2}.\\d{4}\\s-\\s\\d{2}.\\d{2}.\\d{4}$',
                  isRequired: false,
                  errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
                },
              })),
          }, {
            cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
              datepickerData.variants.dateRange.props,
              {
                label: 'Aufhebung',
                name: 'aufhebungsdatum',
                uuid: 'aufhebungsdatum',
                validation: {
                  pattern: '^\\d{2}.\\d{2}.\\d{4}\\s-\\s\\d{2}.\\d{2}.\\d{4}$',
                  isRequired: false,
                  errorMsg: 'Bitte geben Sie eine korrekte Zeitspanne an.',
                },
              })),
          }],
        }],
      }],
    },
  },
  hierarchicalRules: {
    meta: {
      title: 'Hierarchische Regeln',
      desc: '',
    },
    props: {
      sectionTitle: 'Test',
      groups: [{
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () => handlebars.compile(formFieldsetHBS)({
                  fieldsetTitle: 'Feld 1',
                  requiredMessage: 'Option auswählen.',
                  options: [
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'Ja',
                        groupName: 'hr1',
                        id: 'hr1_1',
                        value: 'yes',
                        validation: {
                          isRequired: true,
                        },
                      })),
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'No',
                        groupName: 'hr1',
                        id: 'hr1_2',
                        value: 'no',
                        validation: {
                          isRequired: true,
                        },
                      })),
                  ],
                }),
              },
            ],
          },
          {
            fields: [
              {
                isSmall: true,
                cellContent: () => handlebars.compile(formFieldsetHBS)({
                  fieldsetTitle: 'Feld 2',
                  requiredMessage: 'Option auswählen.',
                  rules: JSON.stringify([
                    {
                      conditions: [
                        {
                          field: 'hr1',
                          equals: true,
                          value: 'yes',
                        },
                      ],
                      action: 'show',
                    },
                  ]),
                  options: [
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'Ja',
                        groupName: 'hr2',
                        id: 'hr2_1',
                        value: 'yes',
                        validation: {
                          isRequired: true,
                        },
                      })),
                    () => handlebars.compile(radioHBS)(_.merge({},
                      radioData.variants.default.props,
                      {
                        label: 'No',
                        groupName: 'hr2',
                        id: 'hr2_2',
                        value: 'no',
                        validation: {
                          isRequired: true,
                        },
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
                    isFloatingLabel: true,
                    label: 'InputFeld',
                    name: 'inputfeld',
                    uuid: 'inputfeld',
                    rules: JSON.stringify([
                      {
                        conditions: [
                          {
                            field: 'hr2',
                            equals: true,
                            value: 'yes',
                          },
                        ],
                        action: 'show',
                      },
                    ]),
                  })),
              },
            ],
          },
        ],
      }],
    },
  },
  rrb: {
    meta: {
      title: 'RRB (Flex data CZHDEV-1236)',
      desc: 'Flex Data Regierungsratsbeschlüsse',
    },
    props: {
      sectionTitle: null,
      groups: [{
        rows: [
          {
            fields: [
              {
                cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                  formInputData.variants.default.props,
                  {
                    isFloatingLabel: true,
                    label: 'Stichwort',
                    name: 'fullText',
                    uuid: 'fullText',
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
                    isFloatingLabel: true,
                    label: 'RRB-Nr.',
                    name: 'decisionNumber',
                    uuid: 'decisionNumber',
                  })),
              },
              {
                cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                  selectData.variants.default.props,
                  {
                    listData: _.merge({}, listDemoData.props, {
                      groupId: 'year',
                      isSingleSelect: true,
                      selectOptions: [
                        { value: '', label: '' },
                        { value: '2019', label: '2019'},
                        { value: '2018', label: '2018'},
                        { value: '2017', label: '2017'},
                        { value: '2016', label: '2016'},
                        { value: '2015', label: '2015'},
                        { value: '2014', label: '2014'},
                        { value: '2013', label: '2013'},
                        { value: '2012', label: '2012'},
                      ],
                    }),
                    triggerInputData: {
                      label: 'Jahr',
                      validation: {
                        isRequired: false,
                      },
                    },
                  })),
              },
            ],
          },
          {
            fields: [{
              cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                selectData.variants.default.props,
                {
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
                  }),
                  triggerInputData: {
                    label: 'Direktion',
                    validation: {
                      isRequired: false,
                    },
                  },
                })),
            }],
          },
        ],
      },
      ],
    },
  },
}, (variant) => {
  // eslint-disable
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'rows' || Array.isArray(variantValue)) {
      return variantValue;
    }
  }).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.mergeWith({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  }, (dataValue, variantValue, key) => {
    if (key === 'rows' || Array.isArray(variantValue)) {
      return variantValue;
    }
  });

  return variantData;
});


data.variants = variants;

module.exports = data;
