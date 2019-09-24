/*!
 * MapView
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import * as L from 'leaflet';
import * as wms from 'leaflet.wms';

/* eslint-disable no-magic-numbers */
const mapOptions = {
  crs: L.CRS.EPSG3857,
  maxBounds: L.latLngBounds(L.latLng(48, 5.8), L.latLng(45.6, 10.9)),
  maxBoundsViscosity: 0.5,
  center: L.latLng(47.3776662, 8.5365413),
  zoom: 12,
  maxZoom: 18,
  minZoom: 9,
  zoomAnimation: false,
};
/* eslint-enable no-magic-numbers */
const kzhIcon = L.divIcon({ className: 'mdl-map__marker', iconSize: [0, 0] });

class MapView extends Module {
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.initMap();
  }

  static get events() {
    return {
      // eventname: `eventname.${ MapView.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  private initMap(): void {
    const url = 'https://wms.zh.ch/ZHWEB?';
    const map = new L.Map('map', mapOptions);

    L.tileLayer.wms(url, {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: false,
      layers: 'ZHBase',
    }).addTo(map);

    wms.overlay(url, {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: true,
      layers: 'ZHLabels',
    }).addTo(map);

    L.marker([47.3776662,8.5365413], { icon: kzhIcon }).addTo(map);

    // Zur Überprüfung, ob alle aktuellen Layer angezeigt werden
    // L.WMS.layer(url, 'ZHWEB', {
    //   version: '1.3.0',
    //   format: 'image/png; mode=8bit',
    //   transparent: true,
    //   layers: 'ZHWEB'
    // }).addTo(map);
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default MapView;
