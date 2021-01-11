/*!
 * IFrame
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { iframeResizer } from 'iframe-resizer';
import WindowEventListener from '../../assets/js/helpers/events';


class IFrame extends Module {
  public ui: {
    element: any,
    iframe: HTMLDivElement,
  };

  public options: {
    domSelectors: {
      iframe: string,
    },
    stateClasses: {
      fullWidth: string,
    },
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        iframe: 'iframe',
      },
      stateClasses: {
        fullWidth: 'mdl-iframe--fullWidth',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.initEventListeners();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    if (this.ui.iframe
      && !this.ui.iframe.style.height
      && !this.ui.element.classList.contains(this.options.stateClasses.fullWidth)) {
      iframeResizer({
        heightCalculationMethod: 'lowestElement',
        bodyPadding: '5px 5px',
      }, this.ui.iframe);
    }

    if (this.ui.element.classList.contains(this.options.stateClasses.fullWidth)) {
      (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
      (<any> window).addEventListener(Module.globalEvents.verticalResize, this.onResize.bind(this));
      setTimeout(this.onResize.bind(this), 0);
    }
  }

  onResize() {
    const y = this.ui.element.getBoundingClientRect().top;
    this.ui.element.style.height = `${window.innerHeight - y}px`;
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default IFrame;
