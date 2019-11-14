const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').variants.inverted.props;
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;

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
      pageHeaderData: defPageHeaderData.variants.rrbDetail.props,
      metablockData: {
        title: 'Details',
        hasTopTitle: true,
        headingLevel: 3,
        rows: [
          {
            columns: [
              {
                label: 'Text',
                text: 'Anfrage Barbara Günthard Fitze, Winterthur, Daniel Sommer, Affoltern  a. Albis, und Beat Monhart, Gossau, betreffend Abfallreduktion,  Beantwortung',
              },
            ],
          },
          {
            columns: [
              {
                label: 'RRB Nr.',
                text: '3.1',
              },
              {
                label: 'Direktion',
                text: 'Baudirektion (BD)',
              },
            ],
          },
          {
            columns: [
              {
                label: 'Sitzungsdatum',
                text: '22.08.2018',
              },
              {
                label: 'Publikationsdatum',
                text: '30.09.2018',
              },
            ],
          },
        ],
      },
      smallcaptionData: {
        headingLevel: 3,
        text: 'Beschlusstext(e)',
      },
      downloadListData: {
        title: false,
        marginBottom: true,
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
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
    },
  },
});

module.exports = data;
