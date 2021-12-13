const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.fullsize.props;
const headerData = require('../../modules/header/header.data').props;

const defPageHeaderData = require('../../modules/page_header/page_header.data').variants.application.props;
const defApplicationData = require('../../modules/application/application.data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Applikationsseite',
    jira: 'CZHDEV-533',
    content: dataHelper.getFileContent('application.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Applikation',
    text: '',
    defaultColorVariation: 'cv-darkblue',
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      application: defApplicationData.variants.fullWidth.props,
      pageHeader: _.merge({}, defPageHeaderData, {
        pageTitle: 'Applikation',
      }),
    },
  },
});

module.exports = data;
