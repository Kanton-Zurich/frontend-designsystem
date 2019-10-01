/*!
 * MapView
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
// eslint-disable-next-line no-unused-vars
import { MapViewDefaultOptions, MapViewModuleOptions } from './map_view.options';

import * as wms from 'leaflet.wms';
import 'leaflet';
import 'leaflet.markercluster';
// @ts-ignore
const { L } = window;

const mapOptions: L.MapOptions = {
  crs: L.CRS.EPSG3857,
  maxZoom: 18,
  minZoom: 9,
  zoomAnimation: false,
  zoomControl: false,
  attributionControl: false,
};

const zhWmsUrl = 'https://wms.zh.ch/ZHWEB?';
const getMapBaseLayer = () => L.tileLayer.wms(zhWmsUrl, {
  version: '1.3.0',
  format: 'image/png; mode=8bit',
  transparent: false,
  layers: 'ZHBase',
});
const getLabelLayer = () => wms.overlay(zhWmsUrl, {
  version: '1.3.0',
  format: 'image/png; mode=8bit',
  transparent: true,
  layers: 'ZHLabels',
});

const { markerClasses } = MapViewDefaultOptions.stateClasses;
const markerIconDefault = L.divIcon({ className: markerClasses.default, iconSize: [0, 0] });
const markerIconHighlight = L.divIcon({ className: markerClasses.highlight, iconSize: [0, 0] });
const markerIconSelected = L.divIcon({ className: markerClasses.selected, iconSize: [0, 0] });
const userPosIcon = L.divIcon({ className: markerClasses.userPos, iconSize: [0, 0] });

interface MarkerEvent extends CustomEvent<{ idx: number}>{}

class MapView extends Module {
  public options: MapViewModuleOptions;

  public ui: {
    element: Element,
    mapContainer: HTMLDivElement,
    zoomInBtn: HTMLElement,
    zoomOutBtn: HTMLElement,
    centerBtn: HTMLElement,
    directionsBtn: HTMLAnchorElement,
    directionsUrlTemplateInput: HTMLInputElement,
  };

  private map: L.Map;
  private markers: L.Marker[];
  private userPosMarker: L.Marker;

  private markerSelected: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, MapViewDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.initMap();
  }

  static get events() {
    return {
      highlightMarker: `eventname.${MapView.name}.ext_marker_highlight`,
      markerMouseOver: `eventname.${MapView.name}.marker_mouseover`,
      markerClicked: `eventname.${MapView.name}.marker_clicked`,
      fixMarker: `eventname.${MapView.name}.ext_marker_fix`,
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
          { setView: true },
        );
      });

    this.ui.mapContainer
      .addEventListener(MapView.events.fixMarker, this.onExternalSelect.bind(this));
    this.ui.mapContainer
      .addEventListener(MapView.events.highlightMarker, this.onExtMarkerHighlight.bind(this));
  }

  private onExtMarkerHighlight(ev: MarkerEvent): void {
    this.log('External marker highlight on marker idx = ', ev.detail.idx);
    const targetMarkerIdx = ev.detail.idx;
    if (targetMarkerIdx >= 0 && targetMarkerIdx < this.markers.length) {
      this.markers[targetMarkerIdx].fireEvent('mouseover');
    } else {
      this.markers.forEach(m => m.fire('mouseout'));
    }
  }

  private onExternalSelect(ev: MarkerEvent): void {
    this.doSelectMarker(ev.detail.idx);
  }

  private doSelectMarker(markerIdx?: number): void {
    this.log('Selected marker: ', markerIdx);
    this.markers.forEach((m, i) => {
      if (i === markerIdx) {
        m.setIcon(markerIconSelected);
      } else {
        m.setIcon(markerIconDefault);
      }
    });
    this.markerSelected = markerIdx >= 0 && markerIdx < this.markers.length;

    if (this.ui.directionsBtn && this.ui.directionsUrlTemplateInput) {
      const { directionsBtn } = this.ui;

      if (this.markerSelected) {
        const urlTemplate = this.ui.directionsUrlTemplateInput.value;
        const latLng = this.markers[markerIdx].getLatLng();
        directionsBtn.href = urlTemplate
          .replace('{lat}', latLng.lat.toString())
          .replace('{lng}', latLng.lng.toString());
        directionsBtn.parentElement.classList.add(this.options.stateClasses.directionsBtnVisible);
      } else {
        directionsBtn.parentElement.classList
          .remove(this.options.stateClasses.directionsBtnVisible);
      }
    }
  }

  private initMap(): void {
    this.map = new L.Map(this.ui.mapContainer, mapOptions);
    getMapBaseLayer().addTo(this.map);
    getLabelLayer().addTo(this.map);

    if (this.ui.centerBtn) {
      this.log('User locate enabled. Requesting user location.');
      this.map.locate();
      this.map.on('locationfound', (ev: L.LocationEvent) => {
        this.log('Locationfound event: ', ev);
        const userLatLng = ev.latlng;
        if (userLatLng) {
          if (!this.userPosMarker) {
            this.userPosMarker = L.marker(
              userLatLng,
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
    this.map.on('click', () => {
      this.doSelectMarker();
      this.ui.mapContainer.dispatchEvent(MapView.markerMouseClickedEvent());
    });
    this.setMarker();
  }

  private setMarker(): void {
    this.markers = [];
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
            this.markers.push(L.marker([lat, lng], {
              icon: markerIconDefault,
            }));
          }
        }
      });


    if (this.markers.length > 0) {
      if (this.markers.length === 1) {
        this.ui.element.classList.add(this.options.stateClasses.singleItem);
        this.doSelectMarker(0);
      }
      const clusterGroup = L.markerClusterGroup({

        iconCreateFunction: cluster => L.divIcon({
          iconSize: [0, 0],
          html: `<div class="mdl-map_view__clustericon">${cluster.getChildCount()}</div>`,
        }),
        showCoverageOnHover: false,
      });
      // set map bounds
      const markerGroup = L.featureGroup(this.markers);
      this.map.fitBounds(markerGroup.getBounds(), { maxZoom: 12 });

      this.markers.forEach((m, idx) => {
        m.on('mouseover', (ev) => {
          this.log('Marker mouseover', ev.target);
          if (!this.markerSelected) {
            ev.target.setIcon(markerIconHighlight);
            this.ui.mapContainer.dispatchEvent(MapView.markerMouseOverEvent(idx));
          }
        }).on('mouseout', (ev) => {
          this.log('Marker mouseout', ev);
          if (!this.markerSelected) {
            ev.target.setIcon(markerIconDefault);
            this.ui.mapContainer.dispatchEvent(MapView.markerMouseOverEvent());
          }
        }).on('click', (ev) => {
          this.log('Marker click', ev);
          this.doSelectMarker(idx);
          this.ui.mapContainer.dispatchEvent(MapView.markerMouseClickedEvent(idx));
          L.DomEvent.stopPropagation(ev);
        });
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

  static extMarkerHighlightEvent(highlightIndex: number) {
    return new CustomEvent(MapView.events.highlightMarker, { detail: { idx: highlightIndex } });
  }
  static extMarkerSelectEvent(selectIndex: number) {
    return new CustomEvent(MapView.events.fixMarker, { detail: { idx: selectIndex } });
  }
  static markerMouseOverEvent(highlightIndex?: number) {
    return new CustomEvent(
      MapView.events.markerMouseOver,
      { detail: { idx: highlightIndex === undefined ? -1 : highlightIndex } },
    );
  }
  static markerMouseClickedEvent(clickedIndex?: number) {
    return new CustomEvent(
      MapView.events.markerClicked,
      { detail: { idx: clickedIndex === undefined ? -1 : clickedIndex } },
    );
  }
}

export default MapView;
