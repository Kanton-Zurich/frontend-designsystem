const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defInstructionsData = require('../instructions/instructions.data.js');
const defApplicationData = require('../application/application.data.js');
const defIFrameData = require('../iframe/iframe.data.js');
const topiclist = require('../topiclist/topiclist.data');
const organisationNavigation = require('../organisation_navigation/organisation_navigation.data');
const search = require('../search/search.data');

const template = dataHelper.getFileContent('modal.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Modal',
    className: 'Modal',
    jira: 'CZHDEV-517',
    label: 'Container',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    preview: true,
    mainNavigation: false,
    modules: {
      contentModules: [
        () => handlebars.compile(dataHelper.getFileContent('../instructions/instructions.hbs'))(defInstructionsData.variants.serviceDemo.props),
      ],
    },
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      modalId: 'service-modal-01',
      closeButtonLabel: 'Schliessen',
      dynamicHeader: true,
      modules: {
        servicePageHeaderData: {
          pageTitle: 'Dienstleistungen zur Steuerrechnung beantragen',
          inverted: true,
          hasImageTitle: false,
          hasVideo: false,
          hasImage: false,
          hasBacklink: false,
          hasBreadcrumb: false,
          noButton: true,
          noText: true,
          hasCloseButton: true,
          homelink: '#',
        },
      },
    },
  },
  large: {
    meta: {
      title: 'Header Fix',
      desc: '',
    },
    props: {
      modalId: 'service-modal-011',
      modules: {
        servicePageHeaderData: {
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
          homelink: '#',
        },
      },
    },
  },
  minimal: {
    meta: {
      title: 'Minimal Header',
      desc: '',
    },
    props: {
      modalId: 'service-modal-02',
      modules: {
        servicePageHeaderData: {
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
          homelink: '#',
        },
      },
    },
  },
  spa: {
    meta: {
      title: 'Single Page Application (CZHDEV-792, CZHDEV-533)',
      desc: '',
    },
    props: {
      modalId: 'service-modal-03',
      fullWidthApp: handlebars.compile(dataHelper.getFileContent('../application/application.hbs'))(defApplicationData.variants.fullWidth.props),
      modules: {
        servicePageHeaderData: {
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
          homelink: '#',
        },
      },
    },
  },
  iframe: {
    meta: {
      title: 'iFrame Modal (CZHDEV-533)',
      desc: '',
    },
    props: {
      modalId: 'service-modal-04',
      fullWidthApp: handlebars.compile(dataHelper.getFileContent('../iframe/iframe.hbs'))(defIFrameData.variants.fullSize.props),
      modules: {
        servicePageHeaderData: {
          pageTitle: 'IFrame',
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
          homelink: '#',
        },
      },
    },
  },
  topicFlyout: {
    meta: {
      title: 'Flyout Themen',
      desc: 'Das Modal welches in der Hauptnavigation genutzt wird.',
    },
    props: {
      modalId: 'flyout-topics',
      closeButtonLabel: '<span class="visuallyhidden">Menu Themen </span>Schliessen',
      mainNavigation: true,
      paging: true,
      modules: {
        contentModules: [
          () => handlebars.compile(dataHelper.getFileContent('../topiclist/topiclist.hbs'))(topiclist.variants.topicsNav.props),
          () => handlebars.compile(dataHelper.getFileContent('../organisation_navigation/organisation_navigation.hbs'))(organisationNavigation.variants.default.props),
        ],
      },
    },
  },
  organisationFlyout: {
    meta: {
      title: 'Flyout Organisation',
      desc: 'Das Modal welches in der Hauptnavigation genutzt wird.',
    },
    props: {
      modalId: 'flyout-organisation',
      closeButtonLabel: '<span class="visuallyhidden">Menu Organisation </span>Schliessen',
      mainNavigation: true,
      modules: {
        contentModules: [
          () => handlebars.compile(dataHelper.getFileContent('../organisation_navigation/organisation_navigation.hbs'))(organisationNavigation.variants.default.props),
        ],
      },
    },
  },
  searchFlyout: {
    meta: {
      title: 'Onsite Search',
      desc: 'Das Modal mit der Suche',
    },
    props: {
      modalId: 'flyout-search',
      closeButtonLabel: '<span class="visuallyhidden">Suche </span>Schliessen',
      mainNavigation: true,
      isSearch: true,
      modules: {
        contentModules: [
          () => handlebars.compile(dataHelper.getFileContent('../search/search.hbs'))(search.variants.default.props),
        ],
      },
      options: JSON.stringify({
        transitionTime: 500,
      }),
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
