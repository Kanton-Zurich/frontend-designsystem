const dataHelper = require('@unic/estatico-data');
const bannerData = require('./banner.data');

dataHelper.getFileContent('banner.warning.mock.hbs');

const data = bannerData.variants.warning.props;

module.exports = data;
