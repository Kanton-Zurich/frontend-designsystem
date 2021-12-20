const _ = require('lodash');

const defaultData = require('../../data/default.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Farben',
  },
  additionalLayoutClass: 'sg_colors',
});

data.wrappingElements.pageHeaderData.breadcrumb.path = [
  {
    title: 'Kanton Zürich',
    href: '../../index.html',
  },
  {
    title: 'Farben',
  },
];

module.exports = data;
