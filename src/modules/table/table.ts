/*!
 * Table
 *
 * @author
 * @copyright
 */
import { orderBy } from 'lodash';

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
      cell: string,
    },
    stateClasses: {
      firstColumnFixed: string,
      sortable: string,
      cloned: string,
      shadeRight: string,
      shadeLeft: string,
      columnAscending: string,
      columnDescending: string,
    },
  };

  public data: {
    shades: {
      left: any,
      right: any,
    },
    clonedTable: any,
    tableData: Array<Object>,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      clonedTable: null,
      tableData: null,
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
        cell: '[data-table="cell"]',
      },
      stateClasses: {
        // activated: 'is-activated'
        firstColumnFixed: 'mdl-table--first-column-fixed',
        sortable: 'mdl-table--sortable',
        cloned: 'mdl-table__table--cloned',
        shadeRight: 'mdl-table--shade-right',
        shadeLeft: 'mdl-table--shade-left',
        columnAscending: 'mdl-table__column--asc',
        columnDescending: 'mdl-table__column--desc',
      },
    };
    super($element, defaultData, defaultOptions, data, options);


    this.initUi();

    this.options.isFixedFirstColumn = this.ui.element.classList
      .contains(this.options.stateClasses.firstColumnFixed);
    this.options.isSortable = typeof this.ui.sortable !== 'undefined';

    this.initEventListeners();

    if (this.options.isFixedFirstColumn) this.cloneTable();

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

    this.eventDelegate
      .on('click', this.options.domSelectors.sortable, this.orderTable.bind(this))
      .on('redraw', this.setShades.bind(this));
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

  /**
   * Gets the scrolling amount in percentage
   *
   * @returns
   * @memberof Table
   */
  getScrollPercentage() {
    const scrollWrapper = this.ui.scrollAreaWrapper;

    return 100 * scrollWrapper.scrollLeft / (scrollWrapper.scrollWidth - scrollWrapper.clientWidth);
  }

  /**
   * Sorting the table
   *
   * @param event {MouseEvent} the click event of the mouse
   * @memberof Table
   */
  orderTable(event) {
    if (!this.data.tableData) {
      this.readTableData();
    }

    let columnHeader = event.target;

    if (columnHeader.tagName !== 'BUTTON') {
      columnHeader = columnHeader.parentNode;

      while (columnHeader.tagName !== 'BUTTON') {
        columnHeader = columnHeader.parentNode;
      }
    }

    const column = columnHeader.getAttribute('data-column-index');

    if (this.isInClonedTable(columnHeader)) {
      const buttonInDefaultTable = this.ui.table.querySelector(`[data-column-index="${column}"]`);

      (<HTMLElement>buttonInDefaultTable).click();
    } else {
      const isOrderedBy = columnHeader.classList.contains(this.options.stateClasses.columnAscending)
        || columnHeader.classList.contains(this.options.stateClasses.columnDescending);
      const orderDirection = isOrderedBy ? (columnHeader.getAttribute('data-order-by')) : false;
      const isNumeric = columnHeader.getAttribute('data-order') === 'enum';
      const th = columnHeader.parentNode;
      let orderedByTableData = null;
      let order = null;

      this.cleanSortableColumns();

      switch (orderDirection) {
        // The current sortOrder is ascending, so the new one has to be descending
        case 'asc':
          order = 'desc';

          columnHeader.classList.add(this.options.stateClasses.columnDescending);
          th.setAttribute('aria-sort', 'descending');
          break;
        // The current sortOrder is descending, next stage is no sort at all (default)
        case 'desc':
          columnHeader.removeAttribute('data-order-by');
          th.setAttribute('aria-sort', 'none');

          break;
        // There is no active sortOrder next stage is ascending
        default:
          order = 'asc';

          columnHeader.classList.add(this.options.stateClasses.columnAscending);
          th.setAttribute('aria-sort', 'ascending');

          break;
      }
      if (order) {
        orderedByTableData = isNumeric
          ? orderBy(this.data.tableData, (o) => {
            const tmp = document.createElement('DIV');
            tmp.innerHTML = o[column];

            return parseFloat(tmp.textContent.replace(',', '.'));
          }, [order])
          : orderBy(this.data.tableData, (o) => {
            const tmp = document.createElement('DIV');
            tmp.innerHTML = o[column];

            return tmp.textContent;
          }, [order]);

        columnHeader.setAttribute('data-order-by', order);
      } else {
        orderedByTableData = this.data.tableData;
      }

      this.redrawTable(orderedByTableData);
    }
  }

  /**
   * Reading the current table data (is done by the first sort interaction)
   *
   * @memberof Table
   */
  readTableData() {
    const tableRows = [];
    const domRows = this.ui.table.querySelectorAll('tbody tr');

    domRows.forEach((row) => {
      const cells = row.querySelectorAll(this.options.domSelectors.cell);
      const rowData = Array.prototype.slice.call(cells).map(cell => cell.innerHTML);
      const rowObject = {
        isHighlighted: false,
      };

      rowData.forEach((innerHTML, index) => {
        rowObject[index] = innerHTML;
      });

      if (row.classList.contains('mdl-table__row--highlighted')) {
        rowObject.isHighlighted = true;
      }

      tableRows.push(rowObject);
    });

    this.data.tableData = tableRows;
  }

  /**
   * Readraws the table with the newly sorted data
   *
   * @param {*} sortedData
   * @memberof Table
   */
  redrawTable(sortedData) {
    if (this.data.clonedTable) {
      this.data.clonedTable.remove();
    }

    const tBodyRows = this.ui.table.querySelectorAll('tbody tr');

    tBodyRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll(this.options.domSelectors.cell);

      cells.forEach((cell, cellIndex) => {
        cell.innerHTML = sortedData[rowIndex][cellIndex];
      });

      if (sortedData[rowIndex].isHighlighted) {
        row.classList.add('mdl-table__row--highlighted');
      } else {
        row.classList.remove('mdl-table__row--highlighted');
      }
    });

    if (this.options.isFixedFirstColumn) {
      this.cloneTable();
    }
  }

  /**
   * Cleaning the table from unnecessary sorting classes
   *
   * @memberof Table
   */
  cleanSortableColumns() {
    const sortableButtons = this.ui.table.querySelectorAll('thead tr th button');

    sortableButtons.forEach((sortableButton) => {
      sortableButton.classList.remove(this.options.stateClasses.columnAscending);
      sortableButton.classList.remove(this.options.stateClasses.columnDescending);
    });
  }

  /**
   * Check if an element is inside the cloned table
   *
   * @param {*} element
   * @returns
   * @memberof Table
   */
  isInClonedTable(element) {
    let elementParent = element.parentNode;

    while (!elementParent.classList.contains('mdl-table__table--cloned')) {
      elementParent = elementParent.parentNode;

      if (elementParent.classList.contains('mdl-table')) {
        return false;
      }
    }

    return true;
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
