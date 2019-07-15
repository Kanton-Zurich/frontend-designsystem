const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defModalData = require('../modal/modal.data');

dataHelper.getFileContent('service_page.mock.hbs');

const data = {
  servicePageHeaderData: _.merge({},
    defModalData.variants.default.props.modules.servicePageHeaderData),
  serviceBoxData: _.merge({}, defModalData.variants.default.props.modules.serviceBoxData),
};


module.exports = data;
