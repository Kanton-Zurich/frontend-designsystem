const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('headings.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Überschriften',
    className: 'Überschriften',
    jira: 'CZHDEV-189',
    documentation: dataHelper.getDocumentation('README.md'),
    hideFromListing: false,
  },
  props: {

  },
});

data.colorVariations = []; // no color variations available

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
  primary: {
    meta: {
      title: 'Primary',
      desc: 'Beliebige HTML-Elemente mit Klassen atm-heading',
    },
    props: {
      title: 'Überschrift Stufe',
      small: '',
      link: 'und einem Link',
      variant: 'primary',
    },
  },
  inverted: {
    meta: {
      title: 'Inverted',
      desc: 'Beliebige HTML-Elemente mit Klassen atm-heading und atm-heading--cv-inverted',
    },
    props: {
      title: 'Überschrift Stufe',
      small: '',
      link: 'und einem Link',
      isInverted: true,
      modifier: 'cv-inverted',
      variant: 'inverted',
    },
  },
  leadHeading: {
    meta: {
      title: 'Heading mit lead',
      desc: '',
    },
    props: {
      leadHeading: true,
      title: 'max@mustermann.com',
      leadTitle: 'Ihre E-Mail Adresse',
      headingLevel: 2,
      variant: 'primary',
    },
  },
  prefixHeading: {
    meta: {
      title: 'Heading mit Prefix',
      desc: '',
    },
    props: {
      title: 'Überschrift',
      headingLevel: 2,
      modifier: 'number-prefix',
      prefix: '1',
      variant: 'primary',
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
