const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const defPageHeaderData = require('../../modules/page_header/page_header.data').variants.facts
  .props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.smallMailOnly
  .props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants
  .withoutLinklist.props;
const defZhLexData = require('../../modules/zhlex/zhlex.data.js').variants.default.props;
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').variants.parentOnly
  .props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Suche',
        anchorlinkAdress: 'zhlex_search',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Sachregister',
        anchorlinkAdress: 'zhlex_index',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Information & Hilfe',
        anchorlinkAdress: 'zhlex_info',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Bestellungen',
        anchorlinkAdress: 'zhlex_order',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'ZH-Lex Suche',
    jira: 'CZHDEV-1240',
    content: dataHelper.getFileContent('zhlex_data.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    defaultColorVariation: 'cv-turqoise',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Zürcher Gesetzessammlung ZH-Lex',
        inverted: true,
        buttonData: false,
        breadcrumb: defBreadcrumbData,
        leadSection: {
          leadText:
            'In der Loseblattsammlung (LS) finden Sie das aktuell geltende Zürcher Recht. Es ist in 14 Bänden nach Sachgebieten geordnet. In der Offiziellen Gesetzessammlung (OS) wird das kantonale Recht chronologisch publiziert.',
        },
      }),
      anchorNav: defAnchorNavData,
      zhlex: defZhLexData,
      downloadList: {
        title: false,
        links: [
          {
            link: {
              linkListItemTitle: 'Tipps und Hinweise zur Suchfunktion',
              linkListItemIsDownload: true,
              linkListItemLabel: 'PDF | 1 Seite | 2MB',
              linkListItemHref:
                'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
            serviceLink: '../../modules/service_list/service_page.mock.html',
            href: '../service/service.html',
            modalData: { modalId: 'service-modal0' },
          },
        ],
      },
      newsTeaserData: defNewsTeaserData,
      releatedContentData: _.merge({}, defReleatedContentData, {
        anchorNavReference: 'related_content',
      }),
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact_title' }),
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
