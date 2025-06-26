const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').variants.defaultWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants
  .newsDetail.props;
const defImageFigureData = require('../../modules/image_figure/image_figure.data.js');
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data');
const defImageGalleryData = require('../../modules/image_gallery/image_gallery.data');
const defLinklistData = require('../../modules/linklist/linklist.data');
const defPersonCardData = require('../../modules/person_card/person_card.data.js');
const defDownloadListData = require('../../modules/download_list/download_list.data');
const defTagGroupData = require('../../modules/tag_group/tag_group.data');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'News-Detailseite 2',
    jira: 'CZHDEV-514',
    content: dataHelper.getFileContent('news_detail_2.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Hochschulgebiet Zürich Zentrum',
        breadcrumb: {
          path: [
            {
              title: 'Zurück',
              href: '../news_overview/news_overview.html',
            },
          ],
        },
      }),
      leadSectionData: {
        leadText:
          'Das Ziel des Generationenprojekts HGZZ ist es, die Lehre, Forschung und medizinische Versorgung im Hochschulgebiet zu sichern, weiter zu stärken, miteinander die städtebauliche Qualität zu erhöhen und ein lebendiges Hochschulquartier zu schaffen. Die Projektverantwortlichen von Kanton und Stadt Zürich sowie UniversitätsSpital Zürich (USZ), Universität Zürich (UZH) und ETH Zürich haben gemeinsam einen konkreten Einblick auf das künftige Hochschulgebiet gegeben.',
        noMarginTop: true,
      },
      imageFigureData: defImageFigureData,
      newsTeaserData: defNewsTeaserData.variants.withoutLinklist.props,
      imageGalleryData: defImageGalleryData.variants.default.props,
      linklistData: _.merge({}, _.omit(defLinklistData.variants.default.props, ['links']), {
        isLast: true,
        linkListTitle: '',
        links: [
          {
            linkListItemTitle: 'Zur Webseite des Hochschulgebiet Zürich Zentrum',
            linkListItemHref: '#',
            target: '_blank',
          },
        ],
      }),
      downloadListData: _.merge({}, defDownloadListData.props, {
        marginBottom: true,
        isLast: true,
      }),
      personCardData: defPersonCardData.variants.noImageAlt.props,
      tagGroupData: defTagGroupData.props,
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
