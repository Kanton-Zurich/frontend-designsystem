const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../data/default.data.js');

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getColorMap() {
  const colors = dataHelper.getColors('../../assets/css/data/colors.json');
  return colors.map((x) => {
    const rgb = hexToRgb(x.color);
    const meanValue = (rgb.r + rgb.g + rgb.b) / 3.0; //eslint-disable-line
    return {
      name: x.name,
      color: x.color,
      blackSmall: meanValue > 120,//eslint-disable-line
      whiteSmall: meanValue < 120,//eslint-disable-line
      blackLarge: meanValue > 60,//eslint-disable-line
      whiteLarge: meanValue < 140, //eslint-disable-line
    };
  });
}

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Colors',
  },
  colors: getColorMap(),
  additionalLayoutClass: 'sg_colors',
});

module.exports = data;
