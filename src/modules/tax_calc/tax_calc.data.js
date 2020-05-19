const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const radioData = require('../../atoms/radiobutton/radiobutton.data');
const notificationApiFailProps = require('../../modules/notification/notification.data').variants.apiConnectionFailure.props;


const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const formHBS = dataHelper.getFileContent('../form/form.hbs');
const formFieldsetHBS = dataHelper.getFileContent('../form/_form.fieldset.hbs');

const template = dataHelper.getFileContent('tax_calc.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Steuerrechner',
    className: 'TaxCalc',
    jira: 'CZHDEV-1238',
    label: 'Applikation',
    documentation: dataHelper.getDocumentation('tax_calc.md'),
  },
  props: {
    apiBase: 'https://int-webcalc.services.zh.ch/ZH-Web-Calculators/calculators/',
    beforeBlock: {
      heading: 'Bevor Sie starten',
      benefitItems: [
        'Die berechneten Werte sind nicht rechtsverbindlich.',
        'In einzelnen Gemeinden können allenfalls abweichende Steuerfüsse zur Anwendung kommen. Für die Steuerzahlung ist einzig der Betrag auf der Steuerrechnung massgebend.',
        'Die Übermittlung der Daten erfolgt verschlüsselt und die Daten werden unmittelbar nach der Berechnung wieder gelöscht.',
        'Die Daten werden für keine weiteren Auswertungen verwendet.',
      ],
    },
    formBlock: {
      heading: 'Steuerbetrag berechnen',
      accordionData: {
        accordionHeading: {
          title: false,
          level: 3,
        },
        toggleAll: true,
        items: [{
          title: 'Für wen möchten Sie den Steuerbetrag berechnen?',
          subHead: '{value-reserve}',
          additionalClass: 'mdl-tax_calc__form-block_item',
          children: [
            {
              partial: () => handlebars.compile(formHBS)({
                sectionTitle: false,
                groups: [{
                  rows: [
                    {
                      fields: [
                        {
                          isSmall: true,
                          cellContent: () => handlebars.compile(formFieldsetHBS)({
                            fieldsetTitle: 'Für wen möchten Sie den Steuerbetrag berechnen.',
                            isFieldsetTitleHidden: true,
                            isVertical: true,
                            requiredMessage: 'Bitte wählen Sie eine Option aus.',
                            options: [
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'privatperson',
                                  groupName: 'taxEntity',
                                  label: 'Natürliche Personen',
                                  descr: 'Berechnen von Bundes-, Staats- und Gemeindesteuerbetrag, Steuerbetrag auf Kapitalleistungen aus Vorsorge sowie Erbschafts- und Schenkungssteuer',
                                  isChecked: false,
                                  additionalAttribute: 'data-tax_calc="inputEntity"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'individual',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'incorp',
                                  groupName: 'taxEntity',
                                  label: 'Juristische Personen',
                                  descr: 'Berechnen des Steuerbetrag und/ oder der Steuerrückstellung für ordentlich besteuerte Gesellschaften und Genossenschaften',
                                  additionalAttribute: 'data-tax_calc="inputEntity"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'incorp',
                                })),
                            ],
                          }),
                        },
                      ],
                    },
                  ],
                },
                ],
              }),
            },
          ],
        }, {
          title: 'Was möchten Sie berechnen?',
          subHead: '{value-reserve}',
          additionalClass: 'mdl-tax_calc__form-block_item',
          children: [
            {
              partial: () => handlebars.compile(formHBS)({
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
                                  id: 'income_assets',
                                  groupName: 'taxType',
                                  label: 'Staats- & Gemeindesteuern',
                                  descr: 'Berechnung Staats- und Gemeindesteuern, auch Sonderfälle.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-individual"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'income_assets',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'federal',
                                  groupName: 'taxType',
                                  label: 'Direkte Bundessteuer',
                                  descr: 'Berechnung Direkte Bundessteuer, auch Sonderfälle.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-individual"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'federal',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'benefit_payments',
                                  groupName: 'taxType',
                                  label: 'Staats- & Gemeindesteuern auf Kapitalleistungen',
                                  descr: 'Berechnung der Staats- und Gemeindesteuern auf Kapitalleistungen aus Vorsorge.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-individual"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'benefit_payments',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'benefit_payments_federal',
                                  groupName: 'taxType',
                                  label: 'Direkte Bundessteuer auf Kapitalleistungen',
                                  descr: 'Berechnung der Direkten Bundessteuer auf Kapitalleistungen aus Vorsorge.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-individual"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'benefit_payments_federal',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'inheritance',
                                  groupName: 'taxType',
                                  label: 'Erbschafts- & Schenkungssteuern',
                                  descr: 'Berechnung Erbschafts- und Schenkungssteuern für natürliche Personen.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-individual"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'inheritance',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'legal_simple',
                                  groupName: 'taxType',
                                  label: 'Steuerbetrag juristische Personen',
                                  descr: 'Berechnen der Steuern, ausgehend vom steuerbaren Reingewinn und vom Kapital.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-incorp"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'legal_simple',
                                })),
                              () => handlebars.compile(radioHBS)(_.merge({},
                                radioData.variants.default.props,
                                {
                                  id: 'legal_iterative',
                                  groupName: 'taxType',
                                  label: 'Steuerrückstellung juristische Personen',
                                  descr: 'Berechnen der Steuern, ausgehend von Gewinn und Kapital vor Steuern, mit dem Zweck der Vornahme der Steuerrückstellung.',
                                  additionalAttribute: 'data-tax_calc="inputTaxType-incorp"',
                                  validation: {
                                    isRequired: true,
                                  },
                                  value: 'legal_iterative',
                                })),
                            ],
                          }),
                        },
                      ],
                    },
                  ],
                },
                ],
              }),
            },
          ],
        },
        ],
      },
      nextBtn: {
        nextText: 'Weiter',
        calculateText: 'Berechnen',
        additionalAttribute: 'data-tax_calc="nextBtn"',
      },
    },
    resultBlock: {
      heading: 'Ihr Ergebnis - Provisorische Berechnung',
    },
    requiredMessages: {
      number: 'Für die Berechnung ist hier eine Eingabe erforderlich.',
      list: 'Bitte wählen Sie eine Option.',
      boolean: 'Bitte auswählen.',
    },
    errorMessages: {
      number: 'Ungültige Zahleneingabe',
      date: 'Bitte im Format TT.MM. eingeben',
      outOfBounds: 'Zahl ausserhalb des zulässigen Rahmens',
    },
    serviceFailNotificationData: notificationApiFailProps,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
