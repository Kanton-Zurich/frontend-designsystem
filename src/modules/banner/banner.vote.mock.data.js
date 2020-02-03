const _ = require('lodash');
const defaultData = require('./banner.mock.data');

const data = _.merge({}, defaultData, {
  icon: '#vote',
  isReferendum: true,
  bannerUID: 'banner_vote1',
});

module.exports = data;
