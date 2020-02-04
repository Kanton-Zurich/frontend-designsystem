const _ = require('lodash');
const defaultData = require('./banner.mock.data');

const data = _.merge({}, defaultData, {
  bannerUID: 'banner_warning',
  isWarning: true,
  icon: '#caution',
});

module.exports = data;
