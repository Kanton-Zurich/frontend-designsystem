const _ = require('lodash');
const path = require('path');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('./data/default.data.js');

const colorPalette = [
  '#71b359',
  '#d99100',
  '#a700b3',
  '#ffbfc8',
  '#3000b3',
  '#00b38f',
  '#bfffd0',
  '#b20000',
  '#80d5ff',
  '#d96ca6',
  '#7340ff',
  '#ff7340',
  '#6c98d9',
  '#ff0066',
  '#d9c36c',
  '#ff00FF',
  '#d9a66c',
  '#00ffaa',
  '#d96c6c',
  '#88ff00',
  '#00cad9',
  '#ffee00',
];

const luminance = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return Math.sqrt((0.299 * r) ** 2 + (0.587 * g) ** 2 + (0.114 * b) ** 2 );
};

const transform = (originalData, filePath) => {
  const previewUrl = path.relative('./src/', filePath).replace('.data.js', '.html');

  const data = _.merge({}, originalData, {
    meta: {
      previewUrl,
    },
  });

  return data;
};

const data = _.merge({}, defaultData, {
  atoms: dataHelper.getDataGlob('./src/atoms/**/*.data.js', transform),
  pages: dataHelper.getDataGlob('./src/pages/**/*.data.js', transform),
  modules: dataHelper.getDataGlob('./src/modules/**/*.data.js', transform),
  styleguide: dataHelper.getDataGlob('./src/preview/styleguide/*.data.js', transform),
});


data.pages = _.sortBy(data.pages, item => item.meta.title);

const modules = _
  .groupBy(_.filter(data.modules, item => item.meta.title), item => item.meta.label);

data.modules = [];
const labelGroups = Object.keys(modules);
labelGroups.forEach((label, index) => {
  modules[label] = _.sortBy(modules[label], item => item.meta.title);
  modules[label].forEach((module) => {
    module.meta.labelBackground = colorPalette[index];
    module.meta.labelColor = luminance(colorPalette[index]) > 120.0 ? '#000000' : '#FFFFFF';
  });
  data.modules.push(modules[label]);
});

data.styleguide = _.sortBy(data.styleguide, item => item.meta.title);

data.atoms = _.sortBy(data.atoms, item => item.meta.title);

module.exports = data;
