const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data');
const defContentNav = require('../content_nav/content_nav.data');
const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants
  .default.props;
const defImageFigureData = require('../image_figure/image_figure.data');
const defVideoData = require('../video/video.data');
const defBreadcrumbData = require('../breadcrumb/breadcrumb.data');
const defPersonCardData = require('../person_card/person_card.data').variants.default.props;
const logoData = require('../../atoms/logo/logo.data').variants;
const headerExpandData = require('../header_expand/header_expand.data').props;
const leadSectionData = require('../lead_section/lead_section.data').variants;

const template = dataHelper.getFileContent('page_header.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Seitenkopf',
    className: 'PageHeader',
    jira: 'CZHDEV-395',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Seitenkopf',
    logo: logoData.linked.props,
    pageTitle: 'H1: Pagetitle Black Strassenverkehrsamt',
    keyVisual: false,
    newsCategory: '',
    publicationDate: '',
  },
});

const variants = _.mapValues(
  {
    home: {
      meta: {
        title: 'Home',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        pageTitle: 'Kanton Zürich',
        anchorLinks: [
          {
            anchorlink: {
              anchorlinkText: 'eAutoindex',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
          {
            anchorlink: {
              anchorlinkText: 'Fahrzeugprüfung',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
          {
            anchorlink: {
              anchorlinkText: 'Drohnen und Flugmodelle',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
          {
            anchorlink: {
              anchorlinkText: 'Veloschulen',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
        ],
      },
    },
    topics: {
      meta: {
        title: 'Themenseite',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-turqoise',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        pageTitle: 'Erwerbstätigkeit von Ausländerinnen und Ausländern',
        contentNav: {
          anchorNavReference: 'ourtopics',
          items: [
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Autofahren lernen',
              buzzwords:
                'Voraussetzungen, Lernfahrausweis, Theorieprüfung, praktische Führerprüfung ',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Motorradfahren lernen',
              buzzwords: 'Motorrad- oder Mofa-Führerausweis:, Voraussetzungen, Prüfungen',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Weitere Fahrzeuge fahren lernen',
              buzzwords: 'Anhänger, Lastwagen, Bus, Taxi, Traktor, langsame Fahrzeuge und',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Führerausweis auf Probe',
              buzzwords:
                '«Grüner L»  Führerausweis: WAB-Kursangebote, wichtige Fristen, unbefristeter Ausweis',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Fahren im Alter',
              buzzwords:
                'Alterskontrolle, medizinische Anforderungen, anerkannte Ärztinnen und Ärzte finden',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Internationaler Führerschein',
              buzzwords: 'Länderliste, Informationen, Internationalen Führerschein bestellen',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Ausländischen Führerausweis ',
              buzzwords: 'Führerausweis verloren/kaputt',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Führerausweis verloren/kaputt',
              buzzwords: 'Ersatz beantragen',
            }),
          ],
        },
      },
    },
    topicsImage: {
      meta: {
        title: 'Themenseite mit Bild',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-turqoise',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        contentNav: defContentNav.variants.twoItems.props,
        keyVisual: true,
        imageData: defImageFigureData.variants.headerNoTitle.props,
      },
    },
    topicsVideo: {
      meta: {
        title: 'Themenseite mit Video',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-turqoise',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        contentNav: defContentNav.variants.oneItem.props,
        keyVisual: true,
        videoData: defVideoData.variants.header.props,
      },
    },
    department: {
      meta: {
        title: 'Direktionsseite mit Personenteaser',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        pageTitle: 'Sicherheitsdirektion',
        keyVisual: true,
        personCardData: defPersonCardData,
      },
    },
    office: {
      meta: {
        title: 'Amtsseite',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        pageTitle: 'Strassenverkehrsamt',
      },
    },
    allElements: {
      meta: {
        title: 'Alle Elemente',
        desc: 'Beispiel mit allen möglichen Elementen im Page Header. Kommt so auf keiner Seite vor.',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        anchorLinks: [
          {
            anchorlink: {
              anchorlinkText: 'eAutoindex',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
          {
            anchorlink: {
              anchorlinkText: 'Fahrzeugprüfung',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
          {
            anchorlink: {
              anchorlinkText: 'Drohnen und Flugmodelle',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
          {
            anchorlink: {
              anchorlinkText: 'Veloschulen',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: false,
            },
          },
        ],
        contentNav: defContentNav.variants.withPromotopic.props,
        leadSection: leadSectionData.reports.props,
        keyVisual: true,
        imageData: defImageFigureData.variants.headerNoTitle.props,
      },
    },
    newsDetail: {
      meta: {
        title: 'Newsseite',
        disabledColorVariations: [
          'cv-monochrome',
          'cv-turqoise',
          'cv-bordeaux',
          'cv-magenta',
          'cv-violet',
          'cv-green',
          'cv-darkblue',
          'cv-anthracite',
        ],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        breadcrumb: _.merge({}, defBreadcrumbData.variants.backOnly.props, {
          hasStorage: true,
        }),
      },
    },
    newsDetailImage: {
      meta: {
        title: 'Newsseite mit Bild',
        disabledColorVariations: [
          'cv-monochrome',
          'cv-turqoise',
          'cv-bordeaux',
          'cv-magenta',
          'cv-violet',
          'cv-green',
          'cv-darkblue',
          'cv-anthracite',
        ],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        breadcrumb: _.merge({}, defBreadcrumbData.variants.backOnly.props, {
          hasStorage: true,
        }),
        keyVisual: true,
        imageData: defImageFigureData.variants.header.props,
      },
    },
    reportsStart: {
      meta: {
        title: 'Berichte Einstieg',
      },
      props: {
        inverted: true,
        isReport: true,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        pageTitle: 'Gemeinde- und Wirksamkeitsbericht',
        leadSection: leadSectionData.default.props,
        hasImage: true,
        imageData: defImageFigureData.variants.moodImage.props,
      },
    },
    reportsChapter: {
      meta: {
        title: 'Berichte Kapitel',
      },
      props: {
        inverted: true,
        isReport: true,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        pageTitle: 'Gemeinde- und Wirksamkeitsbericht',
        leadSection: leadSectionData.reports.props,
        hasImage: true,
        imageData: defImageFigureData.variants.moodImage.props,
      },
    },
    facts: {
      meta: {
        title: 'Factsseite',
        desc: 'Default implementation',
        disabledColorVariations: [
          'cv-monochrome',
          'cv-turqoise',
          'cv-bordeaux',
          'cv-magenta',
          'cv-violet',
          'cv-green',
          'cv-darkblue',
          'cv-anthracite',
        ],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        breadcrumb: _.merge({}, defBreadcrumbData.variants.backOnly.props, {
          hasStorage: true,
        }),
      },
    },
    govPlatformStart: {
      meta: {
        title: 'Regierungsplattform Startseite (CZHDEV-3480)',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        pageTitle: 'Richtlinien der Regierungspolitik 2023-2027',
        isReport: true,
        inverted: true,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        logo: logoData.invertedLinked.props,
        leadSection: leadSectionData.govPlatformStart.props,
        hasImage: true,
        imageData: defImageFigureData.variants.moodImage.props,
      },
    },
    govPlatformPolicyArea: {
      meta: {
        title: 'Regierungsplattform Politikbereich (CZHDEV-3480)',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        pageTitle: 'Allgemeine Verwaltung',
        isReport: true,
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        hasImage: true,
        imageData: defImageFigureData.variants.moodImage.props,
      },
    },
    govPlatformPolicyAreaWithoutImage: {
      meta: {
        title: 'Regierungsplattform Politikbereich ohne Stimmungsbild (CZHDEV-3480)',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        pageTitle: 'Allgemeine Verwaltung',
        isReport: true,
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
      },
    },
    govPlatformObjective: {
      meta: {
        title: 'Regierungsplattform Ziel (CZHDEV-3492)',
      },
      props: {
        pageTitle:
          'Die Verwaltungsstrukturen sind besser an die Aufgabenerfüllung angepasst und die Qualität in den Querschnittsbereichen ist verbessert.',
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
      },
    },
    govPlatformMeasure: {
      meta: {
        title: 'Regierungsplattform Massnahme (CZHDEV-3492)',
      },
      props: {
        pageTitle:
          'Die Struktur der Leistungsgruppen des Kantons überprüfen, um die Aufgabenerfüllung, Kompetenzen und Verantwortung besser abzubilden.',
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
      },
    },
    error404: {
      meta: {
        title: 'Error 404: Nicht gefunden (CZHDEV-528)',
        desc: '',
        disabledColorVariations: [
          'cv-monochrome',
          'cv-turqoise',
          'cv-bordeaux',
          'cv-magenta',
          'cv-violet',
          'cv-green',
          'cv-darkblue',
          'cv-anthracite',
        ],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        pageTitle: 'Seite nicht gefunden',
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
      },
    },
    unavailable: {
      meta: {
        title: 'Error: Nicht erreichbar (CZHDEV-529)',
        desc: '',
        disabledColorVariations: [
          'cv-monochrome',
          'cv-turqoise',
          'cv-bordeaux',
          'cv-magenta',
          'cv-violet',
          'cv-green',
          'cv-darkblue',
          'cv-anthracite',
        ],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        breadcrumb: {
          contextMenu: false,
          path: [
            {
              title: 'Kanton Zürich',
              href: '#',
            },
          ],
        },
        pageTitle: 'Seite nicht erreichbar',
      },
    },
    serviceOverlay: {
      meta: {
        title: 'Service-Overlay',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        pageTitle: 'Führerausweis bestellen',
        inverted: true,
        logo: logoData.invertedLinked.props,
        hasCloseButton: true,
      },
    },
    servicePage: {
      meta: {
        title: 'Serviceseite',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-green',
      },
      props: {
        pageTitle: 'Führerausweis bestellen',
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
      },
    },
    servicePageSmall: {
      meta: {
        title: 'Service Seite klein (CZHDEV-468)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-green',
      },
      props: {
        pageTitle:
          'Internationalen Führerausweis bestellen Internationalen Führerausweis bestellen',
        inverted: true,
        minimal: true,
        hasCloseButton: true,
      },
    },
    application: {
      meta: {
        title: 'Applikation (CZHDEV-533)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        pageTitle: 'Applikation',
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
        headerExpandData,
      },
    },
    applicationStandalone: {
      meta: {
        title: 'Applikation Standalone (CZHDEV-533)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        pageTitle: 'Applikation',
        inverted: true,
        logo: logoData.invertedLinked.props,
        breadcrumb: defBreadcrumbData.variants.parentOnly.props,
      },
    },
    applicationModal: {
      meta: {
        title: 'Applikation Modal (CZHDEV-533)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        pageTitle: 'Applikation',
        inverted: true,
        logo: logoData.invertedLinked.props,
        hasCloseButton: true,
      },
    },
    applicationModalSmall: {
      meta: {
        title: 'Applikation Modal klein (CZHDEV-533)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        pageTitle: 'Applikation',
        inverted: true,
        minimal: true,
        hasCloseButton: true,
      },
    },
    steuerBuch: {
      meta: {
        title: 'Flex Data (Steuerbuch) (CZHDEV-1234)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        pageTitle: 'ZStB-Nr. 3.1',
        inverted: false,
        logo: logoData.invertedLinked.props,
        breadcrumb: _.merge({}, defBreadcrumbData.variants.backOnly.props, {
          hasStorage: true,
        }),
      },
    },
    rrbDetail: {
      meta: {
        title: 'Flex Data (RRB) (CZHDEV-1233)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
      },
      props: {
        pageTitle: 'Regierungsratsbeschluss Nr. 749/2018',
        inverted: false,
        logo: logoData.invertedLinked.props,
        breadcrumb: _.merge({}, defBreadcrumbData.variants.backOnly.props, {
          hasStorage: true,
        }),
      },
    },
    zhLexDetail: {
      meta: {
        title: 'Flex Data (ZHLEX) (CZHDEV-1233)',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
      },
      props: {
        pageTitle:
          'Vertrag zwischen den Ständen Zürich und Schwyz betreffend die Hafengüter bei Richterswil',
        inverted: false,
        logo: logoData.invertedLinked.props,
        breadcrumb: _.merge({}, defBreadcrumbData.variants.backOnly.props, {
          hasStorage: true,
        }),
      },
    },
    eDirectory: {
      meta: {
        title: 'Behördenverzeichnis-Overlay',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        isEDirectory: true,
        pageTitle: 'Behörde x (Maximalausprägung)',
        breadcrumb: defBreadcrumbData.variants.eDirectory.props,
        hasCloseButton: true,
        inverted: true,
      },
    },
    eDirectoryEmpty: {
      meta: {
        title: 'Behördenverzeichnis-Overlay',
        desc: '',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-darkblue',
      },
      props: {
        isEDirectory: true,
        pageTitle: '',
        breadcrumb: defBreadcrumbData.variants.eDirectory.props,
        hasCloseButton: true,
        inverted: true,
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
