const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defModalData = require('../modal/modal.data');
const defServiceWrapper = require('../service_wrapper/service_wrapper.data');

dataHelper.getFileContent('service_page.mock.hbs');

const data = {
  servicePageHeaderData: _.merge({},
    defModalData.variants.default.props.modules.servicePageHeaderData),
  serviceBoxData: _.merge({}, defModalData.variants.default.props.modules.serviceBoxData),
  canonical: 'http://www.zh.ch/de/mobilitaet/internationaler-fuehrerschein.html',
  serviceWrapper: defServiceWrapper.props,
};

module.exports = data;
