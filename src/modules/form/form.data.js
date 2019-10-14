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
  maxDuplications: 2,
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
                  cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
                    datepickerData.variants.dateRange.props,
                    {})),
                },
                {
                  cellContent: () => handlebars.compile(selectHBS)(_.merge({},
                    selectData.variants.multiSelect.props,
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
                  cellContent: () => handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Schweiz',
                          groupName: 'nationality-2',
                          id: 100,
                          value: 'CH',
                        })),
                      () => handlebars.compile(radioHBS)(_.merge({},
                        radioData.variants.default.props,
                        {
                          label: 'Nicht Schweiz',
                          groupName: 'nationality-2',
                          id: 102,
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
                              field: 'nationality-2',
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
  steuerBuch: {
    meta: {
      title: 'Steuerbuch (Flex data CZHDEV-1234)',
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
              cellContent: () => handlebars.compile(drillDownSelectHBS)(_.merge({},
                drillDownSelectData.props, {
                  // primary secondary
                  primarySelectData: {
                    triggerInputData: {
                      label: 'Thema',
                      name: 'primaryTopic',
                      uuid: 'primaryTopic',
                      validation: {
                        isRequired: true,
                      },
                    },
                  },
                  secondarySelectData: {
                    triggerInputData: {
                      label: 'Unterthema',
                      name: 'secondaryTopic',
                      uuid: 'secondaryTopic',
                      validation: {
                        isRequired: true,
                      },
                    },
                  },
                })),
            },],
            unwrapped: true,
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
