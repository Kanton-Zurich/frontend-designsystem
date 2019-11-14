const dataHelper = require('@unic/estatico-data');
const bannerData = require('./banner.data');

dataHelper.getFileContent('banner.vote.mock.hbs');

const data = bannerData.variants.referendum.props;

module.exports = data;
