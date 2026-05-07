/*!
 * Locations
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import MapView, { MarkerEvent, UserLocateEvent } from '../map_view/map_view';
import { DefaultOptions, LocationsModuleOptions } from './locations.options';
import WindowEventListener from '../../assets/js/helpers/events';

/**
 * Helper function to convert a NodeList or HTMLCollection to an array.
 *
 * @param {E | NodeListOf<E>} elements - the NodeList or HTMLCollection to convert
 * @returns {E[]} - the converted array
 */
const arrayFromMaybeNodeList = <E extends Element>(elements: E | NodeListOf<E>): E[] =>
  elements instanceof NodeList ? Array.from(elements) : [elements];

class Locations extends Module {
  public ui: {
    element: HTMLDivElement;
    filterInput: HTMLInputElement;
    sidebar: HTMLDivElement;
    backBtn: HTMLButtonElement;
    filterHead: HTMLDivElement;
    linkList: HTMLDivElement;
    listItems: HTMLButtonElement | NodeListOf<HTMLButtonElement>;
    detailNodes: HTMLDivElement | NodeListOf<HTMLDivElement>;
    map: HTMLDivElement;
    toggleListBtn: HTMLButtonElement;
    emptyListHint: HTMLDivElement;
    notFoundTextTemplate: HTMLTemplateElement;
    filterWrapper: HTMLDivElement;
    detailWrapper: HTMLDivElement;
    filterDescription: HTMLParagraphElement;
  };

  public options: LocationsModuleOptions;

