const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('breadcrumb.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Breadcrumb',
    className: 'Breadcrumb',
    jira: 'CZHDEV-436',
    documentation: dataHelper.getDocumentation('breadcrumb.md'),
    disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue'],
    defaultColorVariation: 'cv-blue',
  },
  props: {
    path: [
      {
        title: 'Kanton Zürich',
        href: '#',
      },
      {
        title: 'Urgrosselternseite',
        href: '#',
      },
      {
        title: 'Grosselternseite',
        href: '#',
      },
      {
        title: 'Elternseite',
        href: '#',
      },
      {
        title: 'aktuelle Seite',
      },
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Standardmässige Implementierung',
    },
  },
  singlePathItem: {
    meta: {
      title: 'Nur Zurück',
      desc: 'Wenn es nur ein Zurück-Link ist',
    },
    props: {
      backOnly: true,
      path: [
        {
          title: 'Zurück zur Übersicht',
          href: '#',
        },
      ],
    },
  },
}, (variant) => {
  // eslint-disable-next-line
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'path') {
      return variantValue;
    }
  }).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.mergeWith({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  // eslint-disable-next-line
  }, (dataValue, variantValue, key) => {
    if (key === 'path') {
      return variantValue;
    }
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
