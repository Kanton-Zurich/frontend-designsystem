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

// Approx. earth radius for Zurich ground level (km)
const EARTH_RADIUS_ZH = 6366.977;
const SELECT_ZOOM = 14;

const mapOptions: L.MapOptions = {
  crs: L.CRS.EPSG3857,
  maxZoom: 18,
  minZoom: 9,
  scrollWheelZoom: false,
  zoomAnimation: true,
  zoomControl: false,
  attributionControl: false,
};

const { markerClasses } = MapViewDefaultOptions.stateClasses;
const markerIconDefault = L.divIcon({ className: markerClasses.default, iconSize: [0, 0] });
const markerIconHighlight = L.divIcon({ className: markerClasses.highlight, iconSize: [0, 0] });
const markerIconSelected = L.divIcon({ className: markerClasses.selected, iconSize: [0, 0] });
const markerIconHidden = L.divIcon({ className: markerClasses.hidden, iconSize: [0, 0] });
const userPosIcon = L.divIcon({ className: markerClasses.userPos, iconSize: [0, 0] });

class MapView extends Module {
  public options: MapViewModuleOptions;

  public ui: {
    element: HTMLDivElement,
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
  private clusterGroup: any;
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
      userLocated: `eventname.${MapView.name}.user_located`,
      showHideMarker: `eventname.${MapView.name}.marker_show_hide`,
      invalidateSize: `eventname.${MapView.name}.invalidate_size`,
      resetBounds: `eventname.${MapView.name}.reset_bounds`,
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
        this.ui.zoomOutBtn.classList.remove(this.options.stateClasses.controlDisabled);
        if (this.map.getZoom() === this.map.getMaxZoom()) {
          this.ui.zoomInBtn.classList.add(this.options.stateClasses.controlDisabled);
        } else {
          this.ui.zoomInBtn.classList.remove(this.options.stateClasses.controlDisabled);
        }
      })
      .on('click', this.options.domSelectors.zoomOutBtn, () => {
        this.map.zoomOut();
        this.ui.zoomInBtn.classList.remove(this.options.stateClasses.controlDisabled);
        if (this.map.getZoom() === this.map.getMinZoom()) {
          this.ui.zoomOutBtn.classList.add(this.options.stateClasses.controlDisabled);
        } else {
          this.ui.zoomOutBtn.classList.remove(this.options.stateClasses.controlDisabled);
        }
      })
      .on('click', this.options.domSelectors.centerBtn, () => {
        this.map.locate();
        this.ui.centerBtn.classList.add(this.options.stateClasses.controlDisabled);
      });

    this.ui.mapContainer
      .addEventListener(MapView.events.fixMarker, this.onExternalSelect.bind(this));
    this.ui.mapContainer
      .addEventListener(MapView.events.highlightMarker, this.onExtMarkerHighlight.bind(this));
    this.ui.mapContainer
      .addEventListener(MapView.events.showHideMarker, this.onExtMarkerShowHide.bind(this));
    this.ui.mapContainer
      .addEventListener(MapView.events.invalidateSize, this.onExtInvalidateSize.bind(this));
    this.ui.mapContainer
      .addEventListener(MapView.events.resetBounds, this.onExtResetBounds.bind(this));
  }

  private onExtMarkerHighlight(ev: MarkerEvent): void {
    this.log('External marker highlight on marker idx = ', ev.detail.idx);
    const targetMarkerIdx = ev.detail.idx;
    if (targetMarkerIdx >= 0 && targetMarkerIdx < this.markers.length) {
      this.markers[targetMarkerIdx].fireEvent('mouseover');
    } else {
      this.markers.forEach((m) => {
        m.fire('mouseout');
      });
    }
  }

  private onExtMarkerShowHide(ev: MarkerEvent): void {
    this.log('External marker show hide idx = ', ev.detail.idx);
    const targetMarkerIdx = ev.detail.idx;
    const targetMarkerVisible = ev.detail.visible;
    if (targetMarkerVisible) {
      this.markers[targetMarkerIdx].setIcon(markerIconDefault);
    } else {
      this.markers[targetMarkerIdx].setIcon(markerIconHidden);
    }
  }

  private onExtInvalidateSize(): void {
    this.map.invalidateSize();
  }

  private onExtResetBounds(): void {
    this.setBounds();
  }

  private onExternalSelect(ev: MarkerEvent): void {
    this.doSelectMarker(ev.detail.idx);
  }

  private doSelectMarker(markerIdx?: number): void {
    this.log('Selected marker: ', markerIdx);
    this.markers.forEach((m, i) => {
      if (i === markerIdx) {
        m.setIcon(markerIconSelected);
        this.markers.forEach((mm) => {
          mm.setZIndexOffset(0);
        });
        const mc = m;
        setTimeout(() => {mc.setZIndexOffset(1);}, 600); // eslint-disable-line
      } else if (m.getIcon().options.className !== 'mdl-map_view__marker_hidden') {
        m.setIcon(markerIconDefault);
      }
    });

    this.markerSelected = markerIdx >= 0 && markerIdx < this.markers.length;

    if (this.markers[markerIdx]) {
      setTimeout(() => {
        this.clusterGroup.unspiderfy();
        setTimeout(() => {
          this.map.setView(this.markers[markerIdx].getLatLng(), SELECT_ZOOM);
        }, 100);
      }, 0);
    } else {
      setTimeout(() => {
        this.setBounds();
      }, 0);
    }

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
    const zhWmsUrl = this.ui.element.getAttribute('data-url');
    const getMapBaseLayer = () => L.tileLayer.wms(zhWmsUrl, {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: false,
      layers: this.ui.element.getAttribute('data-base-layers'),
    });
    const getLabelLayer = () => wms.overlay(zhWmsUrl, {
      version: '1.3.0',
      format: 'image/png; mode=8bit',
      transparent: true,
      layers: this.ui.element.getAttribute('data-label-layers'),
    });
    this.map = new L.Map(this.ui.mapContainer, mapOptions);
    getMapBaseLayer().addTo(this.map);
    getLabelLayer().addTo(this.map);

    if (this.ui.centerBtn) {
      this.log('User locate enabled.');
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
          }
          this.map.panTo(userLatLng);

          const distances = this.getDistancesToMarkerLocations(userLatLng);
          this.ui.mapContainer.dispatchEvent(MapView.userLocatedEvent(userLatLng, distances));
          this.ui.centerBtn.classList.remove(this.options.stateClasses.controlDisabled);
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
      this.clusterGroup = L.markerClusterGroup({

        iconCreateFunction: cluster => L.divIcon({
          iconSize: [0, 0],
          html: `<div class="mdl-map_view__clustericon">${cluster.getChildCount()}</div>`,
        }),
        showCoverageOnHover: false,
        disableClusteringAtZoom: SELECT_ZOOM,
      });

      this.markers.forEach((m, idx) => {
        m.on('mouseover', (ev) => {
          this.log('Marker mouseover', ev.target);
          if (!this.markerSelected) {
            ev.target.setIcon(markerIconHighlight);
            this.ui.mapContainer.dispatchEvent(MapView.markerMouseOverEvent(idx));
          }
        }).on('mouseout', (ev) => {
          this.log('Marker mouseout', ev);
          if (!this.markerSelected && ev.target.getIcon().options.className !== 'mdl-map_view__marker_hidden') {
            ev.target.setIcon(markerIconDefault);
            this.ui.mapContainer.dispatchEvent(MapView.markerMouseOverEvent());
          }
        }).on('click', (ev) => {
          this.log('Marker click', ev);
          this.doSelectMarker(idx);
          this.ui.mapContainer.dispatchEvent(MapView.markerMouseClickedEvent(idx));
          L.DomEvent.stopPropagation(ev);
        });
        this.clusterGroup.addLayer(m);
      });
      this.map.addLayer(this.clusterGroup);

      if (this.markers.length === 1) {
        this.ui.element.classList.add(this.options.stateClasses.singleItem);
        this.doSelectMarker(0);
      }
    }
    this.setBounds();
  }

  private setBounds() {
    if (this.markers.length > 0) {
      // set map bounds
      const markerGroup = L.featureGroup(this.markers);
      this.map.fitBounds(markerGroup.getBounds(),
        { maxZoom: 12, padding: [15, 38] }); // eslint-disable-line no-magic-numbers
    } else {
      // get bounds if available
      const rawBounds = this.ui.element.getAttribute('bounds');
      if (rawBounds) {
        const bounds: [number, number][] = [[0, 0], [0, 0]];
        rawBounds.split(',').forEach(((c, index) => {
          bounds[index < 2 ? 0 : 1][index % 2] = parseFloat(c); // eslint-disable-line
        }));
        this.map.fitBounds(bounds);
      }
    }
  }

  private getDistancesToMarkerLocations(userLatLng: L.LatLng) {
    const distances: number[] = [];
    this.markers.forEach((m) => {
      const markerLatLng = m.getLatLng();
      const normD = this.haversine(markerLatLng, userLatLng);
      distances.push(normD * EARTH_RADIUS_ZH);
    });

    return distances;
  }

  /**
   * Method applies Haversine formula on 2 LatLng Expressions.
   * (see https://en.wikipedia.org/wiki/Haversine_formula)
   * Result is the distance of the two locations given by the LatLng values assuming
   * a perfect sphere of radius = 1.
   *
   * @param latLng1
   * @param latLng2
   *
   * @returns the distance of both oints on a perfect sphere.
   */
  private haversine(latLng1: L.LatLng, latLng2: L.LatLng) {
    const dLat = this.deg2rad(latLng1.lat - latLng2.lat);
    const dLng = this.deg2rad(latLng1.lng - latLng2.lng);
    const h = Math.sin(dLat / 2) * Math.sin(dLat / 2) // eslint-disable-line no-magic-numbers
      + Math.cos(this.deg2rad(latLng1.lat)) * Math.cos(this.deg2rad(latLng2.lat))
      * Math.sin(dLng / 2) * Math.sin(dLng / 2); // eslint-disable-line no-magic-numbers
    return 2 * Math.asin(Math.sqrt(h)); // eslint-disable-line no-magic-numbers
  }

  /**
   * Converts angles measured in degree to radian values.
   *
   * @param deg angle measured in degree
   * @returns angle measured in radian
   */
  private deg2rad(deg: number) {
    return deg * (Math.PI / 180); // eslint-disable-line no-magic-numbers
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }

  static extMarkerHighlightEvent(highlightIndex: number): MarkerEvent {
    return new CustomEvent(MapView.events.highlightMarker, { detail: { idx: highlightIndex } });
  }
  static extMarkerShowHide(highlightIndex: number, visible: boolean): MarkerEvent {
    return new CustomEvent(MapView.events.showHideMarker,
      { detail: { idx: highlightIndex, visible } });
  }
  static extMarkerSelectEvent(selectIndex: number): MarkerEvent {
    return new CustomEvent(MapView.events.fixMarker, { detail: { idx: selectIndex } });
  }
  static markerMouseOverEvent(highlightIndex?: number): MarkerEvent {
    return new CustomEvent(
      MapView.events.markerMouseOver,
      { detail: { idx: highlightIndex === undefined ? -1 : highlightIndex } },
    );
  }
  static markerMouseClickedEvent(clickedIndex?: number): MarkerEvent {
    return new CustomEvent(
      MapView.events.markerClicked,
      { detail: { idx: clickedIndex === undefined ? -1 : clickedIndex } },
    );
  }
  static userLocatedEvent(locateLatLng: L.LatLng, distances: number[]): UserLocateEvent {
    return new CustomEvent(
      MapView.events.userLocated,
      { detail: { locateLatLng, markerDistances: distances } },
    );
  }
}
export interface MarkerEvent extends CustomEvent<{ idx: number, visible?: boolean }>{}
export interface UserLocateEvent
  extends CustomEvent<{ locateLatLng: L.LatLng, markerDistances: number[] }>{}
export default MapView;