  private keepMapHighlight: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};

    super($element, defaultData, DefaultOptions, data, options);

    this.initUi();
    this.initWatchers();
    this.initEventListeners();

    // init sideBar state (i.e. Tabindices)
    this.toggleLocationDetails(
      this.ui.sidebar.classList.contains(this.options.stateClasses.sidebar.singleItem) ? 0 : -1,
      false // do not set focus on init
    );
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
      .on(
        'click',
        this.options.domSelectors.listItems,
        (event: MouseEvent, target: HTMLLIElement) => {
          // this.log('ListItem Click Event', event, target);
          this.onListItemsSelect(target);
        }
      )
      .on(
        'keyup',
        this.options.domSelectors.listItems,
        (event: KeyboardEvent, target: HTMLLIElement) => {
          const keyEvent = event as KeyboardEvent;
          if (keyEvent.key === 'Enter') {
            // this.log('ListItem Keypress "Enter"', event, target);
            this.onListItemsSelect(target);
          }
        }
      )
      .on(
        'mouseover',
        this.options.domSelectors.listItems,
        (_event: MouseEvent, target: HTMLLIElement) => {
          // this.log('Hover over item index: ', itemIndex);
          this.highlightInMap(this.getIndex(target));
        }
      )
      .on('mouseout', this.options.domSelectors.listItems, () => {
        this.highlightInMap();
      })
      .on('click', this.options.domSelectors.backBtn, () => {
        this.onListItemsSelect();
      })
      .on('keyup', this.options.domSelectors.backBtn, (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // this.log('BackBtn Keypress "Escape"', event);
          this.onListItemsSelect();
        }
      })
      .on('keyup', this.options.domSelectors.detailNodes, (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // this.log('DetailNodes Keypress "Escape"', event);
          this.onListItemsSelect();
        }
      })
      .on('click', this.options.domSelectors.toggleListBtn, () => {
        // this.log('ToggleListBtn Click');
        const sidebarClasses = this.ui.sidebar.classList;
        if (sidebarClasses.contains(this.options.stateClasses.sidebar.opened)) {
          sidebarClasses.remove(this.options.stateClasses.sidebar.opened);
        } else {
          sidebarClasses.add(this.options.stateClasses.sidebar.opened);
        }
      });

    this.ui.map.addEventListener(MapView.events.markerMouseOver, (ev: MarkerEvent) => {
      const markerMouseOverIdx = ev.detail.idx;
      // this.log('Mouseover from map on marker', markerMouseOverIdx);
      arrayFromMaybeNodeList(this.ui.listItems).forEach((listItem, i) => {
        listItem.classList[markerMouseOverIdx === i ? 'add' : 'remove'](
          this.options.stateClasses.mapMarkerIsHovered
        );
      });
    });

    this.ui.map.addEventListener(MapView.events.markerClicked, (ev: MarkerEvent) => {
      if ([].slice.call(this.ui.listItems).length > 1) {
        const clickedIdx = ev.detail.idx;
        // this.log('Marker clicked in map', clickedIdx);
        this.toggleLocationDetails(clickedIdx, true);
      }
    });

    this.ui.map.addEventListener(MapView.events.userLocated, (ev: UserLocateEvent) => {
      // this.log('User located event: ', ev.detail);
      if (ev.detail.markerDistances) {
        const distances = ev.detail.markerDistances;
        if (distances.length > 1) {
          Array.from(this.ui.listItems as NodeListOf<HTMLElement>).forEach((item, i) => {
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

    this.ui.element.addEventListener(
      Locations.events.filterLocations,
      this.onFilterEvent.bind(this)
    );
    this.ui.element.addEventListener(
      Locations.events.triggerBackButton,
      this.onTriggerBackButton.bind(this)
    );

    (<any>WindowEventListener).addDebouncedResizeListener(this.setSideBarScrollArea.bind(this));
    this.setSideBarScrollArea();
  }

  private onListItemsSelect(target?: HTMLElement): void {
    const itemIndex: number = this.getIndex(target);
    // this.log('Dispatch marker fix');
    this.toggleLocationDetails(itemIndex, true);
  }

  private getIndex(target: HTMLElement): number {
    let itemIndex = -1;
    const listItem = target?.closest('li');
    if (listItem) {
      const itemIndexStr = listItem.getAttribute(this.options.attrNames.itemIndex);
      try {
        itemIndex = Number.parseInt(itemIndexStr, 10);
      } catch (e) {
        // this.log('Failed to parse itemindex attribute. ', e);
      }
    }
    return itemIndex;
  }

  private onFilterValueChange(_propName: string, _valueBefore: string, valueAfter: string): void {
    // this.log('Filter Value changed', valueAfter);
    const sidebarClasses = this.ui.sidebar.classList;
    if (!sidebarClasses.contains(this.options.stateClasses.sidebar.opened)) {
      sidebarClasses.add(this.options.stateClasses.sidebar.opened);
    }
    this.filterListItemsByText(valueAfter);
  }

  private onFilterEvent(evt: any) {
    const { autoOpenSingleItem, text } = evt.detail;
    this.filterListItemsByText(text, autoOpenSingleItem);
  }

  private onTriggerBackButton() {
    this.ui.backBtn.click();
  }

  private setSideBarScrollArea() {
    if (this.ui.linkList && this.ui.filterHead) {
      this.ui.linkList.style.height = `calc(100% - ${this.ui.filterHead.clientHeight + 8}px)`; // eslint-disable-line
    }
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
    const listItems = arrayFromMaybeNodeList(this.ui.listItems);
    if (listItems.length) {
      const lis: HTMLElement[] = [];
      listItems.forEach((item) => {
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

  private setTabable(el: HTMLElement, tabable: boolean) {
    if (el) el.setAttribute('tabindex', tabable ? '0' : '-1');
  }

  private toggleLocationDetails(selectedItemIdx: number, setHeadFocus: boolean = true): void {
    const onDetails = selectedItemIdx >= 0 || !this.ui.linkList;
    this.ui.sidebar.classList.toggle(this.options.stateClasses.sidebar.onDetails, onDetails);
    this.ui.sidebar.classList.toggle(this.options.stateClasses.sidebar.opened, onDetails);
    if (this.ui.listItems) {
      arrayFromMaybeNodeList(this.ui.listItems).forEach((listItem) => {
        this.setTabable(listItem, !onDetails);
      });
    }
    if (this.ui.filterInput) this.setTabable(this.ui.filterInput, !onDetails);
    if (this.ui.backBtn) this.setTabable(this.ui.backBtn, onDetails);
    this.showLocationDetailsForIndex(selectedItemIdx, setHeadFocus);
    this.ui.map.dispatchEvent(MapView.extMarkerSelectEvent(selectedItemIdx));
    this.highlightInMap(selectedItemIdx, true);
  }

  private filterListItemsByText(filterText: string, autoOpenSingleItem: boolean = false): void {
    const pattern = new RegExp(filterText, 'i');
    const messageTimeout = 3000;

    const listItems = Array.from(this.ui.listItems as NodeListOf<HTMLButtonElement>);
    let countHidden = 0;
    let lastIndex = -1;
    listItems.forEach((listNode, index) => {
      const { parentElement } = listNode;
      const searchText = listNode.hasAttribute('data-filter-attr')
        ? listNode.getAttribute('data-filter-attr')
        : listNode.innerText;
      const isVisible = pattern.test(searchText);
      this.ui.map.dispatchEvent(MapView.extMarkerShowHide(index, isVisible));
      parentElement.hidden = !isVisible;
      parentElement.classList.toggle('hide', !isVisible);
      if (isVisible) lastIndex = index;
      else countHidden += 1;
    });

    if (countHidden === listItems.length) {
      if (this.ui.emptyListHint) {
        this.ui.emptyListHint.childNodes.forEach((childNode) => {
          if (
            !childNode.hasChildNodes() &&
            childNode.textContent &&
            childNode.textContent.trim().length > 0
          ) {
            childNode.textContent = this.ui.notFoundTextTemplate.content.textContent.replace(
              '{searchTerm}',
              filterText
            );
          }
        });
      }
      this.ui.sidebar.classList.add(this.options.stateClasses.sidebar.notFound);
    } else {
      this.ui.sidebar.classList.remove(this.options.stateClasses.sidebar.notFound);
    }

    if (autoOpenSingleItem && listItems.length - countHidden === 1) {
      setTimeout(() => {
        this.toggleLocationDetails(lastIndex, false); // do not set focus when auto-opening
      }, 0);
    } else {
      setTimeout(() => {
        this.toggleLocationDetails(-1, false); // do not set focus when auto-opening
      }, 0);
    }

    this.ui.filterDescription.style.display = 'inherit';
    this.ui.filterInput?.setAttribute('aria-describedby', this.ui.filterDescription.id);

    setTimeout(() => {
      this.ui.filterDescription.removeAttribute('style');
      this.ui.filterInput?.removeAttribute('aria-describedby');
    }, messageTimeout);
  }

  private showLocationDetailsForIndex(indexToShow: number, setHeadFocus: boolean = true): void {
    if (!this.ui.detailNodes) return;
    if (setHeadFocus) (document.activeElement as HTMLButtonElement).blur();
    const detailsContainers = arrayFromMaybeNodeList(this.ui.detailNodes);
    detailsContainers.forEach((detailsContainer, i) => {
      const isActive = indexToShow === i;
      detailsContainer
        .querySelectorAll('a, button')
        .forEach((el: HTMLAnchorElement | HTMLButtonElement) => {
          this.setTabable(el, isActive);
        });
      detailsContainer.hidden = !isActive;
      detailsContainer.classList.toggle(this.options.stateClasses.detailShow, isActive);
    });
    const onDetails = indexToShow >= 0 || !this.ui.linkList;
    this.ui.filterWrapper.hidden = onDetails;
    this.ui.detailWrapper.hidden = !onDetails;
    arrayFromMaybeNodeList(this.ui.listItems).forEach((item, i) => {
      item.ariaExpanded = String(indexToShow === i);
    });
    const focusEl = onDetails
      ? this.ui.backBtn ?? detailsContainers[indexToShow].querySelector('a, button')
      : this.ui.linkList.querySelector<HTMLButtonElement>('[aria-expanded="true"]') ??
        this.ui.filterInput ??
        this.ui.linkList.querySelector('button');

    if (setHeadFocus) {
      setTimeout(() => {
        focusEl.focus();
        this.updateFlyingFocus();
        // this.log('Active Element: ', document.activeElement);
      }, this.options.focusDelay);
    }
  }

  private highlightInMap(highlightIndex?: number, force?: boolean): void {
    if (!this.keepMapHighlight || force) {
      // this.log('Dispatch Marker highlight');
      this.ui.map.dispatchEvent(MapView.extMarkerHighlightEvent(highlightIndex));
      if (force) this.keepMapHighlight = highlightIndex > -1;
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
