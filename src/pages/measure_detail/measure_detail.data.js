const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').props;

const pageHeader = require('../../modules/page_header/page_header.data.js').variants
  .govPlatformMeasure.props;
const leadSection = require('../../modules/lead_section/lead_section.data.js').variants
  .govPlatformMeasure.props;
const commentIntroduction =
  require('../../modules/comment_introduction/comment_introduction.data.js').variants.default.props;

const richtext = require('../../modules/richtext/richtext.data.js').variants.default.props;
const table = require('../../modules/table/table.data.js').variants.default.props;
const imageFigure = require('../../modules/image_figure/image_figure.data.js').variants.default
  .props;
const imageGallery = require('../../modules/image_gallery/image_gallery.data.js').variants.default
  .props;
const video = require('../../modules/video/video.data.js').variants.default.props;
const downloadList = require('../../modules/download_list/download_list.data.js').variants.default
  .props;
const accordion = require('../../modules/accordion/accordion.data.js').variants.default.props;
const locations = require('../../modules/locations/locations.data.js').variants.default.props;
const serviceList = require('../../modules/service_list/service_list.data.js').variants.default
  .props;
const linklist = require('../../modules/linklist/linklist.data.js').variants.default.props;
const linklistNoTitle = require('../../modules/linklist/linklist.data.js').variants.noTitle.props;
const quote = require('../../modules/quote/quote.data.js').props;
const texthighlight = require('../../modules/texthighlight/texthighlight.data.js').variants.text
  .props;
const newsletterForm = require('../../modules/newsletter_form/newsletter_form.data.js').variants
  .default.props;

const teaser = require('../../modules/teaser/teaser.data.js').variants.default.props;
const publicationTeaser = require('../../modules/publication_teaser/publication_teaser.data.js')
  .variants.default.props;

const objectivesList = require('../../modules/objectives_list/objectives_list.data.js').variants
  .default.props;
const tagGroup = require('../../modules/page_header/page_header.data.js').props;
const contact = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const footer = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Massnahme Detailseite',
    jira: 'CZHDEV-3456',
    content: dataHelper.getFileContent('measure_detail.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeader,
      leadSection,
      commentIntroduction,

      richtext,
      table,
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

      detailsMoreInfo: linklistNoTitle,
      objectivesList,
      policyArea: linklistNoTitle,
      tagGroup,
      contact,
      footer,
    },
  },
});

module.exports = data;
