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
    documentation: dataHelper.getDocumentation('anchornav.md'),
  },
  props: {
    anchornavTitle: {
      level: 5,
      title: 'Inhaltsverzeichnis',
    },
    anchornavItems: [
      {
        anchorlink: {
          anchorlinkText: 'Themen',
          anchorlinkAdress: '#themen',
          anchorlinkIsActive: true,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Service',
          anchorlinkAdress: '#service',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Unterlagen',
          anchorlinkAdress: '#unterlagen',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Weiterführende Informationen',
          anchorlinkAdress: '#infos',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Kontakt',
          anchorlinkAdress: '#contact',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Standorte',
          anchorlinkAdress: '#locations',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Bildergallerie',
          anchorlinkAdress: '#bildergallerie',
          anchorlinkIsActive: false,
          anchorlinkIsOpensInNewTab: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Download',
          anchorlinkAdress: '#download',
          anchorlinkIsActive: false,
          anchorlinkIsOpensInNewTab: false,
          anchorlinkAsButton: true,
        },
      },
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
