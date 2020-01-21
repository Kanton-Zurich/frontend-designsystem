const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.smallMailOnly.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defSelectData = require('../../modules/select/select.data.js').variants.history.props;
const buttonDefaultData = require('../../atoms/button/button.data').variants.secondaryWithoutText.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'ZH-Lex Detailseite',
    jira: 'CZHDEV-1240',
    content: dataHelper.getFileContent('zhlex_detail.hbs'),
    documentation: dataHelper.getDocumentation('zhlex_detail.md'),
  },
  props: {
    header: _.merge({}, headerData, { inverted: true }),
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData.variants.rrbDetail.props, {
        pageTitle: 'Vertrag zwischen den Ständen Zürich und Schwyz betreffend die Hafengüter bei Richterswil',
        breadcrumb: {
          path: [
            {
              title: 'Zurück zur Übersicht',
              href: '#',
            },
          ],
        }
      }),
      selectData: defSelectData,
      metablockData: {
        headingLevel: 2,
        smallerHeadings: true,
        rows: [
          {
            columns: [
              {
                label: 'Erlasstitel',
                text: 'Vertrag zwischen den Ständen Zürich und Schwyz betreffend die Hafengüter bei Richterswil',
              },
            ],
          },
          {
            columns: [
              {
                label: 'Ordnungsnummer',
                text: '112',
              },
              {
                label: 'Kurztitel',
                text: '-',
              },
            ],
          },
          {
            columns: [
              {
                label: 'Erlassdatum',
                text: '19.05.1841',
              },
              {
                label: 'Inkraftsetzungsdatum',
                text: '19.05.1841',
              },
            ],
          },
          {
            columns: [
              {
                label: 'Aufhebungsdatum',
                text: '-',
              },
              {
                label: 'Ordner',
                text: '1',
              },
            ],
          },
          {
            columns: [
              {
                label: 'Publikationsdatum',
                text: '19.05.1841',
              },
              {
                label: 'Hinweise',
                text: '-',
              },
            ],
          },
          {
            columns: [
              {
                label: 'Link',
                text: 'http://www.zhlex.zh.ch/Erlass.html?Open&Ordnr=112',
                copyFunction: true,
              },
            ],
          },
        ],
        hasCopyFunction: true,
        copyBtn: _.merge({}, buttonDefaultData, {
          icon: 'link',
          additionalAttribute: 'data-metablock="copy"',
          text: 'Link kopieren',
        }),
        copySuccessNotification: {
          message: 'Der Link wurde in die Zwischenablage kopiert.',
          icon: '#confirm',
          isGreen: true,
          /* button: {
            label: 'Fertig',
            additionalAttributes: 'data-metablock="done"',
          }, */
        },
      },
      smallcaptionData: {
        headingLevel: 3,
        text: 'Erlasstext',
      },
      downloadListData: {
        title: false,
        links: [
          {
            link: {
              linkListItemTitle: '112_19.5.41_91',
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
        }),
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
    },
  },
});

module.exports = data;
