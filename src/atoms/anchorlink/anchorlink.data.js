const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('anchorlink.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Anchorlink',
    className: 'Anchorlink',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchorlink: {
      anchorlinkText: 'Anchorlink',
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
      title: 'Anchorlink',
      desc: 'Default implementation eines Anchorlinks',
    },
  },
  defaultActive: {
    meta: {
      title: 'Anchorlink (aktiv)',
      desc: 'Default implementation eines Anchorlinks im "active state".',
    },
    props: {
      anchorlink: {
        anchorlinkIsActive: true,
      },
    },
  },
  tag: {
    meta: {
      title: 'Tag Label Anchorlink',
      desc: 'Implementation eines Tag Label Anchorlinks.',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Tag Label',
        anchorlinkIsTagAnchor: true,
      },
    },
  },
  tagActive: {
    meta: {
      title: 'Tag Label Anchorlink (aktiv)',
      desc: 'Implementation eines Tag Label Anchorlinks im "active state".',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Tag Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
      },
    },
  },
  tagTopic: {
    meta: {
      title: 'Topic Tag Anchorlink',
      desc: 'Implementation eines Topic Tag Anchorlinks.',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Topic Tag',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
        anchorlinkIsTagTopic: true,
      },
    },
  },
  tagTopTags: {
    meta: {
      title: 'Topitem Tag Anchorlink',
      desc: 'Implementation eines Topitem Tag Anchorlink.',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Topitem',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
      },
    },
  },
  tagTopTagsSmall: {
    meta: {
      title: 'Topitem Tag Anchorlink (klein)',
      desc: 'Implementation eines Topitem Tag Anchorlink (klein).',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Topitem',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
        anchorlinkIsTopitemSmall: true,
      },
    },
  },
  tagInverted: {
    meta: {
      title: 'Tag Label Anchorlink (invertiert)',
      desc: 'Implementation eines Tag Label Anchorlinks.',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Tag Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagActiveInverted: {
    meta: {
      title: 'Tag Label Anchorlink (aktiv/invertiert)',
      desc: 'Implementation eines Tag Label Anchorlinks im "active state".',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Tag Label',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsActive: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagTopicInverted: {
    meta: {
      title: 'Topic Tag Anchorlink (invertiert)',
      desc: 'Implementation eines Topic Tag Anchorlinks.',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Topic Tag',
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
      title: 'Topitem Tag Anchorlink (invertiert)',
      desc: 'Implementation eines Topitem Tag Anchorlink.',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Topitem',
        anchorlinkIsTagAnchor: true,
        anchorlinkIsTopitem: true,
        anchorlinkIsInverted: true,
      },
      isInverted: true,
    },
  },
  tagTopTagsSmallInverted: {
    meta: {
      title: 'Topitem Tag Anchorlink (klein/invertiert)',
      desc: 'Implementation eines Topitem Tag Anchorlink (klein).',
    },
    props: {
      anchorlink: {
        anchorlinkText: 'Topitem',
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
