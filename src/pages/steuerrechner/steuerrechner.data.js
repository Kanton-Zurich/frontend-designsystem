const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;
const taxCalcData = require('../../modules/tax_calc/tax_calc.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Steuerrechner',
    jira: 'CZHDEV-1238',
    content: dataHelper.getFileContent('steuerrechner.hbs'),
    documentation: dataHelper.getDocumentation('steuerrechner.md'),
  },
  props: {
    header: headerData,
    title: 'Steuerrechner',
    text: '',
    defaultColorVariation: 'cv-turqoise',
    modules: {
      pageHeader: {
        pageTitle: 'Steuerbetrag berechnen',
        inverted: true,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: false,
        noButton: true,
      },
      tax_calc: taxCalcData,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
