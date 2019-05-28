const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('page_header.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Seitekopf',
    className: 'PageHeader',
    jira: 'CZHDEV-395',
    documentation: dataHelper.getDocumentation('page_header.md'),
  },
  props: {
    title: 'Seitenkopf',
    pageTitle: 'H1: Pagetitle Black Strassenverkehrsamt',
    leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    breadcumbText: '<strong>Placeholder</strong> &#8227; Placeholder',
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      disabledColorVariations: ['cv-blue', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue' ],
      defaultColorVariation: 'cv-default',
    },
  },
  colored: {
    meta: {
      title: 'Mit Farbe',
      desc: '',
    },
    props: {
      disabledColorVariations: ['cv-default'],
      defaultColorVariation: 'cv-blue',
      inverted: true,
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
