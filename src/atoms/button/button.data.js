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
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    icon: null,
    text: 'Button',
    isTextVisible: true,
    isSecondary: false,
    isSmall: false,
    isBig: false,
    isInverted: false,
    isTagButton: false,
    isTagFilter: false,
    isTopic: false,
    isEdit: false,
    isTopTag: false,
    isAnchor: false,
    additionalAttribute: null,
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Primary',
        desc: 'Primary Button ohne Icon.',
      },
    },
    defaultWithIcon: {
      meta: {
        title: 'Primary mit Icon',
        desc: 'Primary Button mit Icon.',
      },
      props: {
        icon: 'edit',
      },
    },
    defaultDisabled: {
      meta: {
        title: 'Primary disabled',
        desc: 'Primary Button disabled.',
      },
      props: {
        icon: 'edit',
        disabled: true,
      },
    },
    defaultWithoutText: {
      meta: {
        title: 'Primary nur Icon',
        desc: 'Primary Button nur mit Icon und ohne (sichtbaren) Text.',
      },
      props: {
        isTextVisible: false,
        icon: 'edit',
      },
    },
    secondary: {
      meta: {
        title: 'Secondary',
        desc: 'Secondary Button nur mit Text.',
      },
      props: {
        isSecondary: true,
      },
    },
    secondaryWithIcon: {
      meta: {
        title: 'Secondary mit Icon',
        desc: 'Secondary Button mit Icon und Text.',
      },
      props: {
        isSecondary: true,
        icon: 'arrow-right',
      },
    },
    secondaryWithoutText: {
      meta: {
        title: 'Secondary nur Icon',
        desc: 'Secondary Button nur mit Icon und ohne (sichtbaren) Text.',
      },
      props: {
        isTextVisible: false,
        isSecondary: true,
        icon: 'edit',
      },
    },
    primarySmall: {
      meta: {
        title: 'Kleiner Primary',
        desc: 'Kleiner Primary Button nur mit Text.',
      },
      props: {
        isSmall: true,
      },
    },
    primarySmallOnlyIcon: {
      meta: {
        title: 'Kleiner Primary nur Icon',
        desc: 'Kleiner Primary Button nur mit einem Icon.',
      },
      props: {
        isSmall: true,
        isTextVisible: false,
        icon: 'edit',
      },
    },
    secondarySmall: {
      meta: {
        title: 'Kleiner Secondary',
        desc: 'Kleiner Secondary Button nur mit Text.',
      },
      props: {
        isSmall: true,
        isSecondary: true,
      },
    },
    bigPrimary: {
      meta: {
        title: 'Grosser Primary',
        desc: 'Grosser Primary Button mit Text und Icon.',
      },
      props: {
        text: 'Video',
        icon: 'play',
        isBig: true,
      },
    },
    tag: {
      meta: {
        title: 'Tag-Button normal',
        desc: 'Normaler Tag Button nur mit Text.',
      },
      props: {
        text: 'Tag Label',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
      },
    },
    tagActive: {
      meta: {
        title: 'Tag-Button normal (aktiv)',
        desc: 'Normaler Tag Button nur mit Text.',
      },
      props: {
        text: 'Tag Label',
        isSmall: true,
        isTagButton: true,
      },
    },
    tagFilter: {
      meta: {
        title: 'Tag-Filter-Button',
        desc: 'Filter Tag Button mit Text und Icon rechts.',
      },
      props: {
        text: 'Tag Filter',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isTagFilter: true,
        icon: 'exit',
      },
    },
    tagFilterActive: {
      meta: {
        title: 'Tag-Filter-Button (aktiv)',
        desc: 'Filter Tag Button mit Text und Icon rechts.',
      },
      props: {
        text: 'Tag Filter',
        isSmall: true,
        isTagButton: true,
        isTagFilter: true,
        icon: 'exit',
      },
    },
    tagTopic: {
      meta: {
        title: 'Tag-Topic-Button',
        desc: 'Topic Tag Button mit Text.',
      },
      props: {
        text: 'Topic Tag',
        isSmall: true,
        isTagButton: true,
        isTopic: true,
      },
    },
    tagEdit: {
      meta: {
        title: 'Tag-editieren-Button',
        desc: 'Topic Tag Button mit Text.',
      },
      props: {
        text: 'Liste edititeren',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isEdit: true,
        icon: 'edit',
      },
    },
    tagTopBig: {
      meta: {
        title: 'Top Tags (gross)',
        desc: 'Top-Tags Button mit Text.',
      },
      props: {
        text: 'Topitem',
        isSecondary: true,
        isBig: true,
        isTagButton: true,
        isTopTag: true,
      },
    },
    tagTopSmall: {
      meta: {
        title: 'Top Tags (klein)',
        desc: 'Top-Tags Button mit Text.',
      },
      props: {
        text: 'Topitem',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isTopTag: true,
      },
    },
    primaryInverted: {
      meta: {
        title: 'Primary (invertiert)',
        desc: 'Primary Button ohne Icon.',
      },
      props: {
        isInverted: true,
      },
    },
    primaryInvertedWithIcon: {
      meta: {
        title: 'Primary mit Icon (invertiert)',
        desc: 'Primary Button mit Icon.',
      },
      props: {
        icon: 'edit',
        isInverted: true,
      },
    },
    primaryInvertedOnlyIcon: {
      meta: {
        title: 'Primary nur Icon (invertiert)',
        desc: 'Primary Button nur mit Icon und ohne (sichtbaren) Text.',
      },
      props: {
        isTextVisible: false,
        icon: 'edit',
        isInverted: true,
      },
    },
    secondaryInverted: {
      meta: {
        title: 'Secondary (invertiert)',
        desc: 'Secondary Button nur mit Text.',
      },
      props: {
        isSecondary: true,
        isInverted: true,
      },
    },
    secondaryWithIconInverted: {
      meta: {
        title: 'Secondary mit Icon (invertiert)',
        desc: 'Secondary Button mit Icon und Text.',
      },
      props: {
        isSecondary: true,
        icon: 'arrow-right',
        isInverted: true,
      },
    },
    secondaryWithoutTextInverted: {
      meta: {
        title: 'Secondary nur Icon (invertiert)',
        desc: 'Secondary Button nur mit Icon und ohne (sichtbaren) Text.',
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
        title: 'Kleiner Primary (invertiert)',
        desc: 'kleiner Primary Button nur mit Text.',
      },
      props: {
        isSmall: true,
        isInverted: true,
      },
    },
    primarySmallOnlyIconInverted: {
      meta: {
        title: 'Kleiner Primary nur Icon (invertiert)',
        desc: 'kleiner Primary Button nur mit einem Icon.',
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
        title: 'Kleiner Secondary (invertiert)',
        desc: 'kleiner Secondary Button nur mit Text.',
      },
      props: {
        isSmall: true,
        isSecondary: true,
        isInverted: true,
      },
    },
    tagInverted: {
      meta: {
        title: 'Tag-Button normal (invertiert)',
        desc: 'normaler Tag Button nur mit Text.',
      },
      props: {
        text: 'Tag Label',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isInverted: true,
      },
    },
    tagActiveInverted: {
      meta: {
        title: 'Tag-Button normal (aktiv/invertiert)',
        desc: 'normaler Tag Button nur mit Text.',
      },
      props: {
        text: 'Tag Label',
        isSmall: true,
        isTagButton: true,
        isInverted: true,
      },
    },
    tagFilterInverted: {
      meta: {
        title: 'Tag-Filter-Button (invertiert)',
        desc: 'Filter Tag Button mit Text und Icon rechts.',
      },
      props: {
        text: 'Tag Filter',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isTagFilter: true,
        icon: 'exit',
        isInverted: true,
      },
    },
    tagFilterActiveInverted: {
      meta: {
        title: 'Tag-Filter-Button (aktiv/invertiert)',
        desc: 'Filter Tag Button mit Text und Icon rechts.',
      },
      props: {
        text: 'Tag Filter',
        isSmall: true,
        isTagButton: true,
        isTagFilter: true,
        icon: 'exit',
        isInverted: true,
      },
    },
    tagTopicInverted: {
      meta: {
        title: 'Tag-Topic-Button (invertiert)',
        desc: 'Topic Tag Button mit Text.',
      },
      props: {
        text: 'Topic Tag',
        isSmall: true,
        isTagButton: true,
        isTopic: true,
        isInverted: true,
      },
    },
    tagEditInverted: {
      meta: {
        title: 'Tag-editieren-Button (invertiert)',
        desc: 'Tag-editier-Button mit Text und icon Links.',
      },
      props: {
        text: 'Liste edititeren',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isEdit: true,
        isInverted: true,
        icon: 'edit',
      },
    },
    tagTopBigInverted: {
      meta: {
        title: 'Top Tags (gross/invertiert)',
        desc: 'Top-Tags Button mit Text.',
      },
      props: {
        text: 'Topitem',
        isSecondary: true,
        isBig: true,
        isTagButton: true,
        isTopTag: true,
        isInverted: true,
      },
    },
    tagTopSmallInverted: {
      meta: {
        title: 'Top Tags (klein/invertiert)',
        desc: 'Top-Tags Button mit Text.',
      },
      props: {
        text: 'Topitem',
        isSecondary: true,
        isSmall: true,
        isTagButton: true,
        isTopTag: true,
        isInverted: true,
      },
    },
    primaryAnchor: {
      meta: {
        title: 'Primary Link',
        desc: 'Link mit Erscheinung des primary Button ohne Icon.',
      },
      props: {
        text: 'Primary Link',
        isAnchor: true,
        anchorLink: '#',
      },
    },
    primaryLoading: {
      meta: {
        title: 'Primary',
        desc: 'Primary Button mit Loading.',
      },
      props: {
        isLoading: true,
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
