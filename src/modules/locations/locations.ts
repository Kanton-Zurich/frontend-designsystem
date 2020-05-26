/*!
 * Locations
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import MapView,
{ MarkerEvent, UserLocateEvent } // eslint-disable-line no-unused-vars
  from '../map_view/map_view';
import {
  DefaultOptions,
  LocationsModuleOptions, // eslint-disable-line no-unused-vars
} from './locations.options';
import WindowEventListener from '../../assets/js/helpers/events';

class Locations extends Module {
  public ui: {
    element: HTMLDivElement,
    filterInput: HTMLInputElement,
    sidebar: HTMLDivElement,
    backBtn: HTMLButtonElement,
    filterHead: HTMLDivElement,
    linkList: HTMLDivElement,
    listItems: HTMLAnchorElement | HTMLAnchorElement[],
    detailNodes: HTMLDivElement | HTMLDivElement[],
    map: HTMLDivElement,
    toggleListBtn: HTMLButtonElement,
    emptyListHint: HTMLDivElement,
    notFoundTextTemplate: HTMLTemplateElement,
  };

  public options: LocationsModuleOptions;

  private keepMapHighlight: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, DefaultOptions, data, options);

    this.initUi();
    this.initWatchers();
    this.initEventListeners();

    // init sideBar state (i.e. Tabindices)
    this.toggleSidebarTabIndices(false, true);
  }

  static get events() {
    return {
      filterLocations: `eventname.${Locations.name}.filter_locations`,
      triggerBackButton: `eventname.${Locations.name}.trigger_back_button`,
    };
  }

  initWatchers() {
    if (this.ui.filterInput) {
      this.watch(this.ui.filterInput, 'value', this.onFilterValueChange.bind(this));
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.listItems, (event, target) => {
        this.log('ListItem Click Event', event, target);
        this.onListItemsSelect(target);
      })
      .on('keyup', this.options.domSelectors.listItems, (event, target) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Enter') {
          this.log('ListItem Keypress "Enter"', event, target);
          this.onListItemsSelect(target);
        }
      })
      .on('mouseover', this.options.domSelectors.listItems, (event, target) => {
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
        this.onListItemsSelect();
      })
      .on('keyup', this.options.domSelectors.backBtn, (event, target) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          this.log('BackBtn Keypress "Escape"', event, target);
          this.onListItemsSelect();
        }
      })
      .on('keyup', this.options.domSelectors.detailNodes, (event, target) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          this.log('DetaiNodes Keypress "Escape"', event, target);
          this.onListItemsSelect();
        }
      })
      .on('click', this.options.domSelectors.toggleListBtn, (event, target) => {
        this.log('ToggleListBtn Click: ', event, target);
        const sidebarClasses = this.ui.sidebar.classList;
        if (sidebarClasses.contains(this.options.stateClasses.sidebar.opened)) {
          sidebarClasses.remove(this.options.stateClasses.sidebar.opened);
        } else {
          sidebarClasses.add(this.options.stateClasses.sidebar.opened);
        }
      });

    this.ui.map
      .addEventListener(MapView.events.markerMouseOver, (ev: MarkerEvent) => {
        const markerMouseOverIdx = ev.detail.idx;
        this.log('Mouseover from map on marker', markerMouseOverIdx);

        if (this.ui.listItems && [].slice.call(this.ui.listItems).length > 0
          && this.ui.listItems[0]) {
          (this.ui.listItems as HTMLAnchorElement[]).forEach((listItem, i) => {
            if (markerMouseOverIdx === i) {
              listItem.classList.add(this.options.stateClasses.mapMarkerIsHovered);
            } else {
              listItem.classList.remove(this.options.stateClasses.mapMarkerIsHovered);
            }
          });
        } else {
          const singleItemsClasses = (this.ui.listItems as HTMLAnchorElement).classList;
          if (markerMouseOverIdx === 0) {
            singleItemsClasses.add(this.options.stateClasses.mapMarkerIsHovered);
          } else {
            singleItemsClasses.remove(this.options.stateClasses.mapMarkerIsHovered);
          }
        }
      });

    this.ui.map
      .addEventListener(MapView.events.markerClicked, (ev: MarkerEvent) => {
        if ([].slice.call(this.ui.listItems).length > 1) {
          const clickedIdx = ev.detail.idx;
          this.log('Marker clicked in map', clickedIdx);
          this.toggleLocationDetails(clickedIdx);
        }
      });

    this.ui.map
      .addEventListener(MapView.events.userLocated, (ev: UserLocateEvent) => {
        this.log('User located event: ', ev.detail);
        if (ev.detail.markerDistances) {
          const distances = ev.detail.markerDistances;
          if (distances.length > 1) {
            (<HTMLElement[]> this.ui.listItems).forEach((item, i) => {
              this.addDistanceToListItem(item, distances[i]);
            });
          } else if (distances.length === 1) {
            this.addDistanceToListItem(this.ui.listItems as HTMLElement, distances[0]);
          }

          this.sortListItemsByDistance();
        }
      });

    if (this.ui.filterInput) {
      this.ui.filterInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      });
    }

    this.ui.element
      .addEventListener(Locations.events.filterLocations, this.onFilterEvent.bind(this));
    this.ui.element
      .addEventListener(Locations.events.triggerBackButton, this.onTriggerBackButton.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.setSideBarScrollArea.bind(this));
    this.setSideBarScrollArea();
  }

  private onListItemsSelect(selectEventTarget?: HTMLElement): void {
    let selectedItemIndex: number = -1;

    if (selectEventTarget && selectEventTarget.parentElement) {
      const targetItemIndexStr = selectEventTarget.parentElement
        .getAttribute(this.options.attrNames.itemIndex);
      try {
        selectedItemIndex = Number.parseInt(targetItemIndexStr, 10);
      } catch (e) {
        this.log('Failed to parse itemindex attribute. ', e);
      }
    }
    this.log('Dispatch marker fix');
    this.ui.map.dispatchEvent(MapView.extMarkerSelectEvent(selectedItemIndex));

    this.toggleLocationDetails(selectedItemIndex);
  }

  private onFilterValueChange(propName, valueBefore, valueAfter) {
    this.log('Filter Value changed', valueAfter);
    const sidebarClasses = this.ui.sidebar.classList;
    if (!sidebarClasses.contains(this.options.stateClasses.sidebar.opened)) {
      sidebarClasses.add(this.options.stateClasses.sidebar.opened);
    }
    this.filterListItemsByText(valueAfter);
  }

  private onFilterEvent(evt: any) {
    const { autoOpenSingleItem, text } = evt.detail;
    this.ui.backBtn.click();
    this.filterListItemsByText(text, autoOpenSingleItem);
  }

  private onTriggerBackButton() {
    this.ui.backBtn.click();
  }

  private setSideBarScrollArea() {
    this.ui.linkList.style.height = `calc(100% - ${this.ui.filterHead.clientHeight + 8}px)`; // eslint-disable-line
  }

  private addDistanceToListItem(item: HTMLElement, d: number) {
    const distanceNote = item.querySelector(this.options.domSelectors.distanceAnnotation);
    if (distanceNote) {
      const fomatedDistanceString = d.toLocaleString('de', { maximumFractionDigits: 1 });
      distanceNote.innerHTML = `${fomatedDistanceString}&nbsp;km`;
    }
    item.parentElement.setAttribute(this.options.attrNames.locDistance, d.toString());
  }

  private sortListItemsByDistance() {
    if (this.ui.listItems && [].slice.call(this.ui.listItems).length > 0 && this.ui.listItems[0]) {
      const lis: HTMLElement[] = [];
      (this.ui.listItems as HTMLElement[]).forEach((item) => {
        lis.push(item.parentElement);
      });

      lis.sort((a, b) => {
        const distA = a.getAttribute(this.options.attrNames.locDistance);
        const distB = b.getAttribute(this.options.attrNames.locDistance);
        return parseInt(distA, 10) - parseInt(distB, 10);
      });

      const ul = lis[0].parentNode;
      lis.forEach((sortItem) => {
        ul.appendChild(sortItem);
      });
    }
  }

  private toggleLocationDetails(selectedItemIdx: number, singleItem: boolean = false): void {
    if (selectedItemIdx >= 0) {
      this.ui.sidebar.classList.add(this.options.stateClasses.sidebar.onDetails);
      this.ui.sidebar.classList.add(this.options.stateClasses.sidebar.opened);
      if (singleItem) {
        this.ui.backBtn.classList.add('hidden');
      } else {
        this.ui.backBtn.classList.remove('hidden');
      }
      this.toggleSidebarTabIndices(true);
    } else {
      this.ui.sidebar.classList.remove(this.options.stateClasses.sidebar.onDetails);
      this.ui.sidebar.classList.remove(this.options.stateClasses.sidebar.opened);
      this.toggleSidebarTabIndices();
    }

    this.showLocationDetailsForIndex(selectedItemIdx);
    this.highlightInMap(selectedItemIdx, true);
  }

  private toggleSidebarTabIndices(onDetails: boolean = false, initialLoad: boolean = false): void {
    if (this.ui.listItems && [].slice.call(this.ui.listItems).length > 0 && this.ui.listItems[0]) {
      (<HTMLAnchorElement[]> this.ui.listItems).forEach((listItem) => {
        this.setTabable(listItem, !onDetails);
      });
    } else {
      this.setTabable((<HTMLAnchorElement> this.ui.listItems), !onDetails);
    }
    this.setTabable(this.ui.filterInput, !onDetails);
    this.setTabable(this.ui.backBtn, onDetails);

    if (!onDetails) {
      this.showLocationDetailsForIndex(-1, !initialLoad);
    }
  }

  private setTabable(el: HTMLElement, tabable: boolean) {
    if (el) {
      el.setAttribute('tabindex', tabable ? '0' : '-1');
    }
  }

  private filterListItemsByText(filterText: string, autoOpenSingleItem: boolean = false): void {
    const pattern = new RegExp(filterText, 'i');
    const listItems = this.ui.listItems as HTMLAnchorElement[];
    let countHidden = 0;
    let lastIndex = -1;
    listItems.forEach((listNode, index) => {
      const { parentElement } = listNode;
      const searchText = listNode.hasAttribute('data-filter-attr')
        ? listNode.getAttribute('data-filter-attr') : listNode.innerText;
      if (pattern.test(searchText)) {
        this.ui.map.dispatchEvent(MapView.extMarkerShowHide(index, true));
        parentElement.style.removeProperty('display');
        parentElement.classList.remove('hide');
        parentElement.setAttribute('aria-hidden', 'false');
        lastIndex = index;
      } else {
        this.ui.map.dispatchEvent(MapView.extMarkerShowHide(index, false));
        parentElement.classList.add('hide');
        parentElement.style.display = 'none';
        parentElement.setAttribute('aria-hidden', 'true');
        countHidden += 1;
      }
    });

    if (countHidden === listItems.length) {
      if (this.ui.emptyListHint) {
        this.ui.emptyListHint.childNodes.forEach((childNode) => {
          if (!childNode.hasChildNodes() && childNode.textContent
            && childNode.textContent.trim().length > 0) {
            childNode.textContent = this.ui.notFoundTextTemplate.content
              .textContent.replace('{searchTerm}', filterText);
          }
        });
      }
      this.ui.sidebar.classList.add(this.options.stateClasses.sidebar.notFound);
    } else {
      this.ui.sidebar.classList.remove(this.options.stateClasses.sidebar.notFound);
    }

    if (autoOpenSingleItem && listItems.length - countHidden === 1) {
      setTimeout(() => {
        this.toggleLocationDetails(lastIndex, true);
        this.ui.map.dispatchEvent(new CustomEvent(MapView
          .events.fixMarker, { detail: { idx: lastIndex } }));
      }, 0);
    }
  }

  private showLocationDetailsForIndex(indexToShow: number, setHeadFocus: boolean = true): void {
    if (this.ui.detailNodes && [].slice.call(this.ui.detailNodes).length > 0
      && this.ui.detailNodes[0]) {
      (<HTMLDivElement[]> this.ui.detailNodes).forEach((detailsContainer, i) => {
        if (i === indexToShow) {
          detailsContainer.classList.add(this.options.stateClasses.detailShow);
          detailsContainer.setAttribute('aria-hidden', 'false');
        } else {
          detailsContainer.classList.remove(this.options.stateClasses.detailShow);
          detailsContainer.setAttribute('aria-hidden', 'true');
        }
        detailsContainer.querySelectorAll('a').forEach((anchorEl) => {
          this.setTabable(anchorEl, indexToShow === i);
        });
      });
    } else {
      const detailsContainer = <HTMLDivElement> this.ui.detailNodes;
      if (detailsContainer) {
        if (indexToShow === 0) {
          detailsContainer.classList.add(this.options.stateClasses.detailShow);
        } else {
          detailsContainer.classList.remove(this.options.stateClasses.detailShow);
        }
        detailsContainer.querySelectorAll('a').forEach((anchorEl) => {
          this.setTabable(anchorEl, indexToShow === 0);
        });
      }
    }

    if (setHeadFocus) {
      if (indexToShow > -1) {
        setTimeout(() => {
          this.ui.backBtn.focus();
        }, this.options.focusDelay);
      } else if (this.ui.filterInput) {
        setTimeout(() => {
          this.ui.filterInput.focus();
        }, this.options.focusDelay);
      }
    }
  }

  private highlightInMap(highlightIndex?: number, force?: boolean): void {
    if (!this.keepMapHighlight || force) {
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
