const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.defaultWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.smallMailOnly
  .props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defLeadSectionData = require('../../modules/lead_section/lead_section.data.js').variants.default.props;
const defLangSwitchData = require('../../modules/lang_switch/lang_switch.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'OSS Detailseite',
    jira: 'CZHDEV-5056',
    content: dataHelper.getFileContent('oss_detail.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    header: headerData,
    skiplinks: skiplinksData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData.variants.rrbDetail.props, {
        pageTitle: 'OSS Datensatz Detail',
        breadcrumb: {
          path: [
            {
              title: 'Zurück zur Übersicht',
              href: '#',
            },
          ],
        },
      }),
      leadSectionData: _.merge({}, defLeadSectionData, {
        leadText:
          'Beschreibung des OSS-Datensatzes. Hier steht eine kurze Einführung in den Inhalt und Zweck des vorliegenden Datensatzes.',
        noMarginTop: true,
      }),
      smallcaptionData: {
        headingLevel: 3,
        text: 'Dokument(e)',
      },
      downloadListData: {
        title: false,
        links: [
          {
            link: {
              linkListItemTitle: 'Datensatz_OSS',
              linkListItemIsDownload: true,
              linkListItemLabel: 'PDF | 6 Seiten | 100KB',
              linkListItemHref:
                'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
          },
        ],
      },
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
      langSwitchData: defLangSwitchData,
    },
  },
});

module.exports = data;
