const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const headerData = require('../../modules/header/header.data').props;

const richtext = require('../../modules/richtext/richtext.data.js').variants.default.props;
const table = require('../../modules/table/table.data.js').variants.default.props;
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

const teaser = require('../../modules/teaser/teaser.data.js').variants.default.props;
const publicationTeaser = require('../../modules/publication_teaser/publication_teaser.data.js')
  .variants.default.props;
const peopleTeaser = require('../../modules/people_teaser/people_teaser.data.js').variants.default
  .props;

const releatedContent = require('../../modules/related_content/related_content.data.js').variants
  .default.props;
const statisticsTeaser = require('../../modules/statistics_teaser/statistics_teaser.data.js')
  .variants.default.props;

const footer = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Statistik Detailseite',
    jira: 'CZHDEV-3819',
    content: dataHelper.getFileContent('statistics_detail.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    header: headerData,
    modules: {
      pageHeaderData: {
        pageTitle: 'Übersicht über alle Lernenden im Kanton Zürich',
        leadText:
          'Die Daten beziehen sich auf die Abschlüsse im Schuljahr 2020 /2021. In den Angaben zu den Mittelschulabschlüssen an öffentlichen Schulen sind die Abschlüsse der Kantonalen Maturitätsschule für Erwachsene enthalten.',
        newsCategory: '',
        publicationDate: '',
        breadcrumb: {
          backOnly: true,
          hasStorage: true,
          contextMenu: false,
          path: [
            {
              title: 'Zurück',
              href: '../topics/topics.html',
            },
          ],
        },
      },

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
      peopleTeaser,
      iframe,
      openData,
      application,
      releatedContent,
      statisticsTeaser,

      footer,
    },
  },
});

module.exports = data;
