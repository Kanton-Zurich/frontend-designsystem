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
    element: any,
    table: any,
    scrollArea: any,
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

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
        table: '[data-table="table"]',
        scrollArea: '[data-table="scroll-area"]',
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
    const clonedTable = this.ui.table.cloneNode(true);
    clonedTable.classList.add(this.options.stateClasses.cloned);
    clonedTable.removeAttribute('data-table');
    clonedTable.setAttribute('aria-hidden', 'true');
    this.ui.scrollArea.append(clonedTable);
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
