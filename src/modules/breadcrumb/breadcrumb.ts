/*!
 * Breadcrumb
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Breadcrumb extends Module {
  public ui: {
    element: any,
    item: any,
  }

  public data: {
    itemsWiderThanElement: Boolean,
    hiddenItems: Array<Number>,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      itemsWiderThanElement: false,
      hiddenItems: [],
    };
    const defaultOptions = {
      domSelectors: {
        item: '[data-breadcrumb="item"]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    if (this.ui.item.length) {
      this.checkSpace();
    }
  }

  /**
   * Checking the widths to check if certain elements have to be hidden
   */
  isElementNotEnoughWide() {
    const { scrollWidth, clientWidth } = this.ui.element;

    return scrollWidth > clientWidth;
  }

  checkSpace() {
    let hideItem = 1;

    while (this.isElementNotEnoughWide()) {
      this.hideItem(hideItem);

      hideItem += 1;
    }
  }

  hideItem(itemIndex) {
    this.ui.item[itemIndex].classList.add('visuallyhidden');
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Breadcrumb;
