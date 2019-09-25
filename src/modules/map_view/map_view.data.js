const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defButtonData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('map_view.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Map View',
    className: 'MapView',
    jira: 'CZHDEV-441',
    documentation: dataHelper.getDocumentation('map_view.md'),
  },
  props: {
    withUserLocate: true,
    centerBtn: _.merge({}, defButtonData, {
      isTextVisible: false,
      icon: 'locate',
      isInverted: true,
      additionalAttribute: 'data-map-view="centerBtn"',
    }),
    zoomInBtn: _.merge({}, defButtonData, {
      isTextVisible: false,
      icon: 'plus',
      isInverted: true,
      additionalAttribute: 'data-map-view="zoomInBtn"',
    }),
    zoomOutBtn: _.merge({}, defButtonData, {
      isTextVisible: false,
      icon: 'minus',
      isInverted: true,
      additionalAttribute: 'data-map-view="zoomOutBtn"',
    }),
    mapMarker: [
      { lat: 47.3776662, lng: 8.5365413 },
      { lat: 47.39542, lng: 8.54123 },
      { lat: 47.5676662, lng: 8.43513 },
      { lat: 47.41662, lng: 8.4865413 },
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
