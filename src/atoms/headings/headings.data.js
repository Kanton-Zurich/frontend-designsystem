const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('headings.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Titel',
    className: 'Heading',
    jira: 'CZHDEV-189',
    documentation: dataHelper.getDocumentation('README.md'),
    hideFromListing: false,
  },
  props: {},
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: '',
      },
      props: {
        title: 'Überschrift Stufe',
        variant: 'primary',
      },
    },
    inverted: {
      meta: {
        title: 'Invertiert',
        desc: '',
      },
      props: {
        title: 'Überschrift Stufe',
        isInverted: true,
        modifier: 'cv-inverted',
        variant: 'inverted',
      },
    },
    prefixHeading: {
      meta: {
        title: 'Titel mit Prefix',
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
    leadHeading: {
      meta: {
        title: 'Titel mit Legende',
        desc: 'Titelzeile oberhalb der Überschrift',
      },
      props: {
        leadHeading: true,
        title: 'max@mustermann.com',
        leadTitle: 'Ihre E-Mail Adresse',
        headingLevel: 2,
        variant: 'primary',
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
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
