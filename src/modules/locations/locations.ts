/*!
 * Locations
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Locations extends Module {
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
        listItems: '[data-locations="listItem"]',
        filterInput: '[data-locations="input"]',
        sidebar: '[data-locations="sidebar"]',
        backBtn: '[data-locations="back"]',
        detailNodes: '[data-locations="locationDetails"]',
        map: '[data-locations="map"]',
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
        if (sidebarClasses.contains('opened')) {
          sidebarClasses.remove('opened');
        } else {
          sidebarClasses.add('opened');
        }
      });
  }

  private toggleLocationDetails(selectEventTarget?: HTMLElement): void {
    let clickedItemIndex: string;

    if (selectEventTarget) {
      clickedItemIndex = selectEventTarget.parentElement.getAttribute('data-linklist-itemindex');
      this.log('Clicked item index: ', clickedItemIndex);
      this.ui.sidebar.classList.add('show-details');
      this.toggleSidebarTabIndices(true);
    } else {
      this.log('Unselect location');
      this.ui.sidebar.classList.remove('show-details');
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
    if (!sidebarClasses.contains('opened')) {
      sidebarClasses.add('opened');
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
        this.ui.sidebar.classList.add('empty');
      } else {
        this.ui.sidebar.classList.remove('empty');
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
        this.log('ForEach Detail: ', i);
        if (i === indexToShow) {
          detailsContainer.classList.add('show');
        } else {
          detailsContainer.classList.remove('show');
        }
        detailsContainer.querySelectorAll('a').forEach((anchorEl) => {
          this.setTabable(anchorEl, indexToShow === i);
        });
      });
    } else {
      const detailsContainer = <HTMLDivElement> this.ui.detailNodes;
      if (indexToShow === 0) {
        detailsContainer.classList.add('show');
      } else {
        detailsContainer.classList.remove('show');
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
      const mapDevOut = this.ui.map.getElementsByTagName('span')[0];
      if (highlightIndex > -1) {
        mapDevOut.innerText = `Highlight on ${highlightIndex}. location!`;
      } else {
        mapDevOut.innerText = '';
      }

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
