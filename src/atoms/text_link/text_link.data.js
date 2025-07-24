const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('text_link.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'TextLink',
    className: 'TextLink',
    jira: 'CZHDEV-298',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    icon: null,
    text: 'Text Link',
    textLinkSrc: '#',
    isInverted: false,
    hasLeadingIcon: false,
    hasTrailingIcon: false,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Normaler Textlink',
      },
    },
    inverted: {
      meta: {
        title: 'Invertiert',
        desc: 'Normaler Textlink auf dunklem Grund',
      },
      props: {
        isInverted: true,
      },
    },
    iconBefore: {
      meta: {
        title: 'Link mit Icon links',
        desc: 'Normaler Textlink mit Icon auf der linken Seite',
      },
      props: {
        icon: 'add-new',
        text: 'Text Link',
        isInverted: false,
        hasLeadingIcon: true,
        hasTrailingIcon: false,
      },
    },
    iconAfter: {
      meta: {
        title: 'Link mit Icon rechts',
        desc: 'Normaler Textlink mit Icon auf der rechten Seite',
      },
      props: {
        icon: 'arrow-right',
        text: 'Text Link',
        hasLeadingIcon: false,
        hasTrailingIcon: true,
      },
    },
    iconAfterInverted: {
      meta: {
        title: 'Link mit Icon rechts (invertiert)',
        desc: 'Normaler Textlink mit Icon auf der rechten Seite',
      },
      props: {
        icon: 'arrow-right',
        text: 'Text Link',
        isInverted: true,
        hasLeadingIcon: false,
        hasTrailingIcon: true,
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
