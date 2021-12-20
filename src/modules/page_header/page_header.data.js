const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defImageFigureData = require('../image_figure/image_figure.data');
const defVideoData = require('../video/video.data');
const defServiceButtonData = require('../service_button/service_button.data').props;
const defBreadcrumbData = require('../breadcrumb/breadcrumb.data');
const backOnlyBreadcrumbData = require('../breadcrumb/breadcrumb.data').variants.singlePathItem.props;
const defPersonCardData = require('../person_card/person_card.data.js').variants.promo.props;


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
    homelink: '#',
    pageTitle: 'H1: Pagetitle Black Strassenverkehrsamt',
    leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    newsCategory: '',
    publicationDate: '',
    personCardData: defPersonCardData,
    expandNav: 'Navigation anzeigen',
    collapseNav: 'Navigation ausblenden',
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      breadcrumb: defBreadcrumbData.variants.default.props,
      buttonData: _.merge(defServiceButtonData, {
        buttonTitle: 'Formular beantragen',
        modalData: {modalId: 'service-modal0'}
      }),
    },
  },
  default2: {
    meta: {
      title: 'Default 2',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      breadcrumb: defBreadcrumbData.variants.default.props,
      newsCategory: 'Medienmitteilung',
      publicationDate: '08.01.2019',
    },
  },
  defaultImage: {
    meta: {
      title: 'Default mit Bild',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      breadcrumb: backOnlyBreadcrumbData,
      imageData: defImageFigureData.variants.header.props,
      hasImage: true,
      newsCategory: 'Medienmitteilung',
      publicationDate: '08.01.2019',
    },
  },
  colored: {
    meta: {
      title: 'Mit Farbe',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      inverted: true,
      buttonData: _.merge({}, defServiceButtonData, {isInverted: true, modalData: {modalId: 'service-modal1'}}),
      breadcrumb: defBreadcrumbData.variants.default.props,
    },
  },
  coloredAnchors: {
    meta: {
      title: 'Mit Farbe und Tags',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      inverted: true,
      buttonData: _.merge({}, defServiceButtonData, {isInverted: true, modalData: {modalId: 'service-modal2'}}),
      breadcrumb: defBreadcrumbData.variants.default.props,
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
  coloredImage: {
    meta: {
      title: 'Mit Farbe und Bild',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      imageData: defImageFigureData.variants.headerNoTitle.props,
      inverted: true,
      hasImage: true,
      breadcrumb: defBreadcrumbData.variants.default.props,
    },
  },
  coloredImageTitle: {
    meta: {
      title: 'Mit Farbe, Bild und Untertitel',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      imageData: defImageFigureData.variants.header.props,
      inverted: true,
      hasImageTitle: true,
      hasImage: true,
      breadcrumb: defBreadcrumbData.variants.default.props,
    },
  },
  coloredVideoTitle: {
    meta: {
      title: 'Mit Farbe, Video und Untertitel',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      videoData: defVideoData.variants.header.props,
      inverted: true,
      hasImageTitle: true,
      hasVideo: true,
      hasImage: true,
      buttonData: _.merge({}, defServiceButtonData),
      breadcrumb: defBreadcrumbData.variants.default.props,
    },
  },
  colorPeopleTeaser: {
    meta: {
      title: 'Mit Farbe und Personen Teaser',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      imageData: defImageFigureData.variants.headerNoTitle.props,
      inverted: true,
      breadcrumb: defBreadcrumbData.variants.default.props,
      hasImage: false,
      hasPersonCard: true,
    },
  },
  serviceModal: {
    meta: {
      title: 'Service Modal (CZHDEV-468)',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-green',
    },
    props: {
      pageTitle: 'Führerausweis bestellen',
      inverted: true,
      hasImageTitle: false,
      hasVideo: false,
      hasImage: false,
      noText: true,
      hasCloseButton: true,
    },
  },
  servicePage: {
    meta: {
      title: 'Service Stand alone (CZHDEV-468)',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-green',
    },
    props: {
      pageTitle: 'Führerausweis bestellen',
      inverted: true,
      hasImageTitle: false,
      hasVideo: false,
      hasImage: false,
      breadcrumb: defBreadcrumbData.variants.default.props,
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
      pageTitle: 'Internationalen Führerausweis bestellen',
      inverted: true,
      hasImageTitle: false,
      hasVideo: false,
      hasImage: false,
      noText: true,
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
      applicationHeader: true,
      inverted: true,
      noText: true,
      breadcrumb: defBreadcrumbData.variants.default.props,
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
      noText: true,
      breadcrumb: defBreadcrumbData.variants.default.props,
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
      hasImageTitle: false,
      hasVideo: false,
      hasImage: false,
      noText: true,
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
      hasImageTitle: false,
      hasVideo: false,
      hasImage: false,
      noText: true,
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
      leadText: 'Steuerliche Zugehörigkeit',
      breadcrumb: backOnlyBreadcrumbData,
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
      hasBacklink: true,
      noText: true,
      breadcrumb: backOnlyBreadcrumbData,
    },
  },
  zhLexDetail: {
    meta: {
      title: 'Flex Data (ZHLEX) (CZHDEV-1233)',
      desc: '',
      disabledColorVariations: ['cv-monochrome'],
    },
    props: {
      pageTitle: 'Vertrag zwischen den Ständen Zürich und Schwyz betreffend die Hafengüter bei Richterswil',
      inverted: false,
      hasBacklink: true,
      noText: true,
      breadcrumb: _.merge({}, backOnlyBreadcrumbData, {
        hasStorage: true,
      }),
    },
  },
  error404: {
    meta: {
      title: 'Error404 (CZHDEV-528)',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      noText: true,
      breadcrumb: {
        contextMenu: false,
        path: [
          {
            title: 'Kanton Zürich',
            href: '#',
          },
        ],
      },
      pageTitle: 'Seite nicht gefunden',
      homeCTA: {title: 'Zur Startseite', href: '#'},
      errorBlock: {
        code: 'Fehlercode:404',
        text: 'Bitte wählen Sie über die Hauptnavigation andere Inhalte, versuchen Sie es über die Eingabe eines Suchbegriffs oder wechseln Sie zur Startseite.',
      },
    },
  },
  error404Ext: {
    meta: {
      title: 'Error404 Erweitert (CZHDEV-528)',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      anchorLinks: [
        {
          anchorlink: {
            anchorlinkText: 'Schulferien 2019',
            anchorlinkAdress: '#',
            anchorlinkIsActive: false,
            anchorlinkIsTagAnchor: true,
            anchorlinkIsInverted: false,
            anchorlinkIsTopitem: true,
            anchorlinkIsTopitemSmall: false,
          },
        },
        {
          anchorlink: {
            anchorlinkText: 'Kurs für Hundehalter',
            anchorlinkAdress: '#',
            anchorlinkIsActive: false,
            anchorlinkIsTagAnchor: true,
            anchorlinkIsInverted: false,
            anchorlinkIsTopitem: true,
            anchorlinkIsTopitemSmall: false,
          },
        },
        {
          anchorlink: {
            anchorlinkText: 'Quellensteuer',
            anchorlinkAdress: '#',
            anchorlinkIsActive: false,
            anchorlinkIsTagAnchor: true,
            anchorlinkIsInverted: false,
            anchorlinkIsTopitem: true,
            anchorlinkIsTopitemSmall: false,
          },
        },
        {
          anchorlink: {
            anchorlinkText: 'Handelsregistereintrag',
            anchorlinkAdress: '#',
            anchorlinkIsActive: false,
            anchorlinkIsTagAnchor: true,
            anchorlinkIsInverted: false,
            anchorlinkIsTopitem: true,
            anchorlinkIsTopitemSmall: false,
          },
        },
      ],
      noText: true,
      breadcrumb: {
        contextMenu: false,
        path: [
          {
            title: 'Kanton Zürich',
            href: '#',
          },
        ],
      },
      pageTitle: 'Seite nicht gefunden',
      errorBlock: {
        text: 'Bitte wählen Sie über die Hauptnavigation andere Inhalte, versuchen Sie es über die Eingabe eines Suchbegriffs oder wechseln Sie zur Startseite.',
      },
    },
  },
  error403: {
    meta: {
      title: 'Error403 (CZHDEV-525)',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      noText: true,
      breadcrumb: {
        contextMenu: false,
        path: [
          {
            title: 'Kanton Zürich',
            href: '#',
          },
        ],
      },
      pageTitle: 'Oops!',
      homeCTA: { title: 'Zur Startseite', href: '#' },
      errorBlock: {
        code: 'Fehlercode: 403',
        text: 'Entschuldigung, es ist ein Fehler aufgetreten.',
      },
    },
  },
  error403Ext: {
    meta: {
      title: 'Error403 Erweitert (CZHDEV-525)',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      noText: true,
      breadcrumb: {
        contextMenu: false,
        path: [
          {
            title: 'Kanton Zürich',
            href: '#',
          },
        ],
      },
      pageTitle: 'Oops!',
      homeCTA: { title: 'Zur Startseite', href: '#' },
      errorBlock: {
        text: 'Entschuldigung, es ist ein Fehler aufgetreten.',
      },
    },
  },
  error404Image: {
    meta: {
      title: 'Error404 mit Bild (CZHDEV-528)',
      desc: '',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      noText: true,
      breadcrumb: {
        contextMenu: false,
        path: [
          {
            title: 'Kanton Zürich',
            href: '#',
          },
        ],
      },
      pageTitle: 'Seite nicht gefunden',
      homeCTA: { title: 'Zur Startseite', href: '#' },
      errorBlock: {
        code: 'Fehlercode: 404',
        text: 'Bitte wählen Sie über die Hauptnavigation andere Inhalte, versuchen Sie es über die Eingabe eines Suchbegriffs oder wechseln Sie zur Startseite.',
        imageData: defImageFigureData.variants.noTitle.props,
      },
    },
  },
  unavailable: {
    meta: {
      title: 'Error: Nicht erreichbar (CZHDEV-529)',
      desc: '',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      noText: true,
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
      errorBlock: {
        text: 'Wir arbeiten gerade an unserer Website. Schauen Sie doch in der Zwischenzeit unseren Imagefilm und versuchen es später nochmals.',
        videoData: defVideoData.variants.offlinePage.props,
      },
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
});

data.variants = variants;

module.exports = data;
