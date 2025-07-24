const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const pageHeader = require('../../modules/page_header/page_header.data.js').variants
  .govPlatformStart.props;

const policyAreaList = require('../../modules/policy_area_list/policy_area_list.data.js').variants
  .default.props;
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
const quote = require('../../modules/quote/quote.data.js').props;
const texthighlight = require('../../modules/texthighlight/texthighlight.data.js').variants.text
  .props;
const newsletterForm = require('../../modules/newsletter_form/newsletter_form.data.js').variants
  .default.props;

const teaser = require('../../modules/teaser/teaser.data.js').variants.default.props;
const publicationTeaser = require('../../modules/publication_teaser/publication_teaser.data.js')
  .variants.default.props;

const closingImage = require('../../modules/closing_image/closing_image.data.js').props;
const feedback = require('../../modules/feedback/feedback.data.js').props;
const contact = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const footer = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Regierungsplattform Startseite',
    jira: 'CZHDEV-3426',
    content: dataHelper.getFileContent('government_homepage.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeader,

      richtext,
      policyAreaList,
      table,
      imageFigure,
      imageGallery,
      video,
      downloadList,
      accordion,
      locations,
      serviceList,
      linklist,
      quote,
      texthighlight,
      newsletterForm,
      teaser,
      publicationTeaser,

      closingImage,
      feedback,
      contact,
      footer,
    },
  },
});

module.exports = data;
