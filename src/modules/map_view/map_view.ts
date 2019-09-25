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
const mapOptions: L.MapOptions = {
  crs: L.CRS.EPSG3857,
  maxBounds: L.latLngBounds(L.latLng(48, 5.8), L.latLng(45.6, 10.9)),
  maxBoundsViscosity: 0.5,
  center: L.latLng(47.3776662, 8.5365413),
  zoom: 12,
  maxZoom: 18,
  minZoom: 11,
  zoomAnimation: false,
  zoomControl: false,
  attributionControl: false,
};
/* eslint-enable no-magic-numbers */
const kzhIcon = L.divIcon({ className: 'mdl-map_view__marker', iconSize: [0, 0] });
const userPosIcon = L.divIcon({ className: 'mdl-map_view__userposition', iconSize: [0, 0] });

class MapView extends Module {
  public options: {
    domSelectors: {
      zoomInBtn: string,
      zoomOutBtn: string,
      centerBtn: string,
    }
    stateClasses: {

    }
  };

  public ui: {
    element: Element,
    zoomInBtn: HTMLElement,
    zoomOutBtn: HTMLElement,
    centerBtn: HTMLElement,
  };

  private map: L.Map;

  private userPosMarker: L.Marker;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        zoomInBtn: '[date-map-view=zoomInBtn]',
        zoomOutBtn: '[date-map-view=zoomOutBtn]',
        centerBtn: '[date-map-view=centerBtn]',
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
    this.eventDelegate
      .on('click', this.options.domSelectors.zoomInBtn, () => {
        this.map.zoomIn();
      })
      .on('click', this.options.domSelectors.zoomOutBtn, () => {
        this.map.zoomOut();
      })
      .on('click', this.options.domSelectors.centerBtn, () => {
        this.map.locate();
      });
  }

  private initMap(): void {
    const url = 'https://wms.zh.ch/ZHWEB?';
    const map = new L.Map('map', mapOptions);

    // L.control.zoom({ position: 'bottomright' }).addTo(map);
    // L.control.locate().addTo(map);
    // map.locate()
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

    L.marker(
      [47.3776662, 8.5365413],
      { icon: kzhIcon },
    ).addTo(map);

    if (this.ui.centerBtn) {
      this.log('User locate enabled. Requesting user location.');
      map.locate();
      map.on('locationfound', (ev: L.LocationEvent) => {
        this.log('Locationfound event: ', ev);
        const userLatLng = ev.latlng;
        if (userLatLng) {
          if (!this.userPosMarker) {
            this.userPosMarker = L.marker(
              [47.4341, 8.46874], // userLatLng, TODO: For dev only
              { icon: userPosIcon },
            ).addTo(map);
          } else {
            this.userPosMarker.setLatLng(userLatLng);
          }
        }
      });
      map.on('locationerror', (errorEv: L.ErrorEvent) => {
        this.log('Failed to locate user.');
        this.log('Locationerror event: ', errorEv);
      });
    }

    // Zur Überprüfung, ob alle aktuellen Layer angezeigt werden
    wms.layer(url, 'ZHWEB', {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: true,
      layers: 'ZHWEB',
    }).addTo(map);

    this.map = map;
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
