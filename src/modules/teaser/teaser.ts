/*!
 * Teaser
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Teaser extends Module {
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
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

    (<any>window).estatico.lineClamper.initLineClamping();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Teaser.name }.${  }`
    };
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

  updateLineClamper() {
    (<any>window).estatico.lineClamper.updateLineClamping();
  }
}

export default Teaser;
