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
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    text: 'Menu Item',
    iconAfter: 'arrow-right',
    href: '../../',
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Item mit Icon nach dem Text',
      },
    },
    defaultAsButton: {
      meta: {
        title: 'Standard als Button',
        desc: 'Item mit Icon nach dem Text, aber als Button',
      },
      props: {
        isButton: true,
        href: false,
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
        isButton: true,
        href: false,
      },
    },
    download: {
      meta: {
        title: 'Sprache für Download',
        desc: 'Sprachauswahl für einen Download mit mehreren Sprachen',
      },
      props: {
        iconBefore: 'download',
        iconAfter: false,
        text: 'Sprache',
        href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isDownload: true,
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
          data: dataHelper.getFormattedJson(variantProps),
          html: dataHelper.getFormattedHtml(compiledVariant()),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
