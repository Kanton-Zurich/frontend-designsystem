const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defaultImageData = require('../image_figure/image_figure.data');
const defaultRichtextData = require('../richtext/richtext.data');
const defaultFormData = require('../form/form.data');
const defaultVideoData = require('../video/video.data');

// Module für Weiterführende Informationen
const downloadListData = require('../download_list/download_list.data');
const linklistData = require('../linklist/linklist.data');
const tableData = require('../table/table.data');
const publicationTeaserData = require('../publication_teaser/publication_teaser.data');
const radioData = require('../../atoms/radiobutton/radiobutton.data');

const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const formHBS = dataHelper.getFileContent('../form/form.hbs');
const formFieldsetHBS = dataHelper.getFileContent('../form/_form.fieldset.hbs');

const template = dataHelper.getFileContent('accordion.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Accordion',
    className: 'Accordion',
    jira: 'CZHDEV-109',
    label: 'Container',
    documentation: dataHelper.getDocumentation('accordion.md'),
  },
  props: {
    isInverted: false,
    accordionHeading: {
      level: 2,
      title: 'Accordion',
    },
    items: [],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      items: [
        {
          title: 'Kurzer Accordiontitel',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'acc_item_1',
          children: [
            {
              text: 'Wird ein Lernfahrgesuch erstmals eingereicht, muss der/die Gesuchsteller/in persönlich bei der Gemeindeverwaltung/Einwohnerkontrolle oder beim Strassenverkehrsamt vorsprechen und einen gültigen Identifikationsnachweis mit Foto (CH-Bürger: Identitätskarte/Pass, Ausländer: Originalausländerausweis) vorlegen. Für die erstmalige Identifikation wird beim Strassenverkehrsamt eine Gebühr von Fr. 20.-- erhoben. Sie haben bereits einmal ein Gesuch eingereicht oder sind bereits im Besitz eines Führerausweises im Kredikartenformat können Sie das Gesuch per Post oder am Schalter direkt einreichen (ohne Identifikationsbestätigung).',
            },
          ],
        },
        {
          title: 'Kurzer Accordiontitel',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'acc_item_2',
          children: [
            {
              text: 'Wird ein Lernfahrgesuch erstmals eingereicht, muss der/die Gesuchsteller/in persönlich bei der Gemeindeverwaltung/Einwohnerkontrolle oder beim Strassenverkehrsamt vorsprechen und einen gültigen Identifikationsnachweis mit Foto (CH-Bürger: Identitätskarte/Pass, Ausländer: Originalausländerausweis) vorlegen. Für die erstmalige Identifikation wird beim Strassenverkehrsamt eine Gebühr von Fr. 20.-- erhoben. Sie haben bereits einmal ein Gesuch eingereicht oder sind bereits im Besitz eines Führerausweises im Kredikartenformat können Sie das Gesuch per Post oder am Schalter direkt einreichen (ohne Identifikationsbestätigung).',
            },
            {
              partial: defaultImageData.variants.default.meta.demo,
            },
          ],
        },
        {
          title: 'Ein Accordion mit viel Inhalt und einem langen Titel für Testzwecke',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'acc_item_3',
          children: [
            {
              partial: defaultRichtextData.variants.default.meta.demo,
            },
          ],
        },
        {
          title: 'Ein Accordion mit Video',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'acc_item_4',
          children: [
            {
              partial: defaultVideoData.variants.withoutTitle.meta.demo,
            },
          ],
        },
      ],
    },
  },
  furtherInformation: {
    meta: {
      title: 'Weiterführende Informationen',
      desc: 'Das Accordion in der Variante "Weiterführende Informationen"',
    },
    props: {
      isInverted: true,
      accordionHeading: {
        level: 2,
        title: 'Weiterführende Informationen',
      },
      items: [
        {
          title: 'Merkblätter & Downloads',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'wi_item_1',
          children: [
            {
              partial: downloadListData.variants.defaultWithoutTitle.meta.demo(),
            },
          ],
        },
        {
          title: 'Weiterführende Links',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techname: 'wi_item_2',
          children: [
            {
              partial: linklistData.variants.noTitle.meta.demo(),
            },
          ],
        },
        {
          title: 'Rechtliche Grundlagen',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'wi_item_3',
          children: [
            {
              partial: downloadListData.variants.legalFoundationDownloadListNoTitle.meta.demo(),
            },
          ],
        },
        {
          title: 'Daten & Statistiken',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'wi_item_4',
          children: [
            {
              text: 'Das ist ein Beispieltext für die Komponente "Weiterführende Informationen".',
            },
            {
              partial: defaultImageData.variants.default.meta.demo,
            },
            {
              partial: tableData.variants.default.meta.demo,
            },
            {
              partial: publicationTeaserData.variants.default.meta.demo,
            },
          ],
        },
      ],
    },
  },
  furtherInformationSingle: {
    meta: {
      title: 'Weiterführende Informationen Einzeln',
      desc: 'Das Accordion in der Variante "Weiterführende Informationen"',
    },
    props: {
      isInverted: true,
      singleMode: true,
      accordionHeading: {
        level: 2,
        title: 'Weiterführende Informationen Einzeln',
      },
      items: [
        {
          title: 'Merkblätter & Downloads',
          accordionPanelID: _.uniqueId('accordionDemoId-'),
          techName: 'wi_item_1',
          children: [
            {
              partial: downloadListData.variants.defaultWithoutTitle.meta.demo(),
            },
          ],
        },
      ],
    },
  },
  h4: {
    meta: {
      title: 'Accordion mit H4-Titel',
      desc: 'Ein Standard-Accordion mit einem h4 als Titel',
    },
    props: {
      accordionHeading: {
        level: 4,
      },
    },
  },
  taxForms: {
    meta: {
      title: 'TaxCalc Initforms (CZHDEV-1238)',
      desc: 'Accordion mit Formular Feldern zur Ermittlung des Steuerrechners',
    },
    props: {
      accordionHeading: {
        title: false,
      },
      toggleAll: true,
      items: [{
        title: 'Für wen möchten Sie den Steuerbetrag berechnen?',
        accordionPanelID: _.uniqueId('accordionDemoId-'),
        subHead: 'Unternehmen, Vereine und Stiftungen',
        children: [
          {
            partial: () => handlebars.compile(formHBS)(defaultFormData.variants.taxEntity.props),
          },
        ],
      }, {
        title: 'Was möchten Sie berechnen?',
        accordionPanelID: _.uniqueId('accordionDemoId-'),
        subHead: 'Steuerrückstellung',
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
                                additionalAttribute: 'data-tax_calc="inputTaxTypeIndividual"',
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                id: 'federal',
                                groupName: 'taxType',
                                label: 'Direkte Bundessteuer',
                                descr: 'Berechnung Direkte Bundessteuer, auch Sonderfälle.',
                                additionalAttribute: 'data-tax_calc="inputTaxTypeIndividual"',
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                id: 'benefit_payments',
                                groupName: 'taxType',
                                label: 'Staats- & Gemeindesteuern auf Kapitalleistungen',
                                descr: 'Berechnung der Staats- und Gemeindesteuern auf Kapitalleistungen aus Vorsorge.',
                                additionalAttribute: 'data-tax_calc="inputTaxTypeIndividual"',
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                id: 'benefit_payments_federal',
                                groupName: 'taxType',
                                label: 'Direkte Bundessteuer auf Kapitalleistungen',
                                descr: 'Berechnung der Direkten Bundessteuer auf Kapitalleistungen aus Vorsorge.',
                                additionalAttribute: 'data-tax_calc="inputTaxTypeIndividual"',
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                id: 'inheritance',
                                groupName: 'taxType',
                                label: 'Erbschafts- & Schenkungssteuern',
                                descr: 'Berechnung Erbschafts- und Schenkungssteuern für natürliche Personen.',
                                additionalAttribute: 'data-tax_calc="inputTaxTypeIndividual"',
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                id: 'legal_simple',
                                groupName: 'taxType',
                                label: 'Steuerbetrag juristische Personen',
                                descr: 'Berechnen der Steuern, ausgehend vom steuerbaren Reingewinn und vom Kapital.',
                                additionalAttribute: 'data-tax_calc="inputTaxTypeInc"',
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                id: 'legal_iterative',
                                groupName: 'taxType',
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
            }),
          },
        ],
      }],
    },
  },
  zhLexExtendedSearch: {
    meta: {
      title: 'ZH-Lex Erweiterte Suche (CZHDEV-1238)',
      desc: 'Accordion mit Formularfeldern für die erweiterte Suche bei ZH-Lex',
    },
    props: {
      accordionHeading: {
        title: false,
      },
      items: [{
        title: 'Erweiterte Suche',
        subHead: 'Vorschau der Input-Felder',
        children: [{
          partial: () => handlebars.compile(formHBS)(defaultFormData.variants.zhlexExtended.props),
        }],
      }],
    },
  },
}, (variant) => {
  // eslint-disable-next-line consistent-return
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'items' || key === 'children') {
      return variantValue;
    }
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
