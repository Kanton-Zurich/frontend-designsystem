const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data');

const searchData = require('../../modules/search_page/search_page.data.js').variants.default.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Suchseite',
    jira: 'CZHDEV-807',
    content: dataHelper.getFileContent('search.hbs'),
    documentation: dataHelper.getDocumentation('search.md'),
  },
  props: {
    title: 'Title',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    header: headerData.variants.inverted.props,
    modules: {
      pageHeader: {
        homelink: '#',
        pageTitle: 'Suche',
        breadcrumb: _.merge({}, defBreadcrumbData, {
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
    },
  },
});

module.exports = data;
