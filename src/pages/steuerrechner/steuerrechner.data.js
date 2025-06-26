const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;
const taxCalcData = require('../../modules/tax_calc/tax_calc.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Steuerrechner',
    jira: 'CZHDEV-1238',
    content: dataHelper.getFileContent('steuerrechner.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Steuerrechner',
    text: '',
    defaultColorVariation: 'cv-turqoise',
    modules: {
      pageHeader: {
        pageTitle: 'Steuerbetrag berechnen',
        inverted: true,
        breadcrumb: breadcrumbData,
      },
      tax_calc: taxCalcData,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
