const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const mockAssets = {
  loggedIn: '../../mocks/modules/cug_login/status_logged_in.json',
  notLoggedIn: '../../mocks/modules/cug_login/status_not_logged_in.json',
};

const template = dataHelper.getFileContent('user_menu.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'User Menu',
    className: 'UserMenu',
    jira: 'CZHDEV-538',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('user_menu.md'),
  },
  props: {
    logoutItem: {
      isButton: true,
      href: false,
      text: 'Abmelden',
      iconAfter: 'logout-user',
      additionalAttributes: 'data-user-menu="logout"',
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
      userName: 'Andrea Mustermann',
      userInitials: 'AM',
      endpointLoginStatus: mockAssets.notLoggedIn,
    },
  },
  noMock: {
    meta: {
      title: 'Develop (No Data)',
      desc: 'Prefilled with Name, no call for login status.',
    },
    props: {
      userName: 'Andrea Mustermann',
      userInitials: 'AM',
      endpointLoginStatus: '',
    },
  },
  loggedIn: {
    meta: {
      title: 'LoggedIn',
      desc: 'Mocked loginstatus is loggedin=true ',
    },
    props: {
      endpointLoginStatus: mockAssets.loggedIn,
    },
  },
  notloggedIn: {
    meta: {
      title: 'LoggedIn',
      desc: 'Mocked loginstatus is loggedin=false',
    },
    props: {
      endpointLoginStatus: mockAssets.notLoggedIn,
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
