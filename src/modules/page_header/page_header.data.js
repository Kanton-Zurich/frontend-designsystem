const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defImageFigureData = require('../image_figure/image_figure.data');
const defVideoData = require('../video/video.data');
const defServiceButtonData = require('../service_button/service_button.data').props;
const defBreadcrumbData = require('../breadcrumb/breadcrumb.data').props;
const backOnlyBreadcrumbData = require('../breadcrumb/breadcrumb.data').variants.singlePathItem.props;
const defPersonCardData = require('../person_card/person_card.data.js').variants.promo.props;


const template = dataHelper.getFileContent('page_header.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Seitenkopf',
    className: 'PageHeader',
    jira: 'CZHDEV-395',
    documentation: dataHelper.getDocumentation('page_header.md'),
  },
  props: {
    title: 'Seitenkopf',
    homelink: '#',
    pageTitle: 'H1: Pagetitle Black Strassenverkehrsamt',
    leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    breadcrumb: defBreadcrumbData,
    backlink: backOnlyBreadcrumbData,
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
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      hasBreadcrumb: true,
      buttonData: _.merge(defServiceButtonData, {buttonTitle: 'Formular beantragen', modalData: { modalId: 'service-modal0' }}),
    },
  },
  defaultImage: {
    meta: {
      title: 'Default mit Bild',
      desc: 'Default implementation',
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue'],
      defaultColorVariation: 'cv-blue',
    },
    props: {
      imageData: defImageFigureData.variants.header.props,
      hasImage: true,
      hasBacklink: true,
      noButton: true,
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
      buttonData: _.merge({}, defServiceButtonData, {isInverted: true, modalData: { modalId: 'service-modal1' }}),
      hasBreadcrumb: true,
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
      buttonData: _.merge({}, defServiceButtonData, {isInverted: true, modalData: { modalId: 'service-modal2' }}),
      hasBreadcrumb: true,
      hasAnchors: true,
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
      hasBreadcrumb: true,
      noButton: true,
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
      noButton: true,
      imageData: defImageFigureData.variants.header.props,
      inverted: true,
      hasImageTitle: true,
      hasImage: true,
      hasBacklink: true,
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
      hasBacklink: true,
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
      hasBreadcrumb: true,
      noButton: true,
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
      hasBacklink: false,
      hasBreadcrumb: false,
      noButton: true,
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
      hasBacklink: false,
      hasBreadcrumb: true,
      noButton: true,
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
      hasBacklink: false,
      hasBreadcrumb: false,
      noButton: true,
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
      noButton: true,
      noText: true,
      buttonData: _.merge({}, defServiceButtonData, {isInverted: true, modalData: { modalId: 'service-modal4' }}),
      hasBreadcrumb: true,
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
      noButton: true,
      noText: true,
      buttonData: _.merge({}, defServiceButtonData, {isInverted: true, modalData: { modalId: 'service-modal5' }}),
      hasBreadcrumb: true,
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
      hasBacklink: false,
      hasBreadcrumb: false,
      noButton: true,
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
      hasBacklink: false,
      hasBreadcrumb: false,
      noButton: true,
      noText: true,
      minimal: true,
      hasCloseButton: true,
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
