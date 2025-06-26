// eslint-disable no-magic-numbers

const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formInputHBS = dataHelper.getFileContent('../../atoms/form_input/form_input.hbs');
const formInputData = require('../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('./_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../atoms/radiobutton/radiobutton.data');

const selectHBS = dataHelper.getFileContent('../select/select.hbs');
const selectData = require('../select/select.data');

const fileUploadHBS = dataHelper.getFileContent('../file_upload/file_upload.hbs');
const fileUploadData = require('../file_upload/file_upload.data');

const datepickerHBS = dataHelper.getFileContent('../datepicker/datepicker.hbs');
const datepickerData = require('../datepicker/datepicker.data');

// variants
const phoneOnly = require('./variants/phoneOnly.form.variant');
const taxLegal = require('./variants/taxLegal.form.variant.js');
const taxEntity = require('./variants/taxEntity.form.variant.js');
const measurePolicyArea = require('./variants/measurePolicyArea.form.variant.js');
const measureStatus = require('./variants/measureStatus.form.variant.js');
const measureResponsibleBodies = require('./variants/measureResponsibleBodies.form.variant.js');
const bildungsstufen = require('./variants/bildungsstufen.form.variant.js');
const bildungsbereich = require('./variants/bildungsbereich.form.variant.js');
const bildungsbereichMittelschulen = require('./variants/bildungsbereichMittelschulen.form.variant.js');
const bildungsbereichTertiäreBerufsbildung = require('./variants/bildungsbereichTertiäreBerufsbildung.form.variant.js');
const raumbezug = require('./variants/raumbezug.form.variant.js');
const inhalteDerErhebung = require('./variants/inhalteDerErhebung.form.variant.js');
const auswertungen = require('./variants/auswertungen.form.variant.js');
const careerInfo = require('./variants/careerInfo.form.variant.js');
const defaultDuplicate = require('./variants/defaultDuplicate.form.variant.js');
const withRules = require('./variants/withRules.form.variant.js');
const withRulesAlt = require('./variants/withRulesAlt.form.variant.js');
const checkboxesNationality = require('./variants/checkboxesNationality.form.variant.js');
const checkboxesNationality2 = require('./variants/checkboxesNationality2.form.variant.js');
const checkboxesNationality3 = require('./variants/checkboxesNationality3.form.variant.js');
const placeOfCitizenshipPage = require('./variants/placeOfCitizenshipPage.form.variant.js');
const placeOfCitizenshipPage2 = require('./variants/placeOfCitizenshipPage2.form.variant.js');
const steuerBuch = require('./variants/steuerBuch.form.variant.js');
const zhlex = require('./variants/zhlex.form.variant.js');
const zhlexLS = require('./variants/zhlexLS.form.variant.js');
const zhlexOS = require('./variants/zhlexOS.form.variant.js');
const hierarchicalRules = require('./variants/hierarchicalRules.form.variant.js');
const rrb = require('./variants/rrb.form.variant.js');
const socialCareHandbook = require('./variants/socialCareHandbook.form.variant.js');
const eDirectory = require('./variants/eDirectory.form.variant.js');
const dummyStep1 = require('./variants/dummyStep1.form.variant.js');
const dummyStep2 = require('./variants/dummyStep2.form.variant.js');
const dummyStep3 = require('./variants/dummyStep3.form.variant.js');
const dummyStep4 = require('./variants/dummyStep4.form.variant.js');
const dummyStep5 = require('./variants/dummyStep5.form.variant.js');
const dummyStep6 = require('./variants/dummyStep6.form.variant.js');
const dummyStep7 = require('./variants/dummyStep7.form.variant.js');
const dummyStep7WithRules = require('./variants/dummyStep7WithRules.form.variant.js');
const decisions = require('./variants/decisions.form.variant.js');
const veryComplicated = require('./variants/veryComplicated.form.variant.js');
const personType = require('./variants/personType.form.variant.js');
const personType2 = require('./variants/personType2.form.variant.js');
const alternativeSelection = require('./variants/alternativeSelection.form.variant.js');
const duplicationUpload = require('./variants/duplicationUpload.form.variant.js');
const valueCompare = require('./variants/valueCompare.form.variant.js');
const dateCompare = require('./variants/dateCompare.form.variant.js');
const ageCompare = require('./variants/ageCompare.form.variant.js');
const simpleMultiUpload = require('./variants/simpleMultiUpload.form.variant.js');
const newsletter = require('./variants/newsletter.form.variant.js');

const zipData = require('./zip-city.js');

const duplicateGroup = {
  isDuplicatable: true,
  maxDuplications: '1',
  duplicateLabels: {
    add: 'Weitere Staatsangehörigkeit hinzufügen',
    remove: 'Staatangehörigkeit wieder entfernen',
  },
  rows: [
    {
      fields: [
        {
          cellContent: () =>
            handlebars.compile(formInputHBS)(
              _.merge({}, formInputData.variants.default.props, {
                isFloatingLabel: true,
                label: 'Staatsangehörigkeit',
                name: 'nationality',
                uuid: 'nationality',
                describedBy: 'nationality__description',
                validation: {
                  isRequired: true,
                },
              })
            ),
          tooltipBefore: true,
          tooltip: {
            helptext: 'Info',
            descriptionId: 'nationality__description',
            buttonRight: true,
            bubble: {
              heading: 'Tooltip Ipsum',
              text: '<p>Ländernamen auf deutsch eingeben</p><ul><li>Part 1</li><li>Part 2<ul><li>AA</li><li>BB</li></ul></li><li>Part 3</li></ul><h4>Subtitle</h4><ol><li>A 1</li><li>A 2</li><li>A 3</li></ol><p>Weiterer Absatztext mit <a href="#">Link</a></p>',
              id: _.uniqueId('form-test'),
            },
          },
        },
      ],
    },
    {
      fields: [
        {
          cellContent: () =>
            handlebars.compile(fileUploadHBS)(
              _.merge({}, fileUploadData.variants.default.props, {
                validation: { isRequired: true },
              })
            ),
        },
      ],
    },
    {
      fields: [
        {
          isSmall: true,
          cellContent: () =>
            handlebars.compile(formInputHBS)(
              _.merge({}, formInputData.variants.default.props, {
                isFloatingLabel: true,
                label: 'PLZ',
                name: 'zip_place_of_birth',
                uuid: 'zip_place_of_birth',
                validation: {
                  isRequired: true,
                  pattern: '^[0-9]{4,4}$',
                  errorMsg: 'Bitte geben Sie eine gültige schweizerische Postleizahl an.',
                },
                zipCity: {
                  fills: 'place_of_birth',
                  data: JSON.stringify(zipData),
                },
              })
            ),
        },
        {
          cellContent: () =>
            handlebars.compile(formInputHBS)(
              _.merge({}, formInputData.variants.default.props, {
                isFloatingLabel: true,
                label: 'Geburtsort',
                name: 'place_of_birth',
                uuid: 'place_of_birth',
                isZipCityTarget: true,
                validation: {
                  isRequired: true,
                },
              })
            ),
          tooltip: {
            buttonLeft: true,
            bubble: {
              heading: 'Tooltip Ipsum',
              text: '<p>Ländernamen auf deutsch eingeben</p><ul><li>Part 1</li><li>Part 2<ul><li>AA</li><li>BB</li></ul></li><li>Part 3</li></ul><h4>Subtitle</h4><ol><li>A 1</li><li>A 2</li><li>A 3</li></ol><p>Weiterer Absatztext mit <a href="#">Link</a></p>',
              id: _.uniqueId('form-test'),
            },
          },
        },
      ],
    },
    {
      fields: [
        {
          isSmall: true,
          cellContent: () =>
            handlebars.compile(formFieldsetHBS)({
              fieldsetTitle: 'Checkboxen',
              options: [
                () =>
                  handlebars.compile(radioHBS)(
                    _.merge({}, radioData.variants.default.props, {
                      label: 'Wilde Wälder',
                      groupName: 'checkbox_in_duplication',
                      id: 'checkbox_1',
                      value: 'mrs',
                    })
                  ),
                () =>
                  handlebars.compile(radioHBS)(
                    _.merge({}, radioData.variants.default.props, {
                      label: 'Wasserfälle',
                      groupName: 'checkbox_in_duplication',
                      id: 'checkbox_2',
                      value: 'mr',
                    })
                  ),
                () =>
                  handlebars.compile(radioHBS)(
                    _.merge({}, radioData.variants.default.props, {
                      label: 'Beschauliche alpine Auen',
                      groupName: 'checkbox_in_duplication',
                      id: 'checkbox_3',
                      value: 'no',
                    })
                  ),
                () =>
                  handlebars.compile(radioHBS)(
                    _.merge({}, radioData.variants.default.props, {
                      label: 'Test Test',
                      groupName: 'checkbox_in_duplication',
                      id: 'checkbox_4',
                      value: 'no',
                    })
                  ),
              ],
            }),
        },
      ],
    },
    {
      fields: [
        {
          cellContent: () =>
            handlebars.compile(datepickerHBS)(
              _.merge({}, datepickerData.variants.defaultDate.props, {
                rules: JSON.stringify([
                  {
                    conditions: [
                      {
                        field: 'checkbox_in_duplication',
                        equals: true,
                        value: 'mr',
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
  duplicateButton: 'Weitere Staatsangehörigkeit hinzufügen',
};

const duplicateRow = {
  isDuplicatable: true,
  duplicateLabels: {
    add: 'Kind hinzufügen',
    remove: 'Kind wieder entfernen',
  },
  fields: [
    {
      cellContent: () =>
        handlebars.compile(formInputHBS)(
          _.merge({}, formInputData.variants.default.props, {
            isFloatingLabel: true,
            label: 'Vorname Kind',
            name: _.uniqueId('vornameKind'),
            uuid: _.uniqueId('vornameKind'),
          })
        ),
    },
  ],
};

const template = dataHelper.getFileContent('form.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'FormSection',
    className: 'FormSection',
    jira: 'CZHDEV-850',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('README.md'),
    wrapInForm: true,
  },
  props: {
    sectionTitle: 'Persönliche Angaben',
    headingLevel: 3,
    visualHeadingLevel: 3,
  },
});
const variants = _.mapValues(
  {
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
                    cellContent: () =>
                      handlebars.compile(formFieldsetHBS)({
                        fieldsetTitle: 'Anrede',
                        requiredMessage: 'Bitte geben Sie eine Anrede an.',
                        options: [
                          () =>
                            handlebars.compile(radioHBS)(
                              _.merge({}, radioData.variants.default.props, {
                                label: 'Frau',
                                groupName: 'salutation',
                                id: 1,
                                value: 'mrs',
                                validation: {
                                  isRequired: true,
                                },
                              })
                            ),
                          () =>
                            handlebars.compile(radioHBS)(
                              _.merge({}, radioData.variants.default.props, {
                                label: 'Herr',
                                groupName: 'salutation',
                                id: 2,
                                value: 'mr',
                                validation: {
                                  isRequired: true,
                                },
                              })
                            ),
                          () =>
                            handlebars.compile(radioHBS)(
                              _.merge({}, radioData.variants.default.props, {
                                label: 'Keine Angabe',
                                groupName: 'salutation',
                                id: 3,
                                value: 'no',
                                validation: {
                                  isRequired: true,
                                },
                              })
                            ),
                        ],
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
                          label: 'Vorname',
                          name: 'prename',
                          uuid: 'prename',
                          validation: {
                            isRequired: true,
                          },
                        })
                      ),
                  },
                  {
                    cellContent: () =>
                      handlebars.compile(formInputHBS)(
                        _.merge({}, formInputData.variants.default.props, {
                          isFloatingLabel: true,
                          label: 'Nachname',
                          name: 'surname',
                          uuid: 'surname',
                          validation: {
                            isRequired: true,
                          },
                        })
                      ),
                  },
                ],
              },
              {
                fields: [
                  {
                    cellContent: () => `
                    <div class="mdl-richtext">
                      <h3 class="atm-heading">Test titel</h3>
                      <p class="atm-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                      <ul>
                        <li>P, Helvetic Roman Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.</li>
                        <li>Koordinaten begegnen uns täglich. <ul>
                            <li>P, Helvetic Roman Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.</li>
                            <li>Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt.</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                    `,
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
                          label: 'E-Mail',
                          name: 'emailaddr',
                          uuid: 'emailaddr',
                          type: 'email',
                          validation: {
                            errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
                            inputRange:
                              '../../mocks/modules/form/form.validation.json?param={value}',
                            rangeErrorMsg: 'Diese E-Mail Adresse ist bei uns nicht registriert',
                          },
                        })
                      ),
                  },
                  {
                    cellContent: () =>
                      handlebars.compile(formInputHBS)(
                        _.merge({}, formInputData.variants.default.props, {
                          isFloatingLabel: true,
                          label: 'URL',
                          name: 'url_input',
                          uuid: 'url_input',
                          type: 'url',
                          validation: {
                            errorMsg: 'Bitte geben Sie eine gültige URL an.',
                          },
                        })
                      ),
                  },
                ],
              },
              {
                fields: [
                  {
                    isSmall: true,
                    cellContent: () =>
                      handlebars.compile(formInputHBS)(
                        _.merge({}, formInputData.variants.default.props, {
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
                            data: JSON.stringify(zipData),
                          },
                        })
                      ),
                  },
                  {
                    cellContent: () =>
                      handlebars.compile(formInputHBS)(
                        _.merge({}, formInputData.variants.default.props, {
                          isFloatingLabel: true,
                          label: 'Ort',
                          name: 'city',
                          uuid: 'city',
                          isZipCityTarget: true,
                          validation: {
                            isRequired: true,
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
                        _.merge({}, selectData.variants.multiSelect.props, {})
                      ),
                  },
                  {
                    cellContent: () =>
                      handlebars.compile(datepickerHBS)(
                        _.merge({}, datepickerData.variants.dateRange.props, {})
                      ),
                  },
                ],
              },
              {
                fields: [
                  {
                    cellContent: () =>
                      handlebars.compile(selectHBS)(
                        _.merge({}, selectData.variants.selectPhone.props, {})
                      ),
                  },
                ],
              },
              {
                fields: [
                  {
                    cellContent: () =>
                      handlebars.compile(datepickerHBS)(
                        _.merge({}, datepickerData.variants.dateAndTime.props, {})
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
                          label:
                            'Alternative E-Mail asdasd asda d weifjhewrfkj eahrjkherjkgs klerg',
                          name: 'altemailaddr',
                          uuid: 'altemailaddr',
                          type: 'email',
                          validation: {
                            isRequired: true,
                            errorMsg: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
                          },
                        })
                      ),
                  },
                ],
              },
              duplicateRow,
              {
                fields: [
                  {
                    cellContent: () =>
                      handlebars.compile(fileUploadHBS)(
                        _.merge({}, fileUploadData.variants.multiple.props, {
                          validation: {
                            maxSize: 26214400,
                            fileTypes:
                              'text/csv, image/gif, text/html, image/jpeg, application/pdf, image/png, image/tiff, application/rtf, image/svg+xml, text/plain, application/xml',
                            isRequired: true,
                          },
                        })
                      ),
                  },
                ],
              },
            ],
          },
          duplicateGroup,
        ],
      },
    },
    phoneOnly,
    taxLegal,
    taxEntity,
    measurePolicyArea,
    measureStatus,
    measureResponsibleBodies,
    bildungsstufen,
    bildungsbereich,
    bildungsbereichMittelschulen,
    bildungsbereichTertiäreBerufsbildung,
    raumbezug,
    inhalteDerErhebung,
    auswertungen,
    careerInfo,
    defaultDuplicate,
    withRules,
    withRulesAlt,
    checkboxesNationality,
    checkboxesNationality2,
    checkboxesNationality3,
    placeOfCitizenshipPage,
    placeOfCitizenshipPage2,
    steuerBuch,
    zhlex,
    zhlexLS,
    zhlexOS,
    hierarchicalRules,
    rrb,
    socialCareHandbook,
    eDirectory,
    dummyStep1,
    dummyStep2,
    dummyStep3,
    dummyStep4,
    dummyStep5,
    dummyStep6,
    dummyStep7,
    dummyStep7WithRules,
    decisions,
    veryComplicated,
    personType,
    personType2,
    alternativeSelection,
    duplicationUpload,
    valueCompare,
    dateCompare,
    ageCompare,
    simpleMultiUpload,
    newsletter,
  },
  (variant) => {
    // eslint-disable-next-line consistent-return
    const variantProps = _.mergeWith({}, data, variant, (_dataValue, variantValue, key) => {
      if (key === 'rows' || Array.isArray(variantValue)) {
        return variantValue;
      }
    }).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.mergeWith(
      {},
      data,
      variant,
      {
        meta: {
          demo: compiledVariant,

          code: {
            handlebars: dataHelper.getFormattedHandlebars(template),
            html: dataHelper.getFormattedHtml(compiledVariant()),
            data: dataHelper.getFormattedJson(variantProps),
          },
        },
      },
      (dataValue, variantValue, key) => {
        // eslint-disable-line consistent-return
        if (key === 'rows' || Array.isArray(variantValue)) {
          return variantValue;
        }
      }
    );

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
