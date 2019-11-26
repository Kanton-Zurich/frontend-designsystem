const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defPageHeaderData = require('../../modules/page_header/page_header.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.smallMailOnly.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withoutLinklist.props;
const defFlexDataData = require('../../modules/flex_data/flex_data.data').variants.default.props;
const defFormData = require('../../modules/form/form.data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'ZH-Lex Suche',
    jira: 'CZHDEV-1240',
    content: dataHelper.getFileContent('zhlex_data.hbs'),
    documentation: dataHelper.getDocumentation('zhlex_data.md'),
  },
  props: {
    header: headerData,
    defaultColorVariation: 'cv-violetturqoise',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Entscheide',
        inverted: true,
        buttonData: false,
        leadText: 'Die Datenbank enthält wegleitende Entscheide des Regierungsrates, der Direktionen sowie der direktionsabhängigen und -zugeordneten Gremien ab dem 1. Juli 2001. Es handelt sich dabei um Rechtsmittelentscheide, vereinzelt um erstinstanzliche Anordnungen. Die veröffentlichten Entscheide sind in der Regel rechtskräftig.',
      }),
      downloadList1: {
        title: false,
        links: [
          {
            link: {
              linkListItemTitle: 'Tipps und Hinweise zur Suchfunktion',
              linkListItemIsDownload: true,
              linkListItemLabel: 'PDF | 1 Seite | 2MB',
              linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
          },
        ],
      },
      downloadList2: {
        title: false,
        links: [
          {
            link: {
              linkListItemTitle: 'Anonymisierungsrichtlinien',
              linkListItemIsDownload: true,
              linkListItemLabel: 'PDF | 1 Seite | 2MB',
              linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
          },
        ],
      },
      serviceList: {
        hasHeading: false,
        items: [
          {
            title: 'Separatdruck der Gesetzessammlung bestellen',
            buttonTitle: 'Start',
            serviceLink: 'service_page.mock.html',
            href: '../service/service.html',
            modalData: { modalId: 'service-modal0' },
          },
        ],
      },
      flexDataData: _.assign(_.merge({},defFlexDataData), {
        flexDataSource: '/mocks/modules/flex_data/flex_data_table_alt.json',
        flexTableFormData: _.merge({}, defFormData.variants.decisions.props),
        tableData: {
          tableTitle: '',
          hasTitle: true,
          tableHeadingLevel: 4,
          hasColumnHeader: true,
          isWide: true,
          isStatic: true,
          preSortedColumn: 'geschaeftsnummer',
          preSortedDirection: 'ascending',
          headers: [
            {
              title: 'Geschäftsnummer',
              dataColumnName: 'geschaeftsnummer',
              isSortable: 'enum',
            },
            {
              title: 'Entscheidungsinstanz',
              dataColumnName: 'entscheidungsinstanz',
              isSortable: 'alpha',
            },
            {
              title: 'Rechtsgebiet',
              dataColumnName: 'rechtsgebiet',
              isSortable: 'alpha',
            },
            {
              title: 'Entscheidungsdatum',
              dataColumnName: 'entscheidungsdatum',
              isSortable: 'enum',
            },
          ],
          bodyrows: [],
        },
      }),
      newsTeaserData: defNewsTeaserData,
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact' }),
      tagGroupData: _.assign(_.merge({}, defTagGroupData, { tagGroupdHeading: { anchorNavReference: 'responsibilities' } }),
        {
          anchorLinks: [
            { anchorlink:
                { anchorlinkText: 'Staatskanzlei',
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
