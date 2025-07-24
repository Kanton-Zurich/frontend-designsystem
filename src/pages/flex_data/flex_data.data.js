const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data').variants.office
  .props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData
  .props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants
  .withoutLinklist.props;
const defFlexDataData = require('../../modules/flex_data/flex_data.data').variants.default.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Flex Data (Steuerbuch)',
    jira: 'CZHDEV-1234',
    content: dataHelper.getFileContent('flex_data.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Steuerbuch',
    skiplinks: skiplinksData,
    header: headerData,
    defaultColorVariation: 'cv-darkblue',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Steuerbuch',
        inverted: true,
        buttonData: false,
      }),
      leadSectionData: {
        leadText:
          'Das Zürcher Steuerbuch (ZStB) ist eine Sammlung von kantonalen Erlassen und Praxishinweisen zum Zürcher Steuerrecht',
      },
      flexDataData: defFlexDataData,
      newsTeaserData: defNewsTeaserData,
      releatedContentData: _.merge({}, defReleatedContentData, {
        anchorNavReference: 'related_content',
      }),
      contactData: _.merge({}, defContactData, {
        anchorNavReference: 'contact_title',
      }),
      tagGroupData: _.assign(
        _.merge({}, defTagGroupData, {
          anchorNavReference: 'responsibilities',
        }),
        {
          anchorLinks: [
            {
              anchorlink: {
                anchorlinkText: 'Steueramt',
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
