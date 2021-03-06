const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const modalData = require('../modal/modal.data');
const devUserMenuData = require('../user_menu/user_menu.data').variants.loggedIn.props;

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
    modals: [
      _.merge({}, modalData.variants.topicFlyout.props, {
        preview: false,
      }),
      _.merge({}, modalData.variants.searchFlyout.props, {
        preview: false,
      }),
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  inverted: {
    meta: {
      title: 'Invertiert',
      desc: 'Head Module ignoriert Farbschema und wird einfach plain schwarz/weiss dargestellt',
    },
    props: {
      inverted: true,
      hasUserMenu: true,
      userMenu: devUserMenuData,
    },
  },
  userMenu: {
    meta: {
      title: 'Mit User Menu',
      desc: 'Head Module mit User-Menu',
    },
    props: {
      hasUserMenu: true,
      userMenu: devUserMenuData,
    },
  },
  userMenuInv: {
    meta: {
      title: 'Mit User Menu (invertiert)',
      desc: 'Invertiertes HeadModule mit User-Menu',
    },
    props: {
      inverted: true,
      hasUserMenu: true,
      userMenu: devUserMenuData,
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
