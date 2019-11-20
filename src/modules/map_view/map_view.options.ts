interface ModuleDomSelectors {
  mapContainer: string,
  zoomInBtn: string,
  zoomOutBtn: string,
  centerBtn: string,
  directionsBtn: string,
  directionsUrlTemplateInput: string,
  markerProps: string,
  markerPropsLat: string,
  markerPropsLng: string,
}
interface ModuleStateClasses {
  singleItem: string,
  directionsBtnVisible: string,
  controlDisabled: string,
  markerClasses: {
    default: string,
    highlight: string,
    selected: string,
    userPos: string,
  }
}
export interface MapViewModuleOptions {
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const domSelectors: ModuleDomSelectors = {
  mapContainer: '[data-map-view=map]',
  zoomInBtn: '[data-map-view=zoomInBtn]',
  zoomOutBtn: '[data-map-view=zoomOutBtn]',
  centerBtn: '[data-map-view=centerBtn]',
  directionsUrlTemplateInput: '[data-map-view=urlTemplateDirections]',
  directionsBtn: '[data-map-view=directionsBtn]',
  markerProps: '[data-map-view=markerProps]',
  markerPropsLat: '[data-map-view=marker_lat]',
  markerPropsLng: '[data-map-view=marker_lng]',
};
const stateClasses: ModuleStateClasses = {
  singleItem: 'mdl-map_view--single-item',
  directionsBtnVisible: 'visible',
  controlDisabled: 'disabled',
  markerClasses: {
    default: 'mdl-map_view__marker',
    highlight: 'mdl-map_view__marker_highlight',
    selected: 'mdl-map_view__marker_selected',
    userPos: 'mdl-map_view__userposition',
  },
};

export const MapViewDefaultOptions: MapViewModuleOptions = { // eslint-disable-line
  domSelectors,
  stateClasses,
};
