const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const headerData = require('../../modules/header/header.data').props;

const breadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.parentOnly
  .props;

const objectivesList = require('../../modules/objectives_list/objectives_list.data.js').variants
  .singleItemWithH2.props;
const measuresList = require('../../modules/measures_list/measures_list.data.js').variants.default
  .props;
const richtext = require('../../modules/richtext/richtext.data.js').variants.default.props;
const table = require('../../modules/table/table.data.js').variants.default.props;
const tableFinance = require('../../modules/table/table.data.js').variants.finance.props;
const imageFigure = require('../../modules/image_figure/image_figure.data.js').variants.default
  .props;
const imageGallery = require('../../modules/image_gallery/image_gallery.data.js').variants.default
  .props;
const video = require('../../modules/video/video.data.js').variants.default.props;
const downloadList = require('../../modules/download_list/download_list.data.js').variants.default
  .props;
const linklist = require('../../modules/linklist/linklist.data.js').variants.default.props;
const accordion = require('../../modules/accordion/accordion.data.js').variants.default.props;
const locations = require('../../modules/locations/locations.data.js').variants.default.props;
const serviceList = require('../../modules/service_list/service_list.data.js').variants.default
  .props;
const linklistNoTitle = require('../../modules/linklist/linklist.data.js').variants.noTitle.props;
const quote = require('../../modules/quote/quote.data.js').props;
const texthighlight = require('../../modules/texthighlight/texthighlight.data.js').variants.text
  .props;
const newsletterForm = require('../../modules/newsletter_form/newsletter_form.data.js').variants
  .default.props;
const iframe = require('../../modules/iframe/iframe.data.js').variants.default.props;
const openData = require('../../modules/open_data/open_data.data.js').variants.default.props;
const application = require('../../modules/application/application.data.js').variants.default.props;
const factsSection = require('../../modules/facts_section/facts_section.data.js').variants.default
  .props;

const teaser = require('../../modules/teaser/teaser.data.js').variants.default.props;
const publicationTeaser = require('../../modules/publication_teaser/publication_teaser.data.js')
  .variants.default.props;
const peopleTeaser = require('../../modules/people_teaser/people_teaser.data.js').variants.default
  .props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js')
  .variants.default.props;
const teaserSet = require('../../modules/teaser_set/teaser_set.data.js').variants.reportsTeaser
  .props;
const siblingNavigation = require('../../modules/sibling_navigation/sibling_navigation.data.js')
  .variants.reports.props;
const contentList = require('../../modules/content_list/content_list.data.js').variants.default
  .props;

const closingImage = require('../../modules/closing_image/closing_image.data.js').props;
const feedback = require('../../modules/feedback/feedback.data.js').props;
const contact = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const footer = require('../../modules/footer/footer.data.js').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Services',
        anchorlinkAdress: 'services',
        anchorlinkIsActive: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
        anchorlinkIsActive: false,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: 'news_teaser',
        anchorlinkIsActive: false,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Ähnliche Inhalte',
        anchorlinkAdress: 'related_content',
        anchorlinkIsActive: false,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Zuständigkeiten',
        anchorlinkAdress: 'responsibilities',
        anchorlinkIsActive: false,
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Artikel Detailseite',
    jira: 'CZHDEV-4342',
    content: dataHelper.getFileContent('article_detail.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    header: headerData,
    modules: {
      pageHeaderData: {
        pageTitle: '2.1  Strukturen',
        breadcrumb: breadcrumbData,
      },
      leadSectionData: {
        leadText:
          'Bericht über den Stand der Aufgabenteilung zwischen Kanton und Gemeinden sowie den Handlungsspielraum der Gemeinden bei der Erfüllung ihrer Aufgaben.',
        newsCategory: 'Gemeinde- und Wirksamkeitsbericht 2021',
        publicationDate: '14.02.2022',
        noMarginTop: true,
      },
      anchorNav: defAnchorNavData,
      objectivesList,
      measuresList,
      richtext,
      table,
      tableFinance,
      imageFigure,
      imageGallery,
      video,
      downloadList,
      linklist,
      accordion,
      locations,
      serviceList,
      moreInfo: linklistNoTitle,
      lawsList: linklistNoTitle,
      decistionsList: linklistNoTitle,
      quote,
      texthighlight,
      newsletterForm,
      teaser,
      publicationTeaser,
      peopleTeaser,
      iframe,
      openData,
      application,
      factsSection,
      releatedContentData: _.merge({}, defReleatedContentData, {
        anchorNavReference: 'related_content',
      }),
      tagGroupData: _.merge({}, defTagGroupData, { anchorNavReference: 'responsibilities' }),
      teaserSet,
      siblingNavigation,
      contentList,

      closingImage,
      feedback,
      contact,
      footer,
      backToData,
    },
  },
});

module.exports = data;
