/*!
 * JurisdictionFinder
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Locations from '../locations/locations';
import MapView from '../map_view/map_view';

class JurisdictionFinder extends Module {

  public ui: {
    element: HTMLDivElement,
    searchButton: HTMLButtonElement,
    searchInput: HTMLInputElement,
    searchInputClear: HTMLButtonElement,
    locations: HTMLDivElement,
    subtitle: HTMLHeadingElement,
    map: HTMLDivElement,
  };

  public options: {
    searchDelay: number,
    domSelectors: any,
    stateClasses: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      searchDelay: 100,
      domSelectors: {
        searchInput: '.mdl-jurisdiction_finder__form-input input',
        searchInputClear: '.mdl-jurisdiction_finder__form-input [data-buttontype="clear"]',
        searchButton: '.mdl-jurisdiction_finder__form-button button',
        locations: '.mdl-locations',
        subtitle: '.mdl-locations .mdl-locations__subtitle',
        map: '.mdl-locations .mdl-map_view [data-map-view=map]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ JurisdictionFinder.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
    this.ui.searchButton.addEventListener('click', () =>
      this.searchLocations(this.ui.searchInput.value ? this.ui.searchInput.value : ''));
    this.ui.searchInput.addEventListener('keypress', (event: any) => {
      if (event.key === 'Enter') {
        this.searchLocations(this.ui.searchInput.value ? this.ui.searchInput.value : '');
        event.preventDefault();
      }
    });
    this.ui.searchInputClear.addEventListener('click', () => {  this.searchLocations(''); });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }

  searchLocations(text) {
    this.ui.subtitle.innerText = this.ui.element.getAttribute('data-heading-pattern').replace('%s', text);
    this.ui.locations.dispatchEvent(new CustomEvent(Locations.events.filterLocations, { detail: { text: text }}));
    if (!this.ui.locations.classList.contains('visible')) {
      setTimeout(() => {
        this.ui.locations.classList.add('visible');
        this.ui.map.dispatchEvent(new CustomEvent(MapView.events.invalidateSize));
        this.ui.map.dispatchEvent(new CustomEvent(MapView.events.resetBounds));
      }, this.options.searchDelay);
    } else {
      this.ui.locations.dispatchEvent(new CustomEvent(Locations.events.triggerBackButton));
      this.ui.map.dispatchEvent(new CustomEvent(MapView.events.resetBounds));
    }
  }
}

export default JurisdictionFinder;
