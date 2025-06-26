const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.defaultWithUserLoggedOut
  .props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defCookieControls = require('../../modules/cookie_controls/cookie_controls.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const pageHeaderWithoutBreadcrumbs = _.omit(defPageHeaderData.variants.facts.props, ['breadcrumb']);
defPageHeaderData.variants.facts.props = pageHeaderWithoutBreadcrumbs;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datenschutzerklärung',
    jira: 'CZHDEV-466',
    content: dataHelper.getFileContent('privacy_notice.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          default: {
            props: {
              breadcrumb: breadcrumbData,
              pageTitle: 'Datenschutzerklärung',
            },
          },
        },
      }),
      cookieControlsData: defCookieControls,
      tagGroupData: {
        heading: {
          title: 'Für dieses Thema zuständig:',
        },
        anchorLinks: [
          {
            anchorlink: {
              anchorlinkText: 'Staatskanzlei',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: true,
            },
          },
        ],
      },
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
