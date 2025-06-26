const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedIn
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.office
  .props;
const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;

const defTOCListData = require('../../modules/toc_list/toc_list.data').variants.default.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Inhaltsverzeichnis-Seite',
    jira: 'CZHDEV-3178',
    content: dataHelper.getFileContent('toc_list.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    header: headerData,
    defaultColorVariation: 'cv-magenta',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Inhaltsverzeichnis',
        inverted: true,
        breadcrumb: breadcrumbData,
        leadSection: {
          leadText:
            'Das Sozialhilfe-Behördenhandbuch enthält Beiträge zum Sozialhilferecht des Kantons Zürich und zum Zuständigkeitsgesetz des Bundes. Daneben gibt es einen Überblick über die Einrichtungen der primären sozialen Sicherheit und zu weiteren sozialrechtlichen Fragen.',
        },
      }),
      tocListData: defTOCListData,
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
