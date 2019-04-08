const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('button.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Button',
    className: 'Button',
    jira: 'CZHDEV-205',
    documentation: dataHelper.getDocumentation('button.md'),
  },
  props: {
    icon: null,
    text: 'Button',
    isTextVisible: true,
    isSecondary: false,
    isSmall: false,
    isBig: false,
    isInverted: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Primary',
      desc: 'Primary Button ohne Icon',
    },
  },
  defaultWithIcon: {
    meta: {
      title: 'Primary mit Icon',
      desc: 'Primary Button mit Icon',
    },
    props: {
      icon: 'edit',
    },
  },
  defaultWithoutText: {
    meta: {
      title: 'Primary nur Icon',
      desc: 'Primary Button nur mit Icon und ohne (sichtbaren) Text',
    },
    props: {
      isTextVisible: false,
      icon: 'edit',
    },
  },
  secondary: {
    meta: {
      title: 'Secondary',
      desc: 'Secondary Button nur mit Text',
    },
    props: {
      isSecondary: true,
    },
  },
  secondaryWithIcon: {
    meta: {
      title: 'Secondary mit Icon',
      desc: 'Secondary Button mit Icon und Text',
    },
    props: {
      isSecondary: true,
      icon: 'arrow-right',
    },
  },
  secondaryWithoutText: {
    meta: {
      title: 'Secondary nur Icon',
      desc: 'Secondary Button nur mit Icon und ohne (sichtbaren) Text',
    },
    props: {
      isTextVisible: false,
      isSecondary: true,
      icon: 'edit',
    },
  },
  primarySmall: {
    meta: {
      title: 'kleiner Primary',
      desc: 'kleiner Primary Button nur mit Text',
    },
    props: {
      isSmall: true,
    },
  },
  primarySmallOnlyIcon: {
    meta: {
      title: 'kleiner Primary nur Icon',
      desc: 'kleiner Primary Button nur mit einem Icon',
    },
    props: {
      isSmall: true,
      isTextVisible: false,
      icon: 'edit',
    },
  },
  secondarySmall: {
    meta: {
      title: 'kleiner Secondary',
      desc: 'kleiner Secondary Button nur mit Text',
    },
    props: {
      isSmall: true,
      isSecondary: true,
    },
  },
  bigPrimary: {
    meta: {
      title: 'grosser Primary',
      desc: 'grosser Primary Button mit Text und Icon',
    },
    props: {
      text: 'Video',
      icon: 'play',
      isBig: true,
    },
  },
  primaryInverted: {
    meta: {
      title: 'Primary (Inverted)',
      desc: 'Primary Button ohne Icon',
    },
    props: {
      isInverted: true,
    },
  },
  primaryInvertedWithIcon: {
    meta: {
      title: 'Primary mit Icon (Inverted)',
      desc: 'Primary Button mit Icon',
    },
    props: {
      icon: 'edit',
      isInverted: true,
    },
  },
  primaryInvertedOnlyIcon: {
    meta: {
      title: 'Primary nur Icon (Inverted)',
      desc: 'Primary Button nur mit Icon und ohne (sichtbaren) Text',
    },
    props: {
      isTextVisible: false,
      icon: 'edit',
      isInverted: true,
    },
  },
  secondaryInverted: {
    meta: {
      title: 'Secondary (Inverted)',
      desc: 'Secondary Button nur mit Text',
    },
    props: {
      isSecondary: true,
      isInverted: true,
    },
  },
  secondaryWithIconInverted: {
    meta: {
      title: 'Secondary mit Icon (Inverted)',
      desc: 'Secondary Button mit Icon und Text',
    },
    props: {
      isSecondary: true,
      icon: 'arrow-right',
      isInverted: true,
    },
  },
  secondaryWithoutTextInverted: {
    meta: {
      title: 'Secondary nur Icon (Inverted)',
      desc: 'Secondary Button nur mit Icon und ohne (sichtbaren) Text',
    },
    props: {
      isTextVisible: false,
      isSecondary: true,
      icon: 'edit',
      isInverted: true,
    },
  },
  primarySmallInverted: {
    meta: {
      title: 'kleiner Primary (Inverted)',
      desc: 'kleiner Primary Button nur mit Text',
    },
    props: {
      isSmall: true,
      isInverted: true,
    },
  },
  primarySmallOnlyIconInverted: {
    meta: {
      title: 'kleiner Primary nur Icon (Inverted)',
      desc: 'kleiner Primary Button nur mit einem Icon',
    },
    props: {
      isSmall: true,
      isTextVisible: false,
      icon: 'edit',
      isInverted: true,
    },
  },
  secondarySmallInverted: {
    meta: {
      title: 'kleiner Secondary (Inverted)',
      desc: 'kleiner Secondary Button nur mit Text',
    },
    props: {
      isSmall: true,
      isSecondary: true,
      isInverted: true,
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
