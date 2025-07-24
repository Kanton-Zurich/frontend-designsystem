const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data.js').variants.invertedWithUserLoggedOut
  .props;

const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defEDirectoryData = require('../../modules/edirectory/edirectory.data').variants.default
  .props;
const defTocListData = require('../../modules/toc_list/toc_list.data').variants.eDirectory.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Behörden',
        anchorlinkAdress: 'toc_list',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contentinfo',
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Behördenverzeichnis',
    jira: 'CZHDEV-*',
    content: dataHelper.getFileContent('e_directory.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Behördenverzeichnis',
    text: '',
    defaultColorVariation: 'cv-darkblue',
    modules: {
      pageHeader: {
        pageTitle: 'Behördenverzeichnis',
        breadcrumb: defBreadcrumbData,
        inverted: true,
      },
      eDirectoryData: defEDirectoryData,
      toclistData: defTocListData,
      anchorNav: defAnchorNavData,
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
