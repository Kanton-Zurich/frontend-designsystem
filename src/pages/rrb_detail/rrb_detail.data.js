const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').variants.inverted.props;
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Regierungsratsbeschlüsse Detail',
    jira: 'CZHDEV-1236',
    content: dataHelper.getFileContent('rrb_detail.hbs'),
    documentation: dataHelper.getDocumentation('rrb_detail.md'),
  },
  props: {
    header: headerData,
    modules: {
      pageHeaderData: defPageHeaderData.variants.steuerBuch.props,
      metablockData: {
        title: 'Details',
        hasTopTitle: true,
        headingLevel: 3,
        items: [
          {
            label: 'Text',
            text: 'Merkblatt des kantonalen Steueramtes über das Verfahren bei Bestreitung der Steuerhoheit ab Steuerperiode 1999 nach dem neuen Steuergesetz vom 8. Juni 1997',
            wide: true,
          },
          {
            label: 'ZStB-Nummer',
            text: '3.1 ',
          },
          {
            label: 'Erlassdatum',
            text: '24. November 1999',
          },
          {
            label: 'Themenbereic',
            text: 'Natürliche Personen',
          },
          {
            label: 'Nummer alt',
            text: '11/050',
          },
          {
            label: 'Gültig ab',
            text: '1. Januar 1999',
          },
          {
            label: 'Stichworte',
            text: 'Steuerpflicht, Steuerhoheit',
          },
        ],
      },
      smallcaptionData: {
        headingLevel: 3,
        text: 'Beschlusstext(e)',
      },
      downloadListData: {
        title: false,
        links: [
          {
            link: {
              linkListItemTitle: 'RRB-2018-0749 ',
              linkListItemIsDownload: true,
              linkListItemLabel: 'PDF | 6 Seiten | 100KB',
              linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
          },
        ],
      },
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact' }),
      tagGroupData: _.assign(_.merge({}, defTagGroupData, { tagGroupdHeading: { anchorNavReference: 'responsibilities' } }),
        {
          anchorLinks: [ { anchorlink:
              { anchorlinkText: 'Steueramt',
                anchorlinkAdress: '#',
                anchorlinkIsActive: false,
                anchorlinkIsTagAnchor: true,
                anchorlinkIsInverted: true,
                anchorlinkIsTopitem: true,
                anchorlinkIsTopitemSmall: true } },
          ],
        }),
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
    },
  },
});

module.exports = data;
