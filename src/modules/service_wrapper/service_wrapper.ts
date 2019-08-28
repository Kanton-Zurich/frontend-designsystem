/*!
 * ServiceWrapper
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class ServiceWrapper extends Module {
  public ui: {
    element: HTMLDivElement,
    content: HTMLDivElement,
    overlay: HTMLDivElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        content: '.mdl-service-wrapper__content',
        overlay: '.mdl-service-wrapper__overlay',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      showOverlay: 'ServiceWrapper.showOverlay',
      hideOverlay: 'ServiceWrapper.hideOverlay',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('ServiceWrapper.showOverlay', this.showOverlay.bind(this));
    this.eventDelegate.on('ServiceWrapper.hideOverlay', this.hideOverlay.bind(this));
  }

  showOverlay() {
    this.ui.content.style.display = 'none';
    this.ui.overlay.style.display = 'block';
  }

  hideOverlay() {
    this.ui.content.style.display = 'block';
    this.ui.overlay.style.display = 'none';
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default ServiceWrapper;
