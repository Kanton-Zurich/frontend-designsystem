const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const scroll2top = require('../scroll2top/scroll2top.data').props;
const backToChat = require('../back_to_chat/back_to_chat.data').props;

const template = dataHelper.getFileContent('back_to.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Back To',
    className: 'BackTo',
    jira: 'CZHDEV-4245',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    modules: {
      scroll2top,
      backToChat,
    },
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation with chatIsActive',
      },
      props: {
        modules: {
          backToChat: {
            ...backToChat,
            forceVisible: false,
          },
        },
      },
    },
    noChat: {
      meta: {
        title: 'No Chat',
        desc: 'Implementation with no chatIsActive',
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
