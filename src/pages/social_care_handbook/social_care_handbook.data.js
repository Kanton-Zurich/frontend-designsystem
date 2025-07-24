const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedIn
  .props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;
const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.office
  .props;

const defFlexData = require('../../modules/flex_data/flex_data.data').variants.socialCareHandbook
  .props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData
  .props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;

const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Sozialhilfe Handbuch',
    jira: 'CZHDEV-3005',
    content: dataHelper.getFileContent('social_care_handbook.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    defaultColorVariation: 'cv-magenta',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Sozialhilfe-Handbuch',
        inverted: true,
        breadcrumb: breadcrumbData,
        leadSection: {
          leadText:
            'Das Sozialhilfe-Behördenhandbuch enthält Beiträge zum Sozialhilferecht des Kantons Zürich und zum Zuständigkeitsgesetz des Bundes. Daneben gibt es einen Überblick über die Einrichtungen der primären sozialen Sicherheit und zu weiteren sozialrechtlichen Fragen.',
        },
      }),
      flexData: defFlexData,
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact_title' }),
      releatedContentData: _.merge({}, defReleatedContentData, {
        anchorNavReference: 'related_content',
      }),
      tagGroupData: _.assign(
        _.merge({}, defTagGroupData, { anchorNavReference: 'responsibilities' }),
        {
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
        }
      ),
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
