const dataHelper = require('@unic/estatico-data');
const bannerData = require('./banner.data');

dataHelper.getFileContent('banner.conference1.mock.hbs');

const data = bannerData.variants.liveStream.props;

module.exports = data;
