const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('anchornav.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Anchornav',
    className: 'Anchornav',
    jira: 'CZHDEV-259',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchornavTitle: {
      level: 2,
      title: 'Auf dieser Seite',
    },
    anchornavItems: [
      {
        anchorlink: {
          anchorlinkText: 'Themen',
          anchorlinkAdress: 'themen',
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Service',
          anchorlinkAdress: '-853478237', // intentially negative number as reference to simulate ids from AEM
          anchorlinkIsActive: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Unterlagen',
          anchorlinkAdress: 'unterlagen',
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Weiterführende Informationen und langer Titel',
          anchorlinkAdress: 'infos',
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Kontakt',
          anchorlinkAdress: 'contact',
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Standorte',
          anchorlinkAdress: 'locations',
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Bildergalerie',
          anchorlinkAdress: 'bildergalerie',
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Download',
          anchorlinkAdress: 'download',
        },
      },
    ],
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
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
