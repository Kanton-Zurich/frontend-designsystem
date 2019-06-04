const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defImageFigureData = require('../image_figure/image_figure.data');
const defVideoData = require('../video/video.data');
const defButtonData = require('../../atoms/button/button.data').props;


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
    pageTitle: 'H1: Pagetitle Black Strassenverkehrsamt',
    leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    breadcrumbText1: '<strong>Kanton Zürich</strong>',
    breadcrumbText2: 'Level inactive',
    breadcrumbText3: 'Level active',
    backlinkText: 'Zurück zur Übersicht',
    buttonData: _.merge(defButtonData, {text: 'Formular beantragen'}),
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue'],
      defaultColorVariation: 'cv-blue',
      hasBreadcrumb: true,
    },
  },
  defaultImage: {
    meta: {
      title: 'Default mit Bild',
      desc: 'Default implementation',
    },
    props: {
      disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue'],
      defaultColorVariation: 'cv-blue',
      imageData: defImageFigureData.variants.header.props,
      hasImage: true,
      hasBacklink: true,
    },
  },
  colored: {
    meta: {
      title: 'Mit Farbe',
      desc: '',
    },
    props: {
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
      inverted: true,
      buttonData: _.merge({}, defButtonData, {isInverted: true}),
      hasBreadcrumb: true,
    },
  },
  coloredAnchors: {
    meta: {
      title: 'Mit Farbe und Tags',
      desc: '',
    },
    props: {
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
      inverted: true,
      buttonData: _.merge({}, defButtonData, {isInverted: true}),
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
    },
    props: {
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
      imageData: defImageFigureData.variants.headerNoTitle.props,
      inverted: true,
      hasImage: true,
      buttonData: _.merge({}, defButtonData, {isInverted: true}),
      hasBacklink: true,
    },
  },
  coloredImageTitle: {
    meta: {
      title: 'Mit Farbe, Bild und Untertitel',
      desc: '',
    },
    props: {
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
      imageData: defImageFigureData.variants.header.props,
      inverted: true,
      hasImageTitle: true,
      hasImage: true,
      buttonData: _.merge({}, defButtonData, {isInverted: true}),
      hasBacklink: true,
    },
  },
  coloredVideoTitle: {
    meta: {
      title: 'Mit Farbe, Video und Untertitel',
      desc: '',
    },
    props: {
      disabledColorVariations: ['cv-monochrome'],
      defaultColorVariation: 'cv-blue',
      videoData: defVideoData.variants.header.props,
      inverted: true,
      hasImageTitle: true,
      hasVideo: true,
      hasImage: true,
      buttonData: _.merge({}, defButtonData, {isInverted: true}),
      hasBacklink: true,
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