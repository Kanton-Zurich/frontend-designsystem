/*!
 * Locations
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import MapView from '../map_view/map_view';

class Locations extends Module {
  private static classNames = {
    SIDEBAR_OPENED: 'opened',
    SIDEBAR_NOT_FOUND: 'empty',
    SIDEBAR_ON_DETAILS: 'show-details',
    DETAIL_SHOW: 'show',
    MAP_MARKER_IS_HOVERED: 'marker-hovered',
  };

  public ui: {
    element: HTMLDivElement,
    filterInput: HTMLInputElement,
    sidebar: HTMLDivElement,
    backBtn: HTMLButtonElement,
    listItems: HTMLAnchorElement | HTMLAnchorElement[],
    detailNodes: HTMLDivElement | HTMLDivElement[],
    map: HTMLDivElement,
    toggleListBtn: HTMLButtonElement,
    emptyListHint: HTMLDivElement,
    notFoundTextTemplate: HTMLTemplateElement,
  };

  public options: {
    focusDelay: number,
    domSelectors: any,
    stateClasses: any,
  };

  private keepMapHighlight: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      focusDelay: 500,
      domSelectors: {
        map: '#locations-map',
        listItems: '[data-locations="listItem"]',
        filterInput: '[data-locations="input"]',
        sidebar: '[data-locations="sidebar"]',
        backBtn: '[data-locations="back"]',
        detailNodes: '[data-locations="locationDetails"]',
        toggleListBtn: '[data-locations="toggleList"]',
        emptyListHint: '[data-locations="emptyNote"]',
        notFoundTextTemplate: '[data-locations="emptyNoteTextTemplate"]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initWatchers();
    this.initEventListeners();

    // init sideBar state (i.e. Tabindices)
    this.toggleSidebarTabIndices(false, true);
  }

  static get events() {
    return {
      // eventname: `eventname.${ Locations.name }.${  }`
    };
  }

  initWatchers() {
    this.watch(this.ui.filterInput, 'value', this.onFilterValueChange.bind(this));
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.listItems, (event, target) => {
        this.log('ListItem Click Event', event, target);
        this.toggleLocationDetails(target);
      })
      .on('keyup', this.options.domSelectors.listItems, (event, target) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Enter') {
          this.log('ListItem Keypress "Enter"', event, target);
          this.toggleLocationDetails(target);
        }
      })
      .on('mouseover', this.options.domSelectors.listItems, (event, target) => {
        this.log('ListItem MouseOver Event', event, target);
        const itemIndex = target.parentElement.getAttribute('data-linklist-itemindex');
        this.log('Hover over item index: ', itemIndex);
        this.highlightInMap(itemIndex);
      })
      .on('mouseout', this.options.domSelectors.listItems, (event, target) => {
        this.log('ListItem MouseOut Event', event, target);
        this.highlightInMap();
      })
      .on('click', this.options.domSelectors.backBtn, (event, target) => {
        this.log('BackBtn Click: ', event, target);
        this.toggleLocationDetails();
      })
      .on('keyup', this.options.domSelectors.backBtn, (event, target) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          this.log('BackBtn Keypress "Escape"', event, target);
          this.toggleLocationDetails();
        }
      })
      .on('keyup', this.options.domSelectors.detailNodes, (event, target) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          this.log('DetaiNodes Keypress "Escape"', event, target);
          this.toggleLocationDetails();
        }
      })
      .on('click', this.options.domSelectors.toggleListBtn, (event, target) => {
        this.log('ToggleListBtn Click: ', event, target);
        const sidebarClasses = this.ui.sidebar.classList;
        if (sidebarClasses.contains(Locations.classNames.SIDEBAR_OPENED)) {
          sidebarClasses.remove(Locations.classNames.SIDEBAR_OPENED);
        } else {
          sidebarClasses.add(Locations.classNames.SIDEBAR_OPENED);
        }
      });

    this.ui.map
      .addEventListener(MapView.events.markerMouseOver, (ev: CustomEvent) => {
        const markerMouseOverIdx = ev.detail.idx;
        this.log('Mouseover from map on marker', markerMouseOverIdx);

        if (this.ui.listItems[0]) {
          (this.ui.listItems as HTMLAnchorElement[]).forEach((listItem, i) => {
            if (markerMouseOverIdx === i) {
              listItem.classList.add(Locations.classNames.MAP_MARKER_IS_HOVERED);
            } else {
              listItem.classList.remove(Locations.classNames.MAP_MARKER_IS_HOVERED);
            }
          });
        } else {
          const singleItemsClasses = (this.ui.listItems as HTMLAnchorElement).classList;
          if (markerMouseOverIdx === 0) {
            singleItemsClasses.add(Locations.classNames.MAP_MARKER_IS_HOVERED);
          } else {
            singleItemsClasses.remove(Locations.classNames.MAP_MARKER_IS_HOVERED);
          }
        }
      });
  }

  private toggleLocationDetails(selectEventTarget?: HTMLElement): void {
    let clickedItemIndex: string;

    if (selectEventTarget) {
      clickedItemIndex = selectEventTarget.parentElement.getAttribute('data-linklist-itemindex');
      this.log('Clicked item index: ', clickedItemIndex);
      this.ui.sidebar.classList.add(Locations.classNames.SIDEBAR_ON_DETAILS);
      this.toggleSidebarTabIndices(true);
    } else {
      this.log('Unselect location');
      this.ui.sidebar.classList.remove(Locations.classNames.SIDEBAR_ON_DETAILS);
      this.toggleSidebarTabIndices();
    }

    this.showLocationDetailsForIndex(clickedItemIndex);
    this.highlightInMap(clickedItemIndex, true);
  }

  private toggleSidebarTabIndices(onDetails: boolean = false, initialLoad: boolean = false): void {
    if (this.ui.listItems[0]) {
      (<HTMLAnchorElement[]> this.ui.listItems).forEach((listItem) => {
        this.setTabable(listItem, !onDetails);
      });
    } else {
      this.setTabable((<HTMLAnchorElement> this.ui.listItems), !onDetails);
    }
    this.setTabable(this.ui.filterInput, !onDetails);
    this.setTabable(this.ui.backBtn, onDetails);

    if (!onDetails) {
      this.showLocationDetailsForIndex('', !initialLoad);
    }
  }

  private setTabable(el: HTMLElement, tabable: boolean) {
    el.setAttribute('tabindex', tabable ? '0' : '-1');
  }

  private onFilterValueChange(propName, valueBefore, valueAfter) {
    this.log('Filter Value changed', valueAfter);
    const sidebarClasses = this.ui.sidebar.classList;
    if (!sidebarClasses.contains(Locations.classNames.SIDEBAR_OPENED)) {
      sidebarClasses.add(Locations.classNames.SIDEBAR_OPENED);
    }
    this.filterListItemsByText(valueAfter);
  }

  private filterListItemsByText(filterText: string): void {
    if (filterText) {
      const pattern = new RegExp(filterText, 'i');

      const listItems = this.ui.listItems as HTMLAnchorElement[];
      let countHidden = 0;
      listItems.forEach((listNode) => {
        const parentClasses = listNode.parentElement.classList;
        if (pattern.test(listNode.innerText)) {
          parentClasses.remove('hide');
        } else {
          parentClasses.add('hide');
          countHidden += 1;
        }
      });

      if (countHidden === listItems.length) {
        this.ui.emptyListHint.childNodes.forEach((childNode) => {
          if (!childNode.hasChildNodes() && childNode.textContent
            && childNode.textContent.trim().length > 0) {
            childNode.textContent = this.ui.notFoundTextTemplate.content.textContent.replace('{searchTerm}', filterText);
          }
        });
        this.ui.sidebar.classList.add(Locations.classNames.SIDEBAR_NOT_FOUND);
      } else {
        this.ui.sidebar.classList.remove(Locations.classNames.SIDEBAR_NOT_FOUND);
      }
    }
  }

  private showLocationDetailsForIndex(indexString?: string, setHeadFocus: boolean = true): void {
    let indexToShow = -1;
    if (indexString) {
      indexToShow = Number.parseInt(indexString, 10);
    }
    if (this.ui.detailNodes[0]) {
      (<HTMLDivElement[]> this.ui.detailNodes).forEach((detailsContainer, i) => {
        if (i === indexToShow) {
          detailsContainer.classList.add(Locations.classNames.DETAIL_SHOW);
        } else {
          detailsContainer.classList.remove(Locations.classNames.DETAIL_SHOW);
        }
        detailsContainer.querySelectorAll('a').forEach((anchorEl) => {
          this.setTabable(anchorEl, indexToShow === i);
        });
      });
    } else {
      const detailsContainer = <HTMLDivElement> this.ui.detailNodes;
      if (indexToShow === 0) {
        detailsContainer.classList.add(Locations.classNames.DETAIL_SHOW);
      } else {
        detailsContainer.classList.remove(Locations.classNames.DETAIL_SHOW);
      }
      detailsContainer.querySelectorAll('a').forEach((anchorEl) => {
        this.setTabable(anchorEl, indexToShow === 0);
      });
    }

    if (setHeadFocus) {
      if (indexToShow > -1) {
        setTimeout(() => {
          this.ui.backBtn.focus();
        }, this.options.focusDelay);
      } else {
        setTimeout(() => {
          this.ui.filterInput.focus();
        }, this.options.focusDelay);
      }
    }
  }

  private highlightInMap(indexString?: string, force?: boolean): void {
    if (!this.keepMapHighlight || force) {
      let highlightIndex = -1;
      if (indexString) {
        highlightIndex = Number.parseInt(indexString, 10);
      }

      this.log('Dispatch Marker highlight');
      this.ui.map.dispatchEvent(MapView.extMarkerHighlightEvent(highlightIndex));

      if (force) {
        this.keepMapHighlight = highlightIndex > -1;
      }
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

export default Locations;
