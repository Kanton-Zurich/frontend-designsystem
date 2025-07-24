const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const pageHeader = require('../../modules/page_header/page_header.data.js').variants
  .govPlatformPolicyAreaWithoutImage.props;
const measuresSearch = require('../../modules/measures_search/measures_search.data.js').variants
  .default.props;

const closingImage = require('../../modules/closing_image/closing_image.data.js').variants.default
  .props;
const feedback = require('../../modules/feedback/feedback.data.js').variants.default.props;
const contact = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;

const footer = require('../../modules/footer/footer.data').variants.default.props;
const backTo = require('../../modules/back_to/back_to.data.js').props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Massnahmen Übersichtsseite',
    jira: 'CZHDEV-3438',
    content: dataHelper.getFileContent('measures_overview.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeader,
      measuresSearch,
      closingImage,
      feedback,
      contact,
      footer,
      backTo,
    },
  },
});

module.exports = data;
