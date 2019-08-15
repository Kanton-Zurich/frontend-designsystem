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

const template = dataHelper.getFileContent('form.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'FormSection',
    className: 'FormSection',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('form.md'),
    hideFromListing: true,
  },
  props: {
    sectionTitle: 'Persönliche Angaben',
    rows: [
      [
        {
          isSmall: true,
          cellContent: () => handlebars.compile(formFieldsetHBS)({
            fieldsetTitle: 'Anrede',
            options: [
              () => handlebars.compile(radioHBS)(_.merge({},
                radioData.variants.default.props,
                {
                  label: 'Frau',
                  groupName: 'salutation',
                  id: 1,
                  value: 'mrs',
                })),
              () => handlebars.compile(radioHBS)(_.merge({},
                radioData.variants.default.props,
                {
                  label: 'Herr',
                  groupName: 'salutation',
                  id: 2,
                  value: 'mr',
                })),
              () => handlebars.compile(radioHBS)(_.merge({},
                radioData.variants.default.props,
                {
                  label: 'Keine Angabe',
                  groupName: 'salutation',
                  id: 3,
                  value: 'no',
                })),
            ],
          }),
        },
      ],
      [{
        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
          formInputData.variants.default.props,
          {
            isFloatingLabel: true,
            label: 'Vorname',
            name: 'prename',
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
            validation: {
              isRequired: true,
            },
          })),
      }],
      [{
        isSmall: true,
        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
          formInputData.variants.default.props,
          {
            isFloatingLabel: true,
            label: 'PLZ',
            name: 'zip',
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
            validation: {
              isRequired: true,
            },
          })),
      }],
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Persönliche Angaben',
      desc: 'Persönliche Angaben',
    },
  },
  careerInfo: {
    meta: {
      title: 'Berufliche Informationen',
      desc: 'Berufliche Informaitonen',
    },
    props: {
      sectionTitle: 'Berufliche Angaben',
      rows: [
        [
          {
            isSmall: true,
            cellContent: () => handlebars.compile(formFieldsetHBS)({
              fieldsetTitle: 'Auswahl',
              isVertical: true,
              options: [
                () => handlebars.compile(checkboxHBS)(_.merge({},
                  checkboxData.variants.default.props,
                  {
                    label: 'Option 1',
                    groupName: 'checkboxgroup',
                    id: 1,
                    value: '1',
                  })),
                () => handlebars.compile(checkboxHBS)(_.merge({},
                  checkboxData.variants.default.props,
                  {
                    label: 'Option 2',
                    groupName: 'checkboxgroup',
                    id: 2,
                    value: '2',
                  })),
                () => handlebars.compile(checkboxHBS)(_.merge({},
                  checkboxData.variants.default.props,
                  {
                    label: 'Option 2',
                    groupName: 'checkboxgroup',
                    id: 3,
                    value: '3',
                  })),
              ],
            }),
          },
        ],
        [
          {
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Aktuelle Berufsebezichnung',
                name: 'current_job',
                validation: {
                  isRequired: true,
                },
              })),
          },
        ],
        [
          {
            cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
              formInputData.variants.default.props,
              {
                isFloatingLabel: true,
                label: 'Berufslehre als',
                name: 'education_origin',
                validation: {
                  isRequired: true,
                },
              })),
          },
        ],
      ],
    },
  },
}, (variant) => {
  // eslint-disable-next-line
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'rows' || Array.isArray(variantValue)) { return variantValue; }
  }).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
