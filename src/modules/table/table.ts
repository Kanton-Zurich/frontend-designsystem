/*!
 * Table
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
// import namespace from '../../assets/js/helpers/namespace';

class Table extends Module {
  public ui: {
    element: HTMLElement,
    table: HTMLElement,
    scrollArea: HTMLElement,
    scrollAreaWrapper: HTMLElement,
  };
  public options: {
    domSelectors: {
      table: string,
      scrollArea: string,
    },
    stateClasses: {
      firstColumnFixed: string,
      sortable: string,
      cloned: string,
    },
  };

  public data: {
    clonedTable: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      clonedTable: null,
    };
    const defaultOptions = {
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
        table: '[data-table="table"]',
        scrollArea: '[data-table="scroll-area"]',
        scrollAreaWrapper: '[data-table="scroll-area-wrapper"]',
      },
      stateClasses: {
        // activated: 'is-activated'
        firstColumnFixed: 'mdl-table--first-column-fixed',
        sortable: 'mdl-table--sortable',
        cloned: 'mdl-table__table--cloned',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    if (this.ui.element.classList.contains(this.options.stateClasses.firstColumnFixed)) {
      this.initUi();
      this.initEventListeners();
      this.cloneTable();

      this.setupShades();
    }
  }

  static get events() {
    return {
      // eventname: `eventname.${ Table.name }.${  }`
    };
  }

  /**
   * Initialisation of variables, which point to DOM elements
   */
  initUi() {
    // DOM element pointers
    this.ui.table = this.ui.element.querySelector(this.options.domSelectors.table);
    this.ui.scrollArea = this.ui.element.querySelector(this.options.domSelectors.scrollArea);
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
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
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Table;
