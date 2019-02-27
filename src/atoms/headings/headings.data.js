const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('headings.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Überschriften',
    className: 'Überschriften',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('headings.md'),
    hideFromListing: false,
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Blank',
      desc: 'Standard HTML-Elemente ohne Klassen',
    },
    props: {
      title: 'Überschrift Stufe',
      small: 'mit kleinem Text',
      link: 'und einem Link',
    },
  },
  h1: {
    meta: {
      title: 'H1',
      desc: 'Beliebige HTML-Elemente mit Klassen a-heading und a-heading--level1',
    },
    props: {
      title: 'Überschrift Stufe',
      small: 'gestylt als H1',
      link: 'und einem Link',
      variant: 'level1',
    },
  },
  h2: {
    meta: {
      title: 'H2',
      desc: 'Beliebige HTML-Elemente mit Klassen a-heading und a-heading--level2',
    },
    props: {
      title: 'Überschrift Stufe',
      small: 'gestylt als H2',
      link: 'und einem Link',
      variant: 'level2',
    },
  },
  h3: {
    meta: {
      title: 'H3',
      desc: 'Beliebige HTML-Elemente mit Klassen a-heading und a-heading--level3',
    },
    props: {
      title: 'Überschrift Stufe',
      small: 'gestylt als H3',
      link: 'und einem Link',
      variant: 'level3',
    },
  },
  h4: {
    meta: {
      title: 'H4',
      desc: 'Beliebige HTML-Elemente mit Klassen a-heading und a-heading--level4',
    },
    props: {
      title: 'Überschrift Stufe',
      small: 'gestylt als H4',
      link: 'und einem Link',
      variant: 'level4',
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
        // html: dataHelper.getFormattedHtml(compiledVariant),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
