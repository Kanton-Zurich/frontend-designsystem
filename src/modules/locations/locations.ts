/*!
 * Locations
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Locations extends Module {
  private listItems: NodeListOf<HTMLLIElement>;
  private detailNodes: NodeListOf<HTMLDivElement>;

  public ui: {
    element: HTMLDivElement,
    filterInput: HTMLInputElement,
    sidebar: HTMLDivElement,
    backBtn: HTMLButtonElement
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        locationsList: '[data-locations="listItem"]',
        filterInput: '[data-locations="input"]',
        sidebar: '[data-locations="sidebar"]',
        backBtn: '[data-locations="back"]',
        details: '[data-locations="locationDetails"]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.listItems = document.querySelectorAll(this.options.domSelectors.locationsList);
    this.detailNodes = document.querySelectorAll(this.options.domSelectors.details);
  }

  static get events() {
    return {
      // eventname: `eventname.${ Locations.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('keyup', this.options.domSelectors.filterInput, (event, target) => {
        this.log('Filter KeyUp Event', event);
        const filterText = target.value;
        const pattern = new RegExp(filterText, 'i');

        this.listItems.forEach((listNode) => {
          const parentClasses = listNode.parentElement.classList;
          if (pattern.test(listNode.innerText)) {
            parentClasses.remove('hide');
          } else {
            parentClasses.add('hide');
          }
        });
      })
      .on('click', this.options.domSelectors.locationsList, (event, target) => {
        this.log('ListItem Click', event, target);
        const clickedItemIndex = target.parentElement.getAttribute('data-linklist-itemindex');
        this.log('Clicked item index: ', clickedItemIndex);
        this.showLocationDetailsForIndex(clickedItemIndex);
        this.ui.sidebar.classList.add('show-details');
      })
      .on('click', this.options.domSelectors.backBtn, (event, target) => {
        this.log('BackBtn Click', event, target);
        this.ui.sidebar.classList.remove('show-details');
      });
  }

  private showLocationDetailsForIndex(indexString?: string): void {
    let indexToShow = -1;
    if (indexString) {
      indexToShow = Number.parseInt(indexString, 10);
    }
    this.detailNodes.forEach((detailsContainer, i) => {
      if (i === indexToShow) {
        detailsContainer.classList.add('show');
      } else {
        detailsContainer.classList.remove('show');
      }
    });
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
