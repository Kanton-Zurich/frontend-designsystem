const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const mockAssets = {
  loggedIn: '../../mocks/modules/cug_login/status_logged_in.json',
  loggedOut: '../../mocks/modules/cug_login/status_not_logged_in.json',
};

const template = dataHelper.getFileContent('user_menu.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'User Menu',
    className: 'UserMenu',
    jira: 'CZHDEV-538',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    loginLabelText: 'Anmelden',
    logoutItem: {
      isButton: true,
      href: false,
      text: 'Abmelden',
      iconAfter: 'logout-user',
      additionalAttributes: 'data-user-menu="logout"',
    },
  },
});
const variants = _.mapValues(
  {
    loggedOut: {
      meta: {
        title: 'Logged Out',
        desc: 'Mocked Zustand: ausgeloggt',
      },
      props: {
        endpointLoginStatus: mockAssets.loggedOut,
      },
    },
    loggedIn: {
      meta: {
        title: 'Logged In',
        desc: 'Mocked Zustand: eingeloggt',
      },
      props: {
        endpointLoginStatus: mockAssets.loggedIn,
      },
    },
    loggedOutInverted: {
      meta: {
        title: 'Logged Out Inverted',
        desc: 'Invertierte Variante, mocked Zustand: ausgeloggt',
      },
      props: {
        isInverted: true,
        endpointLoginStatus: mockAssets.loggedOut,
      },
    },
    loggedInInverted: {
      meta: {
        title: 'Logged In Inverted',
        desc: 'Invertierte Variante, mocked Zustand: eingeloggt',
      },
      props: {
        isInverted: true,
        endpointLoginStatus: mockAssets.loggedIn,
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
