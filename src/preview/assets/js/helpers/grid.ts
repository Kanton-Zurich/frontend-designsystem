/**
 * Grid helper, shows representation of the grid to all elements with the class l-wrapper
 *
 * Start the debugging with ctrl+g
 */
import Helper from '../../../../assets/js/helpers/helper';
// import MediaQuery from '../../../../assets/js/helpers/mediaqueries';

class Grid extends Helper {
  public logger: Function;

  private isActive: Boolean = false;

  private options = {
    wrapperClasses: ['.l-wrapper'],
    gridClasses: ['fake-grid', 'grid-x', 'grid-margin-x'],
    cellClasses: ['cell', 'tiny-1'],
    fakeGridClass: 'fake-grid',
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
      this.options.wrapperClasses.forEach((className) => {
        const foundNodes = document.querySelectorAll(className);

        foundNodes.forEach((node) => node.appendChild(this.generateFakeGrid()));
      });

      this.isActive = true;
    } else {
      const fakeGrids = document.querySelectorAll(`.${this.options.fakeGridClass}`);

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
  generateFakeGrid() {
    const gridXNode = document.createElement('div');

    gridXNode.classList.add(...this.options.gridClasses);

    for (let i = 0; i < 12; i += 1) {
      const cellNode = document.createElement('div');

      cellNode.classList.add(...this.options.cellClasses);

      gridXNode.appendChild(cellNode);
    }

    return gridXNode;
  }
}

export default Grid;
