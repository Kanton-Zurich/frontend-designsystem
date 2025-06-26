/**
 * Grid helper, shows representation of the grid to all elements with the class l-wrapper
 *
 * Start the debugging with ctrl+g
 */
import Helper from '../../../../assets/js/helpers/helper';

class Grid extends Helper {
  public logger: Function;

  private isActive: Boolean = false;

  private domClasses = {
    wrapperClasses: ['.lyt-main-grid'],
    gridClasses: ['grid-x', 'grid-margin-x'],
    cellClasses: ['cell', 'auto'],
    mainClass: 'dev-grid',
  };

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

        foundNodes.forEach((node) => node.appendChild(this.generateDevGrid()));
      });

      this.isActive = true;
    } else {
      const fakeGrids = [].slice.call(document.querySelectorAll(`.${this.domClasses.mainClass}`));

      fakeGrids.forEach((fakeGrid) => fakeGrid.remove());

      this.isActive = false;
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
    const columns = 12; // eslint-disable-line no-magic-numbers

    devGrid.classList.add(this.domClasses.mainClass, ...this.domClasses.gridClasses);

    for (let i = 0; i < columns; i += 1) {
      const cellNode = document.createElement('div');

      cellNode.classList.add(...this.domClasses.cellClasses);

      devGrid.appendChild(cellNode);
    }

    return devGrid;
  }
}

export default Grid;
