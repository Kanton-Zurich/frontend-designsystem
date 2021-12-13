const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const searchData = require('../../modules/search_page/search_page.data.js').variants.default.props;
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;

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
    header: headerData.variants.inverted.props,
    modules: {
      pageHeader: {
        homelink: '#',
        pageTitle: 'Suche',
        breadcrumb: _.merge({}, defBreadcrumbData, {
          contextMenu: false,
          path: [
            {
              title: 'Kanton Zürich',
              href: '#',
            },
            {
              title: 'Suche',
            },
          ],
        }),
      },
      search: searchData,
      footer: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: false }),
    },
  },
});

module.exports = data;
