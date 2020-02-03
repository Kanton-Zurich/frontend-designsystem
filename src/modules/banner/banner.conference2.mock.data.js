const _ = require('lodash');
const defaultData = require('./banner.mock.data');

const data = _.merge({}, defaultData, {
  isLiveStream: true,
  icon: '#conference',
  link: {
    href: '#',
    label: 'Zur Live-Übertragung',
  },
  image: {
    src: 'https://via.placeholder.com/300x300',
    alt: 'Alt-text',
  },
  bannerUID: 'banner_conf2',
});

module.exports = data;
