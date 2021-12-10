const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('anchorlink.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Link',
    className: 'Anchorlink',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchorlink: {
      anchorlinkText: 'Text Link',
      anchorlinkAdress: '#',
      anchorlinkIsActive: false,
      anchorlinkIsTagAnchor: false,
      anchorlinkIsInverted: false,
      anchorlinkIsTagTopic: false,
      anchorlinkIsTopitem: false,
      anchorlinkIsTopitemSmall: false,
      anchorlinkAsButton: false,
    },
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Link',
      desc: '',
    },
  },
  defaultActive: {
    meta: {
      title: 'Link, aktiv',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkIsActive: true,
      },
    },
  },
  tag: {
    meta: {
      title: 'Chip',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Label',
        anchorlinkIsTagAnchor: true,
      },
    },
  },
  tagActive: {
    meta: {
      title: 'Chip, aktiv',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
      },
    },
  },
  tagTopic: {
    meta: {
      title: 'Chip klein, aktiv',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
        anchorlinkIsTagTopic: true,
      },
    },
  },
  tagTopTags: {
    meta: {
      title: 'Chip Link gross',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Link Text',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
      },
    },
  },
  tagTopTagsSmall: {
    meta: {
      title: 'Chip Link',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Link Text',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
        anchorlinkIsTopitemSmall: true,
      },
    },
  },
  tagInverted: {
    meta: {
      title: 'Chip, invertiert',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagActiveInverted: {
    meta: {
      title: 'Chip, aktiv invertiert',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagTopicInverted: {
    meta: {
      title: 'Chip klein, aktiv invertiert',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
        anchorlinkIsTagTopic: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagTopTagsInverted: {
    meta: {
      title: 'Chip Link gross, invertiert',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Link Text',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagTopTagsSmallInverted: {
    meta: {
      title: 'Chip Link, invertiert',
      desc: '',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Chip Link Text',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
        anchorlinkIsTopitemSmall: true,
        anchorlinkIsInverted: true,
      },
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
