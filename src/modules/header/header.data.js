const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const modalData = require('../modal/modal.data');
const devUserMenuDataLoggedIn = require('../user_menu/user_menu.data').variants.loggedIn.props;
const devUserMenuDataLoggedOut = require('../user_menu/user_menu.data').variants.loggedOut.props;
const devUserMenuDataInvertedLoggedIn = require('../user_menu/user_menu.data').variants
  .loggedInInverted.props;
const devUserMenuDataInvertedLoggedOut = require('../user_menu/user_menu.data').variants
  .loggedOutInverted.props;
const logoData = require('../../atoms/logo/logo.data').variants;

const template = dataHelper.getFileContent('header.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Header',
    className: 'Header',
    jira: 'CZHDEV-496',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    userMenu: false,
    searchModal: true,
    logo: logoData.linked.props,
    navItem: [
      {
        title: 'Themen',
        modal: 'flyout-topics',
      },
      {
        title: 'Organisation',
        modal: 'flyout-topics',
      },
    ],
  },
});
const variants = _.mapValues(
  {
    defaultWithUserLoggedOut: {
      meta: {
        title: 'Standard User ausgeloggt',
        desc: 'Standard Variante mit augeloggtem Benutzer',
      },
      props: {
        userMenu: devUserMenuDataLoggedOut,
        modals: [
          _.merge({}, modalData.variants.topicFlyout.props, {
            preview: false,
          }),
          _.merge({}, modalData.variants.searchFlyout.props, {
            preview: false,
          }),
        ],
      },
    },
    defaultWithoutSearch: {
      meta: {
        title: 'Ohne Suchfunktion',
        desc: 'Variante für Suchresultat-Seite ohne Suchfunktion im Header',
      },
      props: {
        searchModal: false,
        userMenu: devUserMenuDataLoggedOut,
        modals: [
          _.merge({}, modalData.variants.topicFlyout.props, {
            preview: false,
          }),
        ],
      },
    },
    defaultWithUserLoggedIn: {
      meta: {
        title: 'Standard User eingeloggt',
        desc: 'Standard Variante mit eingeloggtem Benutzer',
      },
      props: {
        userMenu: devUserMenuDataLoggedIn,
        modals: [
          _.merge({}, modalData.variants.topicFlyout.props, {
            preview: false,
          }),
          _.merge({}, modalData.variants.searchFlyout.props, {
            preview: false,
          }),
        ],
      },
    },
    invertedWithUserLoggedOut: {
      meta: {
        title: 'Invertiert User ausgeloggt',
        desc: 'Invertierte Variante mit ausgeloggtem Benutzer',
      },
      props: {
        inverted: true,
        userMenu: devUserMenuDataInvertedLoggedOut,
        modals: [
          _.merge({}, modalData.variants.topicFlyout.props, {
            preview: false,
          }),
          _.merge({}, modalData.variants.searchFlyout.props, {
            preview: false,
          }),
        ],
      },
    },
    invertedWithUserLoggedIn: {
      meta: {
        title: 'Invertiert User eingeloggt',
        desc: 'Invertierte Variante mit eingeloggtem Benutzer',
      },
      props: {
        inverted: true,
        userMenu: devUserMenuDataInvertedLoggedIn,
        modals: [
          _.merge({}, modalData.variants.topicFlyout.props, {
            preview: false,
          }),
          _.merge({}, modalData.variants.searchFlyout.props, {
            preview: false,
          }),
        ],
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
