const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('context_menu_item.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Context Menu Item',
    className: 'ContextMenuItem',
    jira: 'CZHDEV-384',
    documentation: dataHelper.getDocumentation('context_menu_item.md'),
  },
  props: {
    text: 'Menu Item',
    iconAfter: 'arrow-right',
    href: '../../',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Item mit Icon nach dem Text',
    },
  },
  iconBefore: {
    meta: {
      title: 'Icon vor Text',
      desc: 'Item mit einem Icon vor dem Text',
    },
    props: {
      iconAfter: false,
      iconBefore: 'location',
    },
  },
  twoIcons: {
    meta: {
      title: 'Mit 2 Icons',
      desc: 'Item mit Icons vor und nach dem Text',
    },
    props: {
      iconBefore: 'location',
    },
  },
  selectable: {
    meta: {
      title: 'Auswählbarer Eintrag',
      desc: 'Item welches angewählt werden kann',
    },
    props: {
      iconBefore: false,
      iconAfter: false,
      selectable: true,
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
