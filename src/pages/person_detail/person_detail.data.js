const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').variants.defaultWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.facts
  .props;
const defImageFigureData = require('../../modules/image_figure/image_figure.data.js');
const defVideoData = require('../../modules/video/video.data.js');
const defAccordionData = require('../../modules/accordion/accordion.data.js');
const defTableData = require('../../modules/table/table.data.js');
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data');
const defImageGalleryData = require('../../modules/image_gallery/image_gallery.data');
const defLinklistData = require('../../modules/linklist/linklist.data');
const defcontactData = require('../../modules/contact/contact.data');
const defPersonCardData = require('../../modules/person_card/person_card.data.js');
const defSocialLinksData = require('../../modules/social_media_links/social_media_links.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Willkommen',
        anchorlinkAdress: 'welcome',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Standpunkte & Reden',
        anchorlinkAdress: 'speech',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Geplante Auftritte',
        anchorlinkAdress: 'events',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Bilder',
        anchorlinkAdress: 'pictures',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Biografie',
        anchorlinkAdress: 'bio',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Weiterführende Informationen',
        anchorlinkAdress: 'furtherinfo',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Scoial Media',
        anchorlinkAdress: 'socialmedia',
      },
    },
  ],
};

const defClearTableData = {
  tableHeadingLevel: 4,
  headers: [
    {
      title: '',
    },
    {
      title: '',
    },
    {
      title: '',
    },
    {
      title: '',
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Personen-Detailseite',
    jira: 'CZHDEV-515',
    content: dataHelper.getFileContent('person_detail.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Title',
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Regierungsrätin Jacqueline Fehr',
        buttonData: false,
        inverted: false,
        breadcrumb: null,
      }),
      leadSectionData: {
        leadText: 'Vorsteherin, Direktion der Justiz und des Innern',
        noMarginTop: true,
      },
      anchorNav: defAnchorNavData,
      imageFigureData: defImageFigureData,
      videoData: defVideoData.variants.default.props,
      accordionData: _.merge({}, defAccordionData.variants.default.props, {
        smallerHeadings: true,
        anchorNavReference: 'speech',
        heading: {
          title: 'Standpunkte & Reden',
        },
        items: [
          {
            title: '2019',
            accordionPanelID: _.uniqueId('accordionPersonDetailDemoId-'),
          },
          {
            title: '2018',
            accordionPanelID: _.uniqueId('accordionPersonDetailDemoId-'),
          },
          {
            title: '2017',
            accordionPanelID: _.uniqueId('accordionPersonDetailDemoId-'),
          },
          {
            title: '2016',
            accordionPanelID: _.uniqueId('accordionPersonDetailDemoId-'),
          },
        ],
      }),
      tableData1: _.merge(
        {},
        defTableData.variants.default.props,
        {
          tableTitle: 'Juni 2019',
        },
        defClearTableData
      ),
      tableData2: _.merge(
        {},
        defTableData.variants.default.props,
        {
          tableTitle: 'Juli 2019',
        },
        defClearTableData
      ),
      tableData3: _.merge(
        {},
        defTableData.variants.default.props,
        {
          tableTitle: 'August 2019',
        },
        defClearTableData
      ),
      newsTeaserData: defNewsTeaserData.variants.withoutLinklist.props,
      imageGalleryData: _.merge({}, defImageGalleryData.variants.default.props, {
        anchorNavReference: 'pictures',
      }),
      tableData4: _.merge(
        {},
        defTableData.variants.default.props,
        {
          tableTitle: 'Politische Tätigkeiten',
        },
        defClearTableData,
        {
          headers: [
            {
              title: 'Jahr',
              isSortable: false,
            },
            {
              title: 'Tätigkeit',
              isSortable: false,
            },
          ],
        }
      ),
      tableData5: _.merge(
        {},
        defTableData.variants.default.props,
        {
          tableTitle: 'Weitere Tätigkeiten',
        },
        defClearTableData,
        {
          headers: [
            {
              title: 'Jahr',
              isSortable: false,
            },
            {
              title: 'Tätigkeit',
              isSortable: false,
            },
          ],
        }
      ),
      linklistData: _.merge({}, _.omit(defLinklistData.variants.default.props, ['links']), {
        isLast: true,
        anchorNavReference: 'furtherinfo',
        linkListTitle: 'Weiterführende Information',
        links: [
          {
            linkListItemTitle: 'Zur Website von Jacqueline Fehr',
            linkListItemHref: '/',
          },
          {
            linkListItemTitle: 'Zum Wikipedia Eintrag von Jaqueline Fehr',
            linkListItemHref: 'https://www.google.ch',
            target: 'blank',
          },
        ],
      }),
      personCardData: _.merge({}, defPersonCardData.variants.default.props, {
        isStandalone: true,
      }),
      contactData: _.merge({}, defcontactData.variants.fullWidthLessData.props, {
        anchorNavReference: 'contact_title',
      }),
      socialLinksData: _.merge(
        {},
        _.omit(defSocialLinksData.variants.default.props, ['linkedIn'], ['youtube']),
        { anchorNavReference: 'socialmedia' }
      ),
      footerData: defFooterData,
      backToData,
    },
  },
});

data.props.modules.pageHeaderData.breadcrumb = {
  contextMenu: false,
  backOnly: true,
  path: [
    {
      title: 'Zurück',
      href: '#',
    },
  ],
};

module.exports = data;
