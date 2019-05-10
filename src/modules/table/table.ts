/*!
 * Table
 *
 * @author
 * @copyright
 */
import WindowEventListener from '../../assets/js/helpers/events';
import Module from '../../assets/js/helpers/module';
// import namespace from '../../assets/js/helpers/namespace';

class Table extends Module {
  public ui: {
    element: HTMLElement,
    table: HTMLElement,
    scrollArea: HTMLElement,
    scrollAreaWrapper: HTMLElement,
    sortable: NodeList,
  };
  public options: {
    isFixedFirstColumn: Boolean,
    isSortable: Boolean,
    domSelectors: {
      table: string,
      scrollArea: string,
      sortable: string,
    },
    stateClasses: {
      firstColumnFixed: string,
      sortable: string,
      cloned: string,
      shadeRight: string,
      shadeLeft: string,
    },
  };

  public data: {
    shades: {
      left: any,
      right: any,
    },
    clonedTable: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      clonedTable: null,
      shades: {
        left: null,
        right: null,
      },
    };
    const defaultOptions = {
      isFixedFirstColumn: false,
      isSortable: false,
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
        table: '[data-table="table"]',
        scrollArea: '[data-table="scroll-area"]',
        scrollAreaWrapper: '[data-table="scroll-area-wrapper"]',
        sortable: '[data-table="sortable"]',
      },
      stateClasses: {
        // activated: 'is-activated'
        firstColumnFixed: 'mdl-table--first-column-fixed',
        sortable: 'mdl-table--sortable',
        cloned: 'mdl-table__table--cloned',
        shadeRight: 'mdl-table--shade-right',
        shadeLeft: 'mdl-table--shade-left',
      },
    };
    super($element, defaultData, defaultOptions, data, options);


    this.initUi();

    this.options.isFixedFirstColumn = this.ui.element.classList
      .contains(this.options.stateClasses.firstColumnFixed);
    this.options.isSortable = typeof this.ui.sortable !== 'undefined';

    this.initEventListeners();
    this.cloneTable();

    this.setupShades();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Table.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(this.setShades.bind(this));
  }

  /**
   * Clone table for fixed first column
   */
  cloneTable() {
    this.data.clonedTable = this.ui.table.cloneNode(true);
    this.data.clonedTable.classList.add(this.options.stateClasses.cloned);
    this.data.clonedTable.removeAttribute('data-table');
    this.data.clonedTable.setAttribute('aria-hidden', 'true');
    this.ui.scrollArea.append(this.data.clonedTable);
  }

  /**
   * Setting up the shades, and the according event listeners
   *
   * @memberof Table
   */
  setupShades() {
    this.ui.scrollAreaWrapper.addEventListener('scroll', this.setShades.bind(this));

    this.createShadeNodes();

    this.setShades();
  }

  /**
   * Creating the shade nodes as pseudo elements can't be styled via js
   *
   * @memberof Table
   */
  createShadeNodes() {
    const leftShade = document.createElement('span');
    const rightShade = document.createElement('span');

    leftShade.setAttribute('aria-hidden', 'true');
    rightShade.setAttribute('aria-hidden', 'true');

    leftShade.classList.add('mdl-table__shade-left');
    rightShade.classList.add('mdl-table__shade-right');

    this.ui.scrollArea.appendChild(leftShade);
    this.ui.scrollArea.appendChild(rightShade);

    this.data.shades = {
      left: leftShade,
      right: rightShade,
    };
  }

  /**
   * Setting the offset for the left shade, as the first column is fixed
   *
   * @memberof Table
   */
  setLeftOffset() {
    const firstThRow = this.ui.table.querySelector('th[scope="row"]');

    this.data.shades.left.style.left = `${firstThRow.getBoundingClientRect().width}px`;
  }

  /**
   * Getting the scroll percentage and setting the shades classes accordingly
   *
   * @memberof Table
   */
  setShades() {
    const scrollPercentage = this.getScrollPercentage();
    const offsetLeft = 1;
    const offsetRight = 99;

    if (scrollPercentage > offsetLeft) {
      this.ui.scrollArea.classList.add(this.options.stateClasses.shadeLeft);
    } else {
      this.ui.scrollArea.classList.remove(this.options.stateClasses.shadeLeft);
    }

    if (scrollPercentage < offsetRight) {
      this.ui.scrollArea.classList.add(this.options.stateClasses.shadeRight);
    } else {
      this.ui.scrollArea.classList.remove(this.options.stateClasses.shadeRight);
    }

    // Temporarily here, have to find a better solution
    if (this.options.isFixedFirstColumn) {
      this.setLeftOffset();
    }
  }

  getScrollPercentage() {
    const scrollWrapper = this.ui.scrollAreaWrapper;

    return 100 * scrollWrapper.scrollLeft / (scrollWrapper.scrollWidth - scrollWrapper.clientWidth);
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Table;
