const _ = require('lodash');

const defaultData = require('../../data/default.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Colors',
  },
  additionalLayoutClass: 'sg_colors',
});

module.exports = data;
