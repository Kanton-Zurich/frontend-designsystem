/*!
 * ContextMenu
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class ContextMenu extends Module {
  public options: {
    showImmediate: Boolean,
    attachTo: Element,
    domSelectors: any,
    stateClasses: any,
  }

  public data: {
    copiedNode: Element,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      copiedNode: null,
    };
    const defaultOptions = {
      showImmediate: false,
      attachTo: null,
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    if (this.options.showImmediate) {
      this.show();
    }
  }

  /**
   * showing the menu
   *
   * @memberof ContextMenu
   */
  show() {
    this.copyDomNode();
  }

  /**
   * Copying the dome node to the end of the body
   *
   * @memberof ContextMenu
   */
  copyDomNode() {
    this.data.copiedNode = this.ui.element.cloneNode(true);

    document.body.appendChild(this.data.copiedNode);
  }

  /**
   * Positioning the context menu to its attachTo Node
   *
   * @memberof ContextMenu
   */
  positionMenu() {}

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

export default ContextMenu;
