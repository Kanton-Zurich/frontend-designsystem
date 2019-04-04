const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('table.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tabelle',
    className: 'Table',
    jira: 'CZHDEV-121',
    documentation: dataHelper.getDocumentation('table.md'),
  },
  props: {
    title: 'Der Kanton in Zahlen',
    headers: [
      '<span class="visuallyhidden">Bezirk</span>', 'Einwohnerzahl<sup>1</sup> 2017', 'Bevölkerungswachsum 2007–2017 in %', 'Beschäftigte 2015'],
    bodyrows: [
      ['Affoltern', '53531', '18,4', '17171'],
      ['Andelfingen', '31140', '9,6', '11094'],
      ['Bülach', '148897', '21,3', '110370'],
      ['Dielsdorf', '89221', '19,1', '38164'],
    ],
    footers: ['Kanton Zürich', '1498643', '15,2', '1005751'],
    hasTitle: true,
    headingLevel: 2,
    alignRight: false,
    colorVariation: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard-Tabelle',
    },
  },
  alignRight: {
    meta: {
      title: 'Rechtsbündig',
      desc: 'Variante mit rechtsbündig ausgerichteten Datenzellen',
    },
    props: {
      alignRight: true,
    },
  },
  noTitle: {
    meta: {
      title: 'Ohne Titel',
      desc: 'Variante ohne Titel',
    },
    props: {
      hasTitle: false,
    },
  },
  blue: {
    meta: {
      title: 'Blau ZH',
      desc: '',
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
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
