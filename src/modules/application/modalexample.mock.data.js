const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defApplicationData = require('../application/application.data.js');

dataHelper.getFileContent('modalexample.mock.hbs');

const data = {
  canonical: 'asdasdasd',
  modalData: {
    fullWidthApp: handlebars.compile(dataHelper.getFileContent('../application/application.hbs'))(
      defApplicationData.variants.fullWidth.props
    ),
    pageHeader: {
      pageTitle: 'Applikation',
      inverted: true,
      hasImageTitle: false,
      hasVideo: false,
      hasImage: false,
      hasBacklink: false,
      hasBreadcrumb: false,
      noButton: true,
      noText: true,
      minimal: true,
      hasCloseButton: true,
    },
  },
};

module.exports = data;
