const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formVariants = require('../form/form.data').variants;
const notification = require('../../modules/notification/notification.data').variants;

const formFieldsetHBS = dataHelper.getFileContent('../form/_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../atoms/radiobutton/radiobutton.data');

const toggle = require('../../atoms/toggle/toggle.data').variants.default.props;

const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const formInput = require('../../atoms/form_input/form_input.data').variants.default.props;

const template = dataHelper.getFileContent('stepper.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Formularschritte',
    className: 'Stepper',
    jira: 'CZHDEV-850',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('stepper.md'),
  },
  props: {
    title: 'Formular mit Schritten',
    action: '/mocks/modules/form/form.json',
    confirmation: notification.formConfirmation.props,
    navigation: {
      steps: ['Persönliche Angaben', 'Berufliche Informationen, mit einem sehr langen Text, Hallo, Hallo, Hallo Hallo', 'Bestätigung'],
      contextMenu: null,
    },
    toggle,
    notificationTemplate: notification.default.meta.code.template,
    ruleNotification: _.merge({}, notification.closeUserGroup.props, {
      title: 'Wichtig',
      message: 'Die von Ihnen gemachte Änderung hat gegebenfalls Einfluss auf die danach folgenden Felder. Bitte überprüfen Sie Ihre Angaben erneut.',
      button: null,
    }),
    replyTo: _.merge({}, formInput, {
      type: 'email',
      label: 'Ihre E-Mail-Adresse',
      uuid: _.uniqueId('reply-to'),
      name: _.uniqueId('reply-to'),
      autofill: 'e_mail',
      validation: {
        isRequired: true,
        errorMsg: 'Bitte geben Sie eine gültige Mail an.',
      },
      isFloatingLabel: true,
      rules: JSON.stringify([
        {
          conditions: [
            {
              field: 'allowmailnotification',
              equals: true,
              value: 'true',
            },
          ],
          action: 'show',
        },
      ]),
    }),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      remark: false,
      steps: [
        formVariants.default.props,
        formVariants.careerInfo.props,
      ],
    },
  },
  smaller: {
    meta: {
      title: 'Default kleiner',
      desc: '',
    },
    props: {
      steps: [
        formVariants.phoneOnly.props,
        formVariants.defaultDuplicate.props,
      ],
    },
  },
  withoutNavigation: {
    meta: {
      title: 'Ohne Navigation',
      desc: 'Implementierung der Formularschritte',
    },
    props: {
      navigation: false,
      remark: '<p>Ihre Daten werden ausschliesslich für den hier ersichtlichen Zweck verwendet.</p><p>Siehe <a class="atm-text_link" href="https://czhdev.dev.one-inside.com/czhdev/develop/modules/stepper/stepper.html#">Datenschutzerklärung</a> und <a class="atm-text_link" href="https://czhdev.dev.one-inside.com/czhdev/develop/modules/stepper/stepper.html#">Nutzungsbedingungen</a>.</p>',
      steps: [
        formVariants.defaultDuplicate.props,
      ],
    },
  },
  serviceForm: {
    meta: {
      title: 'Service Form (CZHDEV-775)',
      desc: '',
    },
    props: {
      title: null,
      navigation: false,
      overlayId: 'serviceOverlay1',
      steps: [
        _.merge({}, formVariants.defaultDuplicate.props, { sectionTitle: null }),
      ],
    },
  },
  withSomeLogic: {
    meta: {
      title: 'Mit Formularlogik (CZHDEV-1181)',
      desc: 'Es gibt eine Formularlogik',
    },
    props: {
      steps: [
        formVariants.checkboxesNationality.props,
        _.merge({}, formVariants.placeOfCitizenshipPage.props),
        _.merge({}, formVariants.placeOfCitizenshipPage.props, {
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'nationality-5',
                  equals: true,
                  value: 'CH',
                },
              ],
              action: 'enable',
            },
          ]),
        }),
        _.merge({}, formVariants.placeOfCitizenshipPage.props, {
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'nationality-33',
                  equals: true,
                },
              ],
              action: 'disable',
            },
          ]),
        }),
      ],
      navigation: {
        steps: ['Staatsangehörigkeit', 'Bürgerort 1', 'Bürgerort 2', 'Bürgerort 3', 'Bestätigung'],
      },
    },
  },
  withEmptyStepAndlogic: {
    meta: {
      title: 'Mit Formularlogik &  leerem Abschnit',
      desc: 'Es gibt eine Formularlogik',
    },
    props: {
      steps: [
        formVariants.dummyStep2.props,
        formVariants.withRulesAlt.props,
      ],
      navigation: {
        steps: ['Schritt 1', 'Schritt 2'],
      },
      toggle: null,
      replyTo: null,
    },
  },
  logicForNotification: {
    meta: {
      title: 'Mit Formularlogik und Notification (CZHDEV-1427)',
      desc: 'Es gibt eine Formularlogik',
    },
    props: {
      steps: [
        formVariants.checkboxesNationality2.props,
        _.merge({}, formVariants.placeOfCitizenshipPage2.props, {
        }),
      ],
      navigation: {
        steps: ['Staatsangehörigkeit', 'Bürgerort 1', 'Bestätigung'],
      },
    },
  },
  withALotSteps: {
    meta: {
      title: 'Mit 7 Schritten (CZHDEV-1630)',
      desc: 'Formular 7 Schritten (Edge-Case)',
    },
    props: {
      steps: [
        formVariants.dummyStep1.props,
        formVariants.dummyStep2.props,
        formVariants.dummyStep3.props,
        formVariants.dummyStep4.props,
        formVariants.dummyStep5.props,
        formVariants.dummyStep6.props,
        formVariants.dummyStep7.props,
      ],
      navigation: {
        steps: ['Schritt 1', 'Schritt 2', 'Schritt 3', 'Schritt 4', 'Schritt 5', 'Schritt 6', 'Schritt 7', 'Bestätigung'],
        contextMenuBefore: {
          domSelector: 'data-stepper_navigation="contextMenu"',
          lists: [
            {
              items: [
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 1', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 2', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 3', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 4', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 5', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 6', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 7', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Bestätigung', iconAfter: false, iconBefore: false,
                }),
              ],
            },
          ],
        },
        contextMenuAfter: {
          domSelector: 'data-stepper_navigation="contextMenu"',
          lists: [
            {
              items: [
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 1',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 2',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 3',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 4',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 5',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 6',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 7',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Bestätigung',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
              ],
            },
          ],
        },
      },
    },
  },
  withALotStepsAndRules: {
    meta: {
      title: 'Mit 7 Schritten und Formularregeln (CZHDEV-1630)',
      desc: 'Formular 7 Schritten und einer Formularregelweiche in Schritt 4 (Edge-Case)',
    },
    props: {
      steps: [
        formVariants.dummyStep1.props,
        formVariants.dummyStep2.props,
        formVariants.dummyStep3.props,
        formVariants.checkboxesNationality3.props,
        formVariants.dummyStep5.props,
        _.merge({}, formVariants.dummyStep7WithRules.props, {
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'nationality-100',
                  equals: true,
                  value: 'CH',
                },
              ],
              action: 'enable',
            },
          ]),
        }),
        formVariants.dummyStep6.props,
      ],
      navigation: {
        steps: ['Schritt 1', 'Schritt 2', 'Schritt 3', 'Schritt 4', 'Schritt 5', 'Schritt 6', 'Schritt 7', 'Bestätigung'],
        contextMenuBefore: {
          domSelector: 'data-stepper_navigation="contextMenu"',
          lists: [
            {
              items: [
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 1', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 2', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 3', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 4', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 5', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 6', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Schritt 7', iconAfter: false, iconBefore: false,
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true, text: 'Bestätigung', iconAfter: false, iconBefore: false,
                }),
              ],
            },
          ],
        },
        contextMenuAfter: {
          domSelector: 'data-stepper_navigation="contextMenu"',
          lists: [
            {
              items: [
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 1',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 2',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 3',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 4',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 5',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 6',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Schritt 7',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
                _.merge({}, contextMenuItemDef, {
                  isButton: true,
                  text: 'Bestätigung',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'disabled="disabled"',
                }),
              ],
            },
          ],
        },
      },
    },
  },
  requestForm: {
    meta: {
      title: 'Antragsformular Testfall',
      desc: '',
    },
    props: {
      steps: [
        formVariants.personType.props,
        _.merge({}, formVariants.personType2.props, {
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'pType',
                  equals: true,
                  value: 'dritt',
                },
              ],
              action: 'enable',
            },
          ]),
        }),
        formVariants.dummyStep1.props,
      ],
      navigation: {
        steps: ['Bestellung', 'Gegenstand der Bestellung', 'Wrapup', 'Bestätigung'],
      },
    },
  },
  duplicateUpload: {
    meta: {
      title: 'Upload (duplizierbar)',
      desc: '',
    },
    props: {
      steps: [
        formVariants.duplicationUpload.props,
        formVariants.dummyStep1.props,
      ],
    },
  },
  nestedRules: {
    meta: {
      title: 'Mehrstufige Regeln',
      desc: '',
    },
    props: {
      steps: [
        {
          groups: [
            {
              rows: [
                {
                  fields: [
                    {
                      cellContent: () => handlebars.compile(formFieldsetHBS)({
                        fieldsetTitle: '1',
                        options: [
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'A',
                              groupName: 'abType',
                              id: 'abType_1',
                              value: 'a',
                            })),
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'B',
                              groupName: 'abType',
                              id: 'abType_2',
                              value: 'b',
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
        _.merge({}, formVariants.dummyStep1.props, {
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'abType',
                  equals: true,
                  value: 'b',
                },
              ],
              action: 'enable',
            },
          ]),
        }),
      ],
      navigation: {
        steps: ['Schritt', 'Abhängiger Schritt', 'Bestätigung'],
      },
    },
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
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
