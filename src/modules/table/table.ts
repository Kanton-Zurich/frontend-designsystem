/*!
 * Table
 *
 * @author
 * @copyright
 */
import mq from '../../assets/js/helpers/mediaqueries';
import orderBy from 'lodash/orderBy';
import {
  stripWhitespace,
  isExternalURL,
  removeProtocol,
  isSafeURL,
} from '../../assets/js/helpers/common';

import WindowEventListener from '../../assets/js/helpers/events';
import Module from '../../assets/js/helpers/module';
import Modal from '../modal/modal';

type TableData = Partial<{
  id: string;
  title: string;
  leaders: string;
  breadcrumbs: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  ariaControls: string;
}>;

class Table extends Module {
  public ui: {
    element: HTMLElement;
    table: HTMLElement;
    tableBody: HTMLElement;
    tableHead: HTMLElement;
    scrollArea: HTMLElement;
    scrollAreaWrapper: HTMLElement;
    sortable: NodeList;
    templateTableRow: HTMLTemplateElement;
    templateTableBodyCell: HTMLTemplateElement;
    templateTableHeaderCell: HTMLTemplateElement;
    templateCell: HTMLTemplateElement;
  };
  public options: {
    isFixedFirstColumn: Boolean;
    isSortable: Boolean;
    domSelectors: {
      table: string;
      tableBody: string;
      tableHead: string;
      scrollArea: string;
      sortable: string;
      cell: string;
      templateTableBodyCell: string;
      templateTableHeaderCell: string;
      templateCell: string;
      templateTableRow: string;
      headerCells: string;
      headerFixed: string;
      anchornavFixed: string;
    };
    stateClasses: {
      tableFinance: string;
      firstColumnFixed: string;
      firstRowFixed: string;
      sortable: string;
      shadeRight: string;
      shadeLeft: string;
      columnAscending: string;
      columnDescending: string;
    };
  };

