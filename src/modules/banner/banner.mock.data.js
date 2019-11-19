const dataHelper = require('@unic/estatico-data');
const bannerData = require('./banner.data');

dataHelper.getFileContent('banner.mock.hbs');

const data = bannerData.variants.default.props;

module.exports = data;
