const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defServiceBoxData = require('../service_box/service_box.data.js');
const defApplicationData = require('../application/application.data.js');
const topiclist = require('../topiclist/topiclist.data');
const organisationNavigation = require('../organisation_navigation/organisation_navigation.data');

const template = dataHelper.getFileContent('modal.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Modal',
    className: 'Modal',
    jira: 'CZHDEV-517',
    documentation: dataHelper.getDocumentation('modal.md'),
  },
  props: {
    preview: true,
    mainNavigation: false,
    modules: {
      contentModules: [
        () => handlebars.compile(dataHelper.getFileContent('../service_box/service_box.hbs'))(defServiceBoxData.variants.default.props),
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
      dynamicHeader: true,
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
        },
      },
    },
  },
  spa: {
    meta: {
      title: 'Single Page Application (CZHDEV-792)',
      desc: '',
    },
    props: {
      modalId: 'service-modal-03',
      singlePageApp: handlebars.compile(dataHelper.getFileContent('../application/application.hbs'))(defApplicationData.variants.fullWidth.props),
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
      mainNavigation: true,
      modules: {
        contentModules: [
          () => handlebars.compile(dataHelper.getFileContent('../topiclist/topiclist.hbs'))(topiclist.variants.topicsNav.props),
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
      mainNavigation: true,
      modules: {
        contentModules: [
          () => handlebars.compile(dataHelper.getFileContent('../organisation_navigation/organisation_navigation.hbs'))(organisationNavigation.variants.default.props),
        ],
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
