const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defModalData = require('../modal/modal.data');
const defInstructionsData = require('../instructions/instructions.data');

dataHelper.getFileContent('service_page.mock.hbs');

const data = {
  servicePageHeaderData: _.merge({},
    defModalData.variants.default.props.modules.servicePageHeaderData),
  canonical: 'http://www.zh.ch/de/mobilitaet/internationaler-fuehrerschein.html',
  instructions: defInstructionsData.variants.serviceDemo.props,
};

module.exports = data;
