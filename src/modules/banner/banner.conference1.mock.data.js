const _ = require('lodash');
const defaultData = require('./banner.mock.data');

const data = _.merge({}, defaultData, {
  isLiveStream: true,
  icon: '#conference',
  link: {
    href: '#',
    label: 'Zur Live-Übertragung',
  },
  bannerUID: 'banner_conf1',
});

module.exports = data;
