const dataHelper = require('@unic/estatico-data');
const bannerData = require('./banner.data');

dataHelper.getFileContent('banner.subtitle.mock.hbs');

const data = bannerData.variants.withSubtitle.props;

module.exports = data;
