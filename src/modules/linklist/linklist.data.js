const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const linkListItemDefaultData = require('../../atoms/linklist_item/linklist_item.data').variants.default;

const template = dataHelper.getFileContent('linklist.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Link-Liste',
    className: 'Linklist',
    jira: 'CZHDEV-187',
    documentation: dataHelper.getDocumentation('linklist.md'),
  },
  props: {
    links: [
      {
        title: 'Link 1',
        href: '/',
      }, {
        title: 'Link 2',
        href: 'https://www.google.ch',
        target: 'blank',
      }, {
        title: 'Link 3',
        href: '/index.html',
      },
    ],
    hasTitle: true,
    headingLevel: 2,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'With H2',
      desc: 'Implementation with h2 title',
    },
    props: {
      headingLevel: 2,
    },
  },
  h3: {
    meta: {
      title: 'With H3',
      desc: 'Implementation with h3 title',
    },
    props: {
      headingLevel: 3,
    },
  },
  h4: {
    meta: {
      title: 'With H4',
      desc: 'Implementation with H4',
    },
    props: {
      headingLevel: 4,
    },
  },
  noTitle: {
    meta: {
      title: 'Without title',
      desc: 'Implementation without title',
    },
    props: {
      hasTitle: false,
    },
  },
  blue: {
    meta: {
      title: 'Blau ZH',
      desc: 'Blue implementation',
    },
    props: {
      colorVariation: 'blue',
    },
  },
  darkblue: {
    meta: {
      title: 'Dunkelblau ZH',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
    },
  },
  turqoise: {
    meta: {
      title: 'Türkis ZH',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
    },
  },
  green: {
    meta: {
      title: 'Grün ZH',
      desc: '',
    },
    props: {
      colorVariation: 'green',
    },
  },
  bordeaux: {
    meta: {
      title: 'Bordeaux ZH',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
    },
  },
  magenta: {
    meta: {
      title: 'Magenta ZH',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
    },
  },
  violet: {
    meta: {
      title: 'Violett ZH',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
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
