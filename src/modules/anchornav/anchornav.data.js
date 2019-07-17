const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('anchornav.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Anchornav',
    className: 'Anchornav',
    jira: 'CZHDEV-502',
    documentation: dataHelper.getDocumentation('anchornav.md'),
  },
  props: {
    anchornavTitle: {
      level: 5,
      title: 'Inhaltsverzeichniss',
    },
    anchornavItems: [
      {
        anchorlink: {
          anchorlinkText: 'Themen',
          anchorlinkAdress: '#themen',
          anchorlinkIsActive: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Service',
          anchorlinkAdress: '#service',
          anchorlinkIsActive: false,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Unterlagen',
          anchorlinkAdress: '#unterlagen',
          anchorlinkIsActive: false,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Weiterführende Informationen',
          anchorlinkAdress: '#infos',
          anchorlinkIsActive: false,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Kontakt',
          anchorlinkAdress: '#contact',
          anchorlinkIsActive: false,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Standorte',
          anchorlinkAdress: '#locations',
          anchorlinkIsActive: false,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Bildergallerie',
          anchorlinkAdress: '#bildergallerie',
          anchorlinkIsActive: false,
          anchorlinkIsOpensInNewTab: false,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Download',
          anchorlinkAdress: '#download',
          anchorlinkIsActive: false,
          anchorlinkIsOpensInNewTab: false,
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
    props: {
      isSticky: false,
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
