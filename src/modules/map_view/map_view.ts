/*!
 * MapView
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import * as wms from 'leaflet.wms';
import 'leaflet';
import 'leaflet.markercluster';

// @ts-ignore
const { L } = window;

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
      markerProps: string,
      markerPropsLat: string,
      markerPropsLng: string,
    }
    stateClasses: {

    }
  };

  public ui: {
    element: Element,
    mapContainer: HTMLDivElement,
    zoomInBtn: HTMLElement,
    zoomOutBtn: HTMLElement,
    centerBtn: HTMLElement,
    inputHighlightIdx: HTMLInputElement,
    inputSelectIdx: HTMLInputElement,
  };

  private map: L.Map;
  private marker: L.Marker[];
  private userPosMarker: L.Marker;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        mapContainer: '[data-map-view=map]',
        zoomInBtn: '[data-map-view=zoomInBtn]',
        zoomOutBtn: '[data-map-view=zoomOutBtn]',
        centerBtn: '[data-map-view=centerBtn]',
        markerProps: '[data-map-view=markerProps]',
        markerPropsLat: '[data-map-view=marker_lat]',
        markerPropsLng: '[data-map-view=marker_lng]',
        inputHighlightIdx: '[data-map-view=highlightIndex]',
        inputSelectIdx: '[data-map-view=selectIndex]',
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
        this.map.locate(
          // { setView: true } // TODO
        );
      });
  }

  private onHighlightValueChange(propName: string, valueBefore: string, valueAfter: string): void {
    this.log('Marker highlight: ', valueAfter);
  }

  private onMarkerSelectValueChange(propName, valueBefore, valueAfter): void {
    this.log('Marker selected: ', valueAfter);
  }

  private initMap(): void {
    const url = 'https://wms.zh.ch/ZHWEB?';
    this.map = new L.Map(this.ui.mapContainer, mapOptions);

    L.tileLayer.wms(url, {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: false,
      layers: 'ZHBase',
    }).addTo(this.map);

    wms.overlay(url, {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: true,
      layers: 'ZHLabels',
    }).addTo(this.map);

    if (this.ui.centerBtn) {
      this.log('User locate enabled. Requesting user location.');
      this.map.locate();
      this.map.on('locationfound', (ev: L.LocationEvent) => {
        this.log('Locationfound event: ', ev);
        const userLatLng = ev.latlng;
        if (userLatLng) {
          if (!this.userPosMarker) {
            this.userPosMarker = L.marker(
              // eslint-disable-next-line no-magic-numbers
              [47.4341, 8.46874], // TODO: For dev only
              // userLatLng,
              { icon: userPosIcon },
            ).addTo(this.map);
          } else {
            this.userPosMarker.setLatLng(userLatLng);
            this.map.fitBounds(ev.bounds);
          }
        }
      });
      this.map.on('locationerror', (errorEv: L.ErrorEvent) => {
        this.log('Failed to locate user.');
        this.log('Locationerror event: ', errorEv);
      });
    }
    this.setMarker();
  }

  private setMarker(): void {
    this.marker = [];
    this.ui.element.querySelectorAll<HTMLLIElement>(this.options.domSelectors.markerProps)
      .forEach((propertyNode) => {
        const latEl = propertyNode
          .querySelector<HTMLElement>(this.options.domSelectors.markerPropsLat);
        const lngEl = propertyNode
          .querySelector<HTMLElement>(this.options.domSelectors.markerPropsLng);

        if (latEl && lngEl) {
          const lat = Number.parseFloat(latEl.innerText);
          const lng = Number.parseFloat(lngEl.innerText);
          if (lat && lng) {
            this.marker.push(L.marker(
              [lat, lng],
              { icon: kzhIcon },
            ));
          }
        }
      });


    if (this.marker.length > 0) {
      const clusterGroup = L.markerClusterGroup({

        iconCreateFunction: cluster => L.divIcon({
          iconSize: [0, 0],
          html: `<div class="mdl-map_view__clustericon">${cluster.getChildCount()}</div>`,
        }),
      });
      // set map bounds
      const markerGroup = L.featureGroup(this.marker);
      this.map.fitBounds(markerGroup.getBounds());

      this.marker.forEach((m) => {
        clusterGroup.addLayer(m);
      });
      this.map.addLayer(clusterGroup);
    }
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
