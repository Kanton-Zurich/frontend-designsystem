const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defaultImageData = require('../image_figure/image_figure.data');
const defaultRichtextData = require('../richtext/richtext.data');
const defaultFormData = require('../form/form.data');
const defaultVideoData = require('../video/video.data');
const defaultContactEntryData = require('../contact_entry/contact_entry.data');

// Module für Weiterführende Informationen
const downloadListData = require('../download_list/download_list.data');
const linklistData = require('../linklist/linklist.data');
const tableData = require('../table/table.data');
const publicationTeaserData = require('../publication_teaser/publication_teaser.data');
const defaultCarouselData = require('../carousel/carousel.data');
const radioData = require('../../atoms/radiobutton/radiobutton.data');
const serviceListData = require('../service_list/service_list.data');

const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const formHBS = dataHelper.getFileContent('../form/form.hbs');
const formFieldsetHBS = dataHelper.getFileContent('../form/_form.fieldset.hbs');

const template = dataHelper.getFileContent('accordion.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Akkordeon',
    className: 'Accordion',
    jira: 'CZHDEV-109',
    label: 'Container',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    hasBackground: false,
    heading: {
      level: 2,
      visualLevel: 2,
      title: 'Akkordeon',
    },
    items: [],
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Standard-Implementation',
      },
      props: {
        items: [
          {
            title: 'Kurzer Akkordeontitel',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'acc_item_1',
            children: [
              {
                text: 'Wird ein Lernfahrgesuch erstmals eingereicht, muss der/die Gesuchsteller/in persönlich bei der Gemeindeverwaltung/Einwohnerkontrolle oder beim Strassenverkehrsamt vorsprechen und einen gültigen Identifikationsnachweis mit Foto (CH-Bürger: Identitätskarte/Pass, Ausländer: Originalausländerausweis) vorlegen. Für die erstmalige Identifikation wird beim Strassenverkehrsamt eine Gebühr von Fr. 20.-- erhoben. Sie haben bereits einmal ein Gesuch eingereicht oder sind bereits im Besitz eines Führerausweises im Kredikartenformat können Sie das Gesuch per Post oder am Schalter direkt einreichen (ohne Identifikationsbestätigung).',
              },
              {
                partial:
                  '<h4 class="atm-heading" id="2020466141">Empfehlung</h4><p class="atm-paragraph">Wenn Sie für eine Reise ein COVID-Zertifikat möchten, klären Sie dessen Ausstellung vor Testabnahme bei der Teststelle ab.</p>',
              },
            ],
          },
          {
            title: 'Kurzer Akkordeontitel 1',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'acc_item_1_1',
            children: [
              {
                partial: defaultCarouselData.variants.default.meta.demo,
              },
            ],
          },
          {
            title: 'Kurzer Akkordeontitel',
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
            title: 'Ein Akkordeon mit viel Inhalt und einem langen Titel für Testzwecke',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'acc_item_3',
            children: [
              {
                partial: defaultRichtextData.variants.default.meta.demo,
              },
            ],
          },
          {
            title: 'Ein Akkordeon mit Video',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'acc_item_4',
            children: [
              {
                partial: defaultVideoData.variants.withoutTitle.meta.demo,
              },
            ],
          },
          {
            title: 'Ein Akkordeon mit Downloadliste',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'acc_item_5',
            children: [
              {
                partial: downloadListData.variants.defaultWithoutTitleLast.meta.demo(),
              },
            ],
          },
        ],
      },
    },
    furtherInformation: {
      meta: {
        title: 'Weiterführende Informationen',
        desc: 'Das Akkordeon in der Variante "Weiterführende Informationen"',
      },
      props: {
        hasBackground: true,
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Weiterführende Informationen',
        },
        items: [
          {
            title: 'Merkblätter & Downloads',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'wi_item_1',
            children: [
              {
                partial: downloadListData.variants.defaultWithoutTitleLast.meta.demo(),
              },
            ],
          },
          {
            title: 'Weiterführende Links',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techname: 'wi_item_2',
            children: [
              {
                partial: linklistData.variants.noTitleLast.meta.demo(),
              },
            ],
          },
          {
            title: 'Rechtliche Grundlagen',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            techName: 'wi_item_3',
            children: [
              {
                partial: linklistData.variants.noTitleLast.meta.demo(),
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
        desc: 'Das Akkordeon in der Variante "Weiterführende Informationen"',
      },
      props: {
        hasBackground: true,
        singleMode: true,
        heading: {
          level: 2,
          visualLevel: 2,
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
    taxForms: {
      meta: {
        title: 'TaxCalc Initforms (CZHDEV-1238)',
        desc: 'Akkordeon mit Formular Feldern zur Ermittlung des Steuerrechners',
      },
      props: {
        heading: {
          title: false,
        },
        toggleAll: true,
        items: [
          {
            title: 'Für wen möchten Sie den Steuerbetrag berechnen?',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            subHead: 'Unternehmen, Vereine und Stiftungen',
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.taxEntity.props),
              },
            ],
          },
          {
            title: 'Was möchten Sie berechnen?',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            subHead: 'Steuerrückstellung',
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)({
                    sectionTitle: false,
                    groups: [
                      {
                        rows: [
                          {
                            fields: [
                              {
                                isSmall: true,
                                cellContent: () =>
                                  handlebars.compile(formFieldsetHBS)({
                                    fieldsetTitle: false,
                                    isVertical: true,
                                    requiredMessage: 'Bitte wählen Sie eine Option aus.',
                                    options: [
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'income_assets-individuals',
                                            groupName: 'taxType',
                                            label: 'Staats- & Gemeindesteuern',
                                            descr:
                                              'Berechnung Staats- und Gemeindesteuern, auch Sonderfälle.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-individuals"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'income_assets',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'federal-individuals',
                                            groupName: 'taxType',
                                            label: 'Direkte Bundessteuer',
                                            descr:
                                              'Berechnung Direkte Bundessteuer, auch Sonderfälle.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-individuals"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'federal',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'benefit_payments-individuals',
                                            groupName: 'taxType',
                                            label:
                                              'Staats- & Gemeindesteuern auf Kapitalleistungen',
                                            descr:
                                              'Berechnung der Staats- und Gemeindesteuern auf Kapitalleistungen aus Vorsorge.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-individuals"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'benefit_payments',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'benefit_payments_federal-individuals',
                                            groupName: 'taxType',
                                            label: 'Direkte Bundessteuer auf Kapitalleistungen',
                                            descr:
                                              'Berechnung der Direkten Bundessteuer auf Kapitalleistungen aus Vorsorge.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-individuals"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'benefit_payments_federal',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'inheritance-individuals',
                                            groupName: 'taxType',
                                            label: 'Erbschafts- & Schenkungssteuern',
                                            descr:
                                              'Berechnung Erbschafts- und Schenkungssteuern für natürliche Personen.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-individuals"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'inheritance',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'legal_simple-corporations',
                                            groupName: 'taxType',
                                            label: 'Steuerbetrag juristische Personen',
                                            descr:
                                              'Berechnen der Steuern, ausgehend vom steuerbaren Reingewinn und vom Kapital.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-corporations"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'legal_simple',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'legal_iterative-corporations',
                                            groupName: 'taxType',
                                            label: 'Steuerrückstellung juristische Personen',
                                            descr:
                                              'Berechnen der Steuern, ausgehend von Gewinn und Kapital vor Steuern, mit dem Zweck der Vornahme der Steuerrückstellung.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-corporations"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'legal_iterative',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'legal_simple-associations',
                                            groupName: 'taxType',
                                            label: 'Steuerbetrag juristische Personen',
                                            descr:
                                              'Berechnen der Steuern, ausgehend vom steuerbaren Reingewinn und vom Kapital.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-associations"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'legal_simple',
                                          })
                                        ),
                                      () =>
                                        handlebars.compile(radioHBS)(
                                          _.merge({}, radioData.variants.default.props, {
                                            id: 'legal_iterative-associations',
                                            groupName: 'taxType',
                                            label: 'Steuerrückstellung juristische Personen',
                                            descr:
                                              'Berechnen der Steuern, ausgehend von Gewinn und Kapital vor Steuern, mit dem Zweck der Vornahme der Steuerrückstellung.',
                                            additionalAttribute:
                                              'data-tax_calc="inputTaxType-associations"',
                                            validation: {
                                              isRequired: true,
                                            },
                                            value: 'legal_iterative',
                                          })
                                        ),
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
    },
    singleItem: {
      meta: {
        title: 'Einzelelement (Entscheidungsbaum)',
        desc: 'Akkordeon für Entscheidungsbaum',
      },
      props: {
        heading: {
          title: false,
        },
        items: [
          {
            title: 'Warum stellen wir diese Frage?',
            subHead: ' ',
            children: [
              {
                partial: `<div class="mdl-richtext">
            <p class="atm-paragraph">
            Die Schweiz erlaubt das Doppelbürgerrecht. Bitte beachten Sie, dass es Staaten gibt, deren Bürgerinnen und Bürger mit dem Erwerb des Schweizer Bürgerrechts ihre Staatsangehörigkeit verlieren. Informieren Sie sich deshalb bitte bei der zuständigen Behörde Ihres Herkunftslandes.
            </p>
          </div>`,
              },
            ],
          },
        ],
      },
    },
    mediaContact: {
      meta: {
        title: 'Medienkontakt (CZHDEV-3295)',
        desc: 'Akkordeon für Medienkontakt',
      },
      props: {
        isInverted: true,
        isContact: true,
        heading: {
          title: false,
        },
        items: [
          {
            title: 'Medienkontakt',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: defaultContactEntryData.variants.revampedMedia.meta.demo(),
              },
            ],
          },
        ],
      },
    },
    multiContact: {
      meta: {
        title: 'Multi-Kontakt (CZHDEV-3295)',
        desc: 'Akkordeon für mehrere Kontaktadressen',
      },
      props: {
        isInverted: true,
        isContact: true,
        heading: {
          title: false,
        },
        items: [
          {
            title: 'Für allgemeine Fragen',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            additionalClass: 'mdl-accordion__item--open',
            children: [
              {
                partial: defaultContactEntryData.variants.revampedStandard.meta.demo(),
              },
            ],
          },
          {
            title: 'Für Fragen zu Schutzmassnahmen',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: defaultContactEntryData.variants.fullWidthLessData.meta.demo(),
              },
            ],
          },
          {
            title: 'Für Fragen zu Wasserbiologie und zur Wasserqualität',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: defaultContactEntryData.variants.revampedMedia.meta.demo(),
              },
            ],
          },
        ],
      },
    },
    serviceList: {
      meta: {
        title: 'Accordion mit Service Teasern',
      },
      props: {
        items: [
          {
            title: 'Accordion mit Teaser 1',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: serviceListData.variants.noHeading.meta.demo,
              },
            ],
          },
          {
            title: 'Accordion mit Teaser 2',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: serviceListData.variants.noHeading.meta.demo,
              },
            ],
          },
        ],
      },
    },
    tableOfContents: {
      meta: {
        title: 'Inhaltsverzeichnis (CZHDEV-3005)',
        desc: 'Akkordeon für das Inhaltsverzeichnis der Sozialhilfe',
      },
      props: {
        heading: {
          title: 'Inhaltsverzeichnis',
          level: 2,
          visualLevel: 2,
        },
        smallerHeadings: false,
        hasBackground: true,
        indented: true,
        storeOrigin: true,
        items: [
          {
            title: 'Link',
            titlePrefix: 'X',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
          },
          {
            title:
              'Akkordeontitel der über mehrere Zeilen gehen soll und dabei noch länger wird, um sicherzustellen, dass er definitiv umbricht und auf mehreren Zeilen dargestellt wird',
            titlePrefix: '0',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.numberedTOCLinkedSubheading.meta.demo,
              },
              {
                partial: linklistData.variants.numberedTOCLinkedSubheading.meta.demo,
              },
              {
                partial: linklistData.variants.numberedTOCLinkedSubheading.meta.demo,
              },
            ],
          },
          {
            title:
              'Link der über mehrere Zeilen gehen soll und dabei noch länger wird, um sicherzustellen, dass er definitiv umbricht und auf mehreren Zeilen dargestellt wird',
            titlePrefix: 'X',
            subHead: ' ',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
          },
          {
            title: 'Akkordeontitel Inhaltsverzeichnis Zwischenüberschriften nicht verlinkt',
            titlePrefix: '1',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.numberedTOCSubheading.meta.demo,
              },
              {
                partial: linklistData.variants.numberedTOCSubheading.meta.demo,
              },
            ],
          },
          {
            title: 'Organisation',
            titlePrefix: '2',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.numberedTOCLinkedSubheading.meta.demo,
              },
              {
                partial: linklistData.variants.numberedTOCLinkedSubheading.meta.demo,
              },
            ],
          },
          {
            title: 'Zuständigkeit',
            titlePrefix: '3',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.numberedTOCSubheading.meta.demo,
              },
              {
                partial: linklistData.variants.numberedTOCSubheading.meta.demo,
              },
            ],
          },
          {
            title: 'Persönliche Hilfe',
            titlePrefix: '4',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.numberedTOCLinkedSubheading.meta.demo,
              },
            ],
          },
        ],
      },
    },
    measureSearchForm: {
      meta: {
        title: 'Massnahmensuche (CZHDEV-3504)',
        desc: 'Erweiterte Suche für Massnahmen in der Regierungsplattform',
      },
      props: {
        heading: {
          title: false,
        },
        items: [
          {
            title: 'Politikbereich',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            additionalClass: 'mdl-accordion__item--open',
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.measurePolicyArea.props),
              },
            ],
          },
          {
            title: 'Status',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.measureStatus.props),
              },
            ],
          },
          {
            title: 'Zuständigkeit',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(
                    defaultFormData.variants.measureResponsibleBodies.props
                  ),
              },
            ],
          },
        ],
      },
    },
    statisticSearchForm: {
      meta: {
        title: 'Statistiksuche (CZHDEV-3504)',
        desc: 'Erweiterte Suche für Bildungsstatistiken in der Regierungsplattform',
      },
      props: {
        heading: {
          title: false,
        },
        items: [
          {
            title: 'Bildungsstufen',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            additionalClass: 'mdl-accordion__item--open',
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.bildungsstufen.props),
              },
            ],
          },
          {
            title: 'Bildungsbereich',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.bildungsbereich.props),
              },
            ],
          },
          {
            title: 'Bildungsbereich Mittelschulen',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(
                    defaultFormData.variants.bildungsbereichMittelschulen.props
                  ),
              },
            ],
          },
          {
            title: 'Bildungsbereich tertiäre Berufsbildung',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(
                    defaultFormData.variants.bildungsbereichTertiäreBerufsbildung.props
                  ),
              },
            ],
          },
          {
            title: 'Inhalte der Erhebung',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.inhalteDerErhebung.props),
              },
            ],
          },
          {
            title: 'Auswertung',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: () =>
                  handlebars.compile(formHBS)(defaultFormData.variants.auswertungen.props),
              },
            ],
          },
        ],
      },
    },
    eDirectoryExecutive: {
      meta: {
        title: 'Kapitel Inhaltsverzeichnis Behördenverzeichnis Exekutive',
        desc: 'Variante Inhaltsverzeichnis fürs Behördenverzeichnis',
      },
      props: {
        heading: {
          title: 'Exekutive',
          level: 3,
          visualLevel: 3,
          bordered: false,
        },
        smallerHeadings: false,
        hasBackground: false,
        indented: false,
        storeOrigin: true,
        items: [
          {
            title: 'Regierungsrat',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
          {
            title: 'Bezirke',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.eDirectoryAccordion.meta.demo(),
              },
            ],
          },
          {
            title: 'SelbständigeAnstaltenAlsEinEinzigesSuperlangesWort',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.eDirectoryAccordion.meta.demo(),
              },
            ],
          },
          {
            title: 'Gemeinden und einige zusätzliche Worte um den Umbruch zu testen',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
          {
            title: 'Kirchen und Religionsgemeinschaften hier noch mit extra langem Titel',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.eDirectoryAccordion.meta.demo(),
              },
            ],
          },
        ],
      },
    },
    eDirectoryLegislative: {
      meta: {
        title: 'Kapitel Inhaltsverzeichnis Behördenverzeichnis Legislative',
        desc: 'Variante Inhaltsverzeichnis fürs Behördenverzeichnis',
      },
      props: {
        heading: {
          title: 'Legislative',
          level: 3,
          visualLevel: 3,
        },
        hasBackground: false,
        indented: false,
        storeOrigin: true,
        items: [
          {
            title: 'Kantonsrat',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
        ],
      },
    },
    eDirectoryJudiciary: {
      meta: {
        title: 'Kapitel Inhaltsverzeichnis Behördenverzeichnis Judikative',
        desc: 'Variante Inhaltsverzeichnis fürs Behördenverzeichnis',
      },
      props: {
        heading: {
          title: 'Judikative',
          level: 3,
          visualLevel: 3,
          bordered: false,
        },
        hasBackground: false,
        indented: false,
        storeOrigin: true,
        items: [
          {
            title: 'Straf- und Zivilgerichte',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.eDirectoryAccordion.meta.demo(),
              },
            ],
          },
          {
            title: 'Verwaltungsgericht und erstintanzliche Spezialgerichte',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            children: [
              {
                partial: linklistData.variants.eDirectoryAccordion.meta.demo(),
              },
            ],
          },
          {
            title: 'Sozialversicherungsgericht',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
          {
            title: 'Notariate',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
          {
            title: 'Grundbuchamt',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
          {
            title: 'Konkursämter',
            accordionPanelID: _.uniqueId('accordionDemoId-'),
            isLink: true,
            ariaControls: 'service-modal-edirectory',
          },
        ],
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