  public data: {
    shades: {
      left: any;
      right: any;
      bottom: any;
    };
    tableData: Array<Object>;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      tableData: null,
      shades: {
        left: null,
        right: null,
        bottom: null,
      },
    };
    const defaultOptions = {
      isFixedFirstColumn: false,
      isSortable: false,
      domSelectors: {
        table: '[data-table="table"]',
        tableHead: '[data-table="table-head"]',
        tableBody: '[data-table="table-body"]',
        cell: '[data-table="cell"]',
        scrollArea: '[data-table="scroll-area"]',
        scrollAreaWrapper: '[data-table="scroll-area-wrapper"]',
        sortable: '[data-table="sortable"]',
        templateTableRow: '[data-table="template-table-row"]',
        templateTableBodyCell: '[data-table="template-body-cell"]',
        templateTableHeaderCell: '[data-table="template-header-cell"]',
        headerCells: '.mdl-table.mdl-table--first-row-fixed .mdl-table__head th',
        headerFixed: '.mdl-header.mdl-header--fixed',
        anchornavFixed: '.mdl-anchornav__container.mdl-anchornav__container--sticky',
      },
      stateClasses: {
        tableFinance: 'mdl-table--finance',
        firstColumnFixed: 'mdl-table--first-column-fixed',
        firstRowFixed: 'mdl-table--first-row-fixed',
        sortable: 'mdl-table--sortable',
        shadeRight: 'mdl-table--shade-right',
        shadeLeft: 'mdl-table--shade-left',
        columnAscending: 'mdl-table__column--asc',
        columnDescending: 'mdl-table__column--desc',
      },
    };
    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.options.isFixedFirstColumn = this.ui.element.classList.contains(
      this.options.stateClasses.firstColumnFixed
    );
    this.options.isSortable = typeof this.ui.sortable !== 'undefined';
    this.initEventListeners();
    this.setupShades();
  }

  static get events() {
    return {
      sort: 'Table.sort',
      sortColumn: 'Table.sortColumn',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(this.setShades.bind(this));

    this.eventDelegate
      .on('click', this.options.domSelectors.sortable, this.onOrderTable.bind(this))
      .on('redraw', this.setShades.bind(this))
      .on(Table.events.sortColumn, this.onSortColumn.bind(this));

    // handle pre sort
    this.cleanSortableColumns();
    if (this.ui.element.hasAttribute('data-sort-column')) {
      let orderDirection = 'ascending';
      if (this.ui.element.hasAttribute('data-sort-direction')) {
        orderDirection = this.ui.element.getAttribute('data-sort-direction');
      }
      const columnHeader = this.ui.element.querySelector(
        `[data-column-name="${this.ui.element.getAttribute('data-sort-column')}"]`
      );
      this.setColumnHeader(orderDirection, columnHeader);
    }

    this.eventDelegate.on(Modal.events.setData, (event) => {
      this.setData(event.detail);
    });

    if (this.ui.element.classList.contains(this.options.stateClasses.tableFinance)) {
      window.addEventListener('scroll', this.setStickyHeaderRow.bind(this));
      window.addEventListener('resize', this.setStickyHeaderRow.bind(this));
    }
  }

  setStickyHeaderRow() {
    const fixedHeader = document.querySelector(this.options.domSelectors.headerFixed);
    const fixedAnchorNav = document.querySelector(this.options.domSelectors.anchornavFixed);
    const tableHeaderCells = this.ui.element.querySelectorAll(
      this.options.domSelectors.headerCells
    );
    const tableHeadHeight = this.ui.tableHead.getBoundingClientRect().height;
    let fixedHeaderHeight = 0;
    let fixedAnchorNavHeight = 0;
    let insetTopTotal = 0;
    let tableIsIntersectingHeaderArea = false;
    let tableIsTallerThanViewport = false;
    let tableIsVisible = false;

    if (fixedHeader) {
      fixedHeaderHeight = fixedHeader.getBoundingClientRect().height;
    }
    if (fixedAnchorNav && !mq.get('large').matches) {
      fixedAnchorNavHeight = fixedAnchorNav.getBoundingClientRect().height;
    }

    insetTopTotal = fixedHeaderHeight + fixedAnchorNavHeight;
    tableIsTallerThanViewport =
      this.ui.table.getBoundingClientRect().height > window.innerHeight - insetTopTotal;
    tableIsIntersectingHeaderArea = this.ui.tableHead.getBoundingClientRect().top < insetTopTotal;
    tableIsVisible = this.ui.table.getBoundingClientRect().bottom > insetTopTotal + tableHeadHeight;

    if (tableIsTallerThanViewport && tableIsIntersectingHeaderArea && tableIsVisible) {
      const insetBlockStart = insetTopTotal - this.ui.tableHead.getBoundingClientRect().top;

      window.requestAnimationFrame(() => {
        this.ui.element.classList.add(this.options.stateClasses.firstRowFixed);
        tableHeaderCells.forEach((cell: HTMLElement) => {
          cell.style.top = `${insetBlockStart}px`;
        });
        this.data.shades.bottom.style.top = `${insetBlockStart + tableHeadHeight}px`;
      });
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.firstRowFixed);
      tableHeaderCells.forEach((cell: HTMLElement) => {
        cell.removeAttribute('style');
      });
      this.data.shades.bottom.removeAttribute('style');
    }
  }

  setData(rowDataList: Array<TableData>) {
    let tableHeaderLabels: Record<string, string>;
    let columnNames: string[];
    try {
      tableHeaderLabels = JSON.parse(this.ui.table.dataset.tableHeaderLabels);
      columnNames = Object.keys(tableHeaderLabels);
    } catch (error) {
      console.error('Error parsing table header labels:', error);
      return;
    }
    const renderTable = () => {
      const removeEmptyColumnNames = (columnNamesToCheck: Array<string>) => {
        columnNamesToCheck.forEach((columnNameToCheck) => {
          const columnIndex = columnNames.indexOf(columnNameToCheck);
          const hasColumnNameToCheck = rowDataList.reduce(
            (hasNameToCheck, current: any) => hasNameToCheck || current[columnNameToCheck],
            false
          );
          if (!hasColumnNameToCheck && columnIndex >= 0) {
            columnNames.splice(columnIndex, 1);
          }
        });
      };

      removeEmptyColumnNames(Array.from(columnNames));

      this.ui.element.classList.remove('hidden');
      this.ui.tableBody.replaceChildren();
      this.ui.tableHead.replaceChildren();
      this.ui.tableHead.appendChild(this.ui.templateTableRow.content.cloneNode(true));

      const headerRow = this.ui.tableHead.querySelector('tr');

      columnNames.forEach((columnName) => {
        const newHeaderCell = this.ui.templateTableHeaderCell.content.cloneNode(
          true
        ) as HTMLElement;

        newHeaderCell.querySelector('span').textContent = tableHeaderLabels[columnName];
        headerRow.appendChild(newHeaderCell);
      });

      rowDataList.forEach((rowDataItem) => {
        const tableRowFragment = this.ui.templateTableRow.content.cloneNode(true) as HTMLElement;
        this.ui.tableBody.appendChild(tableRowFragment);

        const lastTableRow = this.ui.tableBody.querySelector('tr:last-child');

        columnNames.forEach((columnName) => {
          const cellFragment = this.ui.templateTableBodyCell.content.cloneNode(true) as HTMLElement;
          lastTableRow.appendChild(cellFragment);

          const cell = lastTableRow.querySelector('td:last-child');

          if (
            ['email', 'phone', 'website', 'title'].includes(columnName) &&
            rowDataItem[columnName]
          ) {
            const link = document.createElement('a');

            let href = '';
            let linkText = '';
            const value = stripWhitespace(rowDataItem[columnName]);

            switch (columnName) {
              case 'title':
                href = `#${rowDataItem.id}`;
                linkText = rowDataItem[columnName];
                lastTableRow.addEventListener('click', () => {
                  lastTableRow.querySelector('a').click();
                });
                if (rowDataItem['ariaControls'])
                  link.setAttribute('aria-controls', rowDataItem['ariaControls']);
                break;
              case 'email':
                href = `mailto:${value}`;
                linkText = rowDataItem[columnName];
                break;
              case 'phone':
                href = `tel:${value}`;
                linkText = rowDataItem[columnName];
                break;
              case 'website':
                href = isSafeURL(value) ? value : '#';
                linkText = removeProtocol(value);
                if (isExternalURL(value)) {
                  link.setAttribute('target', '_blank');
                }
                break;
              default:
                href = '';
            }

            link.classList.add('atm-text_link');
            link.href = href;
            link.textContent = linkText;
            cell.appendChild(link);
          } else {
            cell.textContent = rowDataItem[columnName];
          }
        });
      });
    };

    if (rowDataList.length > 0) {
      renderTable();
    } else {
      this.ui.element.classList.add('hidden');
    }
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
    const bottomShade = document.createElement('span');

    leftShade.setAttribute('aria-hidden', 'true');
    rightShade.setAttribute('aria-hidden', 'true');
    bottomShade.setAttribute('aria-hidden', 'true');

    leftShade.classList.add('mdl-table__shade-left');
    rightShade.classList.add('mdl-table__shade-right');
    bottomShade.classList.add('mdl-table__shade-bottom');

    this.ui.scrollArea.appendChild(leftShade);
    this.ui.scrollArea.appendChild(rightShade);
    this.ui.scrollArea.appendChild(bottomShade);

    this.data.shades = {
      left: leftShade,
      right: rightShade,
      bottom: bottomShade,
    };
  }

  /**
   * Setting the offset for the left shade, as the first column is fixed
   *
   * @memberof Table
   */
  setLeftOffset() {
    const firstThRow = this.ui.table.querySelector('th[scope="row"]');
    if (firstThRow) {
      this.data.shades.left.style.left = `${firstThRow.getBoundingClientRect().width - 1}px`;
    }
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

    return (
      (100 * scrollWrapper.scrollLeft) / (scrollWrapper.scrollWidth - scrollWrapper.clientWidth)
    );
  }

  /**
   * Sorting the table
   *
   * @param event {MouseEvent} the click event of the mouse
   * @memberof Table
   */
  onOrderTable(event) {
    let columnHeader = event.target;

    if (columnHeader.tagName !== 'BUTTON') {
      columnHeader = columnHeader.parentNode;

      while (columnHeader.tagName !== 'BUTTON') {
        columnHeader = columnHeader.parentNode;
      }
    }

    const eventDetail = {
      index: columnHeader.getAttribute('data-column-index'),
      column: columnHeader.getAttribute('data-column-name'),
      direction: columnHeader.parentNode.getAttribute('aria-sort'),
    };
    this.ui.element.dispatchEvent(new CustomEvent(Table.events.sort, { detail: eventDetail }));

    // break sort process if table is in static mode
    if (this.ui.element.hasAttribute('data-static')) {
      return;
    }

    if (!this.data.tableData) {
      this.readTableData();
    }

    const column = columnHeader.getAttribute('data-column-index');
    const isOrderedBy =
      columnHeader.classList.contains(this.options.stateClasses.columnAscending) ||
      columnHeader.classList.contains(this.options.stateClasses.columnDescending);
    const orderDirection = isOrderedBy ? columnHeader.getAttribute('data-order-by') : false;
    const isNumeric = columnHeader.getAttribute('data-order') === 'enum';
    let orderedByTableData = null;
    this.cleanSortableColumns();

    let order = null;

    switch (orderDirection) {
      // The current sortOrder is ascending, so the new one has to be descending
      case 'ascending':
        order = 'descending';
        this.setColumnHeader(order, columnHeader);
        break;
      // The current sortOrder is descending, next stage is no sort at all (default)
      case 'descending':
        this.setColumnHeader(null, columnHeader);
        break;
      // There is no active sortOrder next stage is ascending
      default:
        order = 'ascending';
        this.setColumnHeader(order, columnHeader);
        break;
    }
    if (order) {
      orderedByTableData = this.orderTableData(isNumeric, column, order);
      columnHeader.setAttribute('data-order-by', order);
    } else {
      orderedByTableData = this.data.tableData;
    }

    this.redrawTable(orderedByTableData);
  }

  /**
   * Do active order
   * @param isNumeric
   * @param columnIndex
   * @param order
   */
  orderTableData(isNumeric: boolean, columnIndex: number, order: any) {
    return isNumeric
      ? orderBy(
          this.data.tableData,
          (o) => {
            const tmp = document.createElement('DIV');
            tmp.innerHTML = o[columnIndex];

            return parseFloat(tmp.textContent.replace(',', '.'));
          },
          [order === 'ascending' ? 'asc' : 'desc']
        )
      : orderBy(
          this.data.tableData,
          (o) => {
            const tmp = document.createElement('DIV');
            tmp.innerHTML = o[columnIndex];

            return tmp.textContent;
          },
          [order === 'ascending' ? 'asc' : 'desc']
        );
  }

  /**
   * Trigger sort from outside
   * @param event
   */
  onSortColumn(event) {
    const { column, direction } = event.detail;
    this.ui.element.setAttribute('data-sort-column', column);
    this.ui.element.setAttribute('data-sort-direction', direction);
    const columnHeader = this.ui.element.querySelector(`[data-column-name="${column}"]`);
    if (columnHeader) {
      const isNumeric = columnHeader.getAttribute('data-order') === 'enum';
      this.cleanSortableColumns();
      this.setColumnHeader(direction, columnHeader);
      if (!this.ui.element.hasAttribute('data-static')) {
        const columnIndex = parseInt(columnHeader.getAttribute('data-column-index'), 10);
        this.redrawTable(this.orderTableData(isNumeric, columnIndex, direction));
      }
    }
  }

  /**
   * Update the table header according to sort direction
   * @param orderDirection
   * @param columnHeader
   */
  setColumnHeader(orderDirection, columnHeader) {
    const th = columnHeader.parentNode;
    switch (
      orderDirection // eslint-disable-line
    ) {
      case 'descending':
        columnHeader.classList.add(this.options.stateClasses.columnDescending);
        th.setAttribute('aria-sort', 'descending');
        break;
      case 'ascending':
        columnHeader.classList.add(this.options.stateClasses.columnAscending);
        th.setAttribute('aria-sort', 'ascending');
        break;
      case null:
        columnHeader.removeAttribute('data-order-by');
        th.setAttribute('aria-sort', 'none');
        break;
    }
  }

  /**
   * Reading the current table data (is done by the first sort interaction)
   *
   * @memberof Table
   */
  readTableData() {
    const tableRows = [];
    const domRows = [].slice.call(this.ui.table.querySelectorAll('tbody tr'));

    domRows.forEach((row) => {
      const cells = row.querySelectorAll(this.options.domSelectors.cell);
      const rowData = Array.prototype.slice.call(cells).map((cell) => cell.innerHTML);
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
    const tBodyRows = [].slice.call(this.ui.table.querySelectorAll('tbody tr'));

    tBodyRows.forEach((row, rowIndex) => {
      const cells = [].slice.call(row.querySelectorAll(this.options.domSelectors.cell));

      cells.forEach((cell, cellIndex) => {
        cell.innerHTML = sortedData[rowIndex][cellIndex];
      });

      if (sortedData[rowIndex].isHighlighted) {
        row.classList.add('mdl-table__row--highlighted');
      } else {
        row.classList.remove('mdl-table__row--highlighted');
      }
    });
  }

  /**
   * Cleaning the table from unnecessary sorting classes
   *
   * @memberof Table
   */
  cleanSortableColumns() {
    const sortableColumnHeaders = [].slice.call(
      this.ui.table.querySelectorAll('thead tr .mdl-table__column-header--sortable')
    );
    const sortableButtons = [].slice.call(this.ui.table.querySelectorAll('thead tr th button'));

    sortableColumnHeaders.forEach((sortableColumnHeader) => {
      sortableColumnHeader.setAttribute('aria-sort', 'none');
    });

    sortableButtons.forEach((sortableButton) => {
      sortableButton.classList.remove(this.options.stateClasses.columnAscending);
      sortableButton.classList.remove(this.options.stateClasses.columnDescending);
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

export default Table;
