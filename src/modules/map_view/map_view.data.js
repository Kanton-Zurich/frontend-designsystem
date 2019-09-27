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
    mapId: 'map',
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
    directionsBtn: _.merge({}, defButtonData, {
      text: 'Route anzeigen',
      icon: 'directions',
      isBig: true,
      isAnchor: true,
      additionalAttribute: 'target="_blank" data-map-view="directionsBtn"',
    }),
    mapMarker: [],
    directions: {
      enabled: false,
      urlTemplate: 'https://www.google.com/maps/dir/?api=1&destination={lat},{lng}',
    },
  },
});
const variants = _.mapValues({
  dev: {
    meta: {
      title: 'Develop',
      desc: 'Develop with sized container and event trigger.',
    },
    props: {
      devMode: true,
      mapMarker: [
        { lat: 47.353611, lng: 8.512877 },
        { lat: 47.444240, lng: 8.613319 },
        { lat: 47.441567, lng: 8.461398 },
        { lat: 47.515148, lng: 8.693981 },
        { lat: 47.532225, lng: 8.527852 },
        { lat: 47.271530, lng: 8.585463 },
      ],
      directions: {
        enabled: true,
      },
    },
  },
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
