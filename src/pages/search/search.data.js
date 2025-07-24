const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const searchData = require('../../modules/search_page/search_page.data.js').variants.default.props;
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').variants.parentOnly
  .props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Suchseite',
    jira: 'CZHDEV-807',
    content: dataHelper.getFileContent('search.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Title',
    skiplinks: skiplinksData,
    header: headerData.variants.defaultWithUserLoggedOut.props,
    modules: {
      pageHeader: {
        pageTitle: 'Suche',
        breadcrumb: defBreadcrumbData,
      },
      search: searchData,
      footer: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
