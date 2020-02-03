const _ = require('lodash');
const defaultData = require('./banner.mock.data');

const data = _.merge({}, defaultData, {
  subtitle: 'Zürcher Spitalplanung 2022',
  bannerUID: 'banner_subtitle',
});

module.exports = data;
