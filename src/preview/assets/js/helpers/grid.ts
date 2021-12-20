/**
 * Grid helper, shows representation of the grid to all elements with the class l-wrapper
 *
 * Start the debugging with ctrl+g
 */
import Helper from '../../../../assets/js/helpers/helper';
import MediaQuery from '../../../../assets/js/helpers/mediaqueries';

class Grid extends Helper {
  public logger: Function;

  private isActive: Boolean = false;

  private domClasses = {
    wrapperClasses: ['.lyt-main-grid'],
    gridClasses: ['grid-x', 'grid-margin-x'],
    cellClasses: ['cell', 'auto'],
    mainClass: 'dev-grid',
  }

  constructor() {
    super();

    this.logger = this.log(Grid.name);

    this.logger(`Initialized ${Grid.name}`);
  }

  /**
   * Function which runs the necessary script to show the grid guidelines
   *
   * @memberof Grid
   */
  run() {
    if (!this.isActive) {
      this.domClasses.wrapperClasses.forEach((className) => {
        const foundNodes = [].slice.call(document.querySelectorAll(className));

        foundNodes.forEach(node => node.appendChild(this.generateDevGrid()));
      });

      this.isActive = true;
    } else {
      const fakeGrids = [].slice.call(document.querySelectorAll(`.${this.domClasses.mainClass}`));

      fakeGrids.forEach(fakeGrid => fakeGrid.remove());

      this.isActive = false;
      MediaQuery.removeMQChangeListener('devGrid');
    }
  }

  /**
   * Generates a fake grid as visual guidelines
   *
   * @returns <NodeElement> A HTML NodeElement to append to the foundNodes
   * @memberof Grid
   */
  generateDevGrid() {
    const devGrid = document.createElement('div');
    const columns = MediaQuery.query({ from: 'tiny', to: 'small' }) ? 6 : 12; // eslint-disable-line no-magic-numbers

    devGrid.classList.add(this.domClasses.mainClass, ...this.domClasses.gridClasses);

    for (let i = 0; i < columns; i += 1) {
      const cellNode = document.createElement('div');

      cellNode.classList.add(...this.domClasses.cellClasses);

      devGrid.appendChild(cellNode);
    }

    MediaQuery.addMQChangeListener(this.recalcColumns.bind(this), 'devGrid');

    return devGrid;
  }

  recalcColumns() {
    const mobileColumns: number = 6;
    const columns: number = MediaQuery.query({ from: 'tiny', to: 'small' }) ? mobileColumns : 12; // eslint-disable-line no-magic-numbers
    const devGrids = [].slice.call(document.querySelectorAll(`.${this.domClasses.mainClass}`));

    devGrids.forEach((devGrid) => {
      const nCells = [].slice.call(devGrid.querySelectorAll(`.${this.domClasses.cellClasses[0]}`)).length;
      if (nCells !== columns) {
        if ((columns - nCells) === -1 * mobileColumns) {
          for (let i = 0; i < (nCells - columns); i += 1) {
            devGrid.removeChild(devGrid.firstChild);
          }
        } else {
          for (let i = 0; i < (columns - nCells); i += 1) {
            const cellNode = document.createElement('div');

            cellNode.classList.add(...this.domClasses.cellClasses);

            devGrid.appendChild(cellNode);
          }
        }
      }
    });
  }
}

export default Grid;
