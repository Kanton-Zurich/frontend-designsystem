const dataHelper = require('@unic/estatico-data');
const bannerData = require('./banner.data');

dataHelper.getFileContent('banner.conference2.mock.hbs');

const data = bannerData.variants.liveStreamWithPicture.props;

module.exports = data;
