/*!
 * ZhLex
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
// import namespace from '../../assets/js/helpers/namespace';

class ZhLex extends Module {
  public ui: {
    element: HTMLDivElement,
    tabs: NodeListOf<HTMLButtonElement>,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        tabs: 'button[role="tab"]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    if (!location.hash) {
      setTimeout(() => {
        this.ui.tabs[0].click();
      }, 0);
    }
  }

  static get events() {
    return {
      // eventname: `eventname.${ ZhLex.name }.${  }`
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
}

export default ZhLex;
